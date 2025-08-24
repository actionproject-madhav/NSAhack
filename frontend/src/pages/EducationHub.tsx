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
<<<<<<< Updated upstream
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
=======
        title: "What's the Difference Between Saving and Investing?",
        type: "lesson",
        content: {
          text: `
What's the difference between saving and investing?

Saving is putting money aside for future use. It's important to save so you can cover fixed expenses, such as mortgage or rent payments, and to make sure you're prepared for emergencies. Generally, people put their savings in bank accounts, where up to $250,000 is insured by the Federal Deposit Insurance Corporation (FDIC). Charles Schwab & Co., Inc. is not an FDIC-insured bank and deposit insurance covers the failure of an insured bank.

Investing is when you put your money "to work for you," another way to think of investing is when you put your money "at risk." You buy an investment like a stock or bond with the hope that its value will increase over time. Although investing comes with the risk of losing money, should a stock or bond decrease in value, it also has the potential for greater returns than you'd receive by putting your money in a bank account.

The goal of investing is to grow your money over time.

In this example from 2004 to 2023, Diego put $3,000 each year in a bank account to fund his short-term spending needs. The interest he received on his money averaged 1% over 20 years, which was relatively low. But the trade-off was that it was safe and accessible. Diego had $68,909 after 20 years.

Over that same period, Alexis was planning for her retirement, so she invested $3,000 each year in a moderate portfolio, which returned an average of above 6% over 20 years. Alexis had $128,644 after 20 years.

This opportunity to earn more money comes with additional risks—including the loss of some or all your investment. Non-deposit products are not insured by the FDIC; they are not deposits and may lose value. Different types of investments have different levels of risk, so it's important to understand your risk tolerance—or your appetite for risk. If working toward a long-term goal, people often consider investing as opposed to saving. Recently, savings rates haven't kept up with the rate of inflation. This means that if you put all your cash in savings, the actual purchasing power of your money could shrink over time.

Inflation can severely erode your purchasing power over time. This chart shows the impact of inflation on the purchasing power of a fixed, annual $50,000 pension. It's important to understand the effects of inflation because it decreases the amount of goods or services you can buy (purchasing power), all else being equal. Here we see that with a hypothetical 3% inflation rate, the fixed, annual $50,000 pension can purchase only $37,200 worth of goods or services at the end of 10 years (a 26% loss of purchasing power) and only $27,684 worth of goods or services at the end of 20 years (a 45% loss of purchasing power).

Why should I invest?

Investing can help investors pursue financial goals, such as buying a home or funding retirement. By investing, you're putting your money to work, and at risk, to pursue your goals. Let's see how it works.

The power of compounding: A little goes a long way. Alexis invests $3,000 a year for 40 years and receives an average annual return of 6%. At the end of 40 years, her portfolio is worth $492,143. This amount consists of $372,143 in total earnings plus her principal investment of $120,000. How did her portfolio grow so much? It's because every year Alexis's 6% return is on the new larger balance (made up of her initial investment, her subsequent yearly investments, and the money she's earned from dividends/interest and capital appreciation on the investment). That's the power of "compound returns." Of course, in real investing, a 6% average return in an investment portfolio commonly includes high return years, low return years, and even some negative return years.

When should I invest?

Many investment professionals say the sooner you invest, the better. Historically, the longer you invest, the less impact the market's short-term ups and downs have on your return.

Some investors may sit on the sidelines waiting for the "right" time to invest. Unfortunately, timing the market is virtually impossible. Instead, many investors consider just getting started and remember this old investing adage: Time in the market is more important than timing the market.

Early beats often. Let's look at an example. Say Alma invests $10,000 when she's 31 and lets the money grow for 20 years. Another investor, Dave, invests $2,000 a year on the same day each year, starting at age 41, for only 10 years. By the time they both reach age 50, Alma has nearly 15% more than Dave even though she invested half as much. Alma has an ending balance of $32,071 compared to Dave's balance of $27,943.

How much should I invest?

It depends on how much you have as well as your goals and timeline (also called your time horizon). But investors commonly choose to invest the maximum they can comfortably afford after setting aside an emergency fund, paying off high-cost debt, funding daily living expenses, and saving for any short-term goals. Compared to waiting to make a lump-sum investment, by investing on a regular basis, investors may potentially experience greater returns over time through compounding.

Is investing risky?

Investing has risks. The goal is to manage them. Many investors choose to do this by having a plan, which should include a deadline for when the money is needed, and diversifying their portfolio.

Diversification spreads assets across different types of investments, so you're not putting all your eggs in one basket. Investors tend to divide funds among stocks, bonds, and cash equivalent investments based on risk tolerance and timeline. Dividing further, investors often diversify their stock portion into different types, such as large cap, small cap, and international. And then within those divisions, investors can also break it even further down by adding stocks that represent different sectors like technology and health care. The ultimate goal is to own investments that don't historically move in tandem.

Because investment types—like stocks, bonds, or cash equivalent investments—tend to perform differently over time, it's important to diversify your portfolio. For example, looking at this chart, see how the performance of stocks, bonds, and cash equivalent investments in a moderate risk portfolio varied over a 20-year time horizon.

What are some common types of investments?

Stocks (equities) represent ownership in a company. As a shareholder, investors can achieve returns in two main ways: 1) The price of the stock may increase, allowing an investor to sell at a profit. 2) The company may distribute some of its earnings to stockholders in the form of dividends. Stocks are considered relatively risky because the stock price may also decrease and there is no guarantee you'll be paid dividends.

How do I choose a stock? There are many ways to pick stocks. Longer-term investors may use fundamental analysis to research stocks. Shorter-term traders may rely on technical analysis, which examines price charts for insights into future market activity. Schwab provides clients with stock screening tools, research, and ratings.

How do I buy a stock? If you know which stock you want to buy, look up its ticker symbol. Then log in to your brokerage account and place a trade order. You can do this with a: Market order if you want your order to fill almost immediately during market hours. Limit order if you have a maximum dollar amount you want to spend and no more. Stop order if you want to buy or sell once the stock moves through a certain price. The stock will show up in your account once the order executes.

Bonds represent a loan you make to the government, municipality, or corporation (issuer). In return, that issuer promises to pay you a specified rate of interest and to repay the face value after a certain period of time, barring default. Bonds can provide a predictable income stream because they generally pay bondholders interest twice a year. They're also useful for preserving capital because they promise to repay the original loan amount upon maturity. As with any investment, bonds have risks, such as default risk and reinvestment risk. Bonds tend to be less volatile than stocks, but an issuer potentially could default on its loan or (in the case of a callable bond) call the loan (this is when an issuer returns the principle and stops interest payments before the bond matures).

How do I choose a bond? The bond market is much bigger and more complex than the stock market. Individual investors and investors just starting out may consider bond funds because they offer diversification and professional management. If you prefer individual bonds, you can start by looking at the issuer's credit quality. Higher-quality bonds tend to offer lower yields with less risk. Lower-quality bonds are riskier—including the risk of default—but can offer higher yields. You also want to consider the maturity date, when your original investment will be repaid, and the coupon, the annual interest rate paid on the bond.

How do I buy a bond? You can buy bonds or bond funds through a broker dealer.

Exchange-traded funds (ETFs) are investment funds that generally hold a portfolio of one specific asset class like stocks, bonds, or commodities. Unlike mutual funds, ETFs are bought and sold and quoted like stocks, and some investors find that aspect convenient compared to mutual funds. Most ETFs are considered passive investments because they are based on an index. Index-based ETFs are similar to those mutual funds known as "index funds," meaning they track market indexes to replicate the performance of a certain part of the market. For example, an ETF that tracks the S&P 500 index (SPX) is trying to mirror the performance of companies in the S&P 500. ETFs trade like stocks on an exchange, and their price changes throughout the day as shares are bought and sold.

How do I choose an ETF? Look for ETFs that represent the part of the market you're looking to invest in. Then look at the costs. There are three different types to consider: the operating expense, bid/ask spread, and trading commissions.

How do I buy an ETF? You can buy and sell ETFs through a brokerage account. Just enter the ticker symbol of the ETF you'd like to buy and place your trade.

Mutual funds pool money from many investors and then invest that pool in a broad range of investments, such as stocks, bonds, and other securities, to create a portfolio; however, like many ETFs, passively managed mutual funds—also known as index mutual funds—are portfolios that try to replicate a particular index. A mutual fund is often managed by a fund manager. When you buy a mutual fund, you buy a stake in everything the fund invests in and any income those investments generate. Mutual funds make it easy to build a diversified portfolio and get professional management, so you don't have to research, buy, and track every security in the fund on your own.

How do I choose a mutual fund? Some investors consider passively managed index funds. These funds simply aim to track their benchmark market index before fees and expenses. If you seek to outperform the market, consider actively managed funds. It's important to understand the fund's investment objective and strategy before investing because there are no guarantees the fund will actually outperform. It's also possible the fund will underperform its benchmark. Also keep in mind that actively managed funds tend to have higher expenses.

How do I buy a mutual fund? You can buy these funds either directly from the fund company or through a broker-dealer. Just look up the ticker symbol of the fund you'd like to buy and place an order. Note: Mutual fund trades are executed once a day after market close.

How can I invest without paying a lot of fees?

Every dollar you pay in fees is one that can't generate compounding returns. That said, investing generally costs money. So, what can you do? Look for brokers that charge low trading commissions. Consider funds with low operating expenses.
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
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
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
=======
Types of Investments 🎯

Stocks (Equities)
Buying shares means owning a piece of a company. When the company does well, your investment typically grows.

Example: If you buy Apple stock, you own a tiny piece of Apple!

Bonds
Lending money to companies or governments in exchange for regular interest payments.

Think of it as: Being the bank - you lend money and get paid interest.

Real Estate
Investing in property, either directly or through REITs (Real Estate Investment Trusts).

ETFs & Mutual Funds
Baskets of investments managed professionally. Perfect for diversification!

ETF Example: SPDR S&P 500 (SPY) contains 500 of the largest US companies in one fund.

Commodities
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
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
# Tax Status and Classifications
=======
Reading Stock Charts 📊
>>>>>>> Stashed changes

## Resident vs Non-Resident for Tax Purposes

<<<<<<< Updated upstream
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
=======
Basic Chart Types:

Line Charts: Simple price movement over time
Candlestick Charts: Show open, high, low, close prices
Volume Charts: How many shares were traded

Key Indicators:

Support & Resistance: Price levels where stock tends to bounce
Moving Averages: Smooth out price action to show trends
RSI: Measures if stock is overbought or oversold

Reading the Story:
- Upward trend = Bullish (optimistic)
- Downward trend = Bearish (pessimistic)
- Sideways = Consolidation (uncertainty)
>>>>>>> Stashed changes

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
<<<<<<< Updated upstream
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
=======
ETF Basics 🛒

What are ETFs?
Exchange Traded Funds are like buying a pre-made smoothie instead of individual fruits. You get a blend of many investments in one purchase!

Popular ETF Categories:

Broad Market ETFs:
- SPY (S&P 500) - Top 500 US companies
- VTI (Total Stock Market) - Entire US market
- QQQ (NASDAQ 100) - Tech-heavy index

International ETFs:
- VXUS (International stocks excluding US)
- EEM (Emerging markets)

Sector ETFs:
- XLK (Technology)
- XLF (Financial)
- XLE (Energy)

Benefits:
-  Instant diversification
-  Low fees (expense ratios)
-  Professional management
-  Trade like stocks

Student-Friendly ETFs:
Start with broad market ETFs like VTI or VOO for maximum diversification! 🎯
>>>>>>> Stashed changes
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
  },
  {
    id: 6,
    title: "International Student Education Hub",
    emoji: "🌍",
    description: "Essential investing knowledge for international students and immigrants in the US.",
    duration: "45 min",
    level: "beginner",
    unlocked: true,
    rating: 4.9,
    students: 2156,
    modules: [
      {
        id: 1,
        title: "Trading 101 for International Students",
        type: "lesson",
        content: {
          text: `
Trading 101 for International Students 🎓

Welcome to US Investing! 🇺🇸

As an international student, you have unique opportunities and challenges when investing in the US market. Let's make it simple and safe!

Why Invest in the US?
- World's Largest Market: Access to companies like Apple, Google, Tesla
- Strong Regulations: Better investor protection than many countries
- Dollar Stability: USD is the world's reserve currency
- Tax Benefits: Many countries have tax treaties with the US

Basic Terms You Need to Know:
- Stock: A piece of a company you can buy
- ETF: A basket of many stocks (easier than picking individual stocks)
- Portfolio: Your collection of investments
- Diversification: Spreading money across different investments (safety!)

Your First Steps:
1. Start Small: Begin with $100-500 to learn
2. Use ETFs: Buy VTI (total US market) instead of individual stocks
3. Think Long-term: Don't try to get rich quick
4. Learn Before You Earn: Education first, profits second!

Remember: You're Not Alone! 🤝
Thousands of international students successfully invest in the US every year. Take it step by step!
          `
        }
      },
      {
        id: 2,
        title: "What Your Visa Allows",
        type: "lesson",
        content: {
          text: `
What Your Visa Allows 📋

F-1 Student Visa 🎓
What You CAN Do:
- Invest in stocks, ETFs, and mutual funds
- Use a US brokerage account
- Trade during market hours (9:30 AM - 4:00 PM ET)
- Hold investments long-term

What You SHOULD NOT Do:
- ❌ Day trading (buying/selling same day)
- ❌ Frequent trading (more than 3-4 times per week)
- ❌ Trading as a business
- ❌ Earning income from trading

Why These Rules Matter:
- F-1 visas are for education, not business
- Frequent trading can be seen as unauthorized employment
- Violations can affect your visa status

J-1 Exchange Visitor 🔬
Similar to F-1 but with additional restrictions:
- Must maintain "exchange visitor" status
- Trading should be minimal and educational
- Focus on long-term investments

H-1B Work Visa 💼
More Freedom:
- Can trade more actively
- Still avoid day trading as primary income
- Consider tax implications carefully

Green Card Holders 🇺🇸
Full Rights:
- Trade like US citizens
- No visa restrictions
- Full tax obligations

Safe Investment Strategy for All Visas:
- Buy and Hold: Purchase quality ETFs and hold for years
- Dollar-Cost Averaging: Invest small amounts regularly
- Focus on Education: Use investing as a learning experience
          `
        }
      },
      {
        id: 3,
        title: "Tax Filing Made Simple",
        type: "lesson",
        content: {
          text: `
# Tax Filing Made Simple 📊

## Do International Students Pay US Taxes? 🤔

**Short Answer**: It depends on your income and how long you've been in the US!

## Tax Residency Rules:
- **Non-Resident**: In US < 183 days (most F-1 students)
- **Resident**: In US > 183 days (some long-term students)

## What You Need to File:

### Form 1040-NR (Non-Resident)
**When to Use:**
- F-1 students in first 5 years
- J-1 exchange visitors
- Anyone with US income

**What to Report:**
- Interest from US bank accounts
- Dividends from US stocks
- Capital gains from selling investments
- Any US employment income

### Form 1040 (Resident)
**When to Use:**
- F-1 students after 5 years
- H-1B workers
- Green card holders

## Tax Treaty Benefits by Country:

### India 🇮🇳
- **Capital Gains**: 15% rate (vs 30% without treaty)
- **Dividends**: 15% rate
- **Interest**: 10% rate

### China 🇨🇳
- **Capital Gains**: 10% rate
- **Dividends**: 10% rate

### Nepal 🇳🇵
- **Capital Gains**: 30% rate (no treaty)
- **Dividends**: 30% rate

### Canada 🇨🇦
- **Capital Gains**: 0% rate (excellent treaty!)
- **Dividends**: 15% rate

## Step-by-Step Tax Filing:

### Step 1: Gather Documents 📋
- W-2 forms (if you worked)
- 1099 forms (investment income)
- 1098-T (tuition statement)
- Foreign bank account statements

### Step 2: Choose Filing Method 💻
- **Free Options**: IRS Free File, TurboTax Free
- **Paid Software**: TurboTax, H&R Block
- **Professional Help**: CPA specializing in international taxes

### Step 3: File on Time ⏰
- **Deadline**: April 15th (or October 15th with extension)
- **Extension Form**: 4868 (automatic 6-month extension)

## Pro Tips 💡
- Keep all investment records for at least 3 years
- Use tax software that handles international situations
- Consider getting help from your university's international office
- File even if you don't owe taxes (maintains good standing)

## Need Help? 🆘
- University international student office
- IRS international taxpayer assistance
- Tax professionals specializing in international students
          `
        }
      },
      {
        id: 4,
        title: "Building a Safe International Portfolio",
        type: "interactive",
        content: {
          text: `
# Building a Safe International Portfolio 🛡️

## The International Student Portfolio Strategy

As an international student, you need a portfolio that's:
- **Safe**: Won't jeopardize your visa status
- **Simple**: Easy to manage while studying
- **Smart**: Takes advantage of US market opportunities
- **Compliant**: Follows all visa and tax rules

## Recommended Portfolio Allocation:

### 70% - US Market ETFs (Core)
- **VTI (Vanguard Total Stock Market)**: 40%
- **VOO (Vanguard S&P 500)**: 30%

**Why This Works:**
- Instant diversification across 500+ companies
- Low fees (0.03% expense ratio)
- Historically stable long-term growth
- Perfect for buy-and-hold strategy

### 20% - International ETFs
- **VXUS (Vanguard Total International)**: 20%

**Why International:**
- Reduces risk through geographic diversification
- Many countries have strong growth potential
- Protects against US market downturns

### 10% - Bond ETFs (Safety)
- **BND (Vanguard Total Bond Market)**: 10%

**Why Bonds:**
- Provides stability during market volatility
- Regular income through interest payments
- Reduces overall portfolio risk

## Sample $1,000 Portfolio for International Students:

**$400 - VTI (Vanguard Total Stock Market)**
- Covers entire US market
- 3,000+ companies in one fund
- Perfect for beginners

**$300 - VOO (Vanguard S&P 500)**
- Top 500 US companies
- Industry standard benchmark
- Very low fees

**$200 - VXUS (Vanguard Total International)**
- 7,000+ international companies
- Developed and emerging markets
- Currency diversification

**$100 - BND (Vanguard Total Bond Market)**
- Government and corporate bonds
- Monthly interest payments
- Portfolio stability

## Investment Schedule for Students:

### Monthly Investment Plan:
- **Week 1**: Buy VTI ($100)
- **Week 2**: Buy VOO ($75)
- **Week 3**: Buy VXUS ($50)
- **Week 4**: Buy BND ($25)

**Total Monthly Investment: $250**

## Safety Rules for International Students:

### ✅ DO:
- Invest small amounts regularly
- Hold investments for at least 1 year
- Use automatic investing features
- Focus on ETFs over individual stocks
- Keep detailed records for taxes

### ❌ DON'T:
- Day trade or frequent trading
- Invest money you need for tuition
- Try to time the market
- Invest without understanding
- Ignore tax obligations

## When to Rebalance:
- **Monthly**: Add new money according to allocation
- **Quarterly**: Check if allocation is still balanced
- **Annually**: Major rebalancing if needed

## Emergency Fund First! 🚨
Before investing, save 3-6 months of expenses in a US bank account. This protects you from having to sell investments during emergencies.

## Success Story Example:
**Priya, F-1 Student from India:**
- Started with $500 in VTI
- Added $100 monthly during 2-year master's program
- Total invested: $2,900
- Portfolio value after 2 years: $3,400
- Tax filing: Simple with 15% treaty rate
- Visa status: Maintained without issues

## Remember: Slow and Steady Wins the Race! 🐢
Your goal is to learn and build wealth safely, not to get rich quick. Focus on your studies first, investing second!
          `,
          interactive: true
        }
      },
      {
        id: 5,
        title: "Common Mistakes to Avoid",
        type: "lesson",
        content: {
          text: `
# Common Mistakes to Avoid ⚠️

## Visa-Related Mistakes:

### 1. Trading Too Frequently 🚫
**What Happens:**
- IRS may classify you as a "trader"
- Could violate F-1 visa terms
- Risk of visa revocation

**How to Avoid:**
- Limit trades to 2-3 per month
- Focus on long-term investments
- Use automatic investing instead of manual trading

### 2. Ignoring Tax Obligations 📋
**What Happens:**
- Late filing penalties
- Interest on unpaid taxes
- Potential legal issues
- Difficulty getting future visas

**How to Avoid:**
- File taxes every year, even if no income
- Keep all investment records
- Use tax software or professional help
- Meet April 15th deadline

### 3. Investing Without Understanding 💸
**What Happens:**
- Loss of money
- Stress and anxiety
- Poor investment decisions
- Potential visa problems from financial stress

**How to Avoid:**
- Start with ETFs, not individual stocks
- Read and understand before investing
- Start with small amounts
- Use educational resources

## Investment Mistakes:

### 4. Trying to Time the Market ⏰
**What Happens:**
- Usually results in buying high, selling low
- Misses out on long-term growth
- Increases stress and anxiety
- More frequent trading (visa risk)

**How to Avoid:**
- Use dollar-cost averaging
- Invest regularly regardless of market conditions
- Focus on long-term goals (5+ years)
- Ignore daily market noise

### 5. Not Diversifying 🌈
**What Happens:**
- All eggs in one basket
- Higher risk of significant losses
- More volatile portfolio
- Potential visa issues from financial stress

**How to Avoid:**
- Use broad market ETFs (VTI, VOO)
- Include international exposure (VXUS)
- Add bonds for stability (BND)
- Don't put more than 10% in any single investment

### 6. Investing Money You Need Soon 💰
**What Happens:**
- Forced to sell at bad times
- Potential losses
- Stress about meeting financial obligations
- Could affect visa status if you can't pay tuition

**How to Avoid:**
- Keep 3-6 months of expenses in cash
- Don't invest tuition money
- Plan your investment timeline
- Have emergency fund before investing

## Tax Mistakes:

### 7. Not Understanding Tax Treaties 🌍
**What Happens:**
- Paying higher taxes than necessary
- Missing out on treaty benefits
- Potential double taxation
- More complex tax filing

**How to Avoid:**
- Research your country's treaty with US
- Understand your tax residency status
- Use appropriate tax forms
- Consider professional tax help

### 8. Not Keeping Good Records 📁
**What Happens:**
- Difficult tax filing
- Potential audit issues
- Missing deductions or credits
- Stress during tax season

**How to Avoid:**
- Save all investment statements
- Keep track of purchase dates and prices
- Document all income sources
- Use digital tools to organize records

## Financial Planning Mistakes:

### 9. Not Having an Emergency Fund 🚨
**What Happens:**
- Forced to sell investments during emergencies
- Potential losses from selling at wrong time
- Stress about unexpected expenses
- Could affect visa status

**How to Avoid:**
- Save 3-6 months of expenses first
- Keep emergency fund in US bank account
- Don't invest emergency money
- Consider high-yield savings accounts

### 10. Ignoring Currency Risk 💱
**What Happens:**
- Exchange rate fluctuations affect returns
- Potential losses when converting back to home currency
- Unpredictable investment outcomes
- Difficulty planning for future expenses

**How to Avoid:**
- Understand that USD investments are in USD
- Plan for currency conversion costs
- Consider international ETFs for diversification
- Don't invest money you'll need in home currency soon

## How to Recover from Mistakes:

### If You Made a Visa Mistake:
1. **Stop the problematic activity immediately**
2. **Consult with international student office**
3. **Consider consulting an immigration lawyer**
4. **Document everything for future reference**

### If You Made an Investment Mistake:
1. **Don't panic - markets recover over time**
2. **Review what went wrong**
3. **Adjust your strategy**
4. **Learn from the experience**

### If You Made a Tax Mistake:
1. **File amended returns if necessary**
2. **Pay any owed taxes and penalties**
3. **Set up better record-keeping systems**
4. **Consider professional help for future years**

## Prevention is Better Than Cure! 🛡️
The best way to avoid mistakes is to:
- Educate yourself before investing
- Start small and learn gradually
- Follow visa and tax rules carefully
- Keep good records
- Ask for help when unsure

## Remember: Everyone Makes Mistakes! 💪
The important thing is to learn from them and not repeat them. Your goal is progress, not perfection!
          `
        }
      }
    ],
    completed: false
  }
]

export default EducationHub