import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, Clock, Trophy, ChevronRight, Check, X } from 'lucide-react'
import { LESSONS } from '../utils/mockData'
import Navigation from '../components/Navigation'

interface Quiz {
  question: string
  options: string[]
  correct: number
  explanation: string
}

const SAMPLE_QUIZ: Quiz[] = [
  {
    question: "What is diversification in investing? 🤔",
    options: [
      "Putting all money in one stock",
      "Spreading investments across different assets",
      "Only buying expensive stocks",
      "Trading every day"
    ],
    correct: 1,
    explanation: "Diversification means spreading your investments across different assets to reduce risk. It's like not putting all your eggs in one basket! 🧺"
  },
  {
    question: "What does ETF stand for? 📊",
    options: [
      "Extra Trading Fee",
      "Electronic Trading Fund",
      "Exchange Traded Fund",
      "Expensive Trading Formula"
    ],
    correct: 2,
    explanation: "ETF stands for Exchange Traded Fund. It's like a basket of stocks that you can buy and sell like a single stock! 🛒"
  },
  {
    question: "What's the best approach for student investors? 🎓",
    options: [
      "Day trading for quick profits",
      "Long-term investing with regular contributions",
      "Only investing in crypto",
      "Waiting until you have $10,000"
    ],
    correct: 1,
    explanation: "Long-term investing with regular contributions (dollar-cost averaging) is perfect for students. Start small, stay consistent! 💪"
  }
]

const EducationHub = () => {
  const [selectedLesson, setSelectedLesson] = useState<number | null>(null)
  const [currentQuiz, setCurrentQuiz] = useState<number>(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [score, setScore] = useState(0)
  const [completedLessons, setCompletedLessons] = useState<number[]>([])

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex)
    setShowExplanation(true)
    
    if (answerIndex === SAMPLE_QUIZ[currentQuiz].correct) {
      setScore(score + 1)
    }
  }

  const nextQuestion = () => {
    if (currentQuiz < SAMPLE_QUIZ.length - 1) {
      setCurrentQuiz(currentQuiz + 1)
      setSelectedAnswer(null)
      setShowExplanation(false)
    } else {
      // Quiz completed
      if (selectedLesson && !completedLessons.includes(selectedLesson)) {
        setCompletedLessons([...completedLessons, selectedLesson])
      }
      setSelectedLesson(null)
      setCurrentQuiz(0)
      setSelectedAnswer(null)
      setShowExplanation(false)
      setScore(0)
    }
  }

  const startLesson = (lessonId: number) => {
    setSelectedLesson(lessonId)
    setCurrentQuiz(0)
    setScore(0)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">Learn Investing 🎓</h1>
          <p className="text-gray-600">Master the basics with fun, interactive lessons</p>
        </motion.div>

        {/* Progress Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold mb-2">Your Progress</h2>
              <p className="text-gray-600">
                {completedLessons.length} of {LESSONS.length} lessons completed
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="w-6 h-6 text-accent-500" />
              <span className="text-2xl font-bold text-accent-500">
                {completedLessons.length * 100}
              </span>
              <span className="text-gray-500">XP</span>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-3">
              <motion.div 
                className="bg-primary-600 h-3 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(completedLessons.length / LESSONS.length) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {selectedLesson === null ? (
            /* Lessons Grid */
            <motion.div
              key="lessons"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid md:grid-cols-2 gap-6"
            >
              {LESSONS.map((lesson, index) => {
                const isCompleted = completedLessons.includes(lesson.id)
                const isLocked = !lesson.unlocked && !isCompleted
                
                return (
                  <motion.div
                    key={lesson.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`card cursor-pointer transition-all duration-200 ${
                      isLocked 
                        ? 'opacity-50 cursor-not-allowed' 
                        : 'hover:shadow-lg hover:scale-105'
                    }`}
                    onClick={() => !isLocked && startLesson(lesson.id)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                          isCompleted 
                            ? 'bg-green-100' 
                            : isLocked 
                            ? 'bg-gray-100' 
                            : 'bg-primary-100'
                        }`}>
                          {isCompleted ? '✅' : lesson.emoji}
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{lesson.title}</h3>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Clock className="w-4 h-4" />
                            <span>{lesson.duration}</span>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              lesson.level === 'beginner' ? 'bg-green-100 text-green-700' :
                              lesson.level === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {lesson.level}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {!isLocked && (
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                    
                    <p className="text-gray-600 mb-4">{lesson.description}</p>
                    
                    {isCompleted && (
                      <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                        <Check className="w-4 h-4" />
                        Completed
                      </div>
                    )}
                    
                    {isLocked && (
                      <div className="text-gray-500 text-sm">
                        🔒 Complete previous lessons to unlock
                      </div>
                    )}
                  </motion.div>
                )
              })}
            </motion.div>
          ) : (
            /* Quiz Interface */
            <motion.div
              key="quiz"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="max-w-2xl mx-auto"
            >
              <div className="card">
                {/* Quiz Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold">
                      {LESSONS.find(l => l.id === selectedLesson)?.title} Quiz
                    </h2>
                    <p className="text-gray-600">
                      Question {currentQuiz + 1} of {SAMPLE_QUIZ.length}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedLesson(null)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
                  <motion.div 
                    className="bg-primary-600 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentQuiz + 1) / SAMPLE_QUIZ.length) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>

                {/* Question */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-6">
                    {SAMPLE_QUIZ[currentQuiz].question}
                  </h3>
                  
                  <div className="space-y-3">
                    {SAMPLE_QUIZ[currentQuiz].options.map((option, index) => (
                      <motion.button
                        key={index}
                        onClick={() => !showExplanation && handleAnswerSelect(index)}
                        disabled={showExplanation}
                        className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 ${
                          showExplanation
                            ? index === SAMPLE_QUIZ[currentQuiz].correct
                              ? 'border-green-500 bg-green-50 text-green-800'
                              : selectedAnswer === index
                              ? 'border-red-500 bg-red-50 text-red-800'
                              : 'border-gray-200 bg-gray-50'
                            : selectedAnswer === index
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                        whileHover={!showExplanation ? { scale: 1.02 } : {}}
                        whileTap={!showExplanation ? { scale: 0.98 } : {}}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            showExplanation && index === SAMPLE_QUIZ[currentQuiz].correct
                              ? 'border-green-500 bg-green-500'
                              : showExplanation && selectedAnswer === index && index !== SAMPLE_QUIZ[currentQuiz].correct
                              ? 'border-red-500 bg-red-500'
                              : 'border-gray-300'
                          }`}>
                            {showExplanation && index === SAMPLE_QUIZ[currentQuiz].correct && (
                              <Check className="w-4 h-4 text-white" />
                            )}
                            {showExplanation && selectedAnswer === index && index !== SAMPLE_QUIZ[currentQuiz].correct && (
                              <X className="w-4 h-4 text-white" />
                            )}
                          </div>
                          <span>{option}</span>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Explanation */}
                {showExplanation && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-200"
                  >
                    <h4 className="font-semibold text-blue-800 mb-2">Explanation:</h4>
                    <p className="text-blue-700">{SAMPLE_QUIZ[currentQuiz].explanation}</p>
                  </motion.div>
                )}

                {/* Next Button */}
                {showExplanation && (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={nextQuestion}
                    className="w-full btn-primary"
                  >
                    {currentQuiz < SAMPLE_QUIZ.length - 1 ? 'Next Question' : 'Complete Lesson'} 
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default EducationHub