import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Lock, 
  Star, 
  Trophy, 
  ChevronLeft,
  BookOpen,
  Map,
  Target,
  TrendingUp,
  Coins,
  Snowflake,
  Cloud
} from 'lucide-react'

interface Lesson {
  id: string
  type: 'lesson' | 'practice' | 'checkpoint' | 'boss'
  title: string
  stars: number // 0-3 stars earned
  maxStars: 3
  locked: boolean
  xp: number
  icon?: React.ElementType
}

interface Unit {
  id: string
  name: string
  description: string
  lessons: Lesson[]
}

interface Island {
  id: string
  name: string
  theme: 'tropical' | 'volcanic' | 'arctic' | 'sky'
  color: string
  totalStars: number
  earnedStars: number
  units: Unit[]
  locked: boolean
}

interface PlayerProgress {
  completedLessons: string[]
  unlockedIslands: string[]
  totalStars: number
  currentIsland?: string
}

interface DuolingoIslandMapProps {
  playerProgress: PlayerProgress
  onLessonSelect: (lesson: any) => void
}

const DuolingoIslandMap = ({ playerProgress, onLessonSelect }: DuolingoIslandMapProps) => {
  const [viewMode, setViewMode] = useState<'islands' | 'path'>('islands')
  const [selectedIsland, setSelectedIsland] = useState<Island | null>(null)

  // Islands data with proper structure
  const islands: Island[] = [
    {
      id: 'finance-basics',
      name: 'Finance Fundamentals',
      theme: 'tropical',
      color: '#58CC02',
      totalStars: 45,
      earnedStars: playerProgress.completedLessons.filter(id => id.startsWith('finance')).length * 3,
      locked: false,
      units: [
        {
          id: 'unit-1',
          name: 'Unit 1',
          description: 'Understanding Money',
          lessons: [
            { 
              id: 'finance-1-1', 
              type: 'lesson', 
              title: 'What is Money?',
              stars: playerProgress.completedLessons.includes('finance-1-1') ? 3 : 0,
              maxStars: 3,
              locked: false,
              xp: 10,
              icon: Coins
            },
            { 
              id: 'finance-1-2', 
              type: 'lesson', 
              title: 'Types of Currency',
              stars: playerProgress.completedLessons.includes('finance-1-2') ? 3 : 0,
              maxStars: 3,
              locked: !playerProgress.completedLessons.includes('finance-1-1'),
              xp: 15,
              icon: TrendingUp
            },
            { 
              id: 'finance-1-checkpoint', 
              type: 'checkpoint', 
              title: 'Unit Checkpoint',
              stars: playerProgress.completedLessons.includes('finance-1-checkpoint') ? 3 : 0,
              maxStars: 3,
              locked: !playerProgress.completedLessons.includes('finance-1-2'),
              xp: 25,
              icon: Trophy
            }
          ]
        },
        {
          id: 'unit-2',
          name: 'Unit 2',
          description: 'Budgeting Basics',
          lessons: [
            { 
              id: 'finance-2-1', 
              type: 'lesson', 
              title: 'Creating a Budget',
              stars: 0,
              maxStars: 3,
              locked: !playerProgress.completedLessons.includes('finance-1-checkpoint'),
              xp: 20,
              icon: Target
            }
          ]
        }
      ]
    },
    {
      id: 'investing',
      name: 'Investment Island',
      theme: 'volcanic',
      color: '#FF4B4B',
      totalStars: 60,
      earnedStars: 0,
      locked: !playerProgress.unlockedIslands.includes('investing'),
      units: []
    },
    {
      id: 'crypto',
      name: 'Crypto Continent',
      theme: 'arctic',
      color: '#1CB0F6',
      totalStars: 75,
      earnedStars: 0,
      locked: !playerProgress.unlockedIslands.includes('crypto'),
      units: []
    }
  ]

  const handleIslandSelect = (island: Island) => {
    if (!island.locked) {
      setSelectedIsland(island)
      setViewMode('path')
    }
  }

  return (
    <div className="duolingo-education-hub">
      <AnimatePresence mode="wait">
        {viewMode === 'islands' ? (
          <IslandOverview
            islands={islands}
            onIslandSelect={handleIslandSelect}
            playerProgress={playerProgress}
          />
        ) : (
          <IslandPath
            island={selectedIsland!}
            onBack={() => setViewMode('islands')}
            onLessonSelect={onLessonSelect}
            playerProgress={playerProgress}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

// Island Overview Component
const IslandOverview = ({ islands, onIslandSelect, playerProgress }: any) => {
  return (
    <div className="island-map-container">
      <div className="map-header">
        <div className="stats-bar">
          <div className="stat-item">
            <Star className="w-6 h-6 text-yellow-500" />
            <span>{playerProgress.totalStars || 0} Stars</span>
          </div>
          <div className="stat-item">
            <Trophy className="w-6 h-6 text-gold" />
            <span>Level {Math.floor((playerProgress.totalStars || 0) / 10)}</span>
          </div>
        </div>
      </div>

      <div className="islands-grid">
        {islands.map((island: Island, index: number) => (
          <IslandCard
            key={island.id}
            island={island}
            index={index}
            onClick={() => onIslandSelect(island)}
          />
        ))}
      </div>
    </div>
  )
}

// Island Card Component
const IslandCard = ({ island, index, onClick }: any) => {
  const getIslandIcon = () => {
    switch(island.theme) {
      case 'tropical': return <Map className="w-16 h-16 text-green-500" />
      case 'volcanic': return <Target className="w-16 h-16 text-red-500" />
      case 'arctic': return <Snowflake className="w-16 h-16 text-blue-400" />
      case 'sky': return <Cloud className="w-16 h-16 text-purple-400" />
      default: return <Map className="w-16 h-16" />
    }
  }

  const progress = island.totalStars > 0 ? (island.earnedStars / island.totalStars) * 100 : 0

  return (
    <motion.div
      className={`island-card ${island.theme} ${island.locked ? 'locked' : ''}`}
      whileHover={!island.locked ? { scale: 1.05 } : {}}
      whileTap={!island.locked ? { scale: 0.98 } : {}}
      onClick={onClick}
    >
      <div className="island-visual">
        {island.locked ? (
          <Lock className="w-16 h-16 text-gray-500" />
        ) : (
          getIslandIcon()
        )}
      </div>

      <div className="island-info">
        <h3>{island.name}</h3>
        
        {!island.locked && (
          <div className="star-progress">
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ 
                  width: `${progress}%`,
                  background: island.color 
                }}
              />
            </div>
            <span className="star-count">
              <Star className="w-4 h-4 inline" /> {island.earnedStars} / {island.totalStars}
            </span>
          </div>
        )}

        {progress === 100 && (
          <div className="completion-badge">
            <Trophy className="w-4 h-4 inline mr-1" />
            <span>MASTERED</span>
          </div>
        )}
      </div>

      <button className="enter-island-btn" disabled={island.locked}>
        {island.locked ? 'LOCKED' : 'ENTER'}
      </button>
    </motion.div>
  )
}

// Island Path View (Duolingo-style lessons)
const IslandPath = ({ island, onBack, onLessonSelect, playerProgress }: any) => {
  const calculatePosition = (unitIndex: number, lessonIndex: number) => {
    const baseY = unitIndex * 400 + lessonIndex * 120
    const zigzag = lessonIndex % 2 === 0 ? -100 : 100
    return { x: 250 + zigzag, y: baseY }
  }

  return (
    <div className={`lesson-path-view theme-${island.theme}`}>
      <div className="island-header">
        <button onClick={onBack} className="back-btn">
          <ChevronLeft className="w-5 h-5 inline mr-1" />
          Back to Islands
        </button>
        <div className="island-title">
          <h1>{island.name}</h1>
        </div>
        <button className="guidebook-btn">
          <BookOpen className="w-5 h-5 inline mr-1" />
          Guidebook
        </button>
      </div>

      <div className="lesson-path">
        {island.units.map((unit: Unit, unitIndex: number) => (
          <div key={unit.id} className="path-section">
            <div className="section-header">
              <h2>{unit.name}</h2>
              <p>{unit.description}</p>
            </div>

            <div className="lessons-container">
              {unit.lessons.map((lesson: Lesson, lessonIndex: number) => (
                <LessonNode
                  key={lesson.id}
                  lesson={lesson}
                  position={calculatePosition(unitIndex, lessonIndex)}
                  onClick={() => !lesson.locked && onLessonSelect(lesson)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Lesson Node Component
const LessonNode = ({ lesson, position, onClick }: any) => {
  const IconComponent = lesson.icon || Star

  const getNodeColor = () => {
    if (lesson.locked) return '#777777'
    if (lesson.stars === 0) return '#58CC02'
    if (lesson.stars < 3) return '#FFC800'
    return '#FFD700'
  }

  return (
    <motion.div
      className={`lesson-node ${lesson.type} ${lesson.locked ? 'locked' : ''}`}
      style={{
        left: position.x,
        top: position.y,
        '--node-color': getNodeColor()
      }}
      whileHover={!lesson.locked ? { scale: 1.1 } : {}}
      whileTap={!lesson.locked ? { scale: 0.95 } : {}}
      onClick={onClick}
    >
      <svg className="progress-ring" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke={getNodeColor()}
          strokeWidth="8"
          fill="none"
          strokeDasharray={`${(lesson.stars / 3) * 283} 283`}
        />
      </svg>

      <button 
        className="lesson-btn"
        disabled={lesson.locked}
        style={{ borderColor: getNodeColor() }}
      >
        {lesson.locked ? (
          <Lock className="w-8 h-8" />
        ) : (
          <IconComponent className="w-8 h-8" />
        )}
      </button>

      <div className="lesson-stars">
        <div className="stars-display">
          {[...Array(3)].map((_, i) => (
            <Star 
              key={i} 
              className={`star w-4 h-4 ${i < lesson.stars ? 'filled' : 'empty'}`}
              fill={i < lesson.stars ? '#FFD700' : 'none'}
            />
          ))}
        </div>
      </div>

      <div className="lesson-tooltip">
        <span>{lesson.title}</span>
        <span className="xp-reward">+{lesson.xp} XP</span>
      </div>
    </motion.div>
  )
}

export default DuolingoIslandMap