import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface GameProgress {
  // Player Stats
  level: number
  xp: number
  totalXP: number
  coins: number
  hearts: number
  streak: number
  lastPlayedDate: string
  
  // Progress
  completedLessons: string[]
  unlockedIslands: string[]
  currentIsland: string | null
  badges: string[]
  achievements: string[]
  
  // Daily Stats
  dailyXP: number
  dailyLessons: number
  dailyGoals: {
    xp: number
    lessons: number
  }
  
  // Power-ups
  powerups: {
    xpBoost: number
    streakFreeze: number
    heartRefill: number
    hint: number
    timeFreeze: number
    shield: number
  }
  
  // Statistics
  perfectScores: number
  totalQuestions: number
  correctAnswers: number
  timeStudied: number // in minutes
  favoriteSubject: string
  
  // Actions
  addXP: (amount: number) => void
  completeLesson: (lessonId: string) => void
  unlockIsland: (islandId: string) => void
  addBadge: (badgeId: string) => void
  addAchievement: (achievementId: string) => void
  usePowerUp: (type: keyof GameProgress['powerups']) => void
  updateStreak: () => void
  resetDaily: () => void
}

const useGameProgressStore = create<GameProgress>()(
  persist(
    (set, get): GameProgress => ({
      // Initial State
      level: 1,
      xp: 0,
      totalXP: 0,
      coins: 100,
      hearts: 5,
      streak: 0,
      lastPlayedDate: new Date().toDateString(),
      completedLessons: [],
      unlockedIslands: ['unit-1'],
      currentIsland: null,
      badges: [],
      achievements: [],
      dailyXP: 0,
      dailyLessons: 0,
      dailyGoals: {
        xp: 100,
        lessons: 3
      },
      powerups: {
        xpBoost: 3,
        streakFreeze: 1,
        heartRefill: 2,
        hint: 5,
        timeFreeze: 3,
        shield: 2
      },
      perfectScores: 0,
      totalQuestions: 0,
      correctAnswers: 0,
      timeStudied: 0,
      favoriteSubject: '',

      // Actions
      addXP: (amount: number) => {
        const currentXP = get().xp
        const currentTotalXP = get().totalXP
        const newXP = currentXP + amount
        const newTotalXP = currentTotalXP + amount
        const newLevel = Math.floor(newTotalXP / 1000) + 1
        
        set({
          xp: newXP,
          totalXP: newTotalXP,
          level: newLevel,
          dailyXP: get().dailyXP + amount,
          coins: get().coins + Math.floor(amount / 10)
        })
      },

      completeLesson: (lessonId: string) => {
        const completedLessons = get().completedLessons
        if (!completedLessons.includes(lessonId)) {
          set({
            completedLessons: [...completedLessons, lessonId],
            dailyLessons: get().dailyLessons + 1
          })
        }
      },

      unlockIsland: (islandId: string) => {
        const unlockedIslands = get().unlockedIslands
        if (!unlockedIslands.includes(islandId)) {
          set({
            unlockedIslands: [...unlockedIslands, islandId]
          })
        }
      },

      addBadge: (badgeId: string) => {
        const badges = get().badges
        if (!badges.includes(badgeId)) {
          set({
            badges: [...badges, badgeId]
          })
        }
      },

      addAchievement: (achievementId: string) => {
        const achievements = get().achievements
        if (!achievements.includes(achievementId)) {
          set({
            achievements: [...achievements, achievementId]
          })
        }
      },

      usePowerUp: (type: keyof GameProgress['powerups']) => {
        const powerups = get().powerups
        if (powerups[type] > 0) {
          set({
            powerups: {
              ...powerups,
              [type]: powerups[type] - 1
            }
          })
        }
      },

      updateStreak: () => {
        const lastPlayed = get().lastPlayedDate
        const today = new Date().toDateString()
        const yesterday = new Date(Date.now() - 86400000).toDateString()
        
        if (lastPlayed === today) {
          // Already played today
          return
        } else if (lastPlayed === yesterday) {
          // Streak continues
          set({
            streak: get().streak + 1,
            lastPlayedDate: today
          })
        } else {
          // Streak broken
          set({
            streak: 1,
            lastPlayedDate: today
          })
        }
      },

      resetDaily: () => {
        set({
          dailyXP: 0,
          dailyLessons: 0,
          hearts: 5
        })
      }
    }),
    {
      name: 'game-progress-storage'
    }
  )
)

export default useGameProgressStore