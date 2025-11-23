// pages/EducationHub.tsx
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useAnimation } from 'framer-motion'
// Temporarily commented out - requires React 19
// import { Canvas } from '@react-three/fiber'
// import { OrbitControls, Float, Text3D } from '@react-three/drei'
import Lottie from 'lottie-react'
import { Howl } from 'howler'
import confetti from 'canvas-confetti'
import Layout from '../components/Layout'
import { allUnits } from './Curriculumdata'
// Temporarily disabled - requires @react-three/fiber (React 19)
// import IslandMap from '../components/education/IslandMap'
import LessonGame from '../components/education/LessonGame'
import QuizBattle from '../components/education/QuizBattle'
import ProgressTracker from '../components/education/ProgressTracker'
import { AchievementPopup } from '../components/education/AchievementSystem'
import useGameSound from '../hooks/useGameSound'
import useXPSystem from '../hooks/useXPSystem'
// Icons removed - will be replaced with custom downloaded icons
// See ICON_REPLACEMENT_GUIDE.md for what to download and where

// Import Lottie animations
import xpBurstAnimation from '../assets/animations/xp-burst.json'
import streakFireAnimation from '../assets/animations/streak-fire.json'
import moneyAnimation from '../assets/animations/Money.json'


const EducationHub = () => {
  // Game State
  const [currentIsland, setCurrentIsland] = useState<any>(null)
  const [currentLesson, setCurrentLesson] = useState<any>(null)
  const [gameMode, setGameMode] = useState('map') // 'map', 'lesson', 'quiz', 'battle'
  const [playerStats, setPlayerStats] = useState<{
    level: number
    xp: number
    streak: number
    hearts: number
    coins: number
    badges: string[]
    unlockedIslands: string[]
    completedLessons: (string | number)[]
    powerups: {
      xpBoost: number
      streakFreeze: number
      heartRefill: number
    }
  }>({
    level: 1,
    xp: 0,
    streak: 0,
    hearts: 5,
    coins: 100,
    badges: [],
    unlockedIslands: ['unit-1'],
    completedLessons: [],
    powerups: {
      xpBoost: 0,
      streakFreeze: 0,
      heartRefill: 0
    }
  })

  // Hooks
  const { playSound, toggleMusic, startBgMusic, stopBgMusic } = useGameSound()
  const { addXP, calculateLevel } = useXPSystem()
  const controls = useAnimation()

  // Start theme music on initial load
  useEffect(() => {
    startBgMusic('theme.mp3')
    
    // Cleanup: stop music when component unmounts
    return () => {
      stopBgMusic()
    }
  }, [startBgMusic, stopBgMusic])

  // Island Configuration
  const islands = [
    {
      id: 'unit-1',
      name: 'Fundamentals Island',
      position: [0, 0, 0],
      color: '#4ECDC4',
      model: '/models/island-tropical.glb',
      theme: 'tropical',
      bgMusic: 'island-tropical.mp3',
      lessons: allUnits[0].lessons,
      boss: {
        name: 'The Market Bear',
        health: 100,
        rewards: { xp: 500, coins: 200, badge: 'fundamentals-master' }
      }
    },
    {
      id: 'unit-2',
      name: 'Stock Market Volcano',
      position: [5, 0, -3],
      color: '#FF6B6B',
      model: '/models/island-volcano.glb',
      theme: 'volcanic',
      bgMusic: 'island-volcano.mp3',
      lessons: allUnits[1].lessons,
      locked: true,
      unlockRequirement: { completeLessons: 3, fromIsland: 'unit-1' }
    },
    {
      id: 'unit-3',
      name: 'Bond Glacier',
      position: [-4, 0, -2],
      color: '#A8E6CF',
      model: '/models/island-ice.glb',
      theme: 'arctic',
      bgMusic: 'island-ice.mp3',
      lessons: allUnits[2].lessons,
      locked: true,
      unlockRequirement: { level: 5 }
    },
    {
      id: 'unit-4',
      name: 'ETF Sky Kingdom',
      position: [2, 3, -5],
      color: '#FFD93D',
      model: '/models/island-floating.glb',
      theme: 'sky',
      bgMusic: 'island-sky.mp3',
      lessons: allUnits[3].lessons,
      locked: true,
      unlockRequirement: { badges: ['fundamentals-master', 'stocks-master'] }
    }
  ]

  // Handle Island Selection
  const selectIsland = async (island: any) => {
    if (island.locked) {
      playSound('locked')
      // Show unlock requirements
      return
    }

    playSound('islandSelect')
    
    // Animate camera zoom
    await controls.start({
      scale: 1.2,
      transition: { duration: 0.5 }
    })

    setCurrentIsland(island)
    setGameMode('lessons')
    
    // Switch to island-specific music if available
    if (island.bgMusic) {
      startBgMusic(island.bgMusic)
    }
  }

  // Handle Lesson Completion
  const completeLesson = (lessonId: string | number, score: number) => {
    const xpEarned = Math.floor(score * 10)
    const coinsEarned = Math.floor(score * 2)
    
    // Update player stats
    setPlayerStats(prev => ({
      ...prev,
      xp: prev.xp + xpEarned,
      coins: prev.coins + coinsEarned,
      completedLessons: [...prev.completedLessons, lessonId],
      streak: prev.streak + 1
    }))

    // Play success animation
    playSound('levelUp')
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    })

    // Check for level up
    const newLevel = calculateLevel(playerStats.xp + xpEarned)
    if (newLevel > playerStats.level) {
      levelUp(newLevel)
    }

    // Check for island unlock based on completed lessons
    const completedCount = playerStats.completedLessons.length
    const newUnlockedIslands: string[] = []
    
    // Unlock unit-2 after 3 lessons
    if (completedCount >= 3 && !playerStats.unlockedIslands.includes('unit-2')) {
      newUnlockedIslands.push('unit-2')
    }
    
    // Unlock unit-3 at level 5
    if (playerStats.level >= 5 && !playerStats.unlockedIslands.includes('unit-3')) {
      newUnlockedIslands.push('unit-3')
    }
    
    // Unlock unit-4 after getting required badges
    const hasFundamentalsBadge = playerStats.badges.includes('fundamentals-master')
    const hasStocksBadge = playerStats.badges.includes('stocks-master')
    if (hasFundamentalsBadge && hasStocksBadge && !playerStats.unlockedIslands.includes('unit-4')) {
      newUnlockedIslands.push('unit-4')
    }
    
    // Update unlocked islands if any new ones were unlocked
    if (newUnlockedIslands.length > 0) {
      setPlayerStats(prev => ({
        ...prev,
        unlockedIslands: [...prev.unlockedIslands, ...newUnlockedIslands]
      }))
      // Play unlock sound for each new island
      newUnlockedIslands.forEach(() => playSound('unlock'))
    }
  }

  // Level Up Celebration
  const levelUp = (newLevel: number) => {
    playSound('levelUp')
    
    // Epic celebration
    const duration = 3000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now()
      if (timeLeft <= 0) return clearInterval(interval)

      const particleCount = 50 * (timeLeft / duration)
      confetti({
        ...defaults,
        particleCount,
        origin: { x: Math.random(), y: Math.random() - 0.2 }
      })
    }, 250)

    setPlayerStats(prev => ({ ...prev, level: newLevel }))
  }

  return (
    <Layout>
      {/* Money Animation Background */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          opacity: 0.3,
          filter: 'blur(1px)'
        }}
      >
        <Lottie 
          animationData={moneyAnimation}
          loop={true}
          autoplay={true}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
          </div>
      <div className="h-screen overflow-hidden relative z-10">
        <AnimatePresence mode="wait">
          {gameMode === 'map' && (
            <motion.div
              key="map"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full"
            >
              {/* 3D Island Map - Temporarily disabled (requires React 19) */}
              {/* TODO: Install compatible @react-three/fiber version or upgrade React */}
              <div className="flex items-center justify-center h-full relative">
                {/* Subtle overlay for better text readability over Spline */}
                <div className="absolute inset-0 bg-black/10 dark:bg-black/20"></div>
                <div className="text-white text-center relative z-10">
                  <h2 className="text-2xl font-bold mb-4 drop-shadow-lg">Island Map</h2>
                  <p className="text-white/90 drop-shadow-md">3D view temporarily disabled</p>
                  <div className="mt-8 grid grid-cols-2 gap-4">
                    {islands.map(island => (
                      <button
                        key={island.id}
                        onClick={() => selectIsland(island)}
                        disabled={!playerStats.unlockedIslands.includes(island.id)}
                        className={`p-4 rounded-lg backdrop-blur-md transition-all ${
                          playerStats.unlockedIslands.includes(island.id)
                            ? 'bg-white/90 text-black hover:bg-white shadow-lg'
                            : 'bg-gray-300/80 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        {island.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* HUD Overlay */}
              <div className="absolute top-0 left-0 right-0 p-4">
                <div className="flex justify-between items-start">
                  {/* Player Stats */}
                  <motion.div 
                    className="bg-white/90 backdrop-blur rounded-2xl p-4 shadow-lg"
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                  >
                    <div className="flex items-center gap-4">
                      {/* Level Badge */}
                      <div className="relative">
                        <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-xl">{playerStats.level}</span>
                        </div>
                        <div className="absolute -bottom-1 left-0 right-0 bg-black/80 text-white text-xs text-center rounded-full px-2 py-0.5">
                          Level
                        </div>
                          </div>

                      {/* Stats */}
                      <div className="space-y-1">
                        {/* XP Bar */}
                        <div className="flex items-center gap-2">
                          <div className="w-32 h-3 bg-gray-200 rounded-full overflow-hidden">
                            <motion.div 
                              className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                              initial={{ width: 0 }}
                              animate={{ width: `${(playerStats.xp % 1000) / 10}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium">{playerStats.xp % 1000}/1000 XP</span>
                        </div>

                        {/* Hearts - TODO: Replace with custom heart icons */}
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <motion.div
                              key={i}
                              initial={{ scale: 0 }}
                              animate={{ scale: i < playerStats.hearts ? 1 : 0.5 }}
                              className={`w-6 h-6 ${i < playerStats.hearts ? 'text-red-500' : 'text-gray-300'}`}
                            >
                              {/* TODO: Replace with <img src="/assets/icons/hearts/heart-full.svg" /> or Lottie */}
                              <div className="w-full h-full rounded-full bg-red-500" />
                            </motion.div>
                          ))}
                            </div>

                        {/* Coins - TODO: Replace with custom coin icon */}
                        <div className="flex items-center gap-1">
                          <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                            {/* TODO: Replace with <img src="/assets/icons/ui/coin.svg" /> or Lottie */}
                            <span className="text-xs font-bold text-yellow-900">$</span>
                          </div>
                          <span className="font-semibold">{playerStats.coins}</span>
                        </div>
                      </div>
                        </div>
                      </motion.div>

                  {/* Streak Counter */}
                  <motion.div
                    className="bg-white/90 backdrop-blur rounded-2xl p-4 shadow-lg"
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                  >
                    <div className="flex items-center gap-3">
                      <Lottie 
                        animationData={streakFireAnimation}
                        loop={true}
                        className="w-12 h-12"
                      />
                      <div>
                        <div className="text-2xl font-bold text-orange-500">{playerStats.streak}</div>
                        <div className="text-xs text-gray-600">Day Streak</div>
                </div>
              </div>
                  </motion.div>

                  {/* Power-ups */}
                  <motion.div
                    className="bg-white/90 backdrop-blur rounded-2xl p-4 shadow-lg"
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                  >
                    <div className="text-xs font-semibold mb-2 text-gray-600">Power-ups</div>
                    <div className="flex gap-2">
                      {Object.entries(playerStats.powerups).map(([key, count]) => (
                        <div key={key} className="relative">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                            {/* TODO: Replace with custom power-up icons from /assets/icons/powerups/ */}
                            {key === 'xpBoost' && <span className="text-white text-xs font-bold">⚡</span>}
                            {key === 'streakFreeze' && <span className="text-white text-xs font-bold">❄</span>}
                            {key === 'heartRefill' && <span className="text-white text-xs font-bold">❤</span>}
                  </div>
                          {count > 0 && (
                            <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                              {count}
                            </div>
                              )}
                            </div>
                      ))}
                    </div>
                  </motion.div>
                </div>
                    </div>

              {/* Bottom Navigation */}
              <motion.div
                className="absolute bottom-0 left-0 right-0 p-4"
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
              >
                <div className="bg-white/90 backdrop-blur rounded-2xl p-4 shadow-lg">
                  <div className="flex justify-around">
                    <button className="flex flex-col items-center gap-1 p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      {/* TODO: Replace with trophy icon from /assets/icons/achievements/trophy.svg */}
                      <div className="w-8 h-8 bg-yellow-500 rounded-full" />
                      <span className="text-xs">Achievements</span>
                    </button>
                    <button className="flex flex-col items-center gap-1 p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      {/* TODO: Replace with users icon from /assets/icons/ui/users.svg */}
                      <div className="w-8 h-8 bg-blue-500 rounded-full" />
                      <span className="text-xs">Leaderboard</span>
                    </button>
                    <button className="flex flex-col items-center gap-1 p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      {/* TODO: Replace with gift icon from /assets/icons/ui/gift.svg */}
                      <div className="w-8 h-8 bg-purple-500 rounded-full" />
                      <span className="text-xs">Daily Rewards</span>
                    </button>
                    <button className="flex flex-col items-center gap-1 p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      {/* TODO: Replace with shopping bag icon from /assets/icons/ui/shopping-bag.svg */}
                      <div className="w-8 h-8 bg-purple-500 rounded-full" />
                      <span className="text-xs">Shop</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {gameMode === 'lessons' && currentIsland && (
            <motion.div
              key="lessons"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="h-full flex flex-col items-center justify-center p-8"
            >
              <div className="max-w-4xl w-full">
                <button
                  onClick={() => setGameMode('map')}
                  className="mb-6 flex items-center gap-2 text-black dark:text-white hover:underline"
                >
                  {/* TODO: Replace with arrow icon from /assets/icons/ui/arrow-left.svg */}
                  <span>←</span>
                  Back to Islands
                </button>
                <h2 className="text-3xl font-bold text-black dark:text-white mb-2">{currentIsland.name}</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                  Select a lesson to begin learning
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(currentIsland.lessons || []).map((lesson: any, index: number) => (
                    <motion.button
                      key={lesson.id || index}
                      onClick={() => {
                        setCurrentLesson(lesson)
                        setGameMode('lesson')
                      }}
                      className="p-6 bg-white/90 dark:bg-black/90 backdrop-blur rounded-2xl shadow-lg text-left hover:shadow-xl transition-all border border-black/10 dark:border-white/10"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <h3 className="text-xl font-bold text-black dark:text-white mb-2">
                        Lesson {index + 1}: {lesson.title || lesson.name || `Lesson ${index + 1}`}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                        {lesson.description || lesson.content?.sections?.[0]?.title || 'Start learning'}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        {/* TODO: Replace with book icon from /assets/icons/ui/book.svg */}
                        <span>📚</span>
                        <span>{lesson.duration || '10 min'}</span>
                        {playerStats.completedLessons && playerStats.completedLessons.includes(lesson.id || index) && (
                          <span className="text-green-500 flex items-center gap-1">
                            <span>✓</span> Completed
                          </span>
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {gameMode === 'lesson' && currentLesson && (
            <LessonGame
              lesson={currentLesson}
              hearts={playerStats.hearts}
              onComplete={(score: number) => {
                completeLesson(currentLesson.id, score)
                // After completing lesson, offer quiz if practice questions exist
                if (currentLesson.content?.practiceQuestions && currentLesson.content.practiceQuestions.length > 0) {
                  // Small delay to show completion, then offer quiz
                  setTimeout(() => {
                    if (window.confirm('Great job! Would you like to take a quiz to test your knowledge?')) {
                      setGameMode('quiz')
                    } else {
                      setGameMode('lessons')
                    }
                  }, 1000)
                } else {
                  setGameMode('lessons')
                }
              }}
              onExit={() => setGameMode('lessons')}
            />
          )}

          {gameMode === 'quiz' && currentLesson && (
            <QuizBattle
              questions={(() => {
                // Get questions from the current lesson
                const questions = currentLesson?.content?.practiceQuestions || []
                if (import.meta.env.DEV) {
                  console.log('Quiz questions:', questions, 'from lesson:', currentLesson?.title)
                }
                return questions
              })()}
              onComplete={(score: number) => {
                completeLesson(`quiz-${currentLesson.id}`, score)
                setGameMode('lessons')
              }}
              playerStats={playerStats}
            />
          )}
        </AnimatePresence>

        {/* Achievement Popups */}
        {/* AchievementPopup will be shown when achievement is unlocked */}
      </div>
    </Layout>
  )
}

// 3D Island Component
// IslandModel component temporarily disabled (requires @react-three/fiber)
// TODO: Re-enable when React 19 is available or use compatible version
const IslandModel = ({ island, isLocked, onClick }: any) => {
  return (
    <div className="p-4">
      {/* Placeholder - will be replaced with 3D model */}
      <button
        onClick={onClick}
        disabled={isLocked}
        className={`p-4 rounded-lg ${
          isLocked ? 'bg-gray-300 text-gray-500' : 'bg-blue-500 text-white hover:bg-blue-600'
        }`}
      >
        {island.name}
        {/* TODO: Replace with lock icon from /assets/icons/ui/lock.svg */}
        {isLocked && <span className="ml-1">🔒</span>}
      </button>
    </div>
  )
}

export default EducationHub