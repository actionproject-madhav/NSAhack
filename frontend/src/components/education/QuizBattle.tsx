import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Howl } from 'howler'
import confetti from 'canvas-confetti'
import Lottie from 'lottie-react'
import { Clock, Flame, Timer, Lightbulb, Shield, Sword } from 'lucide-react'

// Types
interface Question {
  question: string
  options: string[]
  correctAnswer: number
  explanation?: string
}

interface PlayerStats {
  powerups: {
    timeFreeze?: number
    hint?: number
    shield?: number
    [key: string]: number | undefined
  }
}

interface BattleLogEntry {
  type: 'player' | 'opponent'
  message: string
  damage: number
}

interface QuizBattleProps {
  questions?: Question[]
  onComplete: (score: number) => void
  playerStats?: PlayerStats
  opponent?: string
}

const QuizBattle = ({ questions = [], onComplete, playerStats = { powerups: {} }, opponent = 'AI' }: QuizBattleProps) => {
  const [currentQuestion, setCurrentQuestion] = useState<number>(0)
  const [playerHealth, setPlayerHealth] = useState<number>(100)
  const [opponentHealth, setOpponentHealth] = useState<number>(100)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState<boolean>(false)
  const [combo, setCombo] = useState<number>(0)
  const [timeRemaining, setTimeRemaining] = useState<number>(30)
  const [battleLog, setBattleLog] = useState<BattleLogEntry[]>([])
  const [powerUpActive, setPowerUpActive] = useState<string | null>(null)
  const [correctAnswers, setCorrectAnswers] = useState<number>(0)
  const [maxCombo, setMaxCombo] = useState<number>(0)
  
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const sounds = useRef({
    attack: new Howl({ src: ['/assets/sounds/effects/correct.mp3'], volume: 0.6, preload: false }),
    defend: new Howl({ src: ['/assets/sounds/effects/wrong.mp3'], volume: 0.6, preload: false }),
    critical: new Howl({ src: ['/assets/sounds/effects/combo.mp3'], volume: 0.6, preload: false }),
    victory: new Howl({ src: ['/assets/sounds/effects/level_up.mp3'], volume: 0.8, preload: false }),
    defeat: new Howl({ src: ['/assets/sounds/effects/wrong.mp3'], volume: 0.6, preload: false })
  })

  // Timer countdown
  useEffect(() => {
    if (timeRemaining > 0 && !showResult && questions.length > 0) {
      timerRef.current = setTimeout(() => {
        setTimeRemaining(prev => prev - 1)
      }, 1000)
    } else if (timeRemaining === 0 && !showResult) {
      // Time's up - count as wrong answer
      handleAnswer(-1)
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [timeRemaining, showResult, questions.length])

  const handleAnswer = (answerIndex: number) => {
    if (!questions || questions.length === 0 || !questions[currentQuestion]) {
      onComplete(0)
      return
    }
    const question = questions[currentQuestion]
    const isCorrect = answerIndex >= 0 && answerIndex === question.correctAnswer
    
    setSelectedAnswer(answerIndex)
    setShowResult(true)

    if (isCorrect) {
      // Calculate damage based on speed and combo
      const speedBonus = Math.floor(timeRemaining / 3)
      const comboMultiplier = 1 + (combo * 0.2)
      const damage = Math.floor((10 + speedBonus) * comboMultiplier)
      
      // Deal damage to opponent
      setOpponentHealth(prev => Math.max(0, prev - damage))
      setCorrectAnswers(prev => prev + 1)
      const newCombo = combo + 1
      setCombo(newCombo)
      setMaxCombo(prev => Math.max(prev, newCombo))
      
      try {
        sounds.current.attack.play()
        if (newCombo >= 3) {
          sounds.current.critical.play()
        }
      } catch (e) {
        // Sound failed, ignore
      }
      
      // Add to battle log
      setBattleLog(prev => [...prev, {
        type: 'player',
        message: `You dealt ${damage} damage! ${newCombo >= 3 ? 'COMBO!' : ''}`,
        damage
      }])
    } else {
      // Take damage for wrong answer
      const damage = 15
      setPlayerHealth(prev => Math.max(0, prev - damage))
      setCombo(0)
      
      try {
        sounds.current.defend.play()
      } catch (e) {
        // Sound failed, ignore
      }
      
      // Add to battle log
      setBattleLog(prev => [...prev, {
        type: 'opponent',
        message: `You took ${damage} damage!`,
        damage
      }])
    }

    // Check win/loss conditions
    setTimeout(() => {
      if (opponentHealth <= 0) {
        handleVictory()
      } else if (playerHealth <= 0) {
        handleDefeat()
      } else if (currentQuestion < questions.length - 1) {
        // Next question
        setCurrentQuestion(prev => prev + 1)
        setSelectedAnswer(null)
        setShowResult(false)
        setTimeRemaining(30)
      } else {
        // End of questions - determine winner
        if (playerHealth > opponentHealth) {
          handleVictory()
        } else {
          handleDefeat()
        }
      }
    }, 2000)
  }

  const handleVictory = () => {
    sounds.current.victory.play()
    confetti({
      particleCount: 200,
      spread: 70,
      origin: { y: 0.6 }
    })
    
    const score = calculateScore()
    setTimeout(() => {
      onComplete(score)
    }, 3000)
  }

  const handleDefeat = () => {
    sounds.current.defeat.play()
    setTimeout(() => {
      onComplete(0)
    }, 2000)
  }

  const calculateScore = () => {
    if (questions.length === 0) return 0
    const healthBonus = playerHealth
    const accuracyBonus = (correctAnswers / questions.length) * 100
    const comboBonus = maxCombo * 10
    return Math.floor(healthBonus + accuracyBonus + comboBonus)
  }

  const usePowerUp = (type: string) => {
    if (!powerUpActive && playerStats.powerups[type] && playerStats.powerups[type]! > 0) {
      setPowerUpActive(type)
      // Apply power-up effect
      switch(type) {
        case 'timeFreeze':
          setTimeRemaining(prev => prev + 15)
          break
        case 'hint':
          // Eliminate one wrong answer
          break
        case 'shield':
          // Block next damage
          break
      }
    }
  }

  // Show error if no questions
  if (!questions || questions.length === 0) {
    return (
      <div className="h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 text-center max-w-md">
          <h2 className="text-2xl font-bold text-white mb-4">No Quiz Available</h2>
          <p className="text-white/80 mb-6">This lesson doesn't have quiz questions yet.</p>
          <button
            onClick={() => onComplete(0)}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Return to Map
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="stars"></div>
        <div className="twinkling"></div>
      </div>

      {/* Battle Arena */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Top HUD */}
        <div className="bg-black/50 backdrop-blur p-4">
          <div className="max-w-6xl mx-auto">
            {/* Health Bars */}
            <div className="grid grid-cols-2 gap-8 mb-4">
              {/* Player Health */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-bold">You</span>
                  <span className="text-white">{playerHealth}/100 HP</span>
                </div>
                <div className="h-6 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                    initial={{ width: '100%' }}
                    animate={{ width: `${playerHealth}%` }}
                    transition={{ type: "spring", stiffness: 100 }}
                  />
                </div>
              </div>

              {/* Opponent Health */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-bold">{opponent}</span>
                  <span className="text-white">{opponentHealth}/100 HP</span>
                </div>
                <div className="h-6 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-red-500 to-pink-500"
                    initial={{ width: '100%' }}
                    animate={{ width: `${opponentHealth}%` }}
                    transition={{ type: "spring", stiffness: 100 }}
                  />
                </div>
              </div>
            </div>

            {/* Timer and Combo */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Timer */}
                <div className={`flex items-center gap-2 ${timeRemaining < 10 ? 'text-red-500' : 'text-white'}`}>
                  <Clock className="w-6 h-6" />
                  <span className="font-bold text-xl">{timeRemaining}s</span>
                </div>

                {/* Combo */}
                {combo > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex items-center gap-2 text-yellow-400"
                  >
                    <Flame className="w-6 h-6" />
                    <span className="font-bold text-xl">{combo}x COMBO!</span>
                  </motion.div>
                )}
              </div>

              {/* Power-ups */}
              <div className="flex gap-2">
                {Object.entries(playerStats.powerups || {}).map(([key, count]) => {
                  const countNum = typeof count === 'number' ? count : 0
                  return (
                    <button
                      key={key}
                      onClick={() => usePowerUp(key)}
                      disabled={countNum === 0 || powerUpActive !== null}
                      className={`p-2 rounded-lg ${
                        countNum > 0 ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-700 opacity-50'
                      } transition-colors`}
                    >
                      {key === 'timeFreeze' && <Timer className="w-6 h-6 text-white" />}
                      {key === 'hint' && <Lightbulb className="w-6 h-6 text-white" />}
                      {key === 'shield' && <Shield className="w-6 h-6 text-white" />}
                      <span className="text-xs text-white">{countNum}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Battle Field */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="max-w-4xl w-full">
            {/* Characters */}
            <div className="flex justify-between mb-8">
              {/* Player Character */}
              <motion.div
                animate={selectedAnswer !== null && questions[currentQuestion] && questions[currentQuestion].correctAnswer === selectedAnswer ? {
                  x: [0, 50, 0],
                  transition: { duration: 0.5 }
                } : {}}
                className="w-24 h-24 flex items-center justify-center"
              >
                <Sword className="w-full h-full text-blue-400" />
              </motion.div>

              {/* Opponent Character */}
              <motion.div
                animate={selectedAnswer !== null && questions[currentQuestion] && questions[currentQuestion].correctAnswer !== selectedAnswer ? {
                  x: [0, -50, 0],
                  transition: { duration: 0.5 }
                } : {}}
                className="w-24 h-24 flex items-center justify-center transform scale-x-[-1]"
              >
                <Sword className="w-full h-full text-red-400" />
              </motion.div>
            </div>

            {/* Question Card */}
            {questions.length > 0 && questions[currentQuestion] ? (
            <motion.div
              key={currentQuestion}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 100 }}
              className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20"
            >
              <h2 className="text-2xl font-bold text-white mb-6">
                Question {currentQuestion + 1} of {questions.length}
              </h2>
              
              <p className="text-xl text-white mb-8">
                {questions[currentQuestion]?.question || 'No question available'}
              </p>

              {/* Answer Options */}
              <div className="grid grid-cols-2 gap-4">
                {questions[currentQuestion]?.options?.map((option: string, index: number) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => !showResult && handleAnswer(index)}
                    disabled={showResult}
                    className={`p-4 rounded-xl text-left transition-all ${
                      showResult
                        ? index === questions[currentQuestion]?.correctAnswer
                          ? 'bg-green-500 text-white'
                          : index === selectedAnswer
                          ? 'bg-red-500 text-white'
                          : 'bg-white/20 text-white/50'
                        : 'bg-white/20 hover:bg-white/30 text-white'
                    }`}
                  >
                    <span className="font-semibold">{String.fromCharCode(65 + index)}.</span> {option}
                  </motion.button>
                )) || []}
              </div>

              {/* Explanation */}
              <AnimatePresence>
                {showResult && questions[currentQuestion]?.explanation && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 p-4 bg-white/10 rounded-xl"
                  >
                    <p className="text-white">
                      {questions[currentQuestion].explanation}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
            ) : (
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 text-center">
                <p className="text-white text-xl mb-4">No questions available for this quiz.</p>
                <button
                  onClick={() => onComplete(0)}
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Return to Map
                </button>
              </div>
            )}

            {/* Battle Log */}
            <div className="mt-4 max-h-32 overflow-y-auto">
              <AnimatePresence>
                {battleLog.slice(-3).map((log: BattleLogEntry, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: log.type === 'player' ? -50 : 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className={`text-sm mb-1 ${
                      log.type === 'player' ? 'text-green-400' : 'text-red-400'
                    }`}
                  >
                    {log.message}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Victory/Defeat Overlay */}
      <AnimatePresence>
        {(playerHealth <= 0 || opponentHealth <= 0) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/80 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 100 }}
              className="text-center"
            >
              <h1 className={`text-6xl font-bold mb-4 ${
                playerHealth > 0 ? 'text-green-500' : 'text-red-500'
              }`}>
                {playerHealth > 0 ? 'VICTORY!' : 'DEFEAT'}
              </h1>
              <p className="text-white text-xl">
                {playerHealth > 0 
                  ? `You earned ${calculateScore()} XP!`
                  : 'Try again to master this topic!'}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default QuizBattle