// components/education/LessonGame.tsx
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSpring, animated } from '@react-spring/web'
import { Heart, X, ChevronRight } from 'lucide-react'
import Lottie from 'lottie-react'
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

interface LessonGameProps {
  lesson: any
  hearts: number
  onComplete: (score: number) => void
  onExit: () => void
  islandModel?: string
}

const LessonGame = ({ lesson, hearts, onComplete, onExit }: LessonGameProps) => {
  const [currentSection, setCurrentSection] = useState(0)
  const [score, setScore] = useState(0)
  const [combo, setCombo] = useState(0)
  const [showFeedback, setShowFeedback] = useState(false)
  const [feedbackType, setFeedbackType] = useState<'correct' | 'incorrect'>('correct')
  const [heartsRemaining, setHeartsRemaining] = useState(hearts)
  const [mascotMood, setMascotMood] = useState<'happy' | 'thinking' | 'proud' | 'encouraging'>('happy')
  const [showCompletion, setShowCompletion] = useState(false)
  
  const { playSound } = useGameSound()

  // Progress Bar Animation
  const progressSpring = useSpring({
    width: `${((currentSection + 1) / lesson.content.sections.length) * 100}%`,
    config: { tension: 200, friction: 20 }
  })

  // Handle Answer Selection
  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      playSound('correct')
      setScore(prev => prev + (100 * (1 + combo * 0.1)))
      setCombo(prev => prev + 1)
      setFeedbackType('correct')
      setMascotMood('proud')
      
      if (combo >= 3) {
        playSound('combo')
      }
    } else {
      playSound('incorrect')
      setHeartsRemaining(prev => prev - 1)
      setCombo(0)
      setFeedbackType('incorrect')
      setMascotMood('encouraging')
      
      if (heartsRemaining <= 1) {
        setTimeout(() => {
          onComplete(score)
        }, 2000)
        return
      }
    }
    
    setShowFeedback(true)
    setTimeout(() => {
      setShowFeedback(false)
      if (currentSection < lesson.content.sections.length - 1) {
        setCurrentSection(prev => prev + 1)
        setMascotMood('thinking')
      } else {
        onComplete(score)
      }
    }, 1500)
  }

  // Render Bite-Sized Section Content
  const renderSection = () => {
    const section = lesson.content.sections[currentSection]
    if (!section) return null
    
    switch (section.type) {
      case 'comparison':
        return (
          <div className="space-y-6">
            {section.title && (
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 text-center">{section.title}</h3>
            )}
            {section.content && (
              <p className="text-xl text-gray-900 dark:text-white mb-6 text-center font-medium">{section.content}</p>
            )}
            {section.data && (
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(section.data).slice(0, 4).map(([key, value]: [string, any]) => (
                  <div key={key} className="bg-white dark:bg-gray-700 p-5 rounded-xl border-2 border-gray-200 dark:border-gray-600 shadow-sm">
                    <h4 className="font-bold text-lg mb-3 capitalize text-gray-900 dark:text-white">{key}</h4>
                    {typeof value === 'object' && value !== null ? (
                      <ul className="space-y-2">
                        {Object.entries(value).slice(0, 3).map(([k, v]: [string, any]) => (
                          <li key={k} className="text-gray-900 dark:text-white text-base"><span className="font-semibold">{k}:</span> {String(v)}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-900 dark:text-white text-base">{String(value)}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )
        
      case 'example':
      case 'text':
      case 'warning':
      case 'calculation':
      default:
        return (
          <div className="space-y-6">
            {section.title && (
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 text-center">{section.title}</h3>
            )}
            <p className="text-xl text-gray-900 dark:text-white leading-relaxed mb-6 text-center font-medium">{section.content}</p>
            {section.details && section.details.length > 0 && (
              <div className="space-y-3">
                {section.details.slice(0, 4).map((detail: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-4 bg-white dark:bg-gray-700 p-4 rounded-xl border-2 border-gray-200 dark:border-gray-600 shadow-sm">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center" style={{ background: DUOLINGO_COLORS.green }}>
                      <span className="text-white font-bold text-lg">✓</span>
                    </div>
                    <span className="text-gray-900 dark:text-white flex-1 text-lg">{detail}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
    }
  }

  const isLastSection = currentSection === lesson.content.sections.length - 1

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* Top Bar - Duolingo Style */}
      <div className="relative z-20 bg-white dark:bg-gray-800 shadow-md p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={onExit}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>

          {/* Progress Bar */}
          <div className="flex-1 mx-8">
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <animated.div
                style={{ ...progressSpring, background: DUOLINGO_COLORS.green }}
                className="h-full rounded-full"
              />
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">
              {currentSection + 1} / {lesson.content.sections.length}
            </div>
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

      {/* Main Content Area - Centered like Duolingo */}
      <div className="relative z-10 h-full flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          {/* Content Card - Bite-Sized, Duolingo Style */}
          <motion.div
            key={currentSection}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-10 border-4"
            style={{ borderColor: DUOLINGO_COLORS.green }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSection}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {renderSection()}
              </motion.div>
            </AnimatePresence>

            {/* Continue Button - Duolingo Style */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                if (isLastSection) {
                  // Show completion screen
                  playSound('levelUp')
                  setShowCompletion(true)
                } else {
                  // Show positive feedback for continuing
                  playSound('correct')
                  setFeedbackType('correct')
                  setShowFeedback(true)
                  setMascotMood('proud')
                  setTimeout(() => {
                    setShowFeedback(false)
                    setCurrentSection(prev => prev + 1)
                    setMascotMood('thinking')
                  }, 1000)
                }
              }}
              className="w-full mt-8 py-5 rounded-2xl font-bold text-xl text-white shadow-lg flex items-center justify-center gap-2"
              style={{ background: DUOLINGO_COLORS.green }}
            >
              {isLastSection ? 'Complete Lesson' : 'Continue'}
              {!isLastSection && <ChevronRight className="w-6 h-6" />}
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Feedback Overlay - Top Center, No Text Overlap */}
      <AnimatePresence>
        {showFeedback && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.8 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none"
            style={{ marginTop: '80px' }}
          >
            <div 
              className={`text-6xl font-bold px-8 py-4 rounded-2xl ${
                feedbackType === 'correct' ? 'bg-green-100 dark:bg-green-900/50' : 'bg-red-100 dark:bg-red-900/50'
              }`}
              style={{
                textShadow: '0 4px 20px rgba(0,0,0,0.3)',
                color: feedbackType === 'correct' ? DUOLINGO_COLORS.green : DUOLINGO_COLORS.red,
                border: `4px solid ${feedbackType === 'correct' ? DUOLINGO_COLORS.green : DUOLINGO_COLORS.red}`
              }}
            >
              {feedbackType === 'correct' ? '✓ Correct!' : '✗ Try Again'}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Completion Screen with Mascot */}
      <AnimatePresence>
        {isLastSection && currentSection === lesson.content.sections.length - 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => onComplete(score)}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-md text-center shadow-2xl border-4"
              style={{ borderColor: DUOLINGO_COLORS.green }}
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 0.6, repeat: 2 }}
                className="mb-6 flex justify-center"
              >
                <div className="w-32 h-32">
                  <Lottie 
                    animationData={elephantAnimation}
                    loop={false}
                    className="w-full h-full"
                  />
                </div>
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                🎉 Lesson Complete!
              </h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                Great job! You earned {Math.floor(score)} points!
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onComplete(score)}
                className="w-full py-4 rounded-2xl font-bold text-lg text-white shadow-lg"
                style={{ background: DUOLINGO_COLORS.green }}
              >
                Continue
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default LessonGame
