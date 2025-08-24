import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, Trophy, ChevronRight, Check, Play, FileText, Video, Users, Star, Award, TrendingUp, BookmarkIcon, Shield, FileCheck, CreditCard, Smartphone, GraduationCap, Globe, DollarSign, Building } from 'lucide-react'
import Navigation from '../components/Navigation'
import EnhancedChatWidget from '../components/ChatWidget'

interface Quiz {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

interface ModuleContent {
  text: string;
  video?: string;
  quiz?: Quiz[];
  interactive?: boolean;
}

interface Module {
  id: number;
  title: string;
  type: 'lesson' | 'video' | 'interactive';
  content: ModuleContent;
}

interface Course {
  id: number;
  title: string;
  emoji: string | React.ReactNode;
  description: string;
  duration: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  unlocked: boolean;
  rating: number;
  students: number;
  modules: Module[];
  completed: boolean;
}

interface PortfolioAllocation {
  stocks: number;
  bonds: number;
  alternatives: number;
}

interface ModuleContentProps {
  course: Course;
  moduleId: number;
  onBack: () => void;
  currentQuiz: number;
  selectedAnswer: number | null;
  showExplanation: boolean;
  onAnswerSelect: (answerIndex: number) => void;
  onNextQuestion: () => void;
  portfolioBuilder: PortfolioAllocation;
  setPortfolioBuilder: React.Dispatch<React.SetStateAction<PortfolioAllocation>>;
  PortfolioBuilder: React.FC;
}

const ModuleContent: React.FC<ModuleContentProps> = ({
  course,
  moduleId,
  onBack,
  currentQuiz,
  selectedAnswer,
  showExplanation,
  onAnswerSelect,
  onNextQuestion,
  portfolioBuilder,
  setPortfolioBuilder,
  PortfolioBuilder
}) => {
  const module = course.modules.find(m => m.id === moduleId)

  if (!module) {
    return <div>Module not found</div>
  }

  const quiz = module.content?.quiz || []
  const hasQuiz = quiz.length > 0

  // Enhanced markdown parser function
  function parseMarkdown(text: string) {
    // First, split into blocks to handle lists properly
    const lines = text.split('\n');
    const blocks: Array<{ type: 'text' | 'list'; content?: string; items?: string[] }> = [];
    let currentBlock = '';
    let inList = false;
    let listItems: string[] = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Check if line is a list item
      if (line.startsWith('- ')) {
        if (!inList) {
          // Save previous block if exists
          if (currentBlock.trim()) {
            blocks.push({ type: 'text', content: currentBlock.trim() });
          }
          currentBlock = '';
          inList = true;
          listItems = [];
        }
        listItems.push(line.substring(2));
      } else if (line.startsWith('**') && line.endsWith('**')) {
        // Bold text on its own line
        if (inList) {
          blocks.push({ type: 'list', items: listItems });
          inList = false;
          listItems = [];
        }
        if (currentBlock.trim()) {
          blocks.push({ type: 'text', content: currentBlock.trim() });
        }
        currentBlock = line;
      } else if (line.startsWith('##')) {
        // Subheading
        if (inList) {
          blocks.push({ type: 'list', items: listItems });
          inList = false;
          listItems = [];
        }
        if (currentBlock.trim()) {
          blocks.push({ type: 'text', content: currentBlock.trim() });
        }
        currentBlock = line;
      } else if (line.startsWith('#')) {
        // Main heading
        if (inList) {
          blocks.push({ type: 'list', items: listItems });
          inList = false;
          listItems = [];
        }
        if (currentBlock.trim()) {
          blocks.push({ type: 'text', content: currentBlock.trim() });
        }
        currentBlock = line;
      } else if (line === '') {
        // Empty line - end current block
        if (inList) {
          blocks.push({ type: 'list', items: listItems });
          inList = false;
          listItems = [];
        } else if (currentBlock.trim()) {
          blocks.push({ type: 'text', content: currentBlock.trim() });
        }
        currentBlock = '';
      } else {
        // Regular text line
        if (inList) {
          // End list and start new text block
          blocks.push({ type: 'list', items: listItems });
          inList = false;
          listItems = [];
          currentBlock = line;
        } else {
          currentBlock += (currentBlock ? '\n' : '') + line;
        }
      }
    }
    
    // Handle last block
    if (inList) {
      blocks.push({ type: 'list', items: listItems });
    } else if (currentBlock.trim()) {
      blocks.push({ type: 'text', content: currentBlock.trim() });
    }

    return blocks;
  }

  const renderTextBlock = (text: string) => {
    // Handle headings
    if (text.startsWith('#')) {
      const level = text.match(/^#+/)?.[0].length || 1;
      const content = text.replace(/^#+\s*/, '');
      
      if (level === 1) {
        return <h1 className="text-3xl font-bold text-gray-900 mb-4">{content}</h1>;
      } else if (level === 2) {
        return <h2 className="text-2xl font-semibold text-gray-800 mb-3 mt-6">{content}</h2>;
      } else if (level === 3) {
        return <h3 className="text-xl font-semibold text-gray-700 mb-2 mt-4">{content}</h3>;
      }
    }
    
    // Handle bold text
    if (text.startsWith('**') && text.endsWith('**')) {
      const content = text.replace(/^\*\*(.*)\*\*$/, '$1');
      return <p className="text-lg font-semibold text-gray-800 mb-4">{content}</p>;
    }
    
    // Regular paragraph
    return <p className="text-gray-700 mb-4 leading-relaxed">{text}</p>;
  };

  const renderListBlock = (items: string[]) => {
    return (
      <ul className="list-disc list-inside mb-4 space-y-2">
        {items.map((item, index) => (
          <li key={index} className="text-gray-700 leading-relaxed">{item}</li>
        ))}
      </ul>
    );
  };

  const blocks = parseMarkdown(module.content.text);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <button
          onClick={onBack}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
        >
          <ChevronRight className="w-4 h-4 rotate-180 mr-2" />
          Back to Course
        </button>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">{module.title}</h1>
          
          <div className="prose max-w-none">
            {blocks.map((block, index) => (
              <div key={index}>
                {block.type === 'text' && block.content && renderTextBlock(block.content)}
                {block.type === 'list' && block.items && renderListBlock(block.items)}
              </div>
            ))}
          </div>

          {module.content.interactive && (
            <div className="mt-8">
              <PortfolioBuilder />
            </div>
          )}

          {hasQuiz && (
            <div className="mt-8 bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Quiz</h3>
              {currentQuiz < quiz.length ? (
                <div>
                  <p className="text-gray-700 mb-4">{quiz[currentQuiz].question}</p>
                  <div className="space-y-3">
                    {quiz[currentQuiz].options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => onAnswerSelect(index)}
                        disabled={selectedAnswer !== null}
                        className={`w-full text-left p-3 rounded-lg border transition-colors ${
                          selectedAnswer === index
                            ? index === quiz[currentQuiz].correct
                              ? 'border-green-500 bg-green-50 text-green-800'
                              : 'border-red-500 bg-red-50 text-red-800'
                            : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                  
                  {selectedAnswer !== null && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                      <p className="text-blue-800 font-medium">
                        {selectedAnswer === quiz[currentQuiz].correct ? 'Correct!' : 'Incorrect!'}
                      </p>
                      <p className="text-blue-700 mt-2">{quiz[currentQuiz].explanation}</p>
                      {currentQuiz < quiz.length - 1 && (
                        <button
                          onClick={onNextQuestion}
                          className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                        >
                          Next Question
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center">
                  <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">Quiz Complete!</h4>
                  <p className="text-gray-600">Great job! You've completed all the questions.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const PortfolioBuilder: React.FC = () => {
  const [allocation, setAllocation] = useState({ stocks: 70, bonds: 20, alternatives: 10 });

  const handleSliderChange = (type: keyof typeof allocation, value: number) => {
    setAllocation(prev => {
      const newAllocation = { ...prev, [type]: value };
      const total = Object.values(newAllocation).reduce((sum, val) => sum + val, 0);
      
      if (total !== 100) {
        // Adjust other values proportionally
        const otherTypes = Object.keys(newAllocation).filter(key => key !== type) as (keyof typeof allocation)[];
        const remaining = 100 - value;
        const otherTotal = otherTypes.reduce((sum, key) => sum + newAllocation[key], 0);
        
        otherTypes.forEach(key => {
          if (otherTotal > 0) {
            newAllocation[key] = Math.round((newAllocation[key] / otherTotal) * remaining);
          }
        });
        
        // Ensure total equals 100
        const finalTotal = Object.values(newAllocation).reduce((sum, val) => sum + val, 0);
        if (finalTotal !== 100) {
          newAllocation[otherTypes[0]] += (100 - finalTotal);
        }
      }
      
      return newAllocation;
    });
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
      <h3 className="text-xl font-semibold mb-4">Portfolio Builder</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Stocks: {allocation.stocks}%
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={allocation.stocks}
            onChange={(e) => handleSliderChange('stocks', parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bonds: {allocation.bonds}%
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={allocation.bonds}
            onChange={(e) => handleSliderChange('bonds', parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Alternatives: {allocation.alternatives}%
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={allocation.alternatives}
            onChange={(e) => handleSliderChange('alternatives', parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>
      <div className="mt-4 p-4 bg-white rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">Your Portfolio Allocation</h4>
        <div className="flex space-x-4">
          <div className="flex-1 text-center">
            <div className="text-2xl font-bold text-blue-600">{allocation.stocks}%</div>
            <div className="text-sm text-gray-600">Stocks</div>
          </div>
          <div className="flex-1 text-center">
            <div className="text-2xl font-bold text-green-600">{allocation.bonds}%</div>
            <div className="text-sm text-gray-600">Bonds</div>
          </div>
          <div className="flex-1 text-center">
            <div className="text-2xl font-bold text-purple-600">{allocation.alternatives}%</div>
            <div className="text-sm text-gray-600">Alternatives</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const EducationHub: React.FC = () => {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedModule, setSelectedModule] = useState<number | null>(null);
  const [currentQuiz, setCurrentQuiz] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [portfolioBuilder, setPortfolioBuilder] = useState<PortfolioAllocation>({
    stocks: 70,
    bonds: 20,
    alternatives: 10
  });

  const courses: Course[] = [
    {
      id: 1,
      title: "F-1 Visa Investment Mastery",
      emoji: "🎓",
      description: "Learn how to invest safely while maintaining your F-1 visa status",
      duration: "45 min",
      level: "beginner",
      unlocked: true,
      rating: 4.9,
      students: 3241,
      modules: [
        {
          id: 1,
          title: "Understanding Visa Restrictions",
          type: "lesson",
          content: {
            text: `
# Understanding Visa Restrictions

## F-1 Visa Investment Rules

As an F-1 student, you can legally invest in stocks, bonds, and other securities. However, there are important restrictions to understand:

**What's Allowed:**
- Buy and hold investing (long-term positions)
- Passive income from dividends and capital gains
- Investment through brokerage accounts
- Retirement account contributions (with earned income)

**What to Avoid:**
- Day trading or frequent trading that resembles employment
- Running an investment business or advisory service
- Pattern Day Trading (25k+ account with 4+ day trades in 5 days)
- Any activity that generates "active" income

## Key Principle: Passive vs Active Income

The IRS distinguishes between passive investment income (allowed) and active business income (restricted). Buying stocks and holding them is passive. Trading frequently can be seen as active business.

## Safe Investment Approach

Focus on buy-and-hold strategies with index funds, ETFs, and blue-chip stocks. This approach is not only visa-safe but also historically more profitable than frequent trading.
          `,
            quiz: [
              {
                question: "Which investment activity is safest for F-1 visa holders?",
                options: [
                  "Day trading stocks daily",
                  "Buy-and-hold investing in ETFs",
                  "Running a trading advisory service",
                  "Forex trading for quick profits"
                ],
                correct: 1,
                explanation: "Buy-and-hold investing generates passive income, which is allowed for F-1 students and doesn't risk visa status."
              }
            ]
          }
        },
        {
          id: 2,
          title: "Safe Brokerage Account Setup",
          type: "lesson",
          content: {
            text: `
# Safe Brokerage Account Setup

## Choosing the Right Broker

**Student-Friendly Brokers:**
- Fidelity: No minimums, excellent research tools
- Charles Schwab: Global support, no foreign transaction fees
- E*TRADE: User-friendly mobile app, educational resources
- TD Ameritrade: Comprehensive learning platform

**What to Look For:**
- No account minimums
- Commission-free stock and ETF trades  
- Educational resources
- Mobile app functionality
- Customer support for international students

## Required Documents

- Valid passport
- I-20 form
- U.S. address (can be campus address)
- Social Security Number or ITIN
- Bank account information

## Account Types for Students

**Taxable Brokerage Account**: Most flexible for students
**Roth IRA**: Only if you have earned income from on-campus work
**Traditional IRA**: Usually not beneficial for students in low tax brackets

## Important Settings

Set your account to "Cash Account" not "Margin Account" to avoid pattern day trading rules and stay visa-compliant.
          `
          }
        },
        {
          id: 3,
          title: "Building Your First Portfolio",
          type: "interactive",
          content: {
            text: `
Building Your First Portfolio 🎨

A portfolio is your collection of investments. Like a balanced meal, you want variety!

The 60/40 Rule (Traditional)
- 60% Stocks (growth potential)
- 40% Bonds (stability)

Modern Approach for Young Investors
- 70-80% Stock ETFs
- 10-20% International ETFs
- 5-10% Bonds
- 5% Alternative investments

Sample $1,000 Student Portfolio:
- $400 - US Total Market ETF (VTI)
- $200 - International ETF (VTIAX)
- $200 - Individual growth stocks
- $150 - Bond ETF (BND)
- $50 - Fun money (crypto, individual picks)
          `,
            interactive: true
          }
        }
      ],
      completed: false
    },
    {
      id: 2,
      title: "Investment Fundamentals",
      emoji: "📚",
      description: "Master the basics of investing and portfolio management",
      duration: "60 min",
      level: "beginner",
      unlocked: true,
      rating: 4.8,
      students: 2156,
      modules: [
        {
          id: 1,
          title: "What's the Difference Between Saving and Investing?",
          type: "lesson",
          content: {
            text: `
What's the difference between saving and investing?

Saving is putting money aside for future use. It's important to save so you can cover fixed expenses, such as mortgage or rent payments, and to make sure you're prepared for emergencies. Generally, people put their savings in bank accounts, where up to $250,000 is insured by the Federal Deposit Insurance Corporation (FDIC).

Investing is when you put your money "to work for you," another way to think of investing is when you put your money "at risk." You buy an investment like a stock or bond with the hope that its value will increase over time. Although investing comes with the risk of losing money, should a stock or bond decrease in value, it also has the potential for greater returns than you'd receive by putting your money in a bank account.

The goal of investing is to grow your money over time.

**Why should I invest?**

Investing can help investors pursue financial goals, such as buying a home or funding retirement. By investing, you're putting your money to work, and at risk, to pursue your goals.

**The power of compounding**: A little goes a long way. When you invest, your returns generate more returns, creating exponential growth over time.

**When should I invest?**

Many investment professionals say the sooner you invest, the better. Historically, the longer you invest, the less impact the market's short-term ups and downs have on your return.

**Time in the market is more important than timing the market.**
          `,
            quiz: [
              {
                question: "What is the main difference between saving and investing?",
                options: [
                  "Saving is riskier than investing",
                  "Investing aims to grow money over time while saving preserves money",
                  "Saving requires more money than investing",
                  "There is no difference between the two"
                ],
                correct: 1,
                explanation: "Investing puts your money to work to grow over time, while saving preserves your money safely in bank accounts! 💰"
              },
              {
                question: "What is the power of compounding?",
                options: [
                  "Earning interest only on your initial investment",
                  "Earning returns on your initial investment plus accumulated earnings",
                  "Avoiding all investment fees",
                  "Trading stocks frequently"
                ],
                correct: 1,
                explanation: "Compounding means your returns generate more returns, creating exponential growth over time! 📈"
              },
              {
                question: "What is diversification?",
                options: [
                  "Putting all your money in one investment",
                  "Spreading investments across different types to reduce risk",
                  "Only investing in stocks",
                  "Avoiding all bonds"
                ],
                correct: 1,
                explanation: "Diversification spreads your risk across different investments, so you're not putting all your eggs in one basket! 🥚"
              }
            ]
          }
        },
        {
          id: 2,
          title: "Types of Investments",
          type: "lesson",
          content: {
            text: `
Types of Investments 🎯

**Stocks (Equities)**
Buying shares means owning a piece of a company. When the company does well, your investment typically grows.

Example: If you buy Apple stock, you own a tiny piece of Apple!

**Bonds**
Lending money to companies or governments in exchange for regular interest payments.

Think of it as: Being the bank - you lend money and get paid interest.

**Real Estate**
Investing in property, either directly or through REITs (Real Estate Investment Trusts).

**ETFs & Mutual Funds**
Baskets of investments managed professionally. Perfect for diversification!

ETF Example: SPDR S&P 500 (SPY) contains 500 of the largest US companies in one fund.

**Commodities**
Physical goods like gold, oil, or agricultural products.
          `,
            quiz: [
              {
                question: "What does buying a stock represent?",
                options: [
                  "Lending money to a company",
                  "Owning a piece of the company",
                  "Buying the company's products",
                  "Working for the company"
                ],
                correct: 1,
                explanation: "When you buy stock, you become a partial owner of that company! You share in its successes (and risks). 🏢"
              }
            ]
          }
        }
      ],
      completed: false
    }
  ];

  const handleCourseSelect = (course: Course) => {
    setSelectedCourse(course);
    setSelectedModule(null);
    setCurrentQuiz(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
  };

  const handleModuleSelect = (moduleId: number) => {
    setSelectedModule(moduleId);
    setCurrentQuiz(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
  };

  const handleBackToCourses = () => {
    setSelectedCourse(null);
    setSelectedModule(null);
  };

  const handleBackToModules = () => {
    setSelectedModule(null);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    if (currentQuiz < (selectedCourse?.modules.find(m => m.id === selectedModule)?.content.quiz?.length || 0) - 1) {
      setCurrentQuiz(currentQuiz + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  if (selectedCourse && selectedModule) {
    return (
      <ModuleContent
        course={selectedCourse}
        moduleId={selectedModule}
        onBack={handleBackToModules}
        currentQuiz={currentQuiz}
        selectedAnswer={selectedAnswer}
        showExplanation={showExplanation}
        onAnswerSelect={handleAnswerSelect}
        onNextQuestion={handleNextQuestion}
        portfolioBuilder={portfolioBuilder}
        setPortfolioBuilder={setPortfolioBuilder}
        PortfolioBuilder={PortfolioBuilder}
      />
    );
  }

  if (selectedCourse) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <button
              onClick={handleBackToCourses}
              className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
            >
              <ChevronRight className="w-4 h-4 rotate-180 mr-2" />
              Back to Courses
            </button>
            
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center mb-6">
                <span className="text-4xl mr-4">{selectedCourse.emoji}</span>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{selectedCourse.title}</h1>
                  <p className="text-gray-600 mt-2">{selectedCourse.description}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="flex items-center text-gray-600">
                  <Clock className="w-5 h-5 mr-2" />
                  <span>{selectedCourse.duration}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Trophy className="w-5 h-5 mr-2" />
                  <span className="capitalize">{selectedCourse.level}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Users className="w-5 h-5 mr-2" />
                  <span>{selectedCourse.students.toLocaleString()} students</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {selectedCourse.modules.map((module) => (
                  <motion.div
                    key={module.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => handleModuleSelect(module.id)}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        {module.type === 'lesson' && <FileText className="w-5 h-5 text-blue-600 mr-2" />}
                        {module.type === 'video' && <Video className="w-5 h-5 text-red-600 mr-2" />}
                        {module.type === 'interactive' && <Play className="w-5 h-5 text-green-600 mr-2" />}
                        <span className="text-sm text-gray-500 capitalize">{module.type}</span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{module.title}</h3>
                    
                    {module.content.quiz && (
                      <div className="flex items-center text-sm text-gray-600">
                        <FileCheck className="w-4 h-4 mr-1" />
                        <span>{module.content.quiz.length} quiz questions</span>
                      </div>
                    )}
                    
                    {module.content.interactive && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Play className="w-4 h-4 mr-1" />
                        <span>Interactive exercise</span>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <EnhancedChatWidget />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Education Hub
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Master the fundamentals of investing while staying compliant with your visa requirements. 
              Learn from expert-curated content designed specifically for international students.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
              onClick={() => handleCourseSelect(course)}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-4xl">{course.emoji}</span>
                  <div className="flex items-center">
                    <Star className="w-5 h-5 text-yellow-400 mr-1" />
                    <span className="text-sm font-medium text-gray-900">{course.rating}</span>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h3>
                <p className="text-gray-600 mb-4">{course.description}</p>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    <span>{course.students.toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    course.level === 'beginner' ? 'bg-green-100 text-green-800' :
                    course.level === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {course.level}
                  </span>
                  
                  <div className="flex items-center text-blue-600 font-medium">
                    <span>Start Learning</span>
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Our Education Hub?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Designed specifically for international students with F-1 visas, our courses ensure you learn 
              investment strategies that won't jeopardize your immigration status.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Visa-Safe Learning</h3>
              <p className="text-gray-600">
                All content is reviewed to ensure compliance with F-1 visa regulations
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Expert-Curated Content</h3>
              <p className="text-gray-600">
                Learn from financial experts who understand international student needs
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Practical Skills</h3>
              <p className="text-gray-600">
                Build real-world investment skills you can use immediately
              </p>
            </div>
          </div>
        </div>
      </div>
      <EnhancedChatWidget />
    </div>
  );
};

export default EducationHub;