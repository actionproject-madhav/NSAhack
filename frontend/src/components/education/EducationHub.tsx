import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import DuolingoIslandMap from './DuolingoIslandMap'
import LessonGame from './LessonGame'
import QuizBattle from './QuizBattle'
import { useGameProgress } from '../../hooks/useGameProgress'
import '../../styles/duolingo-education.css'

const EducationHub = () => {
  const [currentView, setCurrentView] = useState<'map' | 'lesson' | 'quiz'>('map')
  const [selectedLesson, setSelectedLesson] = useState<any>(null)
  const { playerProgress, updateProgress } = useGameProgress()

  const handleLessonSelect = (lesson: any) => {
    setSelectedLesson(lesson)
    setCurrentView(lesson.type === 'quiz' ? 'quiz' : 'lesson')
  }

  const handleLessonComplete = (score: number) => {
    updateProgress({
      xp: score,
      completedLesson: selectedLesson.id
    })
    setCurrentView('map')
    setSelectedLesson(null)
  }

  return (
    <div className="education-hub">
      <AnimatePresence mode="wait">
        {currentView === 'map' && (
          <motion.div
            key="map"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <DuolingoIslandMap
              playerProgress={playerProgress}
              onLessonSelect={handleLessonSelect}
            />
          </motion.div>
        )}

        {currentView === 'lesson' && selectedLesson && (
          <motion.div
            key="lesson"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <LessonGame
              lesson={selectedLesson}
              hearts={playerProgress.hearts || 5}
              onComplete={handleLessonComplete}
              onExit={() => setCurrentView('map')}
            />
          </motion.div>
        )}

        {currentView === 'quiz' && selectedLesson && (
          <motion.div
            key="quiz"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <QuizBattle
              questions={selectedLesson.questions}
              onComplete={handleLessonComplete}
              playerStats={playerProgress}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default EducationHub