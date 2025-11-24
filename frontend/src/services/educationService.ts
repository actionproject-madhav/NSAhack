import apiService from './apiService'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

export interface EducationProgress {
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
}

class EducationService {
  /**
   * Get user's education progress from backend
   * Returns default progress if user not found or error occurs
   */
  async getProgress(userId: string): Promise<EducationProgress> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/education/progress?user_id=${encodeURIComponent(userId)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch education progress: ${response.statusText}`)
      }

      const data = await response.json()
      
      if (data.success && data.progress) {
        return data.progress
      }

      // Return default progress if no data
      return this.getDefaultProgress()
    } catch (error) {
      console.warn('⚠️ Failed to load education progress from backend, using defaults:', error)
      return this.getDefaultProgress()
    }
  }

  /**
   * Save user's education progress to backend
   * Non-blocking - doesn't throw errors, just logs warnings
   */
  async saveProgress(userId: string, progress: EducationProgress): Promise<void> {
    try {
      // Use AbortController for timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout

      const response = await fetch(`${API_BASE_URL}/api/education/progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          ...progress
        }),
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`Failed to save education progress: ${response.statusText}`)
      }

      const data = await response.json()
      if (data.success) {
        if (import.meta.env.DEV) {
          console.log('✅ Education progress saved to backend')
        }
      }
    } catch (error: any) {
      // Non-blocking - just log warning, don't throw
      if (error.name !== 'AbortError') {
        console.warn('⚠️ Failed to save education progress to backend (non-critical):', error.message)
      } else {
        console.warn('⚠️ Education progress save timed out (non-critical)')
      }
    }
  }

  /**
   * Get default progress structure
   */
  getDefaultProgress(): EducationProgress {
    return {
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
    }
  }
}

const educationService = new EducationService()
export default educationService

