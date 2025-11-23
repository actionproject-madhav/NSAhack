import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback, useMemo } from 'react'
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

  const refreshUserData = useCallback(async () => {
    if (!user) return
    
    try {
      // Use email if available, otherwise use id
      // ALWAYS prefer email over ID for API calls
      const userId = user.email || user.id
      const apiUserId = user.email || userId
      if (!userId) {
        console.error('No user identifier available for refresh')
        return
      }
      
      console.log('Refreshing user data from trading API...')
      const portfolioData = await tradingService.getPortfolio(apiUserId)
      
      const updatedUser = {
        ...user,
        portfolio: portfolioData.portfolio || [],
        totalValue: portfolioData.portfolio_value || 0
      }
      
      setUser(updatedUser)
      localStorage.removeItem('user') // Clear old data first
      localStorage.setItem('user', JSON.stringify(updatedUser))
      console.log('User data refreshed:', portfolioData.portfolio.length, 'positions, $' + portfolioData.portfolio_value.toFixed(2))
    } catch (error) {
      console.error('Error refreshing user data:', error)
    }
  }, [user])

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
        // ALWAYS prefer email over ID for user lookup
        const userId = currentUser.email || currentUser.id
        
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
        // Try to get user profile - use email if available, otherwise try userId
        const lookupId = currentUser.email || userId
        const dbUser = await apiService.getUserProfile(lookupId)
        
        // ALWAYS load portfolio ONLY from trading API (never from database user profile)
        // This ensures only actual trades are shown, no mock data
        let portfolio = []
        let totalValue = 0
        
        // ALWAYS use email for API calls (most reliable identifier)
        // If dbUser exists, use its email, otherwise use currentUser.email, fallback to userId
        const apiUserId = dbUser?.email || currentUser.email || userId
        
        try {
          const portfolioData = await tradingService.getPortfolio(apiUserId)
          portfolio = portfolioData.portfolio || []
          totalValue = portfolioData.portfolio_value || 0
          console.log('✅ Loaded real portfolio from trading API:', portfolio.length, 'positions')
        } catch (error) {
          console.warn('⚠️ Trading API error, portfolio will be empty until trades are made:', error)
          // Keep empty - user has not made any trades yet
          portfolio = []
          totalValue = 0
        }
        
        if (dbUser) {
          // Build user object - portfolio ONLY from trading API, never from dbUser.portfolio
          // CRITICAL: Always ensure email is set (required for API calls)
          const userEmail = dbUser.email || currentUser.email || userId
          const fullUser: User = {
            id: dbUser._id || userId,
            email: userEmail, // ALWAYS set email (required for trading API)
            name: dbUser.name || currentUser.name,
            picture: dbUser.picture || currentUser.picture,
            goal: dbUser.investment_goal as User['goal'],
            language: dbUser.language || 'en',
            lifestyle: dbUser.lifestyle_brands || [],
            visaStatus: dbUser.visa_status,
            homeCountry: dbUser.home_country,
            portfolio: portfolio, // ONLY from trading API
            totalValue: totalValue // ONLY from trading API
          }
          
          setUser(fullUser)
          // Store in localStorage (but portfolio is always from trading API)
          localStorage.removeItem('user') // Clear old data first
          localStorage.setItem('user', JSON.stringify(fullUser))
          console.log('✅ User profile loaded - Portfolio:', portfolio.length, 'positions (from trading API only)')
        } else {
          // If dbUser is null, still set user with currentUser data (but empty portfolio)
          // CRITICAL: Always ensure email is set (required for API calls)
          const fallbackEmail = currentUser.email || userId
          if (!fallbackEmail) {
            console.error('❌ No email available for user! Cannot proceed.')
            setIsLoading(false)
            return
          }
          console.warn('⚠️ Could not load from database, using empty portfolio')
          setUser({
            ...currentUser,
            email: fallbackEmail, // ALWAYS set email (required for trading API)
            portfolio: [], // Empty - no mock data
            totalValue: 0
          })
        }
      } catch (error) {
        console.error('Error loading profile from database:', error)
        // CRITICAL: Always ensure email is set (required for API calls)
        const fallbackEmail = currentUser.email || currentUser.id
        if (!fallbackEmail) {
          console.error('❌ No email available for user! Cannot proceed.')
          setIsLoading(false)
          return
        }
        // No fallback - show empty portfolio if error
        setUser({
          ...currentUser,
          email: fallbackEmail, // ALWAYS set email (required for trading API)
          portfolio: [],
          totalValue: 0
        })
      } finally {
        setIsLoading(false)
      }
    }
    
    loadUserProfile()
  }, [])

  // Set up periodic refresh of portfolio (every 5 minutes - reduced frequency)
  useEffect(() => {
    if (!user) return
    
    const refreshInterval = setInterval(() => {
      refreshUserData()
    }, 5 * 60 * 1000) // 5 minutes instead of 2
    
    return () => clearInterval(refreshInterval)
  }, [user, refreshUserData])

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    user,
    setUser,
    refreshUserData,
    isLoading
  }), [user, refreshUserData, isLoading])

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  )
}