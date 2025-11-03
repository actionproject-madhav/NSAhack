import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import authService from '../services/authService'
import apiService from '../services/apiService'

interface User {
  id: string
  email: string
  name: string
  picture?: string
  goal?: 'save' | 'grow' | 'learn' | 'options'
  language?: string
  lifestyle?: string[]
  visaStatus?: string
  homeCountry?: string
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
  refreshPortfolioPrices: () => Promise<void>
  isLoading: boolean
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
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for authenticated user on app start and load full profile from database
    const loadUserProfile = async () => {
      setIsLoading(true)
      const currentUser = authService.getCurrentUser()
      
      if (!currentUser) {
        setIsLoading(false)
        return
      }
      
      try {
        const userId = currentUser.id || currentUser.email
        
        if (!userId) {
          console.warn('No user ID or email found, using localStorage data')
          setUser({
            ...currentUser,
            portfolio: currentUser.portfolio || [],
            totalValue: currentUser.totalValue || 0
          })
          setIsLoading(false)
          return
        }

        console.log(' Loading user profile from database...')
        const dbUser = await apiService.getUserProfile(userId)
        
        if (dbUser) {
          // Map database fields to User interface
          let portfolio = dbUser.portfolio || []
          
          // Sync portfolio with real-time stock prices
          if (portfolio.length > 0) {
            console.log(' Syncing portfolio with real-time prices...')
            portfolio = await apiService.syncPortfolioWithRealPrices(portfolio)
          }
          
          const totalValue = apiService.calculatePortfolioValue(portfolio)
          
          const fullUser: User = {
            id: dbUser._id || userId,
            email: dbUser.email,
            name: dbUser.name,
            picture: dbUser.picture,
            goal: dbUser.investment_goal as User['goal'],
            language: dbUser.language || 'en',
            lifestyle: dbUser.lifestyle_brands || [],
            visaStatus: dbUser.visa_status,
            homeCountry: dbUser.home_country,
            portfolio: portfolio,
            totalValue: totalValue
          }
          
          setUser(fullUser)
          // Update localStorage with full profile
          localStorage.setItem('user', JSON.stringify(fullUser))
          console.log(' Loaded full user profile from database with real-time prices')
        } else {
          // Fallback to localStorage data if database fetch fails
          console.warn(' Could not load from database, using localStorage')
          setUser({
            ...currentUser,
            portfolio: currentUser.portfolio || [],
            totalValue: currentUser.totalValue || 0
          })
        }
      } catch (error) {
        console.error(' Error loading profile from database:', error)
        // Fallback to localStorage data
        setUser({
          ...currentUser,
          portfolio: currentUser.portfolio || [],
          totalValue: currentUser.totalValue || 0
        })
      } finally {
        setIsLoading(false)
      }
    }
    
    loadUserProfile()
    
    // Set up periodic refresh of portfolio prices (every 5 minutes)
    const refreshInterval = setInterval(() => {
      refreshPortfolioPrices()
    }, 5 * 60 * 1000)
    
    return () => clearInterval(refreshInterval)
  }, [])

  const updatePortfolio = async (item: PortfolioItem) => {
    if (!user) return
    
    const existingIndex = user.portfolio.findIndex(p => p.ticker === item.ticker)
    let newPortfolio = [...user.portfolio]
    
    if (existingIndex >= 0) {
      newPortfolio[existingIndex] = item
    } else {
      newPortfolio.push(item)
    }
    
    const totalValue = apiService.calculatePortfolioValue(newPortfolio)
    
    const updatedUser = {
      ...user,
      portfolio: newPortfolio,
      totalValue
    }
    
    setUser(updatedUser)
    
    // Sync to database
    try {
      await apiService.updatePortfolio(user.id, newPortfolio, totalValue)
      localStorage.setItem('user', JSON.stringify(updatedUser))
      console.log(' Portfolio updated in database')
    } catch (error) {
      console.error(' Error updating portfolio in database:', error)
    }
  }
  
  const refreshPortfolioPrices = async () => {
    if (!user || !user.portfolio || user.portfolio.length === 0) return
    
    try {
      console.log(' Refreshing portfolio prices...')
      const updatedPortfolio = await apiService.syncPortfolioWithRealPrices(user.portfolio)
      const totalValue = apiService.calculatePortfolioValue(updatedPortfolio)
      
      const updatedUser = {
        ...user,
        portfolio: updatedPortfolio,
        totalValue
      }
      
      setUser(updatedUser)
      localStorage.setItem('user', JSON.stringify(updatedUser))
      console.log(' Portfolio prices refreshed')
    } catch (error) {
      console.error(' Error refreshing portfolio prices:', error)
    }
  }

  return (
    <UserContext.Provider value={{ user, setUser, updatePortfolio, refreshPortfolioPrices, isLoading }}>
      {children}
    </UserContext.Provider>
  )
}