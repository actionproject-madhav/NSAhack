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
import { Lock, BookOpen } from 'lucide-react'
import Spline from '@splinetool/react-spline'
import IslandModelViewer from '../components/education/IslandModelViewer'

// Import Lottie animations
import xpBurstAnimation from '../assets/animations/xp-burst.json'
import streakFireAnimation from '../assets/animations/streak-fire.json'
import moneyAnimation from '../assets/animations/Money.json'
import financeAnimation from '../assets/animations/Finance.json'
import investingAnimation from '../assets/animations/investing.json'
import stocksAnimation from '../assets/animations/stocks.json'


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

  // Load progress from localStorage on mount and check for unlocks
  useEffect(() => {
    const savedProgress = localStorage.getItem('educationProgress')
    if (savedProgress) {
      try {
        const progress = JSON.parse(savedProgress)
        setPlayerStats(prev => {
          const loadedStats = { ...prev, ...progress }
          
          // Re-check island unlocks with loaded progress
          const checkUnlocks = (stats: typeof loadedStats) => {
            const newUnlockedIslands: string[] = []
            const completedCount = stats.completedLessons.length
            
            islands.forEach(island => {
              if (island.locked && !stats.unlockedIslands.includes(island.id)) {
                const req = island.unlockRequirement
                
                if (req?.completeLessons && completedCount >= req.completeLessons) {
                  newUnlockedIslands.push(island.id)
                }
                
                if (req?.level && stats.level >= req.level) {
                  newUnlockedIslands.push(island.id)
                }
                
                if (req?.badges && Array.isArray(req.badges)) {
                  const hasAllBadges = req.badges.every((badge: string) => stats.badges.includes(badge))
                  if (hasAllBadges) {
                    newUnlockedIslands.push(island.id)
                  }
                }
              }
            })
            
            return newUnlockedIslands
          }
          
          const newUnlocks = checkUnlocks(loadedStats)
          if (newUnlocks.length > 0) {
            return {
              ...loadedStats,
              unlockedIslands: [...loadedStats.unlockedIslands, ...newUnlocks]
            }
          }
          
          return loadedStats
        })
      } catch (e) {
        console.warn('Failed to load progress from localStorage:', e)
      }
    }
  }, [])

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('educationProgress', JSON.stringify({
      level: playerStats.level,
      xp: playerStats.xp,
      streak: playerStats.streak,
      hearts: playerStats.hearts,
      coins: playerStats.coins,
      badges: playerStats.badges,
      unlockedIslands: playerStats.unlockedIslands,
      completedLessons: playerStats.completedLessons,
      powerups: playerStats.powerups
    }))
  }, [playerStats])

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
      model: '/3d-models/island-tropical.glb',
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
      model: '/3d-models/island-volcano.glb',
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
      model: '/3d-models/island-ice.glb',
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
      model: '/3d-models/island-sky.glb',
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
      try {
        startBgMusic(island.bgMusic)
      } catch (e) {
        console.warn('Failed to play island music:', island.bgMusic, e)
        // Fallback to theme music
        startBgMusic('theme.mp3')
      }
    } else {
      startBgMusic('theme.mp3')
    }
  }

  // Handle Lesson Completion
  const completeLesson = (lessonId: string | number, score: number) => {
    const xpEarned = Math.floor(score * 10)
    const coinsEarned = Math.floor(score * 2)
    
    // Update player stats
    const newXP = playerStats.xp + xpEarned
    const newStats = {
      ...playerStats,
      xp: newXP,
      coins: playerStats.coins + coinsEarned,
      completedLessons: [...playerStats.completedLessons, lessonId],
      streak: playerStats.streak + 1
    }
    setPlayerStats(newStats)

    // Save progress immediately
    localStorage.setItem('educationProgress', JSON.stringify({
      level: newStats.level,
      xp: newStats.xp,
      streak: newStats.streak,
      hearts: newStats.hearts,
      coins: newStats.coins,
      badges: newStats.badges,
      unlockedIslands: newStats.unlockedIslands,
      completedLessons: newStats.completedLessons,
      powerups: newStats.powerups
    }))

    // Play celebration music and sound
    playSound('levelUp')
    // Play celebration music (use level_up sound as celebration)
    startBgMusic('theme.mp3') // Resume theme music after lesson
    
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    })

    // Check for level up
    const newLevel = calculateLevel(newXP)
    if (newLevel > playerStats.level) {
      levelUp(newLevel)
    }

    // Check for island unlock AFTER stats are updated
    // Use newStats instead of playerStats for accurate checking
    const checkIslandUnlocks = (stats: typeof newStats) => {
      const newUnlockedIslands: string[] = []
      const completedCount = stats.completedLessons.length
      
      // Check each island's unlock requirements
      islands.forEach(island => {
        if (island.locked && !stats.unlockedIslands.includes(island.id)) {
          const req = island.unlockRequirement
          
          // Check lesson completion requirement
          if (req?.completeLessons && completedCount >= req.completeLessons) {
            newUnlockedIslands.push(island.id)
          }
          
          // Check level requirement
          if (req?.level && stats.level >= req.level) {
            newUnlockedIslands.push(island.id)
          }
          
          // Check badge requirements
          if (req?.badges && Array.isArray(req.badges)) {
            const hasAllBadges = req.badges.every((badge: string) => stats.badges.includes(badge))
            if (hasAllBadges) {
              newUnlockedIslands.push(island.id)
            }
          }
        }
      })
      
      return newUnlockedIslands
    }
    
    // Check for unlocks with updated stats
    const newUnlockedIslands = checkIslandUnlocks(newStats)
    
    // Update unlocked islands if any new ones were unlocked
    if (newUnlockedIslands.length > 0) {
      const finalStats = {
        ...newStats,
        unlockedIslands: [...newStats.unlockedIslands, ...newUnlockedIslands]
      }
      setPlayerStats(finalStats)
      
      // Save progress with unlocked islands
      localStorage.setItem('educationProgress', JSON.stringify({
        level: finalStats.level,
        xp: finalStats.xp,
        streak: finalStats.streak,
        hearts: finalStats.hearts,
        coins: finalStats.coins,
        badges: finalStats.badges,
        unlockedIslands: finalStats.unlockedIslands,
        completedLessons: finalStats.completedLessons,
        powerups: finalStats.powerups
      }))
      
      // Play unlock sound and show notification
      newUnlockedIslands.forEach((islandId) => {
        playSound('unlock')
        const island = islands.find(i => i.id === islandId)
        if (island) {
          // Show unlock notification (can be replaced with a toast component)
          if (import.meta.env.DEV) {
            console.log(`New Island Unlocked: ${island.name}!`)
          }
        }
      })
    }
  }

  // Level Up Celebration
  const levelUp = (newLevel: number) => {
    playSound('levelUp')
    
    // Play celebration music (level up sound)
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

    const updatedStats = { ...playerStats, level: newLevel }
    setPlayerStats(updatedStats)
    
    // Save progress after level up
    localStorage.setItem('educationProgress', JSON.stringify({
      level: updatedStats.level,
      xp: updatedStats.xp,
      streak: updatedStats.streak,
      hearts: updatedStats.hearts,
      coins: updatedStats.coins,
      badges: updatedStats.badges,
      unlockedIslands: updatedStats.unlockedIslands,
      completedLessons: updatedStats.completedLessons,
      powerups: updatedStats.powerups
    }))
  }

  // Map island themes to animations
  const getIslandAnimation = (theme: string) => {
    const themeMap: Record<string, any> = {
      'tropical': moneyAnimation,      // Fundamentals - Money flow
      'volcanic': stocksAnimation,    // Stock Market - Stock charts
      'arctic': financeAnimation,     // Bonds - Financial stability
      'sky': investingAnimation       // ETFs - Investment growth
    }
    const animation = themeMap[theme] || moneyAnimation
    if (import.meta.env.DEV) {
      console.log(`🎬 Island animation for theme "${theme}":`, animation ? 'Loaded' : 'Missing')
    }
    return animation
  }

  // Get current island background based on theme
  const getIslandBackground = () => {
    if (!currentIsland) return moneyAnimation
    return getIslandAnimation(currentIsland.theme)
  }

  return (
    <Layout>
      {/* Island Theme Background - Only show when island is selected */}
      {currentIsland && (
        <div 
          className="fixed inset-0 z-0 pointer-events-none"
          style={{
            opacity: 0.25,
            filter: 'blur(2px)'
          }}
        >
          <Lottie 
            animationData={getIslandBackground()}
            loop={true}
            autoplay={true}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        </div>
      )}
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
              {/* Island Map with 3D Visualization */}
              <div className="flex items-center justify-center h-full relative p-8">
                {/* 3D Island Background using Spline - Subtle background */}
                <div className="absolute inset-0 z-0 opacity-20">
                  <Spline 
                    scene="https://prod.spline.design/f7MEBGBa8Fh0o30l/scene.splinecode"
                    style={{ width: '100%', height: '100%' }}
                  />
                </div>
                
                {/* Animated background layers for each unlocked island */}
                <div className="absolute inset-0 z-0 opacity-15 pointer-events-none">
                  {islands
                    .filter(i => playerStats.unlockedIslands.includes(i.id))
                    .map((island, idx) => (
                      <div 
                        key={island.id} 
                        className="absolute inset-0"
                        style={{
                          transform: `translate(${idx * 15}%, ${idx * 10}%) scale(0.8)`,
                          opacity: 0.2
                        }}
                      >
                        <Lottie 
                          animationData={getIslandAnimation(island.theme)}
                          loop={true}
                          autoplay={true}
                          style={{ width: '100%', height: '100%' }}
                        />
                      </div>
                    ))}
                </div>
                
                <div className="max-w-6xl w-full relative z-10">
                  <h2 className="text-4xl font-bold mb-8 text-center text-black dark:text-white drop-shadow-lg">
                    Choose Your Learning Island
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {islands.map((island, index) => {
                      const isUnlocked = playerStats.unlockedIslands.includes(island.id)
                      const isLocked = !isUnlocked
                      
                      return (
                        <motion.div
                          key={island.id}
                          initial={{ opacity: 0, y: 50 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="relative"
                        >
                          <motion.button
                            onClick={() => !isLocked && selectIsland(island)}
                            disabled={isLocked}
                            whileHover={!isLocked ? { scale: 1.05 } : {}}
                            whileTap={!isLocked ? { scale: 0.95 } : {}}
                            className={`w-full p-6 rounded-2xl backdrop-blur-lg transition-all relative overflow-hidden ${
                              isLocked
                                ? 'bg-gray-400/50 dark:bg-gray-700/50 cursor-not-allowed opacity-60'
                                : 'bg-white/90 dark:bg-black/90 shadow-xl hover:shadow-2xl border-2 border-transparent hover:border-blue-400'
                            }`}
                            style={{
                              background: isLocked 
                                ? undefined 
                                : `linear-gradient(135deg, ${island.color}20, ${island.color}10)`
                            }}
                          >
                            {/* Lock overlay */}
                            {isLocked && (
                              <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-2xl z-10">
                                <div className="text-center">
                                  <Lock className="w-8 h-8 mx-auto mb-2 text-white" />
                                  <div className="text-xs text-white font-semibold">
                                    {island.unlockRequirement?.completeLessons && 
                                      `Complete ${island.unlockRequirement.completeLessons} lessons`}
                                    {island.unlockRequirement?.level && 
                                      `Reach Level ${island.unlockRequirement.level}`}
                                    {island.unlockRequirement?.badges && 
                                      `Earn required badges`}
                                  </div>
                                </div>
                              </div>
                            )}
                            
                            {/* 3D Island Model Preview */}
                            <div 
                              className="w-32 h-32 mx-auto mb-4 rounded-lg overflow-hidden relative"
                              style={{ 
                                backgroundColor: island.color + '10',
                                minHeight: '128px',
                                minWidth: '128px'
                              }}
                            >
                              <IslandModelViewer
                                modelPath={island.model}
                                autoRotate={true}
                                scale={1}
                                className="w-full h-full"
                              />
                              {/* Subtle color tint overlay */}
                              <div 
                                className="absolute inset-0 opacity-10 pointer-events-none rounded-lg"
                                style={{ 
                                  backgroundColor: island.color,
                                  zIndex: 2
                                }}
                              />
                            </div>
                            
                            {/* Island Name */}
                            <h3 className="text-xl font-bold text-black dark:text-white mb-2">
                              {island.name}
                            </h3>
                            
                            {/* Lesson Count */}
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {island.lessons?.length || 0} Lessons
                            </p>
                            
                            {/* Progress indicator */}
                            {isUnlocked && (
                              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  {island.lessons?.filter((l: any) => 
                                    playerStats.completedLessons.includes(l.id)
                                  ).length || 0} / {island.lessons?.length || 0} completed
                                </div>
                              </div>
                            )}
                          </motion.button>
                        </motion.div>
                      )
                    })}
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
                        <BookOpen className="w-4 h-4" />
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
        {isLocked && <Lock className="w-4 h-4 inline ml-1" />}
      </button>
    </div>
  )
}

export default EducationHub