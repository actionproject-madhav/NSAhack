import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const DuolingoIslandSystem = () => {
  const [currentView, setCurrentView] = useState('islands') // 'islands' or 'lessons'
  const [selectedIsland, setSelectedIsland] = useState(null)
  
  // Each island is a complete section with Duolingo-style lessons
  const islands = [
    {
      id: 'finance-basics',
      name: 'Finance Fundamentals',
      icon: '🏝️',
      theme: 'tropical',
      color: '#58CC02', // Duolingo green
      totalStars: 120, // Total stars available in this island
      sections: [
        {
          id: 'section-1',
          title: 'SECTION 1, UNIT 1',
          subtitle: 'Understanding Money',
          lessons: [
            {
              id: 'intro-1',
              type: 'lesson',
              title: 'What is Money?',
              stars: 3, // 0-3 stars like Duolingo
              crown: false, // Legendary crown
              xp: 10,
              icon: '💰',
              difficulty: 'easy'
            },
            {
              id: 'intro-2',
              type: 'lesson',
              title: 'Types of Currency',
              stars: 2,
              crown: false,
              xp: 15,
              icon: '💵',
              difficulty: 'easy'
            },
            {
              id: 'checkpoint-1',
              type: 'checkpoint',
              title: 'Unit Checkpoint',
              stars: 0,
              required: true,
              icon: '🏁'
            }
          ]
        },
        {
          id: 'section-2',
          title: 'SECTION 1, UNIT 2',
          subtitle: 'Saving Strategies',
          lessons: [
            {
              id: 'savings-1',
              type: 'lesson',
              title: 'Why Save Money?',
              stars: 1,
              crown: false,
              xp: 20,
              icon: '🏦',
              difficulty: 'medium'
            },
            // More lessons...
          ]
        }
      ]
    },
    {
      id: 'investing',
      name: 'Investment Island',
      icon: '🌋',
      theme: 'volcanic',
      color: '#FF4B4B',
      totalStars: 150,
      sections: [
        // Similar structure...
      ]
    },
    {
      id: 'crypto',
      name: 'Crypto Continent',
      icon: '❄️',
      theme: 'arctic',
      color: '#1CB0F6',
      totalStars: 180,
      sections: [
        // Similar structure...
      ]
    }
  ]

  return (
    <div className="duolingo-education-hub">
      {currentView === 'islands' ? (
        <IslandMapView
          islands={islands}
          onIslandSelect={(island) => {
            setSelectedIsland(island)
            setCurrentView('lessons')
          }}
        />
      ) : (
        <IslandLessonView
          island={selectedIsland}
          onBack={() => setCurrentView('islands')}
        />
      )}
    </div>
  )
}

// Main Island Map (3D or 2D styled)
const IslandMapView = ({ islands, onIslandSelect }) => {
  return (
    <div className="island-map-container">
      {/* Header with stats */}
      <div className="map-header">
        <div className="stats-bar">
          <div className="stat-item">
            <img src="/icons/star.svg" alt="Stars" />
            <span>245 / 450</span>
          </div>
          <div className="stat-item">
            <img src="/icons/crown.svg" alt="Crowns" />
            <span>12</span>
          </div>
          <div className="stat-item">
            <img src="/icons/streak.svg" alt="Streak" />
            <span>7 day streak</span>
          </div>
        </div>
      </div>

      {/* Islands Grid */}
      <div className="islands-grid">
        {islands.map((island, index) => (
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

// Individual Island Card
const IslandCard = ({ island, index, onClick }) => {
  const [progress, setProgress] = useState(0)
  const [earnedStars, setEarnedStars] = useState(45) // Example progress

  useEffect(() => {
    // Calculate progress based on completed lessons
    setProgress((earnedStars / island.totalStars) * 100)
  }, [earnedStars, island.totalStars])

  return (
    <motion.div
      className={`island-card ${island.theme}`}
      style={{
        background: `linear-gradient(135deg, ${island.color}22 0%, ${island.color}44 100%)`
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      {/* Island Visual */}
      <div className="island-visual">
        <div className="island-icon">{island.icon}</div>
        {index > 0 && progress === 0 && (
          <div className="lock-overlay">
            <span className="lock-icon">🔒</span>
          </div>
        )}
      </div>

      {/* Island Info */}
      <div className="island-info">
        <h3>{island.name}</h3>
        
        {/* Star Progress Bar */}
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
            ⭐ {earnedStars} / {island.totalStars}
          </span>
        </div>

        {/* Completion Badge */}
        {progress === 100 && (
          <div className="completion-badge">
            <span>🏆 MASTERED</span>
          </div>
        )}
      </div>

      {/* Enter Button */}
      <button className="enter-island-btn">
        {progress === 0 && index > 0 ? 'LOCKED' : 'ENTER'}
      </button>
    </motion.div>
  )
}

// Duolingo-Style Lesson Path for Selected Island
const IslandLessonView = ({ island, onBack }) => {
  const [currentSection, setCurrentSection] = useState(0)

  return (
    <div className={`lesson-path-view theme-${island.theme}`}>
      {/* Island Header */}
      <div className="island-header">
        <button onClick={onBack} className="back-btn">
          ← Back to Map
        </button>
        <div className="island-title">
          <span className="island-icon">{island.icon}</span>
          <h1>{island.name}</h1>
        </div>
        <button className="guidebook-btn">
          📖 Guidebook
        </button>
      </div>

      {/* Duolingo-Style Path */}
      <div className="lesson-path">
        {island.sections.map((section, sectionIndex) => (
          <div key={section.id} className="path-section">
            {/* Section Header */}
            <div className="section-header">
              <h2>{section.title}</h2>
              <p>{section.subtitle}</p>
            </div>

            {/* Lessons with Stars */}
            <div className="lessons-container">
              {section.lessons.map((lesson, lessonIndex) => (
                <LessonNodeWithStars
                  key={lesson.id}
                  lesson={lesson}
                  position={calculateZigzagPosition(lessonIndex)}
                  isUnlocked={checkUnlockStatus(sectionIndex, lessonIndex)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Individual Lesson Node with Star System
const LessonNodeWithStars = ({ lesson, position, isUnlocked }) => {
  const getStarDisplay = () => {
    if (lesson.type === 'checkpoint') {
      return <span className="checkpoint-icon">🏁</span>
    }
    
    // Duolingo star system
    const stars = []
    for (let i = 0; i < 3; i++) {
      if (i < lesson.stars) {
        stars.push(<span key={i} className="star filled">⭐</span>)
      } else {
        stars.push(<span key={i} className="star empty">☆</span>)
      }
    }
    
    // Add crown if legendary
    if (lesson.crown) {
      stars.push(<span key="crown" className="crown">👑</span>)
    }
    
    return <div className="stars-display">{stars}</div>
  }

  const getNodeColor = () => {
    if (!isUnlocked) return '#777777'
    if (lesson.stars === 0) return '#58CC02' // Green for available
    if (lesson.stars < 3) return '#FFC800' // Gold for in-progress
    if (lesson.crown) return '#CE82FF' // Purple for legendary
    return '#FFD700' // Full gold for completed
  }

  return (
    <motion.div
      className={`lesson-node ${lesson.type} ${!isUnlocked ? 'locked' : ''}`}
      style={{
        left: position.x,
        top: position.y,
        '--node-color': getNodeColor()
      }}
      whileHover={isUnlocked ? { scale: 1.1 } : {}}
      whileTap={isUnlocked ? { scale: 0.95 } : {}}
    >
      {/* Progress Ring */}
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

      {/* Lesson Button */}
      <button 
        className="lesson-btn"
        disabled={!isUnlocked}
        style={{ background: getNodeColor() }}
      >
        {!isUnlocked ? '🔒' : lesson.icon}
      </button>

      {/* Stars Display */}
      <div className="lesson-stars">
        {getStarDisplay()}
      </div>

      {/* Lesson Title (on hover) */}
      <div className="lesson-tooltip">
        <span>{lesson.title}</span>
        <span className="xp-reward">+{lesson.xp} XP</span>
      </div>

      {/* Start Label for first lesson */}
      {lesson.id.includes('intro-1') && (
        <div className="start-label">START</div>
      )}
    </motion.div>
  )
}

// Helper Functions
function calculateZigzagPosition(index) {
  const verticalSpacing = 140
  const horizontalOffset = 100
  const zigzag = index % 2 === 0 ? -1 : 1
  
  return {
    x: 250 + (zigzag * horizontalOffset),
    y: 100 + (index * verticalSpacing)
  }
}

function checkUnlockStatus(sectionIndex, lessonIndex) {
  // First section, first 3 lessons are always unlocked
  if (sectionIndex === 0 && lessonIndex < 3) return true
  // Add your unlock logic here
  return false
}

export default DuolingoIslandSystem