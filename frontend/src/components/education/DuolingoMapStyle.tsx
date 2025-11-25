import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'

// Duolingo exact colors from their CSS
const DUOLINGO_COLORS = {
  green: '#58CC02',
  darkGreen: '#58A700',
  lightGreen: '#89E219',
  gold: '#FFC800',
  blue: '#1CB0F6',
  purple: '#CE82FF',
  red: '#FF4B4B',
  orange: '#FF9600',
  yellow: '#FFC800',
  gray: '#E5E5E5',
  darkGray: '#777777',
  background: '#131F24', // Dark mode background
  cardBg: '#37464F',
  textPrimary: '#F7F7F7',
  textSecondary: '#AFAFAF'
}

// Type definitions
interface Lesson {
  id: string | number
  title: string
  [key: string]: any
}

interface Island {
  id: string
  name: string
  position?: number[]
  color?: string
  model?: string
  theme: string
  bgMusic?: string
  lessons: Lesson[]
  boss?: {
    name: string
    health: number
    rewards: { xp: number; coins: number; badge: string }
  }
  locked?: boolean
  unlockRequirement?: {
    completeLessons?: number
    level?: number
    badges?: string[]
    fromIsland?: string
  }
}

interface PlayerProgress {
  level: number
  xp: number
  streak: number
  hearts: number
  coins: number
  badges: string[]
  unlockedIslands: string[]
  completedLessons: (string | number)[]
  powerups?: {
    xpBoost: number
    streakFreeze: number
    heartRefill: number
  }
}

interface DuolingoStyleMapProps {
  islands: Island[]
  playerProgress: PlayerProgress
  onIslandSelect: (node: any) => void
}

const DuolingoStyleMap = ({ islands, playerProgress, onIslandSelect }: DuolingoStyleMapProps) => {
  const [selectedIsland, setSelectedIsland] = useState(null)
  const mapRef = useRef(null)

  // Convert islands to Duolingo-style path nodes
  const pathNodes = islands.flatMap((island, islandIndex) => 
    island.lessons.map((lesson, lessonIndex) => ({
      id: `${island.id}-${lesson.id}`,
      islandId: island.id,
      lesson,
      position: calculateNodePosition(islandIndex, lessonIndex),
      isLocked: !playerProgress.unlockedIslands.includes(island.id),
      isCompleted: playerProgress.completedLessons.includes(lesson.id),
      type: lessonIndex === island.lessons.length - 1 ? 'checkpoint' : 'lesson',
      theme: island.theme
    }))
  )

  function calculateNodePosition(islandIndex, lessonIndex) {
    // Zigzag pattern like Duolingo
    const verticalSpacing = 120
    const horizontalOffset = 150
    const zigzag = lessonIndex % 2 === 0 ? -1 : 1
    
    return {
      x: 200 + (zigzag * horizontalOffset * (lessonIndex % 3)),
      y: islandIndex * 500 + lessonIndex * verticalSpacing
    }
  }

  return (
    <div className="duolingo-map-container">
      {/* Background with gradient like Duolingo */}
      <div className="duo-background">
        <div className="duo-gradient-overlay" />
        <div className="duo-clouds">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="duo-cloud"
              style={{
                left: `${20 + i * 15}%`,
                top: `${10 + i * 20}%`,
                animationDelay: `${i * 2}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Path Container */}
      <div className="duo-path-container" ref={mapRef}>
        <svg className="duo-path-svg">
          {/* Draw connecting lines between nodes */}
          {pathNodes.slice(0, -1).map((node, index) => {
            const nextNode = pathNodes[index + 1]
            return (
              <motion.path
                key={`line-${index}`}
                d={`M ${node.position.x} ${node.position.y} Q ${
                  (node.position.x + nextNode.position.x) / 2
                } ${
                  (node.position.y + nextNode.position.y) / 2 + 30
                } ${nextNode.position.x} ${nextNode.position.y}`}
                stroke={node.isCompleted ? DUOLINGO_COLORS.gold : DUOLINGO_COLORS.gray}
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: index * 0.1 }}
              />
            )
          })}
        </svg>

        {/* Lesson Nodes */}
        {pathNodes.map((node, index) => (
          <DuolingoNode
            key={node.id}
            node={node}
            index={index}
            onClick={() => !node.isLocked && onIslandSelect(node)}
          />
        ))}

        {/* Island Markers */}
        {islands.map((island, index) => (
          <IslandMarker
            key={island.id}
            island={island}
            position={{ x: 50, y: index * 500 - 50 }}
            isUnlocked={playerProgress.unlockedIslands.includes(island.id)}
          />
        ))}
      </div>

      {/* Character (Mascot) */}
      <FinnyMascot position={getCurrentPosition(pathNodes, playerProgress)} />
    </div>
  )
}

interface PathNode {
  id: string
  islandId: string
  lesson: Lesson
  position: { x: number; y: number }
  isLocked: boolean
  isCompleted: boolean
  type: 'checkpoint' | 'lesson'
  theme: string
}

interface DuolingoNodeProps {
  node: PathNode
  index: number
  onClick: () => void
}

const DuolingoNode = ({ node, index, onClick }: DuolingoNodeProps) => {
  const [isHovered, setIsHovered] = useState(false)
  
  const getNodeStyle = () => {
    if (node.isLocked) {
      return {
        background: '#2E3C44',
        border: '4px solid #1F2937'
      }
    }
    if (node.isCompleted) {
      return {
        background: `linear-gradient(135deg, ${DUOLINGO_COLORS.gold} 0%, ${DUOLINGO_COLORS.yellow} 100%)`,
        border: '4px solid #FFB020'
      }
    }
    return {
      background: `linear-gradient(135deg, ${DUOLINGO_COLORS.green} 0%, ${DUOLINGO_COLORS.darkGreen} 100%)`,
      border: '4px solid #4CAF00'
    }
  }

  return (
    <motion.div
      className={`duo-node ${node.type} ${node.isLocked ? 'locked' : ''}`}
      style={{
        left: node.position.x,
        top: node.position.y,
        ...getNodeStyle()
      }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={!node.isLocked ? { scale: 1.1 } : {}}
      whileTap={!node.isLocked ? { scale: 0.95 } : {}}
    >
      {node.type === 'checkpoint' ? (
        <div className="checkpoint-flag">🏁</div>
      ) : (
        <div className="lesson-icon">
          {node.isLocked ? '🔒' : node.isCompleted ? '⭐' : getIslandIcon(node.theme)}
        </div>
      )}
      
      {/* Hover tooltip */}
      <AnimatePresence>
        {isHovered && !node.isLocked && (
          <motion.div
            className="duo-tooltip"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: -20 }}
            exit={{ opacity: 0 }}
          >
            {node.lesson.title}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

const IslandMarker = ({ island, position, isUnlocked }) => {
  return (
    <div 
      className="island-marker"
      style={{ left: position.x, top: position.y }}
    >
      <div className={`island-badge ${isUnlocked ? 'unlocked' : 'locked'}`}>
        <span className="island-icon">{getIslandIcon(island.theme)}</span>
        <h3>{island.name}</h3>
      </div>
    </div>
  )
}

function getIslandIcon(theme) {
  const icons = {
    tropical: '🏝️',
    volcanic: '🌋',
    arctic: '❄️',
    sky: '☁️',
    desert: '🏜️',
    forest: '🌲',
    ocean: '🌊'
  }
  return icons[theme] || '📚'
}

// Get the current position for the mascot based on player progress
function getCurrentPosition(pathNodes: any[], playerProgress: any): { x: number; y: number } {
  // Find the last completed lesson node (reverse iteration for compatibility)
  let lastCompletedIndex = -1
  for (let i = pathNodes.length - 1; i >= 0; i--) {
    if (pathNodes[i].isCompleted && !pathNodes[i].isLocked) {
      lastCompletedIndex = i
      break
    }
  }
  
  if (lastCompletedIndex >= 0 && lastCompletedIndex < pathNodes.length - 1) {
    // Position mascot at the next unlocked node after the last completed one
    const nextNode = pathNodes[lastCompletedIndex + 1]
    if (!nextNode.isLocked) {
      return nextNode.position
    }
    return pathNodes[lastCompletedIndex].position
  }
  
  // If no completed lessons, find the first unlocked node
  const firstUnlocked = pathNodes.find((node: any) => !node.isLocked)
  if (firstUnlocked) {
    return firstUnlocked.position
  }
  
  // Default to first node position
  return pathNodes[0]?.position || { x: 200, y: 0 }
}

// Mascot component to show player's current position
const FinnyMascot = ({ position }: { position: { x: number; y: number } }) => {
  if (!position) return null
  
  return (
    <motion.div
      className="finny-mascot"
      style={{
        position: 'absolute',
        left: position.x - 30,
        top: position.y - 30,
        zIndex: 100
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ 
        scale: 1, 
        opacity: 1,
        y: [0, -10, 0]
      }}
      transition={{
        scale: { duration: 0.3 },
        opacity: { duration: 0.3 },
        y: {
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }}
    >
      <div
        style={{
          width: 60,
          height: 60,
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${DUOLINGO_COLORS.blue} 0%, ${DUOLINGO_COLORS.purple} 100%)`,
          border: '4px solid white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '32px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          cursor: 'pointer'
        }}
      >
        🎓
      </div>
    </motion.div>
  )
}

export default DuolingoStyleMap