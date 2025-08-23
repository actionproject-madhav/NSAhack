// services/geminiService.ts

interface Context {
  currentCourse?: string;
  currentModule?: string;
  userLevel?: 'beginner' | 'intermediate' | 'advanced';
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

class GeminiService {
  private apiKey: string;
  private baseURL: string;

  constructor() {
    this.apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
    this.baseURL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
  }

  async generateContent(prompt: string, context: Context = {}): Promise<string> {
    try {
      const { currentCourse, currentModule, userLevel = 'beginner' } = context;
      
      const systemPrompt = this.buildSystemPrompt(currentCourse, currentModule, userLevel);
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
      console.error('Gemini API Error:', error);
      throw error;
    }
  }

  private buildSystemPrompt(
    currentCourse?: string, 
    currentModule?: string, 
    userLevel: 'beginner' | 'intermediate' | 'advanced' = 'beginner'
  ): string {
    let prompt = `You are an expert AI investment tutor specializing in teaching students about investing and financial markets. Your role is to:

1. Provide clear, educational explanations tailored for ${userLevel} level students
2. Use practical examples and analogies to make complex concepts understandable
3. Be encouraging and supportive in your responses
4. Use appropriate emojis to make learning engaging (but don't overuse them)
5. Always relate answers back to practical applications for students

Key guidelines:
- Keep explanations simple but accurate
- Use real-world examples when possible
- Encourage questions and curiosity
- Provide actionable advice when appropriate
- Mention relevant risks and considerations
- Stay focused on educational value`;

    if (currentCourse) {
      prompt += `\n\nCURRENT LEARNING CONTEXT:
Course: "${currentCourse}"`;
      
      if (currentModule) {
        prompt += `\nModule: "${currentModule}"`;
      }
      
      prompt += `\n\nWhen answering, consider the student's current learning context. Reference concepts from their current course/module when relevant, and build upon what they're currently studying.`;
    }

    // Add course-specific context
    if (currentCourse) {
      prompt += this.getCourseSpecificContext(currentCourse);
    }

    return prompt;
  }

  private getCourseSpecificContext(courseName: string): string {
    const courseContexts: Record<string, string> = {
      "Investing Fundamentals": `
        Focus on basic concepts like:
        - Risk vs return relationship
        - Diversification principles
        - Time horizon importance
        - Compound interest
        - Asset classes (stocks, bonds, ETFs)
        - Dollar-cost averaging
        - Investment goals and planning`,
      
      "Stock Market Mastery": `
        Focus on stock market concepts like:
        - Stock analysis fundamentals
        - Market trends and patterns
        - Chart reading basics
        - Company valuation
        - Market psychology
        - Trading vs investing
        - Risk management`,
      
      "ETF Investment Strategy": `
        Focus on ETF concepts like:
        - ETF structure and benefits
        - Index fund principles
        - Expense ratios
        - Diversification through ETFs
        - Popular ETF categories
        - ETF vs mutual funds
        - Building ETF portfolios`,
      
      "Crypto & Alternative Investments": `
        Focus on alternative investments like:
        - Cryptocurrency basics
        - Blockchain technology
        - DeFi concepts
        - NFTs and digital assets
        - Alternative investment risks
        - Portfolio allocation
        - Regulatory considerations`,
      
      "Tax-Efficient Investing": `
        Focus on tax efficiency like:
        - Tax-advantaged accounts
        - Capital gains vs ordinary income
        - Tax-loss harvesting
        - Asset location strategies
        - Retirement account types
        - Tax implications for students
        - Long-term vs short-term gains`
    };

    return courseContexts[courseName] || '';
  }

  // Fallback responses for when API is unavailable
  getFallbackResponse(prompt: string, context: Context): string {
    const responses: string[] = [
      "That's a great question about investing! While I'm having trouble accessing my full knowledge right now, I'd recommend focusing on the fundamentals: diversification, long-term thinking, and starting small. 📚",
      "Excellent point! Remember, successful investing is about time in the market, not timing the market. Your current course materials should have great examples of this principle! 💪",
      "I love your curiosity about investing! For students, the key is to start learning early and invest consistently. Even small amounts can grow significantly over time thanks to compound interest! 🌱",
      "That's exactly the kind of thinking that leads to investment success! Consider how this concept applies to your current studies - building knowledge is just like building wealth: consistent, small steps lead to big results. 🚀",
      "Great question! While I'm having connectivity issues, I can tell you that understanding risk and return is fundamental to investing. Your course should cover this concept in detail! 📈"
    ];

    // Try to match response to context
    if (context.currentCourse?.includes('Fundamentals')) {
      return responses[0];
    } else if (context.currentCourse?.includes('Stock Market')) {
      return responses[4];
    } else if (context.currentCourse?.includes('ETF')) {
      return responses[1];
    } else {
      return responses[Math.floor(Math.random() * responses.length)];
    }
  }
}

export default new GeminiService();