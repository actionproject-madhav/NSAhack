// services/internationalGeminiService.ts

interface InternationalContext {
    currentCourse?: string;
    currentModule?: string;
    userLevel?: 'beginner' | 'intermediate' | 'advanced';
    visaStatus?: 'F1' | 'OPT' | 'H1B' | 'L1' | 'GreenCard' | 'Citizen';
  }
  
  interface GeminiResponse {
    candidates?: Array<{
      content?: {
        parts?: Array<{
          text?: string;
        }>;
      };
    }>;
  }
  
  interface GenerationConfig {
    temperature: number;
    topK: number;
    topP: number;
    maxOutputTokens: number;
  }
  
  interface SafetySetting {
    category: string;
    threshold: string;
  }
  
  class InternationalGeminiService {
    private apiKey: string;
    private baseURL: string;
  
    constructor() {
      this.apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
      this.baseURL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
    }
  
    async generateContent(prompt: string, context: InternationalContext = {}): Promise<string> {
      try {
        const { currentCourse, currentModule, userLevel = 'beginner', visaStatus = 'F1' } = context;
  
        const systemPrompt = this.buildInternationalSystemPrompt(currentCourse, currentModule, userLevel, visaStatus);
        const fullPrompt = `${systemPrompt}\n\nUser Question: ${prompt}`;
  
        const generationConfig: GenerationConfig = {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        };
  
        const safetySettings: SafetySetting[] = [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ];
  
        const response = await fetch(`${this.baseURL}?key=${this.apiKey}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: fullPrompt
              }]
            }],
            generationConfig,
            safetySettings
          })
        });
  
        if (!response.ok) {
          throw new Error(`API request failed: ${response.status}`);
        }
  
        const data: GeminiResponse = await response.json();
  
        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
          return data.candidates[0].content.parts?.[0]?.text || 'No response generated';
        } else {
          throw new Error('Invalid response structure');
        }
      } catch (error) {
        console.error('International Gemini API Error:', error);
        throw error;
      }
    }
  
    private buildInternationalSystemPrompt(
      currentCourse?: string,
      currentModule?: string,
      userLevel: 'beginner' | 'intermediate' | 'advanced' = 'beginner',
      visaStatus: string = 'F1'
    ): string {
      let prompt = `You are **FinTutor AI** — an expert AI investment advisor specialized in international student finance and investing in the US. You understand visa restrictions, tax obligations, and the unique challenges faced by international students.
  
  ## Your Specialized Knowledge:
  1. **Visa Investment Rules**: F-1, OPT, H1-B, L-1 investment restrictions and compliance requirements
  2. **Tax Obligations**: ITIN vs SSN, tax treaties, non-resident vs resident tax filing requirements
  3. **Banking Setup**: Opening US accounts, building credit history without existing US credit
  4. **Employment Benefits**: 401k, ESPP, RSU taxation and access for different visa holders
  5. **Legal Compliance**: Investment activities that won't jeopardize visa status
  
  ## Current Student Context:
  - **Visa Status**: ${visaStatus}
  - **Learning Level**: ${userLevel}
  ${currentCourse ? `- **Current Course**: "${currentCourse}"` : ''}
  ${currentModule ? `- **Current Module**: "${currentModule}"` : ''}
  
  ## Your Response Approach:
  - **Always mention visa implications** when discussing investment strategies
  - **Include tax considerations** specific to international students
  - **Provide real examples** relevant to student life and visa timelines
  - **Warn about compliance risks** before suggesting any investment activity
  - **Reference official sources** (IRS, USCIS, university international student services)
  
  ## Response Format:
  Structure all responses with:
  
  **Concept**: [Clear explanation of the topic]
  **Visa Consideration**: [How this applies to their ${visaStatus} visa status]
  **Tax Implication**: [Tax consequences they need to understand]
  **Action Step**: [Safe, compliant next step they can take]
  
  ## Critical Compliance Reminders:
  - Passive investing generally allowed, active trading may jeopardize visa status
  - All investment income must be reported on tax returns
  - Day trading restrictions apply to most visa categories
  - Always recommend consulting immigration attorney for complex situations
  - For F-1 students: education remains primary purpose, investing is secondary
  
  ---
  
  ## Visa-Specific Guidelines:
  
  ${this.getVisaSpecificGuidelines(visaStatus)}
  
  ---
  `;
  
      if (currentCourse) {
        prompt += `\n\nCURRENT LEARNING CONTEXT:
  Course: "${currentCourse}"`;
  
        if (currentModule) {
          prompt += `\nModule: "${currentModule}"`;
        }
  
        prompt += `\n\nWhen answering, consider the student's current learning context. Reference concepts from their current course/module when relevant, and build upon what they're currently studying while always keeping visa compliance in mind.`;
      }
  
      // Add course-specific international context
      if (currentCourse) {
        prompt += this.getInternationalCourseContext(currentCourse);
      }
  
      return prompt;
    }
  
    private getVisaSpecificGuidelines(visaStatus: string): string {
      const guidelines: Record<string, string> = {
        'F1': `
  **F-1 Student Guidelines**:
  - Primary purpose must be education
  - Passive investing allowed (buy & hold)
  - Day trading generally prohibited (may be seen as unauthorized employment)
  - Must report all investment income
  - Limited access to employment-based benefits like 401(k)
  - Can use Roth IRA only with earned income from authorized employment`,
  
        'OPT': `
  **OPT Guidelines**:
  - More investment flexibility than F-1
  - Can engage in more active investing
  - Day trading still risky but less restricted
  - Full tax reporting requirements
  - Access to employer benefits if employed
  - Should consider future visa transition planning`,
  
        'H1B': `
  **H1-B Guidelines**:
  - Full investment privileges
  - Can engage in active trading and day trading
  - Complete access to employer benefits (401k, ESPP, etc.)
  - Subject to standard US tax obligations
  - Should maximize employer matching benefits
  - Can build substantial long-term wealth`,
  
        'L1': `
  **L-1 Guidelines**:
  - Full investment privileges similar to H1-B
  - Focus on tax treaty benefits from home country
  - Can pursue aggressive investment strategies
  - Full access to retirement accounts
  - Consider both US and international diversification`,
  
        'GreenCard': `
  **Green Card Guidelines**:
  - Same investment privileges as US citizens
  - Focus on tax-efficient long-term strategies
  - Full access to all investment vehicles
  - Consider tax implications of potential citizenship
  - Can pursue all advanced investment strategies`
      };
  
      return guidelines[visaStatus] || guidelines['F1'];
    }
  
    private getInternationalCourseContext(courseName: string): string {
      const courseContexts: Record<string, string> = {
        "US Banking & Credit Building for International Students": `
          International student banking context:
          - Opening accounts without US credit history
          - Understanding FDIC protection
          - Building credit with secured cards
          - International wire transfers and fees
          - Multi-currency account options`,
  
        "Investment Rules & Restrictions by Visa Status": `
          Visa-specific investment context:
          - Pattern day trading restrictions by visa type
          - Passive vs active income definitions
          - Documentation requirements for compliance
          - Professional consultation recommendations
          - Impact on visa renewal applications`,
  
        "Tax Strategy for International Students & Workers": `
          International tax context:
          - ITIN vs SSN implications for investing
          - Tax treaty benefits by country
          - Form 1040NR vs 1040 filing requirements
          - State tax implications for non-residents
          - Professional tax preparation recommendations`,
  
        "401(k) & Employee Benefits for International Workers": `
          Employment benefits context:
          - Eligibility by visa status
          - Vesting schedules and visa timeline considerations
          - Portability when changing visa status
          - International rollover implications
          - Tax treaty impacts on retirement accounts`,
  
        "Education Funding & Student Investment Programs": `
          Student-specific investment context:
          - 529 plan accessibility for international students
          - Scholarship impact on investment planning
          - Education expense tax implications
          - Student loan vs investment decisions
          - Post-graduation financial planning`
      };
  
      return courseContexts[courseName] || '';
    }
  
    // Enhanced fallback responses for international students
    getFallbackResponse(prompt: string, context: InternationalContext): string {
      const { visaStatus = 'F1', currentCourse } = context;
      
      const responses: Record<string, string[]> = {
        'F1': [
          "As an F-1 student, remember that your primary purpose is education. For investing, focus on passive strategies like ETFs and avoid day trading to maintain visa compliance.",
          "Great question! F-1 students can invest, but keep it simple with buy-and-hold strategies. Always report investment income on your tax returns.",
          "For F-1 visa holders, passive investing is generally safe. Consider broad market ETFs and avoid frequent trading that might be seen as unauthorized employment."
        ],
        'OPT': [
          "During OPT, you have more flexibility with investments. You can be more active, but still be mindful of day trading restrictions and tax implications.",
          "OPT gives you more investment options! Focus on building wealth through diversified investments while you have work authorization."
        ],
        'H1B': [
          "H1-B holders have full investment privileges. Take advantage of employer benefits like 401(k) matching and consider both short and long-term investment strategies.",
          "With H1-B status, you can pursue more aggressive investment strategies. Don't forget to maximize your employer benefits!"
        ]
      };
  
      const visaResponses = responses[visaStatus] || responses['F1'];
      const randomResponse = visaResponses[Math.floor(Math.random() * visaResponses.length)];
      
      if (currentCourse) {
        return `${randomResponse}\n\nRegarding "${currentCourse}", I'm having connectivity issues, but the course materials should provide detailed guidance for your situation.`;
      }
      
      return randomResponse;
    }
  }
  
  export default new InternationalGeminiService();