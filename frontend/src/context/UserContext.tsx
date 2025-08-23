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
    // Check for authenticated user on app start
    const currentUser = authService.getCurrentUser()
    if (currentUser) {
      setUser({
        ...currentUser,
        portfolio: [],
        totalValue: 0
      })
    }
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