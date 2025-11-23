import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface XPState {
  totalXP: number
  level: number
  xpToNextLevel: number
  addXP: (amount: number) => { newLevel: number; totalXP: number }
  calculateLevel: (xp: number) => number
}

const useXPStore = create<XPState>()(
  persist(
    (set, get) => ({
      totalXP: 0,
      level: 1,
      xpToNextLevel: 1000,
      
      addXP: (amount: number) => {
      const newXP = get().totalXP + amount
      const newLevel = Math.floor(newXP / 1000) + 1
      
      set({
        totalXP: newXP,
        level: newLevel,
        xpToNextLevel: (newLevel * 1000) - newXP
      })
      
      return { newLevel, totalXP: newXP }
    },
    
    calculateLevel: (xp: number) => {
      return Math.floor(xp / 1000) + 1
    }
  }),
  { name: 'xp-storage' }
))

export default useXPStore