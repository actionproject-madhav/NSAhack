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
import { Heart, Coins, Trophy, Users, Gift, Snowflake, Zap, ShoppingBag, Lock } from 'lucide-react'

// Import Lottie animations
import xpBurstAnimation from '../assets/animations/xp-burst.json'
import streakFireAnimation from '../assets/animations/streak-fire.json'
import moneyAnimation from '../assets/animations/Money.json'


const EducationHub = () => {
  // Game State
  const [currentIsland, setCurrentIsland] = useState(null)
  const [currentLesson, setCurrentLesson] = useState(null)
  const [gameMode, setGameMode] = useState('map') // 'map', 'lesson', 'quiz', 'battle'
  const [playerStats, setPlayerStats] = useState({
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
  const selectIsland = async (island) => {
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
    
    // Keep theme.mp3 playing (no need to switch to island-specific music)
    // Theme music continues playing throughout the experience
  }

  // Handle Lesson Completion
  const completeLesson = (lessonId, score) => {
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
    playSound('levelComplete')
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

    // Check for island unlock
    checkIslandUnlocks()
  }

  // Level Up Celebration
  const levelUp = (newLevel) => {
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

                        {/* Hearts */}
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <motion.div
                              key={i}
                              initial={{ scale: 0 }}
                              animate={{ scale: i < playerStats.hearts ? 1 : 0.5 }}
                              className={`w-6 h-6 ${i < playerStats.hearts ? 'text-red-500' : 'text-gray-300'}`}
                            >
                              <Heart className="w-full h-full fill-current" />
                            </motion.div>
                          ))}
                            </div>

                        {/* Coins */}
                        <div className="flex items-center gap-1">
                          <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                            <Coins className="w-4 h-4 text-yellow-900" />
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
                            {key === 'xpBoost' && <Zap className="w-6 h-6 text-white" />}
                            {key === 'streakFreeze' && <Snowflake className="w-6 h-6 text-white" />}
                            {key === 'heartRefill' && <Heart className="w-6 h-6 text-white fill-white" />}
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
                      <Trophy className="w-8 h-8 text-yellow-500" />
                      <span className="text-xs">Achievements</span>
                    </button>
                    <button className="flex flex-col items-center gap-1 p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <Users className="w-8 h-8 text-blue-500" />
                      <span className="text-xs">Leaderboard</span>
                    </button>
                    <button className="flex flex-col items-center gap-1 p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <Gift className="w-8 h-8 text-purple-500" />
                      <span className="text-xs">Daily Rewards</span>
                    </button>
                    <button className="flex flex-col items-center gap-1 p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <ShoppingBag className="w-8 h-8 text-purple-500" />
                      <span className="text-xs">Shop</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {gameMode === 'lesson' && currentLesson && (
            <LessonGame
              lesson={currentLesson}
              hearts={playerStats.hearts}
              onComplete={(score) => completeLesson(currentLesson.id, score)}
              onExit={() => setGameMode('map')}
            />
          )}

          {gameMode === 'quiz' && (
            <QuizBattle
              questions={currentIsland?.lessons[0]?.content.practiceQuestions || []}
              onComplete={(score) => {
                completeLesson('quiz', score)
                setGameMode('map')
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
        {isLocked && <Lock className="w-4 h-4 inline ml-1" />}
      </button>
    </div>
  )
}

export default EducationHub