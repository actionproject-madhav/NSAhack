import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import authService from '../services/authService'
import apiService from '../services/apiService'
import tradingService from '../services/tradingService'

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
  refreshUserData: () => Promise<void>
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
          console.warn('No user ID or email found')
          setUser({
            ...currentUser,
            portfolio: [],
            totalValue: 0
          })
          setIsLoading(false)
          return
        }

        console.log('Loading user profile from database...')
        const dbUser = await apiService.getUserProfile(userId)
        
        if (dbUser) {
          // ONLY load portfolio from trading API (real purchases only)
          let portfolio = []
          let totalValue = 0
          
          try {
            const portfolioData = await tradingService.getPortfolio(userId)
            portfolio = portfolioData.portfolio || []
            totalValue = portfolioData.portfolio_value || 0
            console.log('Loaded real portfolio from trading API:', portfolio.length, 'positions')
          } catch (error) {
            console.warn('Trading API error, portfolio will be empty until trades are made')
            // Keep empty - user has not made any trades yet
            portfolio = []
            totalValue = 0
          }
          
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
          // Store in localStorage for quick access
          localStorage.setItem('user', JSON.stringify(fullUser))
          console.log('User profile loaded - Portfolio:', portfolio.length, 'positions')
        } else {
          console.warn('Could not load from database')
          setUser({
            ...currentUser,
            portfolio: [],
            totalValue: 0
          })
        }
      } catch (error) {
        console.error('Error loading profile from database:', error)
        // No fallback - show empty portfolio if error
        setUser({
          ...currentUser,
          portfolio: [],
          totalValue: 0
        })
      } finally {
        setIsLoading(false)
      }
    }
    
    loadUserProfile()
    
    // Set up periodic refresh of portfolio (every 2 minutes)
    const refreshInterval = setInterval(() => {
      if (user) {
        refreshUserData()
      }
    }, 2 * 60 * 1000)
    
    return () => clearInterval(refreshInterval)
  }, [])

  const refreshUserData = async () => {
    if (!user) return
    
    try {
      console.log('Refreshing user data from trading API...')
      const portfolioData = await tradingService.getPortfolio(user.id)
      
      const updatedUser = {
        ...user,
        portfolio: portfolioData.portfolio || [],
        totalValue: portfolioData.portfolio_value || 0
      }
      
      setUser(updatedUser)
      localStorage.setItem('user', JSON.stringify(updatedUser))
      console.log('User data refreshed:', portfolioData.portfolio.length, 'positions, $' + portfolioData.portfolio_value.toFixed(2))
    } catch (error) {
      console.error('Error refreshing user data:', error)
    }
  }

  return (
    <UserContext.Provider value={{ user, setUser, refreshUserData, isLoading }}>
      {children}
    </UserContext.Provider>
  )
}