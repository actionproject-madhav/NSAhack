// components/education/LessonGame.tsx
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Howl } from 'howler'
import Lottie from 'lottie-react'
import { useSpring, animated } from '@react-spring/web'
import { useDrag } from '@use-gesture/react'
import { Heart, X } from 'lucide-react'

interface LessonGameProps {
  lesson: any
  hearts: number
  onComplete: (score: number) => void
  onExit: () => void
}

const LessonGame = ({ lesson, hearts, onComplete, onExit }: LessonGameProps) => {
  const [currentSection, setCurrentSection] = useState(0)
  const [score, setScore] = useState(0)
  const [combo, setCombo] = useState(0)
  const [showFeedback, setShowFeedback] = useState(false)
  const [feedbackType, setFeedbackType] = useState('correct')
  
  // Interactive Elements State
  const [draggedItems, setDraggedItems] = useState<Record<string, any>>({})
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [heartsRemaining, setHeartsRemaining] = useState(hearts)

  // Sound Effects - using correct paths
  const sounds = {
    correct: new Howl({ src: ['/assets/sounds/effects/correct.mp3'], volume: 0.6, preload: false }),
    incorrect: new Howl({ src: ['/assets/sounds/effects/wrong.mp3'], volume: 0.6, preload: false }),
    combo: new Howl({ src: ['/assets/sounds/effects/combo.mp3'], volume: 0.6, preload: false }),
    heartLost: new Howl({ src: ['/assets/sounds/effects/wrong.mp3'], volume: 0.6, preload: false }) // Using wrong.mp3 as fallback
  }

  // Progress Bar Animation
  const progressSpring = useSpring({
    width: `${((currentSection + 1) / lesson.content.sections.length) * 100}%`,
    config: { tension: 200, friction: 20 }
  })

  // Handle Answer Selection
  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      sounds.correct.play()
      setScore(prev => prev + (100 * (1 + combo * 0.1)))
      setCombo(prev => prev + 1)
      setFeedbackType('correct')
      
      // Combo celebration
      if (combo >= 3) {
        try {
          sounds.combo.play()
        } catch (e) {
          // Sound failed, ignore
        }
        // TODO: Add combo animation using Lottie (you have combo.mp3 sound)
      }
    } else {
      sounds.incorrect.play()
      setHeartsRemaining(prev => prev - 1)
      setCombo(0)
      setFeedbackType('incorrect')
      sounds.heartLost.play()
      
      // Game Over Check
      if (heartsRemaining <= 1) {
        // Game over - complete lesson with current score
        setTimeout(() => {
          onComplete(score)
        }, 2000)
        return
      }
    }
    
    setShowFeedback(true)
    setTimeout(() => {
      setShowFeedback(false)
      // Move to next section or complete lesson
      if (currentSection < lesson.content.sections.length - 1) {
        setCurrentSection(prev => prev + 1)
      } else {
        // Lesson complete
        onComplete(score)
      }
    }, 1500)
  }

  // Interactive Drag and Drop
  const bind = useDrag(({ active, movement: [x, y], memo = { x: 0, y: 0 } }) => {
    // Drag logic for interactive elements
    return memo
  })

  // Render Different Section Types
  const renderSection = () => {
    const section = lesson.content.sections[currentSection]
    
    switch (section.type) {
      case 'interactive-drag':
        return (
          <div className="relative h-96">
            <h3 className="text-2xl font-bold mb-4">{section.title}</h3>
            <div className="grid grid-cols-2 gap-8">
              {/* Draggable Items */}
              <div className="space-y-4">
                {section.items?.map((item: any, idx: number) => (
                  <animated.div
                    key={idx}
                    {...bind()}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-4 rounded-xl cursor-move shadow-lg"
                  >
                    {item.text}
                  </animated.div>
                ))}
              </div>
              
              {/* Drop Zones */}
              <div className="space-y-4">
                {section.dropZones?.map((zone: any, idx: number) => (
                  <div
                    key={idx}
                    className="border-2 border-dashed border-gray-300 p-4 rounded-xl min-h-[80px] flex items-center justify-center"
                  >
                    {draggedItems[zone.id] || zone.placeholder}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
        
      case 'mini-game':
        return <MiniGame config={section.gameConfig} onComplete={handleAnswer} />
        
      case 'animation-lesson':
        return (
          <div className="text-center">
            <Lottie 
              animationData={section.animation}
              loop={false}
              className="w-96 h-96 mx-auto"
            />
            <p className="text-lg mt-4">{section.content}</p>
          </div>
        )
        
      default:
        return (
          <div className="prose prose-lg max-w-none">
            <h3 className="text-2xl font-bold mb-4">{section.title}</h3>
            <p>{section.content}</p>
          </div>
        )
    }
  }

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 to-purple-50 relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 opacity-10">
        <div className="floating-shapes">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="shape"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 20}s`,
                animationDuration: `${20 + Math.random() * 10}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Top Bar */}
      <div className="relative z-10 bg-white/90 backdrop-blur shadow-lg p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          {/* Exit Button */}
          <button
            onClick={onExit}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Progress Bar */}
          <div className="flex-1 mx-8">
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <animated.div
                style={progressSpring}
                className="h-full bg-gradient-to-r from-green-400 to-blue-500"
              />
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

          {/* Score & Combo */}
          <div className="ml-4 text-right">
            <div className="text-2xl font-bold">{Math.floor(score)}</div>
            {combo > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-sm text-orange-500 font-semibold"
              >
                {combo}x Combo!
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto p-8 mt-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSection}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="bg-white rounded-3xl shadow-2xl p-8"
          >
            {renderSection()}
          </motion.div>
        </AnimatePresence>

        {/* Action Buttons */}
        <div className="flex justify-between mt-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-gray-200 text-gray-700 rounded-2xl font-semibold"
            onClick={() => currentSection > 0 && setCurrentSection(prev => prev - 1)}
          >
            Previous
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-2xl font-semibold shadow-lg"
            onClick={() => handleAnswer(true)}
          >
            Continue
          </motion.button>
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
            <div className={`text-6xl font-bold ${
              feedbackType === 'correct' ? 'text-green-500' : 'text-red-500'
            }`}>
              {feedbackType === 'correct' ? '✓ Correct!' : '✗ Try Again'}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Mini-Game Component
const MiniGame = ({ config, onComplete }: { config: any; onComplete: (isCorrect: boolean) => void }) => {
  // Implement various mini-games based on config
  // Examples: Stock Trading Simulator, Portfolio Balancer, Risk Calculator
  return (
    <div className="p-8 bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl">
      <h3 className="text-2xl font-bold mb-4">Interactive Challenge</h3>
      {/* Mini-game implementation */}
    </div>
  )
}

export default LessonGame