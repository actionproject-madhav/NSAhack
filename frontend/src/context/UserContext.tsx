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
  cashBalance?: number
  totalAccountValue?: number
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
        return
      }
      
      const portfolioData = await tradingService.getPortfolio(apiUserId)
      
      const updatedUser = {
        ...user,
        portfolio: portfolioData.portfolio || [],
        totalValue: portfolioData.portfolio_value || 0,
        cashBalance: portfolioData.cash_balance || 0,
        totalAccountValue: portfolioData.total_account_value || (portfolioData.portfolio_value + portfolioData.cash_balance)
      }
      
      setUser(updatedUser)
      localStorage.removeItem('user') // Clear old data first
      localStorage.setItem('user', JSON.stringify(updatedUser))
    } catch (error) {
      // Silently fail - don't spam console
      if (import.meta.env.DEV) {
        console.error('Error refreshing user data:', error)
      }
    }
  }, [user?.email, user?.id]) // Only depend on identifiers, not entire user object

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
          setUser({
            ...currentUser,
            portfolio: [],
            totalValue: 0
          })
          setIsLoading(false)
          return
        }

        // Try to get user profile and portfolio in parallel for faster loading
        const lookupId = currentUser.email || userId
        const apiUserId = currentUser.email || userId
        
        // Load both in parallel instead of sequentially
        const [dbUser, portfolioData] = await Promise.allSettled([
          apiService.getUserProfile(lookupId),
          tradingService.getPortfolio(apiUserId).catch(() => ({ 
            success: false,
            portfolio: [], 
            portfolio_value: 0,
            cash_balance: 10000,
            total_account_value: 10000
          } as any))
        ])
        
        // Process results
        const userProfile = dbUser.status === 'fulfilled' ? dbUser.value : null
        let portfolio: PortfolioItem[] = []
        let totalValue = 0
        let cashBalance = 10000 // Default starting cash
        let totalAccountValue = 10000
        
        if (portfolioData.status === 'fulfilled') {
          const portfolioResponse = portfolioData.value
          portfolio = portfolioResponse.portfolio || []
          totalValue = portfolioResponse.portfolio_value || 0
          cashBalance = portfolioResponse.cash_balance || 10000
          totalAccountValue = portfolioResponse.total_account_value || (totalValue + cashBalance)
        }
        
        if (userProfile) {
          // Build user object - portfolio ONLY from trading API, never from dbUser.portfolio
          // CRITICAL: Always ensure email is set (required for API calls)
          const userEmail = userProfile.email || currentUser.email || userId
          const fullUser: User = {
            id: userProfile._id || userId,
            email: userEmail, // ALWAYS set email (required for trading API)
            name: userProfile.name || currentUser.name,
            picture: userProfile.picture || currentUser.picture,
            goal: userProfile.investment_goal as User['goal'],
            language: userProfile.language || 'en',
            lifestyle: userProfile.lifestyle_brands || [],
            visaStatus: userProfile.visa_status,
            homeCountry: userProfile.home_country,
            portfolio: portfolio, // ONLY from trading API
            totalValue: totalValue, // ONLY from trading API
            cashBalance: cashBalance, // From trading API
            totalAccountValue: totalAccountValue // From trading API
          }
          
          setUser(fullUser)
          // Store in localStorage (but portfolio is always from trading API)
          localStorage.removeItem('user') // Clear old data first
          localStorage.setItem('user', JSON.stringify(fullUser))
        } else {
          // If dbUser is null, still set user with currentUser data (but empty portfolio)
          // CRITICAL: Always ensure email is set (required for API calls)
          const fallbackEmail = currentUser.email || userId
          if (!fallbackEmail) {
            setIsLoading(false)
            return
          }
          setUser({
            ...currentUser,
            email: fallbackEmail, // ALWAYS set email (required for trading API)
            portfolio: portfolio, // Use portfolio from parallel call
            totalValue: totalValue,
            cashBalance: cashBalance,
            totalAccountValue: totalAccountValue
          })
        }
      } catch (error) {
        // CRITICAL: Always ensure email is set (required for API calls)
        const fallbackEmail = currentUser.email || currentUser.id
        if (!fallbackEmail) {
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