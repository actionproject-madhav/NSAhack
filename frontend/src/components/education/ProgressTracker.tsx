import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import Lottie from 'lottie-react'
import { Trophy, Flame, Star, BookOpen } from 'lucide-react'
// import streakAnimation from '../../assets/animations/streak-fire.json'

const ProgressTracker = ({ playerStats, dailyGoals, achievements }) => {
  const [showStreakAnimation, setShowStreakAnimation] = useState(false)

  useEffect(() => {
    if (playerStats.streak > 0 && playerStats.streak % 7 === 0) {
      setShowStreakAnimation(true)
      setTimeout(() => setShowStreakAnimation(false), 3000)
    }
  }, [playerStats.streak])

  const xpProgress = (playerStats.xp % 1000) / 1000 * 100
  const dailyXPProgress = (playerStats.dailyXP / dailyGoals.xp) * 100
  const dailyLessonsProgress = (playerStats.dailyLessons / dailyGoals.lessons) * 100

  return (
    <div className="bg-white/90 backdrop-blur rounded-3xl p-6 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Progress Tracker</h2>
        <div className="flex items-center gap-2">
          <Trophy className="w-8 h-8 text-yellow-500" />
          <span className="text-xl font-bold">{playerStats.level}</span>
        </div>
      </div>

      {/* Streak Counter */}
      <div className="bg-gradient-to-r from-orange-400 to-red-500 rounded-2xl p-4 mb-6 relative overflow-hidden">
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="text-white/80 text-sm">Current Streak</p>
            <p className="text-white text-3xl font-bold">{playerStats.streak} Days</p>
          </div>
          <Flame className="w-12 h-12 text-orange-500" />
        </div>
        
        {showStreakAnimation && (
          <div className="absolute inset-0 flex items-center justify-center">
            {/* <Lottie animationData={streakAnimation} loop={false} /> */}
          </div>
        )}
      </div>

      {/* Level Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Level {playerStats.level}</span>
          <span className="text-sm text-gray-500">
            {playerStats.xp % 1000} / 1000 XP
          </span>
        </div>
        <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
            initial={{ width: 0 }}
            animate={{ width: `${xpProgress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Daily Goals */}
      <div className="space-y-4 mb-6">
        <h3 className="font-semibold">Daily Goals</h3>
        
        {/* XP Goal */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-500" /> Earn {dailyGoals.xp} XP
            </span>
            <span className="text-sm text-gray-500">
              {playerStats.dailyXP}/{dailyGoals.xp}
            </span>
          </div>
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-blue-500"
              animate={{ width: `${Math.min(dailyXPProgress, 100)}%` }}
            />
          </div>
        </div>

        {/* Lessons Goal */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-500" /> Complete {dailyGoals.lessons} lessons
            </span>
            <span className="text-sm text-gray-500">
              {playerStats.dailyLessons}/{dailyGoals.lessons}
            </span>
          </div>
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-green-500"
              animate={{ width: `${Math.min(dailyLessonsProgress, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Recent Achievements */}
      <div>
        <h3 className="font-semibold mb-3">Recent Achievements</h3>
        <div className="flex gap-2 flex-wrap">
          {achievements.slice(-5).map((achievement, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg"
              title={achievement.name}
            >
              <span className="text-2xl">{achievement.icon}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="bg-gray-100 rounded-xl p-3">
          <p className="text-xs text-gray-500">Total XP</p>
          <p className="text-xl font-bold">{playerStats.totalXP}</p>
        </div>
        <div className="bg-gray-100 rounded-xl p-3">
          <p className="text-xs text-gray-500">Lessons Completed</p>
          <p className="text-xl font-bold">{playerStats.completedLessons.length}</p>
        </div>
        <div className="bg-gray-100 rounded-xl p-3">
          <p className="text-xs text-gray-500">Perfect Scores</p>
          <p className="text-xl font-bold">{playerStats.perfectScores || 0}</p>
        </div>
        <div className="bg-gray-100 rounded-xl p-3">
          <p className="text-xs text-gray-500">Time Studied</p>
          <p className="text-xl font-bold">{playerStats.timeStudied || '0h'}</p>
        </div>
      </div>
    </div>
  )
}

export default ProgressTracker