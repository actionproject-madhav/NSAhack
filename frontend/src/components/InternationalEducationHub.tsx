import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Clock, Trophy, ChevronRight, Check, Play, FileText, Video, Users, 
  Star, Award, TrendingUp, Bookmark, Globe, CreditCard, Building,
  Shield, GraduationCap, Flag, AlertTriangle, CheckCircle, Info,
  Calendar, DollarSign, MapPin, Phone, ExternalLink, 
  Calculator, FileCheck, PiggyBank, Briefcase, Home, Car
} from 'lucide-react'

// Enhanced Types for International Student Context
interface Course {
  id: number;
  title: string;
  description: string;
  duration: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  unlocked: boolean;
  rating: number;
  modules: Module[];
  completed: boolean;
  category: 'visa' | 'banking' | 'investing' | 'taxes' | 'employment' | 'student' | 'permanent';
  urgency?: 'high' | 'medium' | 'low';
  visaRelevance: string[];
  prerequisites?: string[];
  completionReward?: string;
}

interface Module {
  id: number;
  title: string;
  type: 'lesson' | 'video' | 'interactive' | 'checklist' | 'calculator';
  content: ModuleContent;
  estimatedTime: string;
  visaSpecific?: boolean;
}

interface ModuleContent {
  text: string;
  video?: string;
  quiz?: Quiz[];
  interactive?: boolean;
  checklist?: ChecklistItem[];
  warningBoxes?: WarningBox[];
}

interface Quiz {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

interface ChecklistItem {
  id: number;
  text: string;
  completed: boolean;
  urgent?: boolean;
  link?: string;
}

interface WarningBox {
  type: 'visa' | 'tax' | 'legal' | 'deadline';
  title: string;
  content: string;
  actionRequired?: boolean;
}

interface VisaStatus {
  current: 'F1' | 'OPT' | 'H1B' | 'L1' | 'GreenCard' | 'Citizen' | 'Other';
  timeRemaining?: string;
  nextStep?: string;
  restrictions: string[];
}

// Comprehensive International Student Courses
const INTERNATIONAL_COURSES: Course[] = [
  {
    id: 1,
    title: "US Banking & Credit Building for International Students",
    description: "Essential guide to opening US bank accounts, building credit history, and understanding the US financial system as an international student.",
    duration: "45 min",
    level: "beginner",
    unlocked: true,
    rating: 4.9,
    category: "banking",
    urgency: "high",
    visaRelevance: ["F1", "OPT", "H1B"],
    modules: [
      {
        id: 1,
        title: "Opening Your First US Bank Account",
        type: "checklist",
        estimatedTime: "15 min",
        content: {
          text: `Opening a US bank account is your first step toward financial independence in America. Here's everything you need to know as an international student.

## Required Documents

You'll need these essential documents to open any US bank account:

- Valid passport with current visa stamp
- I-20 form (for F-1 students) or I-797 (for H1-B/L-1 workers)  
- I-94 arrival/departure record (available online)
- Proof of US address (lease agreement, utility bill, or school housing letter)
- Initial deposit amount (varies by bank, typically $25-$500)

## Recommended Banks for International Students

These banks offer specialized programs for international students:

**Bank of America**: Provides student banking programs with no monthly maintenance fees and extensive ATM networks.

**Chase**: Offers College Checking accounts with mobile banking features and fee waivers for students.

**Wells Fargo**: Features dedicated international student services with multilingual support staff.

**Local Credit Unions**: Often provide lower fees, higher interest rates, and more personalized customer service.

## Account Types to Consider

Choose the right accounts for your financial needs:

**Checking Account**: Essential for daily transactions, bill payments, and debit card purchases. Look for accounts with no monthly fees and ATM fee reimbursements.

**Savings Account**: Perfect for building an emergency fund and storing money for short-term goals. Earns interest while keeping funds accessible.

**Money Market Account**: Offers higher interest rates than regular savings accounts but may require higher minimum balances.`,
          checklist: [
            { id: 1, text: "Gather required documents (I-20, passport, I-94)", completed: false, urgent: true },
            { id: 2, text: "Research banks with international student programs", completed: false },
            { id: 3, text: "Schedule appointment at chosen bank branch", completed: false },
            { id: 4, text: "Prepare initial deposit amount", completed: false },
            { id: 5, text: "Set up online banking and mobile app", completed: false }
          ]
        }
      },
      {
        id: 2,
        title: "Building Credit History from Zero",
        type: "interactive",
        estimatedTime: "20 min",
        visaSpecific: true,
        content: {
          text: `Building credit history in the US is crucial for your financial future. As an international student, you're starting from zero, but with the right strategy, you can build excellent credit.

## Understanding US Credit Scores

Credit scores in the US range from 300 to 850, with 700+ considered good credit. Your credit score affects:

- Loan approval and interest rates
- Apartment rental applications  
- Some employment opportunities
- Insurance premiums
- Cell phone plans without deposits

## Secured Credit Cards: Your Starting Point

Secured credit cards are perfect for building credit from scratch:

- Requires a security deposit ($200-$500 typically)
- Your deposit becomes your credit limit
- Builds credit history with responsible use
- Can upgrade to unsecured cards after 6-12 months

**Recommended Secured Cards**:
- **Discover it Secured**: Offers cash back rewards and free credit score monitoring
- **Capital One Secured**: Low deposit options and potential credit limit increases

## Student Credit Cards

If you have some income, student credit cards offer better terms:

- Designed specifically for students with limited credit history
- Lower credit limits initially but can grow over time
- Some offer rewards on common student purchases
- Often include educational resources about credit

**Recommended Student Cards**:
- **Journey Student Rewards**: Offers cash back and credit education tools
- **Discover it Student**: Provides rotating category cash back rewards

## Credit Building Strategy

Follow this proven strategy to build excellent credit:

- Apply for one secured or student credit card
- Use it for small, regular purchases (gas, groceries, streaming services)
- Pay the full balance every month before the due date
- Keep credit utilization below 30% (ideally under 10%)
- Never miss payments - payment history is 35% of your credit score
- Be patient - credit building takes 6-12 months to show significant improvement`,
          interactive: true
        }
      }
    ],
    completed: false
  },
  {
    id: 2,
    title: "Investment Rules & Restrictions by Visa Status",
    description: "Critical legal information about investment limitations, day trading rules, and compliance requirements for different visa types.",
    duration: "60 min",
    level: "intermediate",
    unlocked: true,
    rating: 4.8,
    category: "visa",
    urgency: "high",
    visaRelevance: ["F1", "OPT", "H1B", "L1"],
    modules: [
      {
        id: 1,
        title: "F-1 Visa Investment Restrictions",
        type: "lesson",
        estimatedTime: "20 min",
        visaSpecific: true,
        content: {
          text: `## F-1 Visa Investment Guidelines

### Permitted Investment Activities
- **Long-term stock investing**: Buy and hold strategies are generally allowed
- **ETF and mutual fund investing**: Passive index investing is recommended
- **Dividend investing**: Receiving passive income from investments
- **Bond investing**: Government and corporate bonds for portfolio diversification

### Prohibited or High-Risk Activities
- **Pattern Day Trading**: 4+ trades within 5 business days may be considered unauthorized employment
- **Active Trading**: Trading as primary source of income conflicts with student status
- **Forex Trading**: Currency trading for profit is generally not allowed
- **Cryptocurrency Trading**: High-frequency crypto trading may violate visa terms

### Key Compliance Principles
1. **Passive Income Focus**: Investment income should be passive, not active trading profits
2. **Education Priority**: Your primary purpose must remain education
3. **Documentation**: Keep detailed records of all investment activities
4. **Professional Consultation**: Consult immigration attorney for complex situations

### Tax Reporting Requirements
- All investment income must be reported on tax returns
- Use Form 1040NR for non-resident tax status
- Consider tax treaty benefits from your home country
- Obtain ITIN if you don't have SSN and have investment income`,
          warningBoxes: [
            {
              type: 'visa',
              title: 'Visa Status Risk Warning',
              content: 'Excessive trading activity could be interpreted as unauthorized employment, potentially jeopardizing your F-1 status. Always prioritize compliance over profits.',
              actionRequired: true
            }
          ]
        }
      }
    ],
    completed: false
  },
  {
    id: 3,
    title: "Tax Strategy for International Students & Workers",
    description: "Navigate US tax obligations, ITIN applications, tax treaties, and optimize your investment taxes as a non-resident.",
    duration: "75 min",
    level: "advanced",
    unlocked: true,
    rating: 4.7,
    category: "taxes",
    urgency: "high",
    visaRelevance: ["F1", "OPT", "H1B", "L1"],
    modules: [
      {
        id: 1,
        title: "ITIN vs SSN: Tax Identification Requirements",
        type: "lesson",
        estimatedTime: "15 min",
        content: {
          text: `## Tax Identification for International Students

### Social Security Number (SSN)
**Eligibility**: Available to F-1 students with on-campus employment authorization, OPT participants, and H1-B/L-1 workers

**Investment Benefits**:
- Access to all major brokerage platforms
- Automatic tax form generation (1099s)
- Full access to retirement accounts (IRA, 401k)
- Streamlined tax filing process

**How to Obtain**: Apply at Social Security Administration office with employment authorization document

### Individual Taxpayer Identification Number (ITIN)
**Purpose**: For tax filing purposes when SSN is not available
**Application Process**: File Form W-7 with supporting documents and tax return

**Investment Limitations**:
- Some brokerages may not accept ITIN applications
- Limited access to retirement accounts
- Manual tax reporting may be required

### Tax Treaty Benefits by Country
Many countries have bilateral tax treaties with the US that can significantly reduce your tax burden:

**Common Treaty Benefits**:
- Reduced withholding on dividends (typically 15% instead of 30%)
- Interest income exemptions
- Capital gains tax reductions or exemptions
- Higher threshold for tax filing requirements

**Major Treaty Countries**: Canada, UK, Germany, France, Japan, South Korea, India, China, and many others

**How to Claim**: File Form W-8BEN with your broker and claim treaty benefits on tax return`,
          warningBoxes: [
            {
              type: 'tax',
              title: 'Important Tax Deadline',
              content: 'US tax returns are due April 15th each year. International students must file if they have any US-source income, regardless of amount.',
              actionRequired: true
            }
          ]
        }
      }
    ],
    completed: false
  },
  {
    id: 4,
    title: "401(k) & Employee Benefits for International Workers",
    description: "Maximize your employer benefits including 401(k), ESPP, RSUs, and health savings accounts during your work authorization.",
    duration: "50 min",
    level: "intermediate",
    unlocked: true,
    rating: 4.6,
    category: "employment",
    visaRelevance: ["OPT", "H1B", "L1"],
    modules: [],
    completed: false
  },
  {
    id: 5,
    title: "Education Funding & Student Investment Programs",
    description: "Discover investment strategies for education expenses, scholarship opportunities, and financial aid programs for international students.",
    duration: "40 min",
    level: "beginner",
    unlocked: true,
    rating: 4.5,
    category: "student",
    visaRelevance: ["F1"],
    modules: [],
    completed: false
  },
  {
    id: 6,
    title: "Real Estate & Long-term Wealth Building",
    description: "Plan for property ownership, long-term wealth building, and financial strategies for the path to permanent residency.",
    duration: "65 min",
    level: "advanced",
    unlocked: false,
    rating: 4.8,
    category: "permanent",
    visaRelevance: ["H1B", "L1", "GreenCard"],
    modules: [],
    completed: false
  }
]

// Module Content Display Component
interface ModuleContentViewProps {
  course: Course;
  moduleId: number;
  onBackToCourse: () => void;
  visaStatus: VisaStatus;
}

const ModuleContentView: React.FC<ModuleContentViewProps> = ({ 
  course, 
  moduleId, 
  onBackToCourse, 
  visaStatus 
}) => {
  const module = course.modules.find(m => m.id === moduleId)
  const [checkedItems, setCheckedItems] = useState<number[]>([])

  if (!module) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Module Not Found</h2>
        <p className="text-gray-600 mb-6">The requested module could not be found.</p>
        <button 
          onClick={onBackToCourse}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Back to Course
        </button>
      </div>
    )
  }

  // Format markdown-like content to proper HTML
  const formatContent = (text: string): string => {
    return text
      // Convert headers
      .replace(/### (.*?)(?=\n|$)/g, '<h3 class="text-xl font-semibold text-gray-900 mt-6 mb-3">$1</h3>')
      .replace(/## (.*?)(?=\n|$)/g, '<h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">$1</h2>')
      .replace(/# (.*?)(?=\n|$)/g, '<h1 class="text-3xl font-bold text-gray-900 mt-8 mb-4">$1</h1>')
      
      // Convert bold text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')
      
      // Convert lists - handle both - and • bullets
      .replace(/^- (.*?)$/gm, '<li class="ml-4 mb-2">• $1</li>')
      .replace(/^• (.*?)$/gm, '<li class="ml-4 mb-2">• $1</li>')
      
      // Wrap consecutive list items in ul tags
      .replace(/(<li.*?<\/li>\s*)+/gs, '<ul class="space-y-2 mb-6">$&</ul>')
      
      // Convert line breaks to paragraphs
      .split('\n\n')
      .map(paragraph => {
        if (paragraph.trim() && !paragraph.includes('<h') && !paragraph.includes('<ul')) {
          return `<p class="mb-4 text-gray-700 leading-relaxed">${paragraph.trim()}</p>`
        }
        return paragraph
      })
      .join('')
      
      // Clean up extra whitespace
      .replace(/\s+/g, ' ')
      .trim()
  }

  const toggleChecklistItem = (itemId: number) => {
    setCheckedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    )
  }

  const renderWarningBoxes = () => {
    if (!module.content.warningBoxes) return null

    return (
      <div className="space-y-4 mb-8">
        {module.content.warningBoxes.map((warning, index) => (
          <div 
            key={index}
            className={`border-l-4 p-4 rounded-r-lg ${
              warning.type === 'visa' ? 'border-l-red-500 bg-red-50' :
              warning.type === 'tax' ? 'border-l-yellow-500 bg-yellow-50' :
              warning.type === 'legal' ? 'border-l-blue-500 bg-blue-50' :
              'border-l-orange-500 bg-orange-50'
            }`}
          >
            <div className="flex items-start gap-3">
              <AlertTriangle className={`w-5 h-5 mt-0.5 ${
                warning.type === 'visa' ? 'text-red-600' :
                warning.type === 'tax' ? 'text-yellow-600' :
                warning.type === 'legal' ? 'text-blue-600' :
                'text-orange-600'
              }`} />
              <div>
                <h4 className={`font-semibold mb-1 ${
                  warning.type === 'visa' ? 'text-red-900' :
                  warning.type === 'tax' ? 'text-yellow-900' :
                  warning.type === 'legal' ? 'text-blue-900' :
                  'text-orange-900'
                }`}>
                  {warning.title}
                </h4>
                <p className={`text-sm ${
                  warning.type === 'visa' ? 'text-red-800' :
                  warning.type === 'tax' ? 'text-yellow-800' :
                  warning.type === 'legal' ? 'text-blue-800' :
                  'text-orange-800'
                }`}>
                  {warning.content}
                </p>
                {warning.actionRequired && (
                  <div className="mt-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white border">
                      Action Required
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  const renderChecklist = () => {
    if (!module.content.checklist) return null

    return (
      <div className="bg-gray-50 rounded-2xl p-6 mb-8">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <FileCheck className="w-5 h-5 text-blue-600" />
          Action Items
        </h3>
        <div className="space-y-3">
          {module.content.checklist.map((item) => (
            <div 
              key={item.id}
              className={`flex items-start gap-3 p-3 rounded-lg border ${
                item.urgent ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-white'
              }`}
            >
              <button
                onClick={() => toggleChecklistItem(item.id)}
                className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                  checkedItems.includes(item.id)
                    ? 'bg-green-500 border-green-500 text-white'
                    : 'border-gray-300 hover:border-blue-500'
                }`}
              >
                {checkedItems.includes(item.id) && <Check className="w-3 h-3" />}
              </button>
              <div className="flex-1">
                <p className={`${checkedItems.includes(item.id) ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                  {item.text}
                </p>
                {item.urgent && (
                  <span className="inline-block mt-1 px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                    Urgent
                  </span>
                )}
                {item.link && (
                  <a 
                    href={item.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block mt-1 text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Learn More →
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-sm text-gray-600">
          Completed: {checkedItems.length} / {module.content.checklist.length}
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBackToCourse}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          ← Back to {course.title}
        </button>
        <div className="text-sm text-gray-500">
          {module.estimatedTime} • {module.type}
        </div>
      </div>

      {/* Module Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{module.title}</h1>
        {module.visaSpecific && (
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-4">
            <Flag className="w-4 h-4" />
            {visaStatus.current} Specific Content
          </div>
        )}
      </div>

      {/* Warning Boxes */}
      {renderWarningBoxes()}

      {/* Main Content */}
      <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8">
        <div 
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ 
            __html: formatContent(module.content.text)
          }} 
        />
      </div>

      {/* Interactive Elements */}
      {module.content.interactive && (
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6 mb-8">
          <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
            <Play className="w-5 h-5 text-blue-600" />
            Interactive Exercise
          </h3>
          <p className="text-gray-600 mb-4">
            This section includes interactive tools and exercises to help you apply what you've learned.
          </p>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Start Interactive Exercise
          </button>
        </div>
      )}

      {/* Checklist */}
      {renderChecklist()}

      {/* Navigation */}
      <div className="flex items-center justify-between pt-8 border-t border-gray-200">
        <button
          onClick={onBackToCourse}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          ← Back to Course
        </button>
        <button 
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          onClick={() => {
            // Mark as completed and go to next module or back to course
            onBackToCourse()
          }}
        >
          Mark Complete & Continue →
        </button>
      </div>
    </div>
  )
}

const InternationalEducationHub: React.FC = () => {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [selectedModule, setSelectedModule] = useState<number | null>(null)
  const [visaStatus, setVisaStatus] = useState<VisaStatus>({
    current: 'F1',
    timeRemaining: '2 years 4 months',
    nextStep: 'Apply for OPT',
    restrictions: ['No day trading', 'Report investment income', '401k limited access']
  })
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [completedCourses, setCompletedCourses] = useState<number[]>([])

  // Pass course context to parent component
  const handleCourseSelect = (course: Course) => {
    setSelectedCourse(course)
    // Notify parent component about course selection
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('courseSelected', { 
        detail: { courseTitle: course.title, moduleTitle: null } 
      }))
    }
  }

  const handleModuleSelect = (moduleId: number) => {
    setSelectedModule(moduleId)
    if (selectedCourse) {
      const module = selectedCourse.modules.find(m => m.id === moduleId)
      if (module && typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('courseSelected', { 
          detail: { courseTitle: selectedCourse.title, moduleTitle: module.title } 
        }))
      }
    }
  }
  
  // Visa Status Banner Component
  const VisaStatusBanner = () => (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 mb-8"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <Flag className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Current Status: {visaStatus.current} Visa</h3>
            <p className="text-blue-700">
              {visaStatus.timeRemaining} remaining • Next: {visaStatus.nextStep}
            </p>
            <div className="flex gap-2 mt-2">
              {visaStatus.restrictions.map((restriction, index) => (
                <span key={index} className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                  {restriction}
                </span>
              ))}
            </div>
          </div>
        </div>
        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
          Update Status
        </button>
      </div>
    </motion.div>
  )

  // Category Filter Component
  const CategoryFilter = () => {
    const categories = [
      { key: 'all', label: 'All Courses', icon: Bookmark },
      { key: 'visa', label: 'Visa & Legal', icon: Shield, urgent: true },
      { key: 'banking', label: 'Banking Setup', icon: CreditCard },
      { key: 'investing', label: 'Smart Investing', icon: TrendingUp },
      { key: 'taxes', label: 'Tax Strategy', icon: FileCheck, urgent: true },
      { key: 'employment', label: 'Employment Benefits', icon: Briefcase },
      { key: 'student', label: 'Student Programs', icon: GraduationCap },
      { key: 'permanent', label: 'Path to PR/Citizenship', icon: Home }
    ]

    return (
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {categories.map(category => (
          <button
            key={category.key}
            onClick={() => setActiveCategory(category.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all ${
              activeCategory === category.key
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <category.icon className="w-4 h-4" />
            <span>{category.label}</span>
            {category.urgent && (
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            )}
          </button>
        ))}
      </div>
    )
  }

  // Course Card Component
  const CourseCard: React.FC<{ course: Course; index: number }> = ({ course, index }) => {
    const getUrgencyColor = (urgency?: string) => {
      switch (urgency) {
        case 'high': return 'border-l-red-500 bg-red-50'
        case 'medium': return 'border-l-yellow-500 bg-yellow-50'
        default: return 'border-l-green-500 bg-green-50'
      }
    }

    const isRelevantToVisa = course.visaRelevance.includes(visaStatus.current)

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        onClick={() => handleCourseSelect(course)}
        className={`relative bg-white rounded-2xl p-6 shadow-sm border-l-4 hover:shadow-lg cursor-pointer transition-all duration-300 ${getUrgencyColor(course.urgency)}`}
      >
        {/* Visa Relevance Badge */}
        {isRelevantToVisa && (
          <div className="absolute top-4 right-4 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium">
            {visaStatus.current} Relevant
          </div>
        )}

        {/* Urgency Indicator */}
        {course.urgency === 'high' && (
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <span className="text-red-600 font-medium text-sm">Time-Sensitive</span>
          </div>
        )}

        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center border-2 border-blue-200">
            {course.category === 'banking' && <CreditCard className="w-8 h-8 text-blue-600" />}
            {course.category === 'visa' && <Shield className="w-8 h-8 text-blue-600" />}
            {course.category === 'taxes' && <FileCheck className="w-8 h-8 text-blue-600" />}
            {course.category === 'employment' && <Briefcase className="w-8 h-8 text-blue-600" />}
            {course.category === 'student' && <GraduationCap className="w-8 h-8 text-blue-600" />}
            {course.category === 'permanent' && <Home className="w-8 h-8 text-blue-600" />}
            {course.category === 'investing' && <TrendingUp className="w-8 h-8 text-blue-600" />}
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-2">{course.title}</h3>
            <p className="text-gray-600 mb-4">{course.description}</p>
            
            {/* Course Metadata */}
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {course.duration}
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500" />
                {course.rating}
              </div>
              <span className="capitalize text-blue-600 font-medium">{course.level}</span>
            </div>

            {/* Visa Relevance Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {course.visaRelevance.map((visa, idx) => (
                <span key={idx} className={`text-xs px-2 py-1 rounded-full ${
                  visa === visaStatus.current 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {visa}
                </span>
              ))}
            </div>

            {/* Progress and Action */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {completedCourses.includes(course.id) ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : course.unlocked ? (
                  <Play className="w-5 h-5 text-blue-600" />
                ) : (
                  <Shield className="w-5 h-5 text-gray-400" />
                )}
                <span className="text-sm font-medium">
                  {completedCourses.includes(course.id) ? 'Completed' : 
                   course.unlocked ? 'Start Course' : 'Locked'}
                </span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  const filteredCourses = activeCategory === 'all' 
    ? INTERNATIONAL_COURSES
    : INTERNATIONAL_COURSES.filter(course => course.category === activeCategory)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900">
                  International Student Investment Academy
                </h1>
              </div>
              <p className="text-gray-600">
                Master US investing while navigating visa requirements, taxes, and regulations
              </p>
            </div>
            {/* <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors">
                <Phone className="w-4 h-4" />
                Connect with CPA
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors">
                <MapPin className="w-4 h-4" />
                Find Immigration Lawyer
              </button>
            </div> */}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Visa Status Banner */}
        <VisaStatusBanner />

        {/* Category Filter */}
        <CategoryFilter />

        {/* Quick Actions for International Students */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl p-6 text-white">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
              <h3 className="font-bold">Tax Deadline Alert</h3>
            </div>
            <p className="text-sm mb-4">April 15th approaching - File your US tax return</p>
            <button className="bg-white text-red-600 px-4 py-2 rounded-xl font-medium text-sm hover:bg-gray-100 transition-colors">
              Get Tax Assistance
            </button>
          </div>

          <div className="bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl p-6 text-white">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="font-bold">Visa Compliance Check</h3>
            </div>
            <p className="text-sm mb-4">Ensure your investments comply with your visa requirements</p>
            <button className="bg-white text-blue-600 px-4 py-2 rounded-xl font-medium text-sm hover:bg-gray-100 transition-colors">
              Check Compliance
            </button>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-white">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <Calculator className="w-5 h-5" />
              </div>
              <h3 className="font-bold">Tax Liability Calculator</h3>
            </div>
            <p className="text-sm mb-4">Calculate your investment tax liability by visa status</p>
            <button className="bg-white text-green-600 px-4 py-2 rounded-xl font-medium text-sm hover:bg-gray-100 transition-colors">
              Calculate Taxes
            </button>
          </div>
        </div>

        {/* Course Grid */}
        <AnimatePresence mode="wait">
          {!selectedCourse ? (
            <motion.div
              key="courses"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  {activeCategory === 'all' ? 'All Courses' : `${activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} Courses`}
                  <span className="ml-2 text-lg text-gray-500">({filteredCourses.length})</span>
                </h2>
                <div className="text-sm text-gray-600">
                  Courses customized for <span className="font-medium text-blue-600">{visaStatus.current} visa holders</span>
                </div>
              </div>
              
              <div className="grid gap-6">
                {filteredCourses.map((course, index) => (
                  <CourseCard key={course.id} course={course} index={index} />
                ))}
              </div>
            </motion.div>
          ) : selectedModule ? (
            <motion.div
              key="module-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white rounded-2xl p-8 shadow-lg"
            >
              <ModuleContentView 
                course={selectedCourse}
                moduleId={selectedModule}
                onBackToCourse={() => setSelectedModule(null)}
                visaStatus={visaStatus}
              />
            </motion.div>
          ) : (
            <motion.div
              key="course-detail"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white rounded-2xl p-8 shadow-lg"
            >
              <button
                onClick={() => setSelectedCourse(null)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
              >
                ← Back to Courses
              </button>

              <div className="flex items-start gap-6 mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl flex items-center justify-center border-3 border-blue-200">
                  {selectedCourse.category === 'banking' && <CreditCard className="w-10 h-10 text-blue-600" />}
                  {selectedCourse.category === 'visa' && <Shield className="w-10 h-10 text-blue-600" />}
                  {selectedCourse.category === 'taxes' && <FileCheck className="w-10 h-10 text-blue-600" />}
                  {selectedCourse.category === 'employment' && <Briefcase className="w-10 h-10 text-blue-600" />}
                  {selectedCourse.category === 'student' && <GraduationCap className="w-10 h-10 text-blue-600" />}
                  {selectedCourse.category === 'permanent' && <Home className="w-10 h-10 text-blue-600" />}
                  {selectedCourse.category === 'investing' && <TrendingUp className="w-10 h-10 text-blue-600" />}
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold mb-2">{selectedCourse.title}</h1>
                  <p className="text-gray-600 mb-4">{selectedCourse.description}</p>
                  
                  <div className="flex items-center gap-6 text-sm text-gray-500 mb-6">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {selectedCourse.duration}
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      {selectedCourse.rating}
                    </div>
                    <span className="capitalize text-blue-600 font-medium">{selectedCourse.level}</span>
                  </div>

                  {/* Visa Specific Warnings */}
                  {selectedCourse.visaRelevance.includes(visaStatus.current) && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                      <div className="flex items-start gap-3">
                        <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-blue-900 mb-1">
                            {visaStatus.current} Specific Information
                          </h4>
                          <p className="text-blue-800 text-sm">
                            This course includes specific guidance for your visa status, including investment limitations and tax implications.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Module List */}
              <div className="space-y-4">
                <h2 className="text-xl font-bold">Course Modules</h2>
                {selectedCourse.modules.map((module, index) => (
                  <div 
                    key={module.id} 
                    className="border border-gray-200 rounded-xl p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => handleModuleSelect(module.id)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                        {module.type === 'lesson' && <FileText className="w-5 h-5 text-blue-600" />}
                        {module.type === 'video' && <Video className="w-5 h-5 text-blue-600" />}
                        {module.type === 'interactive' && <Play className="w-5 h-5 text-blue-600" />}
                        {module.type === 'checklist' && <FileCheck className="w-5 h-5 text-blue-600" />}
                        {module.type === 'calculator' && <Calculator className="w-5 h-5 text-blue-600" />}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{module.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="capitalize">{module.type}</span>
                          <span>{module.estimatedTime}</span>
                          {module.visaSpecific && (
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                              {visaStatus.current} Specific
                            </span>
                          )}
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default InternationalEducationHub