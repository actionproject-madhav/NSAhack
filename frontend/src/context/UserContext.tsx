import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import authService from '../services/authService'

interface User {
  id: string
  email: string
  name: string
  picture?: string
  goal?: 'save' | 'grow' | 'learn' | 'options'
  language?: string
  lifestyle?: string[]
  portfolio: PortfolioItem[]
  totalValue: number
}

interface PortfolioItem {
  ticker: string
  company: string
  quantity: number
  avgPrice: number
  currentPrice: number
  reason: string
  logo: string
}

interface UserContextType {
  user: User | null
  setUser: (user: User | null) => void
  updatePortfolio: (item: PortfolioItem) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const useUser = () => {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // Check for authenticated user on app start and load full profile
    const loadUserProfile = async () => {
      const currentUser = authService.getCurrentUser()
      if (currentUser) {
        // Try to load full profile from database
        try {
          const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'
          const userId = currentUser.id || currentUser.email
          
          if (!userId) {
            console.warn('No user ID or email found, using localStorage data')
            setUser({
              ...currentUser,
              portfolio: currentUser.portfolio || [],
              totalValue: currentUser.totalValue || 0
            })
            return
          }

          const response = await fetch(`${API_BASE_URL}/auth/user/${userId}`, {
            credentials: 'include'
          })
          
          if (response.ok) {
            const data = await response.json()
            if (data.user) {
              // Map database fields to User interface
              const fullUser: User = {
                id: data.user._id || currentUser.id,
                email: data.user.email,
                name: data.user.name,
                picture: data.user.picture,
                goal: data.user.investment_goal,
                language: data.user.language || 'en',
                lifestyle: data.user.lifestyle_brands || [],
                portfolio: data.user.portfolio || [],
                totalValue: data.user.total_value || 0
              }
              setUser(fullUser)
              // Update localStorage with full profile
              localStorage.setItem('user', JSON.stringify(fullUser))
              console.log('✅ Loaded full user profile from database')
              return
            }
          }
        } catch (error) {
          console.error('Error loading profile from database:', error)
        }
        
        // Fallback to localStorage data if database fetch fails
        setUser({
          ...currentUser,
          portfolio: currentUser.portfolio || [],
          totalValue: currentUser.totalValue || 0
        })
      }
    }
    
    loadUserProfile()
  }, [])

  const updatePortfolio = (item: PortfolioItem) => {
    if (!user) return
    
    const existingIndex = user.portfolio.findIndex(p => p.ticker === item.ticker)
    let newPortfolio = [...user.portfolio]
    
    if (existingIndex >= 0) {
      newPortfolio[existingIndex] = item
    } else {
      newPortfolio.push(item)
    }
    
    const totalValue = newPortfolio.reduce((sum, item) => 
      sum + (item.quantity * item.currentPrice), 0
    )
    
    setUser({
      ...user,
      portfolio: newPortfolio,
      totalValue
    })
  }

  return (
    <UserContext.Provider value={{ user, setUser, updatePortfolio }}>
      {children}
    </UserContext.Provider>
  )
}