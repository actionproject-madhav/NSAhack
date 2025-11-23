import { useState, useCallback } from 'react'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useXPStore = create(persist(
  (set, get) => ({
    totalXP: 0,
    level: 1,
    xpToNextLevel: 1000,
    
    addXP: (amount) => {
      const newXP = get().totalXP + amount
      const newLevel = Math.floor(newXP / 1000) + 1
      
      set({
        totalXP: newXP,
        level: newLevel,
        xpToNextLevel: (newLevel * 1000) - newXP
      })
      
      return { newLevel, totalXP: newXP }
    }
  }),
  { name: 'xp-storage' }
))

export default useXPStore