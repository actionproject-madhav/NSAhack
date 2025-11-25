import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import Lottie from 'lottie-react'
import { Heart, X } from 'lucide-react'
import elephantAnimation from '../../assets/animations/elephant.json'
import useGameSound from '../../hooks/useGameSound'

// Duolingo Colors
const DUOLINGO_COLORS = {
  green: '#58CC02',
  darkGreen: '#58A700',
  lightGreen: '#89E219',
  gold: '#FFC800',
  blue: '#1CB0F6',
  purple: '#CE82FF',
  red: '#FF4B4B',
  orange: '#FF9600',
  background: '#F7F7F7',
  cardBg: '#FFFFFF',
  textPrimary: '#1F2937',
  textSecondary: '#6B7280'
}

interface Question {
  question: string
  options: string[]
  correctAnswer: number
  explanation?: string
}

interface PlayerStats {
  powerups?: {
    [key: string]: number | undefined
  }
}

interface QuizBattleProps {
  questions?: Question[]
  onComplete: (score: number) => void
  playerStats?: PlayerStats
  opponent?: string
  islandModel?: string
}

const QuizBattle = ({ questions = [], onComplete, playerStats = {}, opponent = 'AI' }: QuizBattleProps) => {
  const [currentQuestion, setCurrentQuestion] = useState<number>(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState<boolean>(false)
  const [heartsRemaining, setHeartsRemaining] = useState<number>(5)
  const [correctAnswers, setCorrectAnswers] = useState<number>(0)
  const [mascotMood, setMascotMood] = useState<'happy' | 'thinking' | 'proud' | 'encouraging'>('happy')
  
  const { playSound } = useGameSound()
  
  // Preload sounds on mount to ensure they're ready
  useEffect(() => {
    // Touch sounds to preload them (they're already preloaded in useGameSound, but this ensures they're ready)
    const preloadSounds = () => {
      try {
        // Sounds are already preloaded in useGameSound hook
      } catch (e) {
        // Ignore
      }
    }
    preloadSounds()
  }, [])
  
  const calculateScore = (includeCurrent: boolean = false) => {
    if (questions.length === 0) return 0
    const currentCorrect = includeCurrent && selectedAnswer !== null && selectedAnswer === questions[currentQuestion]?.correctAnswer ? 1 : 0
    const accuracy = ((correctAnswers + currentCorrect) / questions.length) * 100
    return Math.floor(accuracy)
  }

  const handleAnswer = (answerIndex: number) => {
    if (!questions || questions.length === 0 || !questions[currentQuestion]) {
      onComplete(0)
      return
    }
    
    const question = questions[currentQuestion]
    const isCorrect = answerIndex === question.correctAnswer
    
    // Immediately show result and play sound
    setSelectedAnswer(answerIndex)
    setShowResult(true)

    // Play sound immediately - ensure it plays
    if (isCorrect) {
      playSound('correct')
      setCorrectAnswers(prev => prev + 1)
      setMascotMood('proud')
    } else {
      playSound('incorrect')
      setHeartsRemaining(prev => prev - 1)
      setMascotMood('encouraging')
      
      if (heartsRemaining <= 1) {
        setTimeout(() => {
          onComplete(calculateScore(true))
        }, 2000)
        return
      }
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1)
        setSelectedAnswer(null)
        setShowResult(false)
        setMascotMood('thinking')
      } else {
        // Quiz complete
        const finalCorrect = correctAnswers + (isCorrect ? 1 : 0)
        if (finalCorrect === questions.length) {
          confetti({
            particleCount: 200,
            spread: 70,
            origin: { y: 0.6 }
          })
        }
        setTimeout(() => {
          onComplete(Math.floor((finalCorrect / questions.length) * 100))
        }, 2000)
      }
    }, 2000)
  }

  // Show error if no questions
  if (!questions || questions.length === 0) {
    return (
      <div className="h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 border-4 shadow-2xl text-center max-w-md" style={{ borderColor: DUOLINGO_COLORS.green }}>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">No Quiz Available</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">This lesson doesn't have quiz questions yet.</p>
          <button
            onClick={() => onComplete(0)}
            className="px-6 py-3 rounded-xl font-bold text-white"
            style={{ background: DUOLINGO_COLORS.green }}
          >
            Return to Map
          </button>
        </div>
      </div>
    )
  }

  // Safety check - ensure question exists
  if (!questions || questions.length === 0 || !questions[currentQuestion]) {
    return (
      <div className="h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 border-4 shadow-2xl text-center max-w-md" style={{ borderColor: DUOLINGO_COLORS.green }}>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">No Question Available</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">This question is not available.</p>
          <button
            onClick={() => onComplete(0)}
            className="px-6 py-3 rounded-xl font-bold text-white"
            style={{ background: DUOLINGO_COLORS.green }}
          >
            Return to Map
          </button>
        </div>
      </div>
    )
  }

  const question = questions[currentQuestion]
  const isLastQuestion = currentQuestion === questions.length - 1

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* Top Bar - Duolingo Style */}
      <div className="relative z-20 bg-white dark:bg-gray-800 shadow-md p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="text-sm font-semibold text-gray-600 dark:text-gray-400">
            Question {currentQuestion + 1} of {questions.length}
          </div>

          {/* Hearts */}
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ 
                  scale: i < heartsRemaining ? 1 : 0.5,
                  opacity: i < heartsRemaining ? 1 : 0.3
                }}
                className={`w-6 h-6 ${i < heartsRemaining ? 'text-red-500' : 'text-gray-300'}`}
              >
                <Heart className="w-full h-full fill-current" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area - Full Page */}
      <div className="relative z-10 h-full flex items-center justify-center p-6">
        <div className="w-full h-full max-w-6xl mx-auto flex gap-6 items-center">
          {/* Elephant Mascot */}
          <motion.div
            className="flex-shrink-0 hidden lg:block"
            animate={{ 
              y: [0, -10, 0],
              scale: showResult && selectedAnswer === question.correctAnswer ? [1, 1.2, 1] : 1
            }}
            transition={{ 
              y: { duration: 2, repeat: Infinity, ease: "easeInOut" },
              scale: { duration: 0.5 }
            }}
          >
            <div className="w-40 h-40">
              <Lottie 
                animationData={elephantAnimation}
                loop={true}
                className="w-full h-full"
              />
            </div>
          </motion.div>

          {/* Question Card - Full Page Coverage */}
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 h-full bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 border-4 flex flex-col"
            style={{ borderColor: DUOLINGO_COLORS.green }}
          >
            {/* Question */}
            <div className="flex-shrink-0 mb-6">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white leading-relaxed text-center">
                {question?.question || 'No question available'}
              </h2>
            </div>

            {/* Answer Options - Horizontal Layout */}
            <div className="flex-1 grid grid-cols-2 gap-4 mb-6 overflow-y-auto">
              {(question?.options || []).map((option: string, index: number) => {
                const isSelected = selectedAnswer === index
                const isCorrect = index === question?.correctAnswer
                const showCorrect = showResult && isCorrect
                const showIncorrect = showResult && isSelected && !isCorrect

                return (
                  <motion.button
                    key={index}
                    whileHover={!showResult ? { scale: 1.02 } : {}}
                    whileTap={!showResult ? { scale: 0.98 } : {}}
                    onClick={() => !showResult && handleAnswer(index)}
                    disabled={showResult}
                    className={`p-5 rounded-xl text-center font-semibold text-lg transition-all border-4 flex flex-col items-center justify-center gap-2 min-h-[120px] relative ${
                      showCorrect
                        ? 'bg-green-100 dark:bg-green-900 border-green-500 text-green-900 dark:text-green-100'
                        : showIncorrect
                        ? 'bg-red-100 dark:bg-red-900 border-red-500 text-red-900 dark:text-red-100'
                        : showResult
                        ? 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400'
                        : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-gray-600'
                    }`}
                    style={!showResult && !showCorrect && !showIncorrect ? {
                      borderColor: '#E5E5E5'
                    } : {}}
                  >
                    {/* Correct/Wrong Indicator - Large and Prominent */}
                    {showResult && (showCorrect || showIncorrect) && (
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1.2, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 200 }}
                        className={`absolute -top-4 -right-4 w-16 h-16 rounded-full flex items-center justify-center text-4xl font-bold shadow-2xl z-10 border-4 border-white dark:border-gray-800 ${
                          showCorrect 
                            ? 'bg-green-500 text-white' 
                            : 'bg-red-500 text-white'
                        }`}
                      >
                        {showCorrect ? '✓' : '✗'}
                      </motion.div>
                    )}
                    <span className="font-bold text-2xl">{String.fromCharCode(65 + index)}</span>
                    <span className="text-base leading-tight">{option}</span>
                  </motion.button>
                )
              })}
            </div>

            {/* Explanation */}
            <AnimatePresence>
              {showResult && question?.explanation && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/30 border-2 border-blue-200 dark:border-blue-700"
                >
                  <p className="text-gray-800 dark:text-gray-200 font-medium">
                    {question.explanation}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Continue Button */}
            {showResult && (
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  if (isLastQuestion) {
                    onComplete(calculateScore())
                  } else {
                    setCurrentQuestion(prev => prev + 1)
                    setSelectedAnswer(null)
                    setShowResult(false)
                    setMascotMood('thinking')
                  }
                }}
                className="w-full mt-6 py-5 rounded-2xl font-bold text-xl text-white shadow-lg flex-shrink-0"
                style={{ background: DUOLINGO_COLORS.green }}
              >
                {isLastQuestion ? 'Complete Quiz' : 'Next Question'}
              </motion.button>
            )}
          </motion.div>
        </div>
      </div>

      {/* Feedback Overlay - Top Center, No Text Overlap */}
      <AnimatePresence>
        {showResult && question && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.8 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none"
            style={{ marginTop: '80px' }}
          >
            <div 
              className={`text-6xl font-bold px-8 py-4 rounded-2xl ${
                selectedAnswer === question.correctAnswer ? 'bg-green-100 dark:bg-green-900/50' : 'bg-red-100 dark:bg-red-900/50'
              }`}
              style={{
                textShadow: '0 4px 20px rgba(0,0,0,0.3)',
                color: selectedAnswer === question.correctAnswer ? DUOLINGO_COLORS.green : DUOLINGO_COLORS.red,
                border: `4px solid ${selectedAnswer === question.correctAnswer ? DUOLINGO_COLORS.green : DUOLINGO_COLORS.red}`
              }}
            >
              {selectedAnswer === question.correctAnswer ? '✓ Correct!' : '✗ Try Again'}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default QuizBattle
