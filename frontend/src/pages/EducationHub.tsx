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
          // Starting a new list
          if (currentBlock.trim()) {
            blocks.push({ type: 'text', content: currentBlock.trim() });
            currentBlock = '';
          }
          inList = true;
          listItems = [];
        }
        listItems.push(line.substring(2)); // Remove "- "
      } else {
        if (inList) {
          // End of list
          blocks.push({ type: 'list', items: listItems });
          inList = false;
          listItems = [];
        }
        currentBlock += line + '\n';
      }
    }
    
    // Handle any remaining content
    if (inList) {
      blocks.push({ type: 'list', items: listItems });
    } else if (currentBlock.trim()) {
      blocks.push({ type: 'text', content: currentBlock.trim() });
    }
    
    // Convert blocks to HTML
    let html = blocks.map(block => {
      if (block.type === 'list' && block.items) {
        const items = block.items.map(item => 
          `<li class="mb-1">${item.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</li>`
        ).join('');
        return `<ul class="list-disc ml-6 mb-4 space-y-1">${items}</ul>`;
      } else if (block.type === 'text' && block.content) {
        return block.content
          // Headers
          .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mb-3 mt-6 text-gray-900">$1</h3>')
          .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mb-4 mt-8 text-gray-900">$1</h2>')
          .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mb-6 mt-8 text-gray-900">$1</h1>')
          
          // Bold text
          .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')
          
          // Paragraphs (non-empty lines that aren't headers)
          .replace(/^(?!<[h123]|$)(.*$)/gim, '<p class="mb-4 text-gray-700 leading-relaxed">$1</p>')
          
          // Clean up empty paragraphs
          .replace(/<p class="[^"]*">\s*<\/p>/g, '');
      }
      return '';
    }).join('');
    
    return html;
  }

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
        <div dangerouslySetInnerHTML={{ __html: parseMarkdown(module.content.text) }} />
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
          <h2 className="text-2xl font-bold mb-6">Knowledge Check</h2>

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
      <h3 className="text-xl font-bold mb-4">Interactive Portfolio Builder</h3>
      <p className="text-gray-600 mb-6">Adjust the sliders to see how different allocations affect your portfolio</p>

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
    const course = INTERNATIONAL_STUDENT_COURSES.find(c => c.id === courseId)
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
              Investment Learning Hub
            </h1>
            <p className="text-gray-600">Investment education tailored for international students</p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium">All courses</button>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50">Visa Safe</button>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50">Tax Aware</button>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50">Banking</button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {!selectedCourse ? (
            <motion.div
              key="courses"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              {/* Featured Courses for International Students */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Recommended for You</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {INTERNATIONAL_STUDENT_COURSES.slice(0, 3).map((course, index) => {
                    const isCompleted = completedCourses.includes(course.id)
                    const progress = Math.floor(Math.random() * 100)

                    return (
                      <motion.div
                        key={course.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`relative rounded-3xl p-6 text-white cursor-pointer transition-all duration-200 hover:scale-105 ${
                          index === 0 ? 'bg-gradient-to-br from-green-500 to-green-600' :
                          index === 1 ? 'bg-gradient-to-br from-blue-500 to-blue-600' :
                          'bg-gradient-to-br from-purple-500 to-purple-600'
                        }`}
                        onClick={() => startCourse(course.id)}
                      >
                        <div className="absolute top-4 right-4">
                          <BookmarkIcon className="w-6 h-6" />
                        </div>

                        <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-4 ${
                          index === 0 ? 'bg-green-700' :
                          index === 1 ? 'bg-blue-700' :
                          'bg-purple-700'
                        }`}>
                          {course.level}
                        </div>

                        <h3 className="text-xl font-bold mb-2">{course.title}</h3>
                        <p className="text-sm opacity-90 mb-4">{course.description.slice(0, 80)}...</p>

                        <div className="mb-4">
                          <div className="flex justify-between text-sm mb-2">
                            <span>Progress</span>
                            <span>{progress}% complete</span>
                          </div>
                          <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
                            <div
                              className="bg-white h-2 rounded-full transition-all duration-300"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="w-4 h-4" />
                            {course.duration}
                          </div>
                          <button className="bg-white text-gray-900 px-4 py-2 rounded-xl font-medium text-sm hover:bg-gray-100 transition-colors">
                            Start Learning
                          </button>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </div>

              {/* All Courses */}
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">All Courses</h2>
                    <button className="text-blue-600 hover:text-blue-700 font-medium">View all</button>
                  </div>

                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="space-y-4">
                      {INTERNATIONAL_STUDENT_COURSES.map((course) => {
                        const isCompleted = completedCourses.includes(course.id)
                        const isLocked = !course.unlocked && !isCompleted

                        return (
                          <div 
                            key={course.id} 
                            className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors" 
                            onClick={() => !isLocked && startCourse(course.id)}
                          >
                            <div className="flex items-center justify-center">{course.emoji}</div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900">{course.title}</h4>
                              <p className="text-sm text-gray-600">{course.description}</p>
                              <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                                <span>{course.duration}</span>
                                <span>{course.level}</span>
                                <div className="flex items-center gap-1">
                                  <Star className="w-3 h-3 text-yellow-500" />
                                  {course.rating}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {isCompleted && <Check className="w-5 h-5 text-green-600" />}
                              {isLocked && <div className="text-gray-400 text-sm">🔒</div>}
                              <ChevronRight className="w-5 h-5 text-gray-400" />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>

                {/* Course Spotlight */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Course Spotlight</h3>
                  <div className="bg-gradient-to-br from-orange-400 to-orange-500 rounded-3xl p-6 text-white">
                    <div className="inline-block px-3 py-1 bg-orange-700 rounded-full text-xs font-medium mb-4">
                      Most Popular
                    </div>

                    <h3 className="text-2xl font-bold mb-2">Visa-Safe Investing</h3>
                    <p className="text-sm mb-6">Learn how to invest without risking your student visa status</p>

                    <div className="flex items-center gap-2 mb-6">
                      <span className="text-sm">Join 1,200+ students</span>
                    </div>

                    <button 
                      onClick={() => startCourse(1)}
                      className="w-full bg-white text-orange-600 py-3 px-4 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                    >
                      Start Course
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : !selectedModule ? (
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
                  <div className="text-6xl flex items-center justify-center">{selectedCourse.emoji}</div>
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

      <EnhancedChatWidget
        currentCourse={selectedCourse?.title}
        currentModule={selectedCourse?.modules.find(m => m.id === selectedModule)?.title}
      />
    </div>
  )
}

// Courses specifically designed for international students
const INTERNATIONAL_STUDENT_COURSES: Course[] = [
  {
    id: 1,
    title: "Visa-Safe Investing for Students",
    emoji: <Shield className="w-6 h-6" />,
    description: "Learn investment strategies that protect your student visa status while building wealth.",
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
      }
    ],
    completed: false
  },
  {
    id: 2,
    title: "International Student Tax Guide",
    emoji: <FileCheck className="w-6 h-6" />,
    description: "Navigate U.S. tax obligations and optimize your investment taxes as an international student.",
    duration: "55 min",
    level: "intermediate",
    unlocked: true,
    rating: 4.8,
    students: 2156,
    modules: [
      {
        id: 1,
        title: "Tax Status and Classifications",
        type: "lesson",
        content: {
          text: `
# Tax Status and Classifications

## Resident vs Non-Resident for Tax Purposes

Your visa status doesn't determine your tax status. The IRS uses the "Substantial Presence Test":

**Non-Resident (Years 1-5 for most F-1 students):**
- Taxed only on U.S. source income
- Standard deduction doesn't apply
- Different tax rates on investment income

**Resident (After 5 years or marriage to U.S. citizen):**
- Taxed on worldwide income like U.S. citizens
- Can use standard deduction
- Standard capital gains rates apply

## Investment Income Tax Rates

**For Non-Residents:**
- Dividends: 30% (or lower treaty rate)
- Capital gains: Generally not taxed if you leave the U.S.
- Interest: Usually not taxed on bank accounts

**Treaty Benefits:**
Many countries have tax treaties reducing these rates. Common treaty rates:
- India: 15% on dividends
- China: 10% on dividends  
- South Korea: 15% on dividends
- Canada: 15% on dividends

## Tax Forms You'll Need

- Form 1040NR (Non-resident) or 1040 (Resident)
- Form 8843 (Exempt individual statement)
- Form W-8BEN (Treaty benefits)
          `
        }
      },
      {
        id: 2,
        title: "Tax-Efficient Investment Strategies",
        type: "lesson",
        content: {
          text: `
# Tax-Efficient Investment Strategies

## Growth vs Dividend Stocks

**For Non-Resident Students:**
Focus on growth stocks over dividend-paying stocks to minimize current tax obligations.

**Growth Stocks Benefits:**
- No annual tax on unrealized gains
- Lower tax rates when you eventually sell
- Compound growth without tax drag

**Dividend Stock Considerations:**
- Subject to withholding tax each year
- May reduce treaty benefits if switching countries
- Still valuable for long-term wealth building

## ETF vs Mutual Fund Selection

**ETFs Generally Better for Tax Efficiency:**
- Lower internal turnover
- More control over when you realize gains
- No forced distributions from other investors

**Index Funds:**
- Vanguard, Fidelity, and Schwab offer tax-efficient options
- Lower turnover than actively managed funds
- Broad diversification reduces risk

## Tax Loss Harvesting

Sell losing investments to offset gains, reducing your tax bill. However, be aware of the "wash sale rule" - you can't repurchase the same security within 30 days.

## Timing Your Investment Sales

Consider your future plans:
- Selling before leaving the U.S. may avoid some taxes
- Holding investments while returning home may benefit from treaty provisions
- Consult tax professional for complex situations
          `
        }
      }
    ],
    completed: false
  },
  {
    id: 3,
    title: "Building Credit While Investing",
    emoji: <CreditCard className="w-6 h-6" />,
    description: "Establish U.S. credit history alongside your investment journey for financial success.",
    duration: "40 min",
    level: "beginner",
    unlocked: true,
    rating: 4.7,
    students: 1987,
    modules: [
      {
        id: 1,
        title: "Credit Basics for International Students",
        type: "lesson",
        content: {
          text: `
# Credit Basics for International Students

## Why Credit Matters

Building credit in the U.S. opens doors to:
- Better loan rates for cars, homes, or education
- Higher credit card limits and rewards
- Easier apartment rentals
- Some employers check credit for job applications
- Building financial credibility for future opportunities

## Credit Score Basics

**Credit Score Ranges:**
- 300-579: Poor
- 580-669: Fair  
- 670-739: Good
- 740-799: Very Good
- 800-850: Exceptional

**What Affects Your Score:**
- Payment history (35%): Always pay on time
- Credit utilization (30%): Keep balances low
- Length of credit history (15%): Start early
- Credit mix (10%): Different types of accounts
- New credit (10%): Don't open too many accounts quickly

## First Steps for Students

**Secured Credit Card:**
- Easiest approval for students with no credit
- Requires security deposit
- Use for small purchases, pay in full monthly
- Discover it Secured and Capital One Secured are popular

**Student Credit Cards:**
- Designed for students with limited credit
- Often have rewards and no annual fees
- Discover it Student Cash Back is highly rated

**Authorized User:**
- Ask a trusted friend/family member to add you
- Their good credit history helps build yours
- Ensure they have excellent payment history

## Credit Building Strategy

1. Start with one card, use it responsibly
2. Keep utilization under 30% (under 10% is ideal)
3. Pay statement balance in full each month
4. Never miss payment deadlines
5. Check your credit report regularly (free at annualcreditreport.com)
          `,
          quiz: [
            {
              question: "What's the most important factor affecting your credit score?",
              options: [
                "Credit utilization ratio",
                "Payment history",
                "Length of credit history",
                "Types of credit accounts"
              ],
              correct: 1,
              explanation: "Payment history accounts for 35% of your credit score - always paying on time is the most critical factor."
            }
          ]
        }
      },
      {
        id: 2,
        title: "Balancing Credit Building and Investing",
        type: "lesson",
        content: {
          text: `
# Balancing Credit Building and Investing

## Monthly Budget Allocation

**Sample $1,000 Monthly Budget:**
- Essential expenses: $600 (rent, food, utilities)
- Credit card spending: $100 (pay in full monthly)
- Emergency fund: $150 (until you have $1,000 saved)
- Investments: $150 (once emergency fund is complete)

## Credit Card Strategies

**Use Credit Cards for:**
- Recurring bills (Netflix, Spotify, phone)
- Groceries and gas (categories with rewards)
- Online purchases (better fraud protection)

**Never Use Credit Cards for:**
- Cash advances (high fees and interest)
- Purchases you can't afford to pay off
- Investment funding (high interest rates)

## Building Both Simultaneously

**Month 1-3: Foundation**
- Open secured credit card
- Set up automatic bill payments
- Start building emergency fund

**Month 4-6: Growth**
- Apply for student credit card
- Begin small investment contributions ($25-50/month)
- Monitor credit score monthly

**Month 7+: Optimization**
- Increase investment contributions
- Consider rewards credit cards
- Look into investment-backed credit products

## Common Mistakes to Avoid

- Using credit cards to fund investments
- Missing credit card payments to invest more
- Opening too many accounts too quickly
- Carrying balances to "build credit" (this actually hurts your score)
          `
        }
      }
    ],
    completed: false
  },
  {
    id: 4,
    title: "Student-Friendly Investment Apps",
    emoji: <Smartphone className="w-6 h-6" />,
    description: "Master the best investment platforms and apps designed for students and beginners.",
    duration: "35 min",
    level: "beginner",
    unlocked: true,
    rating: 4.6,
    students: 2834,
    modules: [
      {
        id: 1,
        title: "Choosing the Right Platform",
        type: "lesson",
        content: {
          text: `
# Choosing the Right Platform

## Top Platforms for Students

**Fidelity:**
- No account minimums or fees
- Excellent fractional shares
- Strong research tools and education
- 24/7 customer support

**Charles Schwab:**
- Great for international students
- No foreign transaction fees
- Comprehensive educational resources
- Global ATM fee reimbursement

**E*TRADE:**
- User-friendly mobile app
- No minimums for brokerage accounts
- Good selection of commission-free ETFs
- Educational webinars and tools

**Robinhood:**
- Simple, intuitive interface
- Commission-free trades
- Fractional shares available
- Good for beginners but limited research tools

## Key Features to Consider

**Account Minimums:** Choose platforms with $0 minimums
**Fractional Shares:** Invest in expensive stocks with small amounts
**Educational Resources:** Learning materials and research tools
**Mobile App:** Easy-to-use interface for managing investments
**Customer Support:** Available when you need help

## Red Flags to Avoid

- High account fees or maintenance charges
- Limited investment options
- Poor customer reviews
- Platforms that encourage frequent trading
- Complex fee structures

## Getting Started Checklist

1. Research platform options
2. Gather required documents (passport, I-20, SSN)
3. Open account online
4. Fund account via bank transfer
5. Start with broad market ETFs
6. Set up automatic investing if available
          `
        }
      }
    ],
    completed: false
  },
  {
    id: 5,
    title: "Post-Graduation Investment Planning",
    emoji: <GraduationCap className="w-6 h-6" />,
    description: "Navigate investment decisions when transitioning from student to professional status.",
    duration: "50 min",
    level: "intermediate",
    unlocked: true,
    rating: 4.8,
    students: 1654,
    modules: [
      {
        id: 1,
        title: "OPT and H-1B Considerations",
        type: "lesson",
        content: {
          text: `
# OPT and H-1B Considerations

## Investment Changes During OPT

**What Changes:**
- You can now earn active income from employment
- Eligible for employer 401(k) plans
- May qualify for Roth IRA contributions
- Still subject to non-resident tax rules initially

**Investment Opportunities:**
- Maximize employer 401(k) match (free money!)
- Increase investment contributions with higher income
- Consider more aggressive growth strategies
- Start planning for potential H-1B transition

## H-1B Investment Advantages

**New Opportunities:**
- Higher income allows larger investments
- Employer-sponsored retirement plans
- Potential for company stock options
- More stability for long-term planning

**Tax Considerations:**
- May become tax resident after 5 years total in U.S.
- Different capital gains treatment
- Access to tax-advantaged retirement accounts
- Estate planning becomes important

## Career Transition Strategies

**6 Months Before Graduation:**
- Research visa options and requirements
- Optimize current investment portfolio
- Plan for potential income changes
- Consider job location impact on taxes

**During Job Search:**
- Keep essential expenses low
- Maintain investment contributions if possible
- Research employer benefits packages
- Plan for potential relocation costs

**After Starting Work:**
- Immediately enroll in employer 401(k)
- Increase investment rate with higher income
- Reassess risk tolerance and time horizon
- Consider professional financial advice

## Long-term Planning Scenarios

**Staying in U.S. (Green Card Path):**
- Maximize retirement account contributions
- Consider real estate investment
- Build substantial emergency fund
- Plan for eventual tax resident status

**Returning Home Eventually:**
- Focus on portable investments
- Understand tax implications of moving assets
- Consider international investment accounts
- Plan withdrawal strategies to minimize taxes
          `
        }
      }
    ],
    completed: false
  },
  {
    id: 6,
    title: "International Diversification",
    emoji: <Globe className="w-6 h-6" />,
    description: "Build a globally diversified portfolio that makes sense for your international background.",
    duration: "45 min",
    level: "intermediate",
    unlocked: false,
    rating: 4.7,
    students: 1123,
    modules: [
      {
        id: 1,
        title: "Global Portfolio Construction",
        type: "lesson",
        content: {
          text: `
# Global Portfolio Construction

## Why International Diversification Matters

**Benefits for International Students:**
- Exposure to your home country's growth
- Currency diversification
- Access to different economic cycles
- Reduced dependence on U.S. market performance

**Geographic Allocation Guidelines:**
- 60-70% U.S. stocks (where you're living/working)
- 20-30% International developed markets
- 5-10% Emerging markets (including home country)
- 10-20% Bonds (U.S. and international)

## ETF Options for Global Exposure

**U.S. Market:**
- VTI (Total Stock Market)
- VOO (S&P 500)
- QQQ (NASDAQ 100)

**International Developed:**
- VTIAX (Total International)
- EFA (MSCI EAFE)
- VEA (Developed Markets)

**Emerging Markets:**
- VWO (Emerging Markets)
- IEMG (Core MSCI Emerging)
- EEM (MSCI Emerging Markets)

**Home Country Specific (Examples):**
- INDA (India)
- FXI (China)
- EWJ (Japan)
- EWZ (Brazil)

## Currency Considerations

**Currency Risk Management:**
- Most international ETFs are currency-hedged or unhedged
- Hedged ETFs reduce currency volatility
- Unhedged ETFs provide natural currency diversification
- Consider your future plans when choosing

**Sample International Student Portfolio:**
- 50% U.S. Total Market (VTI)
- 20% International Developed (VTIAX)
- 10% Emerging Markets (VWO)
- 10% Home Country ETF
- 10% U.S. Bonds (BND)
          `
        }
      }
    ],
    completed: false
  },
  {
    id: 7,
    title: "Emergency Fund Strategies",
    emoji: <Shield className="w-6 h-6" />,
    description: "Build and maintain emergency funds while maximizing investment growth as a student.",
    duration: "30 min",
    level: "beginner",
    unlocked: false,
    rating: 4.9,
    students: 2456,
    modules: [],
    completed: false
  },
  {
    id: 8,
    title: "Banking for International Students",
    emoji: <Building className="w-6 h-6" />,
    description: "Navigate U.S. banking system, optimize accounts, and integrate with investment strategy.",
    duration: "40 min",
    level: "beginner",
    unlocked: false,
    rating: 4.5,
    students: 1789,
    modules: [],
    completed: false
  }
]

export default EducationHub