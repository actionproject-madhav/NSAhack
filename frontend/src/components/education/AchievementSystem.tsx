import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import confetti from 'canvas-confetti'
import { Howl } from 'howler'

const achievements = [
  // Streak Achievements
  { id: 'streak_3', name: 'On Fire', description: '3 day streak', icon: '🔥', xp: 50 },
  { id: 'streak_7', name: 'Week Warrior', description: '7 day streak', icon: '📅', xp: 100 },
  { id: 'streak_30', name: 'Monthly Master', description: '30 day streak', icon: '🗓️', xp: 500 },
  
  // Lesson Achievements  
  { id: 'first_lesson', name: 'First Steps', description: 'Complete first lesson', icon: '👶', xp: 25 },
  { id: 'lessons_10', name: 'Knowledge Seeker', description: 'Complete 10 lessons', icon: '📚', xp: 100 },
  { id: 'lessons_50', name: 'Scholar', description: 'Complete 50 lessons', icon: '🎓', xp: 500 },
  
  // Perfect Score Achievements
  { id: 'perfect_1', name: 'Perfectionist', description: 'First perfect score', icon: '💯', xp: 50 },
  { id: 'perfect_10', name: 'Flawless', description: '10 perfect scores', icon: '✨', xp: 200 },
  
  // Island Achievements
  { id: 'island_complete', name: 'Island Conqueror', description: 'Complete an island', icon: '🏝️', xp: 300 },
  { id: 'all_islands', name: 'World Traveler', description: 'Complete all islands', icon: '🌍', xp: 1000 },
  
  // Special Achievements
  { id: 'night_owl', name: 'Night Owl', description: 'Study after midnight', icon: '🦉', xp: 50 },
  { id: 'early_bird', name: 'Early Bird', description: 'Study before 6 AM', icon: '🐦', xp: 50 },
  { id: 'speed_demon', name: 'Speed Demon', description: 'Complete lesson in under 2 minutes', icon: '⚡', xp: 75 }
]

export const AchievementPopup = ({ achievement, onClose }: { achievement: any; onClose: () => void }) => {
  useEffect(() => {
    // Play sound
    const sound = new Howl({ src: ['/sounds/achievement.mp3'] })
    sound.play()

    // Trigger confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    })

    // Auto close after 5 seconds
    const timer = setTimeout(onClose, 5000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <motion.div
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 400, opacity: 0 }}
      className="fixed top-20 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-6 shadow-2xl z-50 max-w-sm"
    >
      <div className="flex items-start gap-4">
        <div className="text-5xl">{achievement.icon}</div>
        <div className="flex-1">
          <h3 className="text-white font-bold text-xl mb-1">Achievement Unlocked!</h3>
          <p className="text-white/90 font-semibold">{achievement.name}</p>
          <p className="text-white/80 text-sm">{achievement.description}</p>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-white/90">+{achievement.xp} XP</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

const AchievementSystem = ({ playerStats, onAchievementUnlock }) => {
  const [unlockedAchievements, setUnlockedAchievements] = useState([])
  const [showingAchievement, setShowingAchievement] = useState(null)
  const [achievementQueue, setAchievementQueue] = useState([])

  // Check for new achievements
  useEffect(() => {
    checkAchievements()
  }, [playerStats])

  // Process achievement queue
  useEffect(() => {
    if (!showingAchievement && achievementQueue.length > 0) {
      const nextAchievement = achievementQueue[0]
      setShowingAchievement(nextAchievement)
      setAchievementQueue(prev => prev.slice(1))
    }
  }, [showingAchievement, achievementQueue])

  const checkAchievements = () => {
    const newAchievements = []

    // Streak achievements
    if (playerStats.streak >= 3 && !hasAchievement('streak_3')) {
      newAchievements.push(getAchievement('streak_3'))
    }
    if (playerStats.streak >= 7 && !hasAchievement('streak_7')) {
      newAchievements.push(getAchievement('streak_7'))
    }
    if (playerStats.streak >= 30 && !hasAchievement('streak_30')) {
      newAchievements.push(getAchievement('streak_30'))
    }

    // Lesson achievements
    if (playerStats.completedLessons.length >= 1 && !hasAchievement('first_lesson')) {
      newAchievements.push(getAchievement('first_lesson'))
    }
    if (playerStats.completedLessons.length >= 10 && !hasAchievement('lessons_10')) {
      newAchievements.push(getAchievement('lessons_10'))
    }

    // Add new achievements to queue
    if (newAchievements.length > 0) {
      setAchievementQueue(prev => [...prev, ...newAchievements])
      newAchievements.forEach(ach => {
        setUnlockedAchievements(prev => [...prev, ach.id])
        onAchievementUnlock(ach)
      })
    }
  }

  const hasAchievement = (id) => {
    return unlockedAchievements.includes(id)
  }

  const getAchievement = (id) => {
    return achievements.find(a => a.id === id)
  }

  return (
    <>
      <AnimatePresence>
        {showingAchievement && (
          <AchievementPopup
            achievement={showingAchievement}
            onClose={() => setShowingAchievement(null)}
          />
        )}
      </AnimatePresence>

      {/* Achievement Gallery */}
      <div className="grid grid-cols-4 gap-4">
        {achievements.map(achievement => {
          const isUnlocked = hasAchievement(achievement.id)
          return (
            <motion.div
              key={achievement.id}
              whileHover={isUnlocked ? { scale: 1.05 } : {}}
              className={`relative p-4 rounded-xl ${
                isUnlocked 
                  ? 'bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg' 
                  : 'bg-gray-200'
              }`}
            >
              <div className={`text-4xl mb-2 ${!isUnlocked && 'grayscale opacity-50'}`}>
                {achievement.icon}
              </div>
              <h4 className={`font-semibold text-sm ${
                isUnlocked ? 'text-white' : 'text-gray-500'
              }`}>
                {achievement.name}
              </h4>
              <p className={`text-xs ${
                isUnlocked ? 'text-white/80' : 'text-gray-400'
              }`}>
                {achievement.description}
              </p>
              {!isUnlocked && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-5xl opacity-20">🔒</span>
                </div>
              )}
            </motion.div>
          )
        })}
      </div>
    </>
  )
}

export default AchievementSystem