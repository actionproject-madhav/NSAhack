import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import confetti from 'canvas-confetti'
import { Howl } from 'howler'
import { 
  Flame, 
  Calendar, 
  CalendarDays, 
  Baby, 
  BookOpen, 
  GraduationCap, 
  Target, 
  Sparkles, 
  Island, 
  Globe, 
  Moon, 
  Sun, 
  Zap, 
  Trophy, 
  Lock 
} from 'lucide-react'

// Icon mapping for achievements
const iconMap = {
  'streak_3': Flame,
  'streak_7': Calendar,
  'streak_30': CalendarDays,
  'first_lesson': Baby,
  'lessons_10': BookOpen,
  'lessons_50': GraduationCap,
  'perfect_1': Target,
  'perfect_10': Sparkles,
  'island_complete': Island,
  'all_islands': Globe,
  'night_owl': Moon,
  'early_bird': Sun,
  'speed_demon': Zap,
  'default': Trophy
}

const achievements = [
  // Streak Achievements
  { id: 'streak_3', name: 'On Fire', description: '3 day streak', iconKey: 'streak_3', xp: 50 },
  { id: 'streak_7', name: 'Week Warrior', description: '7 day streak', iconKey: 'streak_7', xp: 100 },
  { id: 'streak_30', name: 'Monthly Master', description: '30 day streak', iconKey: 'streak_30', xp: 500 },
  
  // Lesson Achievements  
  { id: 'first_lesson', name: 'First Steps', description: 'Complete first lesson', iconKey: 'first_lesson', xp: 25 },
  { id: 'lessons_10', name: 'Knowledge Seeker', description: 'Complete 10 lessons', iconKey: 'lessons_10', xp: 100 },
  { id: 'lessons_50', name: 'Scholar', description: 'Complete 50 lessons', iconKey: 'lessons_50', xp: 500 },
  
  // Perfect Score Achievements
  { id: 'perfect_1', name: 'Perfectionist', description: 'First perfect score', iconKey: 'perfect_1', xp: 50 },
  { id: 'perfect_10', name: 'Flawless', description: '10 perfect scores', iconKey: 'perfect_10', xp: 200 },
  
  // Island Achievements
  { id: 'island_complete', name: 'Island Conqueror', description: 'Complete an island', iconKey: 'island_complete', xp: 300 },
  { id: 'all_islands', name: 'World Traveler', description: 'Complete all islands', iconKey: 'all_islands', xp: 1000 },
  
  // Special Achievements
  { id: 'night_owl', name: 'Night Owl', description: 'Study after midnight', iconKey: 'night_owl', xp: 50 },
  { id: 'early_bird', name: 'Early Bird', description: 'Study before 6 AM', iconKey: 'early_bird', xp: 50 },
  { id: 'speed_demon', name: 'Speed Demon', description: 'Complete lesson in under 2 minutes', iconKey: 'speed_demon', xp: 75 }
]

export const AchievementPopup = ({ achievement, onClose }: { achievement?: any; onClose?: () => void }) => {
  useEffect(() => {
    if (!achievement) return
    
    // Play sound - achievement.mp3 doesn't exist, so use unlock sound instead
    try {
      const sound = new Howl({ src: ['/assets/sounds/effects/unlock.mp3'], volume: 0.8, preload: false })
      sound.play()
    } catch (e) {
      // Sound file not found, ignore
    }

    // Trigger confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    })

    // Auto close after 5 seconds
    if (onClose) {
      const timer = setTimeout(onClose, 5000)
      return () => clearTimeout(timer)
    }
  }, [achievement, onClose])

  if (!achievement) return null

  return (
    <motion.div
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 400, opacity: 0 }}
      className="fixed top-20 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-6 shadow-2xl z-50 max-w-sm"
    >
      <div className="flex items-start gap-4">
        {(() => {
          const IconComponent = iconMap[achievement.iconKey] || iconMap.default
          return <IconComponent className="w-12 h-12 text-white" />
        })()}
        <div className="flex-1">
          <h3 className="text-white font-bold text-xl mb-1">Achievement Unlocked!</h3>
          <p className="text-white/90 font-semibold">{achievement.name || 'Achievement'}</p>
          <p className="text-white/80 text-sm">{achievement.description || ''}</p>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-white/90">+{achievement.xp || 0} XP</span>
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