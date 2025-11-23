// pages/EducationHub.tsx
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useAnimation } from 'framer-motion'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Float, Text3D } from '@react-three/drei'
import Lottie from 'lottie-react'
import { Howl } from 'howler'
import confetti from 'canvas-confetti'
import Layout from '../components/Layout'
import { allUnits } from './Curriculumdata'
import IslandMap from '../components/education/IslandMap'
import LessonGame from '../components/education/LessonGame'
import QuizBattle from '../components/education/QuizBattle'
import ProgressTracker from '../components/education/ProgressTracker'
import AchievementPopup from '../components/education/AchievementPopup'
import useGameSound from '../hooks/useGameSound'
import useXPSystem from '../hooks/useXPSystem'

// Import Lottie animations (placeholder paths - you'll download these)
import islandUnlockAnimation from '../assets/animations/island-unlock.json'
import xpBurstAnimation from '../assets/animations/xp-burst.json'
import streakFireAnimation from '../assets/animations/streak-fire.json'

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
  const { playSound, toggleMusic } = useGameSound()
  const { addXP, calculateLevel } = useXPSystem()
  const controls = useAnimation()

  // Island Configuration
  const islands = [
    {
      id: 'unit-1',
      name: 'Fundamentals Island',
      position: [0, 0, 0],
      color: '#4ECDC4',
      model: '/models/island-tropical.glb',
      theme: 'tropical',
      bgMusic: 'tropical-adventure.mp3',
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
      bgMusic: 'volcanic-intensity.mp3',
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
      bgMusic: 'arctic-winds.mp3',
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
      bgMusic: 'sky-symphony.mp3',
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
    
    // Start island-specific music
    const music = new Howl({
      src: [`/sounds/music/${island.bgMusic}`],
      loop: true,
      volume: 0.3
    })
    music.play()
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
      <div className="h-screen overflow-hidden relative">
        <AnimatePresence mode="wait">
          {gameMode === 'map' && (
            <motion.div
              key="map"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full"
            >
              {/* 3D Island Map */}
              <Canvas camera={{ position: [0, 10, 20], fov: 60 }}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} />
                <OrbitControls 
                  enablePan={false}
                  maxDistance={30}
                  minDistance={10}
                />
                
                {/* Sky Background */}
                <mesh position={[0, 0, -50]}>
                  <planeGeometry args={[200, 100]} />
                  <meshBasicMaterial color="#87CEEB" />
                </mesh>

                {/* Render Islands */}
                {islands.map(island => (
                  <IslandModel
                    key={island.id}
                    island={island}
                    isLocked={!playerStats.unlockedIslands.includes(island.id)}
                    onClick={() => selectIsland(island)}
                  />
                ))}

                {/* Animated Clouds */}
                <Float speed={2} rotationIntensity={0.1} floatIntensity={2}>
                  <mesh position={[10, 5, -5]}>
                    <sphereGeometry args={[2, 8, 6]} />
                    <meshStandardMaterial color="white" opacity={0.8} transparent />
                  </mesh>
                </Float>
              </Canvas>

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
                              ❤️
                            </motion.div>
                          ))}
                        </div>

                        {/* Coins */}
                        <div className="flex items-center gap-1">
                          <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold">₹</span>
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
                            {key === 'xpBoost' && '2x'}
                            {key === 'streakFreeze' && '❄️'}
                            {key === 'heartRefill' && '💖'}
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
                      <div className="w-8 h-8">🏆</div>
                      <span className="text-xs">Achievements</span>
                    </button>
                    <button className="flex flex-col items-center gap-1 p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <div className="w-8 h-8">👥</div>
                      <span className="text-xs">Leaderboard</span>
                    </button>
                    <button className="flex flex-col items-center gap-1 p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <div className="w-8 h-8">🎁</div>
                      <span className="text-xs">Daily Rewards</span>
                    </button>
                    <button className="flex flex-col items-center gap-1 p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <div className="w-8 h-8">🛍️</div>
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
            />
          )}
        </AnimatePresence>

        {/* Achievement Popups */}
        <AchievementPopup />
      </div>
    </Layout>
  )
}

// 3D Island Component
const IslandModel = ({ island, isLocked, onClick }) => {
  const meshRef = useRef()
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.001
    }
  })

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <group position={island.position}>
        <mesh
          ref={meshRef}
          onClick={onClick}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <boxGeometry args={[3, 1, 3]} />
          <meshStandardMaterial 
            color={isLocked ? '#666' : island.color} 
            metalness={0.3}
            roughness={0.7}
          />
        </mesh>
        
        {/* Island Name */}
        <Text3D
          position={[0, 2, 0]}
          fontSize={0.3}
          color={isLocked ? '#999' : '#fff'}
        >
          {island.name}
        </Text3D>

        {/* Lock Icon */}
        {isLocked && (
          <mesh position={[0, 0.5, 0]}>
            <boxGeometry args={[0.5, 0.7, 0.1]} />
            <meshStandardMaterial color="#444" />
          </mesh>
        )}

        {/* Hover Effect */}
        {hovered && !isLocked && (
          <mesh position={[0, -0.5, 0]}>
            <ringGeometry args={[2, 2.5, 32]} />
            <meshBasicMaterial color={island.color} opacity={0.5} transparent />
          </mesh>
        )}
      </group>
    </Float>
  )
}

export default EducationHub