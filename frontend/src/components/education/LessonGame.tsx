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
          <div className="space-y-4">
            {section.title && (
              <h3 className="text-2xl font-bold text-gray-900 mb-3">{section.title}</h3>
            )}
            {section.content && (
              <p className="text-lg text-gray-700 mb-4">{section.content}</p>
            )}
            {section.data && (
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(section.data).slice(0, 4).map(([key, value]: [string, any]) => (
                  <div key={key} className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-xl border-2 border-blue-200">
                    <h4 className="font-bold text-lg mb-2 capitalize text-gray-900">{key}</h4>
                    {typeof value === 'object' && value !== null ? (
                      <ul className="space-y-1 text-sm">
                        {Object.entries(value).slice(0, 3).map(([k, v]: [string, any]) => (
                          <li key={k} className="text-gray-700"><span className="font-semibold">{k}:</span> {String(v)}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-700">{String(value)}</p>
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
          <div className="space-y-4">
            {section.title && (
              <h3 className="text-2xl font-bold text-gray-900 mb-3">{section.title}</h3>
            )}
            <p className="text-lg text-gray-700 leading-relaxed mb-4">{section.content}</p>
            {section.details && section.details.length > 0 && (
              <div className="space-y-2">
                {section.details.slice(0, 4).map((detail: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-3 bg-green-50 p-3 rounded-lg border-l-4 border-green-400">
                    <span className="text-green-500 font-bold text-xl">✓</span>
                    <span className="text-gray-700 flex-1">{detail}</span>
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

      {/* Main Content Area */}
      <div className="relative z-10 h-full flex items-center justify-center p-4">
        <div className="max-w-3xl w-full flex gap-6 items-center">
          {/* Elephant Mascot */}
          <motion.div
            className="flex-shrink-0 hidden md:block"
            animate={{ 
              y: [0, -10, 0],
              scale: showFeedback && feedbackType === 'correct' ? [1, 1.2, 1] : 1
            }}
            transition={{ 
              y: { duration: 2, repeat: Infinity, ease: "easeInOut" },
              scale: { duration: 0.5 }
            }}
          >
            <div className="w-32 h-32">
              <Lottie 
                animationData={elephantAnimation}
                loop={true}
                className="w-full h-full"
              />
            </div>
          </motion.div>

          {/* Content Card - Bite-Sized */}
          <motion.div
            key={currentSection}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="flex-1 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 border-4"
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
                  onComplete(score)
                } else {
                  setCurrentSection(prev => prev + 1)
                  setMascotMood('thinking')
                }
              }}
              className="w-full mt-6 py-4 rounded-2xl font-bold text-lg text-white shadow-lg flex items-center justify-center gap-2"
              style={{ background: DUOLINGO_COLORS.green }}
            >
              {isLastSection ? 'Complete Lesson' : 'Continue'}
              {!isLastSection && <ChevronRight className="w-5 h-5" />}
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Feedback Overlay */}
      <AnimatePresence>
        {showFeedback && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
          >
            <div 
              className={`text-7xl font-bold ${
                feedbackType === 'correct' ? 'text-green-500' : 'text-red-500'
              }`}
              style={{
                textShadow: '0 4px 20px rgba(0,0,0,0.3)',
                color: feedbackType === 'correct' ? DUOLINGO_COLORS.green : DUOLINGO_COLORS.red
              }}
            >
              {feedbackType === 'correct' ? '✓ Correct!' : '✗ Try Again'}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default LessonGame
