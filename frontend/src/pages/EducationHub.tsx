import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, Trophy, ChevronRight, Check, Play, FileText, Video, Users, Star, Award, TrendingUp, BookmarkIcon } from 'lucide-react'
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
  emoji: string;
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

  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        ← Back to {course.title}
      </button>

      <h1 className="text-3xl font-bold mb-6">{module.title}</h1>

      {/* Content */}
      <div className="prose prose-lg max-w-none mb-8">
        <div dangerouslySetInnerHTML={{ __html: module.content.text.replace(/\n/g, '<br>') }} />
      </div>

      {/* Interactive Portfolio Builder */}
      {module.content.interactive && (
        <div className="mb-8">
          <PortfolioBuilder />
        </div>
      )}

      {/* Quiz Section */}
      {hasQuiz && (
        <div className="border-t pt-8">
          <h2 className="text-2xl font-bold mb-6">Knowledge Check 🧠</h2>

          <div className="bg-gray-50 rounded-2xl p-6">
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Question {currentQuiz + 1} of {quiz.length}</span>
                <span>{Math.round(((currentQuiz + 1) / quiz.length) * 100)}% Complete</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  className="bg-primary-600 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentQuiz + 1) / quiz.length) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            <h3 className="text-xl font-semibold mb-6">{quiz[currentQuiz].question}</h3>

            <div className="space-y-3 mb-6">
              {quiz[currentQuiz].options.map((option, index) => (
                <motion.button
                  key={index}
                  onClick={() => !showExplanation && onAnswerSelect(index)}
                  disabled={showExplanation}
                  className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 ${showExplanation
                    ? index === quiz[currentQuiz].correct
                      ? 'border-green-500 bg-green-50 text-green-800'
                      : selectedAnswer === index
                        ? 'border-red-500 bg-red-50 text-red-800'
                        : 'border-gray-200 bg-gray-50'
                    : selectedAnswer === index
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  whileHover={!showExplanation ? { scale: 1.02 } : {}}
                >
                  {option}
                </motion.button>
              ))}
            </div>

            {showExplanation && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-200"
              >
                <h4 className="font-semibold text-blue-800 mb-2">Explanation:</h4>
                <p className="text-blue-700">{quiz[currentQuiz].explanation}</p>
              </motion.div>
            )}

            {showExplanation && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={onNextQuestion}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 px-6 rounded-xl font-medium transition-colors"
              >
                {currentQuiz < quiz.length - 1 ? 'Next Question' : 'Complete Module'} →
              </motion.button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

const EducationHub: React.FC = () => {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [selectedModule, setSelectedModule] = useState<number | null>(null)
  const [currentQuiz, setCurrentQuiz] = useState<number>(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showExplanation, setShowExplanation] = useState<boolean>(false)
  const [completedCourses] = useState<number[]>([])
  const [completedModules, setCompletedModules] = useState<number[]>([])
  const [portfolioBuilder, setPortfolioBuilder] = useState<PortfolioAllocation>({
    stocks: 70,
    bonds: 20,
    alternatives: 10
  })

  const PortfolioBuilder: React.FC = () => (
    <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6 border">
      <h3 className="text-xl font-bold mb-4">🎨 Interactive Portfolio Builder</h3>
      <p className="text-gray-600 mb-6">Adjust the sliders to see how different allocations affect your portfolio!</p>

      <div className="space-y-4">
        {Object.entries(portfolioBuilder).map(([key, value]) => (
          <div key={key} className="space-y-2">
            <div className="flex justify-between">
              <label className="font-medium capitalize">{key}</label>
              <span className="font-bold text-primary-600">{value}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={value}
              onChange={(e) => {
                const newValue = parseInt(e.target.value)
                setPortfolioBuilder(prev => ({
                  ...prev,
                  [key]: newValue
                }))
              }}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-white rounded-xl">
        <div className="flex justify-between text-sm">
          <span>Total Allocation:</span>
          <span className={`font-bold ${Object.values(portfolioBuilder).reduce((a: number, b: number) => a + b, 0) === 100
            ? 'text-green-600'
            : 'text-red-600'
            }`}>
            {Object.values(portfolioBuilder).reduce((a: number, b: number) => a + b, 0)}%
          </span>
        </div>
      </div>
    </div>
  )

  const handleAnswerSelect = (answerIndex: number): void => {
    setSelectedAnswer(answerIndex)
    setShowExplanation(true)
  }

  const nextQuestion = (): void => {
    const currentModule = selectedCourse?.modules.find(m => m.id === selectedModule)
    const quiz = currentModule?.content?.quiz || []

    if (currentQuiz < quiz.length - 1) {
      setCurrentQuiz(currentQuiz + 1)
      setSelectedAnswer(null)
      setShowExplanation(false)
    } else {
      // Module completed
      if (selectedModule && !completedModules.includes(selectedModule)) {
        setCompletedModules([...completedModules, selectedModule])
      }
      setSelectedModule(null)
      setCurrentQuiz(0)
      setSelectedAnswer(null)
      setShowExplanation(false)
    }
  }

  const startCourse = (courseId: number): void => {
    const course = COMPREHENSIVE_COURSES.find(c => c.id === courseId)
    if (course) {
      setSelectedCourse(course)
    }
  }

  const startModule = (moduleId: number): void => {
    setSelectedModule(moduleId)
    setCurrentQuiz(0)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Investment Academy 
            </h1>
            <p className="text-gray-600">Master investing through interactive courses and AI-powered guidance</p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium">All courses</button>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50">Stocks</button>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50">ETFs</button>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50">Options</button>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50">Crypto</button>
          </div>
        </div>



        <AnimatePresence mode="wait">
          {!selectedCourse ? (
            /* Courses Grid */
            <motion.div
              key="courses"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              {/* My Courses Section */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">My courses</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {COMPREHENSIVE_COURSES.slice(0, 3).map((course, index) => {
                    const isCompleted = completedCourses.includes(course.id)
                    const progress = Math.floor(Math.random() * 100) // Mock progress
                    const lessonsCount = course.modules.length

                    return (
                      <motion.div
                        key={course.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`relative rounded-3xl p-6 text-white cursor-pointer transition-all duration-200 hover:scale-105 ${index === 0 ? 'bg-gradient-to-br from-blue-500 to-blue-600' :
                          index === 1 ? 'bg-gradient-to-br from-red-500 to-orange-500' :
                            'bg-gradient-to-br from-gray-800 to-gray-900'
                          }`}
                        onClick={() => startCourse(course.id)}
                      >
                        <div className="absolute top-4 right-4">
                          <BookmarkIcon className="w-6 h-6" />
                        </div>

                        <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-4 ${index === 0 ? 'bg-blue-700' :
                          index === 1 ? 'bg-red-700' :
                            'bg-gray-700'
                          }`}>
                          {course.level}
                        </div>

                        <h3 className="text-xl font-bold mb-2">{course.title}</h3>
                        <p className="text-sm opacity-90 mb-4">{course.description.slice(0, 60)}...</p>

                        <div className="mb-4">
                          <div className="flex justify-between text-sm mb-2">
                            <span>Progress</span>
                            <span>{progress}/24 lessons</span>
                          </div>
                          <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
                            <div
                              className="bg-white h-2 rounded-full transition-all duration-300"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex -space-x-2">
                            <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-xs">+{Math.floor(Math.random() * 200) + 100}</div>
                          </div>
                          <button className="bg-lime-400 text-gray-900 px-4 py-2 rounded-xl font-medium text-sm hover:bg-lime-300 transition-colors">
                            Continue
                          </button>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </div>

              {/* My Next Lessons */}
              <div className="grid lg:grid-cols-3 gap-8 mb-8">
                <div className="lg:col-span-2">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">All Courses</h2>
                    <button className="text-red-500 hover:text-red-600 font-medium">View all courses</button>
                  </div>

                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="space-y-4">
                      {COMPREHENSIVE_COURSES.map((course, index) => {
                        const isCompleted = completedCourses.includes(course.id)
                        const isLocked = !course.unlocked && !isCompleted

                        return (
                          <div key={course.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors" onClick={() => !isLocked && startCourse(course.id)}>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900">{course.title}</h4>
                              <p className="text-sm text-gray-600">{course.description}</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="text-2xl">{course.emoji}</div>
                              <div className="text-right">
                                <div className="text-sm font-medium text-gray-900">{course.level}</div>
                                <div className="text-xs text-gray-500">{course.duration}</div>
                              </div>
                              {isCompleted && (
                                <Check className="w-5 h-5 text-green-600" />
                              )}
                              {isLocked && (
                                <div className="text-gray-400 text-sm">🔒</div>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>

                {/* New Course Recommendation */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">New course matching your interests</h3>
                  <div className="bg-gradient-to-br from-lime-400 to-lime-500 rounded-3xl p-6 text-gray-900">
                    <div className="inline-block px-3 py-1 bg-gray-900 text-white rounded-full text-xs font-medium mb-4">
                      Design
                    </div>

                    <h3 className="text-2xl font-bold mb-2">Advanced Option Trading</h3>

                    <div className="flex items-center gap-2 mb-6">
                      <span className="text-sm">They are already studying</span>
                      <div className="flex -space-x-2">
                        <div className="w-6 h-6 bg-gray-800 rounded-full"></div>
                        <div className="w-6 h-6 bg-gray-700 rounded-full"></div>
                        <div className="w-6 h-6 bg-gray-600 rounded-full"></div>
                        <span className="text-sm font-medium">+100</span>
                      </div>
                    </div>

                    <button className="w-full bg-red-500 text-white py-3 px-4 rounded-xl font-medium hover:bg-red-600 transition-colors">
                      More details
                    </button>
                  </div>
                </div>
              </div>

              {/* All Courses Grid */}
            
            </motion.div>
          ) : !selectedModule ? (
            /* Course Modules */
            <motion.div
              key="modules"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-4xl mx-auto"
            >
              <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
                <button
                  onClick={() => setSelectedCourse(null)}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
                >
                  ← Back to Courses
                </button>

                <div className="flex items-start gap-6 mb-8">
                  <div className="text-6xl">{selectedCourse.emoji}</div>
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold mb-2">{selectedCourse.title}</h1>
                    <p className="text-gray-600 mb-4">{selectedCourse.description}</p>
                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {selectedCourse.duration}
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-500" />
                        {selectedCourse.rating}
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        {selectedCourse.students.toLocaleString()} students
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4">
                  {selectedCourse.modules.map((module, index) => (
                    <motion.div
                      key={module.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => startModule(module.id)}
                      className="flex items-center gap-4 p-4 border-2 border-gray-100 rounded-xl hover:border-primary-200 hover:bg-primary-50 cursor-pointer transition-all"
                    >
                      <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                        {module.type === 'lesson' ? <FileText className="w-6 h-6 text-primary-600" /> :
                          module.type === 'video' ? <Video className="w-6 h-6 text-primary-600" /> :
                            <Play className="w-6 h-6 text-primary-600" />}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{module.title}</h3>
                        <p className="text-sm text-gray-500 capitalize">{module.type}</p>
                      </div>
                      {completedModules.includes(module.id) && (
                        <Check className="w-6 h-6 text-green-600" />
                      )}
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            /* Module Content */
            <motion.div
              key="module"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-4xl mx-auto"
            >
              <ModuleContent
                course={selectedCourse}
                moduleId={selectedModule}
                onBack={() => setSelectedModule(null)}
                currentQuiz={currentQuiz}
                selectedAnswer={selectedAnswer}
                showExplanation={showExplanation}
                onAnswerSelect={handleAnswerSelect}
                onNextQuestion={nextQuestion}
                portfolioBuilder={portfolioBuilder}
                setPortfolioBuilder={setPortfolioBuilder}
                PortfolioBuilder={PortfolioBuilder}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Enhanced Chat Widget with Course Context */}
      <EnhancedChatWidget
        currentCourse={selectedCourse?.title}
        currentModule={selectedCourse?.modules.find(m => m.id === selectedModule)?.title}
      />
    </div>
  )
}

// Enhanced course data with comprehensive content
const COMPREHENSIVE_COURSES: Course[] = [
  {
    id: 1,
    title: "Investing Fundamentals",
    emoji: "📚",
    description: "Master the core concepts of investing with practical examples and real-world applications.",
    duration: "45 min",
    level: "beginner",
    unlocked: true,
    rating: 4.9,
    students: 2847,
    modules: [
      {
        id: 1,
        title: "What is Investing?",
        type: "lesson",
        content: {
          text: `
# What is Investing? 💰

Investing is the process of putting your money to work to generate returns over time. Think of it as planting seeds that grow into trees bearing fruit.

## Key Concepts:

**Risk vs Return**: Higher potential returns usually come with higher risk. It's like climbing a mountain - the higher you go, the more beautiful the view, but the more challenging the climb.

**Time Horizon**: How long you plan to keep your money invested. Longer time horizons generally allow for more aggressive strategies.

**Compound Interest**: Einstein called it "the eighth wonder of the world." Your money earns returns, and those returns earn returns!

## Example:
If you invest $1,000 at 7% annual return:
- Year 1: $1,070
- Year 10: $1,967
- Year 20: $3,870
- Year 30: $7,612

The magic happens over time! ✨
          `,
          video: "intro-to-investing.mp4",
          quiz: [
            {
              question: "What is the main benefit of compound interest?",
              options: [
                "You get money back immediately",
                "Your returns generate additional returns over time",
                "It eliminates all investment risk",
                "It guarantees profits"
              ],
              correct: 1,
              explanation: "Compound interest means your returns generate additional returns, creating exponential growth over time! 🚀"
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
# Types of Investments 🎯

## Stocks (Equities)
Buying shares means owning a piece of a company. When the company does well, your investment typically grows.

**Example**: If you buy Apple stock, you own a tiny piece of Apple!

## Bonds
Lending money to companies or governments in exchange for regular interest payments.

**Think of it as**: Being the bank - you lend money and get paid interest.

## Real Estate
Investing in property, either directly or through REITs (Real Estate Investment Trusts).

## ETFs & Mutual Funds
Baskets of investments managed professionally. Perfect for diversification!

**ETF Example**: SPDR S&P 500 (SPY) contains 500 of the largest US companies in one fund.

## Commodities
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
      },
      {
        id: 3,
        title: "Building Your First Portfolio",
        type: "interactive",
        content: {
          text: `
# Building Your First Portfolio 🎨

A portfolio is your collection of investments. Like a balanced meal, you want variety!

## The 60/40 Rule (Traditional)
- 60% Stocks (growth potential)
- 40% Bonds (stability)

## Modern Approach for Young Investors
- 70-80% Stock ETFs
- 10-20% International ETFs
- 5-10% Bonds
- 5% Alternative investments

## Sample $1,000 Student Portfolio:
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
    title: "Stock Market Mastery",
    emoji: "📈",
    description: "Deep dive into stock analysis, market trends, and advanced trading strategies.",
    duration: "60 min",
    level: "intermediate",
    unlocked: true,
    rating: 4.8,
    students: 1923,
    modules: [
      {
        id: 1,
        title: "Reading Stock Charts",
        type: "lesson",
        content: {
          text: `
# Reading Stock Charts 📊

Charts tell the story of a stock's price movement. Learn to read this visual language!

## Basic Chart Types:

**Line Charts**: Simple price movement over time
**Candlestick Charts**: Show open, high, low, close prices
**Volume Charts**: How many shares were traded

## Key Indicators:

**Support & Resistance**: Price levels where stock tends to bounce
**Moving Averages**: Smooth out price action to show trends
**RSI**: Measures if stock is overbought or oversold

## Reading the Story:
- Upward trend = Bullish (optimistic)
- Downward trend = Bearish (pessimistic)
- Sideways = Consolidation (uncertainty)

Remember: Charts show what happened, not what will happen! 🔮
          `
        }
      }
    ],
    completed: false
  },
  {
    id: 3,
    title: "ETF Investment Strategy",
    emoji: "🛒",
    description: "Master Exchange Traded Funds for diversified, low-cost investing.",
    duration: "35 min",
    level: "beginner",
    unlocked: true,
    rating: 4.9,
    students: 3241,
    modules: [
      {
        id: 1,
        title: "ETF Basics",
        type: "lesson",
        content: {
          text: `
# ETF Basics 🛒

## What are ETFs?
Exchange Traded Funds are like buying a pre-made smoothie instead of individual fruits. You get a blend of many investments in one purchase!

## Popular ETF Categories:

**Broad Market ETFs**:
- SPY (S&P 500) - Top 500 US companies
- VTI (Total Stock Market) - Entire US market
- QQQ (NASDAQ 100) - Tech-heavy index

**International ETFs**:
- VXUS (International stocks excluding US)
- EEM (Emerging markets)

**Sector ETFs**:
- XLK (Technology)
- XLF (Financial)
- XLE (Energy)

## Benefits:
-  Instant diversification
-  Low fees (expense ratios)
-  Professional management
-  Trade like stocks

## Student-Friendly ETFs:
Start with broad market ETFs like VTI or VOO for maximum diversification! 🎯
          `
        }
      }
    ],
    completed: false
  },
  {
    id: 4,
    title: "Crypto & Alternative Investments",
    emoji: "₿",
    description: "Explore cryptocurrency, NFTs, and other alternative investment opportunities.",
    duration: "50 min",
    level: "advanced",
    unlocked: false,
    rating: 4.6,
    students: 1456,
    modules: [],
    completed: false
  },
  {
    id: 5,
    title: "Tax-Efficient Investing",
    emoji: "📋",
    description: "Maximize your returns by minimizing taxes through smart investment strategies.",
    duration: "40 min",
    level: "intermediate",
    unlocked: false,
    rating: 4.7,
    students: 987,
    modules: [],
    completed: false
  }
]

export default EducationHub