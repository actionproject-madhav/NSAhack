// Google OAuth configuration
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || ''
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

interface GoogleUser {
  id: string
  email: string
  name: string
  picture?: string
}

interface AuthResponse {
  success: boolean
  user?: GoogleUser
  error?: string
}

class AuthService {
  private isInitialized = false

  // Load Google Sign-In script and initialize
  async initialize(): Promise<void> {
    if (this.isInitialized) return

    return new Promise((resolve, reject) => {
      console.log('🔵 AuthService: Loading Google Sign-In script...')
      console.log('🔵 Using Client ID:', GOOGLE_CLIENT_ID)
      
      // Load Google Sign-In script
      const script = document.createElement('script')
      script.src = 'https://accounts.google.com/gsi/client'
      script.async = true
      script.defer = true
      
      script.onload = () => {
        console.log(' Google Sign-In script loaded')
        // Initialize Google Sign-In
        if (window.google?.accounts?.id) {
          console.log(' Google API available, initializing...')
          window.google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: this.handleGoogleResponse.bind(this),
            auto_select: false,
            cancel_on_tap_outside: false
          })
          this.isInitialized = true
          console.log(' Google Sign-In initialized successfully')
          resolve()
        } else {
          console.error(' Google Sign-In library not available')
          reject(new Error('Google Sign-In library not available'))
        }
      }
      
      script.onerror = () => {
        reject(new Error('Failed to load Google Sign-In script'))
      }
      
      document.head.appendChild(script)
    })
  }

  // Decode JWT token in frontend (no backend needed!)
  private decodeJWT(token: string): any {
    try {
      const base64Url = token.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      )
      return JSON.parse(jsonPayload)
    } catch (error) {
      console.error('Error decoding JWT:', error)
      return null
    }
  }

  // Handle Google Sign-In response
  private async handleGoogleResponse(response: any) {
    console.log('=== Google Sign-In Response ===')
    console.log(' handleGoogleResponse CALLED!')
    console.log('Full response:', response)
    console.log('Credential token:', response.credential ? 'Present' : 'Missing')
    
    try {
      if (!response.credential) {
        throw new Error('No credential token received from Google')
      }

      console.log('🔵 Verifying token in FRONTEND (no backend needed!)...')
      
      // Decode JWT token to get user info (frontend-only, instant!)
      const decodedToken = this.decodeJWT(response.credential)
      
      if (!decodedToken || !decodedToken.email) {
        throw new Error('Invalid token: Could not decode user information')
      }

      // Extract user information from decoded token
      const user: GoogleUser = {
        id: decodedToken.sub || decodedToken.email, // Use Google ID or email as ID
        email: decodedToken.email,
        name: decodedToken.name || decodedToken.email.split('@')[0],
        picture: decodedToken.picture
      }

      console.log('✅ Token decoded successfully! User:', user)
      
      // Store user data in localStorage immediately (no backend call!)
      localStorage.setItem('user', JSON.stringify(user))
      localStorage.setItem('google_token', response.credential) // Store token for later backend sync
      console.log('✅ User data stored in localStorage')
      
      // Check onboarding status from localStorage (fast, no backend needed)
      const storedUser = localStorage.getItem('user')
      const parsedUser = storedUser ? JSON.parse(storedUser) : null
      const hasCompletedOnboarding = parsedUser?.onboarding_completed || false
      
      console.log('Onboarding status (from localStorage):', hasCompletedOnboarding)
      
      // Try to sync with backend in background (non-blocking)
      this.syncWithBackend(response.credential, user).catch(error => {
        console.warn('⚠️ Backend sync failed (non-critical):', error)
        console.log('✅ Continuing with frontend-only auth...')
      })
      
      // Redirect immediately (no waiting for backend!)
      if (hasCompletedOnboarding) {
        console.log('✅ User has completed onboarding, redirecting to dashboard...')
        window.location.replace('/dashboard')
      } else {
        console.log('⚠️ User needs to complete onboarding, redirecting to /onboarding...')
        window.location.replace('/onboarding')
      }
    } catch (error) {
      console.error('=== Google Authentication Error ===')
      console.error('Error details:', error)
      alert(`Authentication failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  // Sync with backend in background (non-blocking, optional)
  private async syncWithBackend(token: string, user: GoogleUser): Promise<void> {
    try {
      console.log('🔄 Syncing with backend in background...')
      const result = await this.verifyGoogleToken(token)
      
      if (result.success && result.user) {
        console.log('✅ Backend sync successful')
        // Update localStorage with backend user data (may have more fields)
        localStorage.setItem('user', JSON.stringify(result.user))
        
        // Check onboarding status from backend
        const hasCompletedOnboarding = await this.checkOnboardingStatus(result.user.id)
        if (hasCompletedOnboarding) {
          const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
          currentUser.onboarding_completed = true
          localStorage.setItem('user', JSON.stringify(currentUser))
        }
      }
    } catch (error) {
      // Silently fail - frontend auth already worked
      console.warn('Backend sync failed (non-critical):', error)
    }
  }

  // Check if user has completed onboarding
  private async checkOnboardingStatus(userId: string): Promise<boolean> {
    try {
      console.log(`Checking onboarding status at: ${API_BASE_URL}/auth/user/${userId}`)
      
      // Increased timeout for Render cold starts
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout
      
      const response = await fetch(`${API_BASE_URL}/auth/user/${userId}`, {
        credentials: 'include',
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)
      
      console.log('Onboarding check response status:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log('Onboarding check response data:', data)
        const isCompleted = data.user?.onboarding_completed || false
        console.log('User onboarding completed:', isCompleted)
        return isCompleted
      } else {
        console.warn('Onboarding check failed with status:', response.status)
        // If user doesn't exist yet, they need onboarding
        return false
      }
    } catch (error) {
      console.error('Error checking onboarding status:', error)
      // On error, assume user needs onboarding (safer default)
      return false
    }
  }

  // Load full user profile from database
  private async loadUserProfile(userId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/user/${userId}`, {
        credentials: 'include'
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.user) {
          // Store complete profile in localStorage
          localStorage.setItem('user', JSON.stringify(data.user))
          console.log(' Full user profile loaded from database')
        }
      }
    } catch (error) {
      console.error('Error loading user profile:', error)
    }
  }

  // Render Google Sign-In button
  async renderGoogleButton(elementId: string = 'google-signin-button'): Promise<void> {
    try {
      console.log(` Rendering Google button in element: ${elementId}`)
      await this.initialize()
      
      const element = document.getElementById(elementId)
      console.log(' Button element found:', !!element)
      
      if (element && window.google?.accounts.id) {
        // Clear any existing content
        element.innerHTML = ''
        
        console.log(' Calling renderButton...')
        window.google.accounts.id.renderButton(element, {
          theme: 'outline',
          size: 'large',
          text: 'signin_with',
          shape: 'rectangular',
          width: 300
        })
        console.log(' Google Sign-In button rendered successfully')
      } else {
        console.error(' Element not found or Google Sign-In not available')
        console.error('Element:', element)
        console.error('Google API:', window.google?.accounts?.id)
      }
    } catch (error) {
      console.error(' Failed to render Google button:', error)
      throw error
    }
  }

  // Sign in with Google (trigger One Tap)
  async signInWithGoogle(): Promise<void> {
    try {
      await this.initialize()
      
      // Trigger One Tap prompt
      window.google?.accounts.id.prompt((notification: any) => {
        console.log('Google One Tap notification:', notification)
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          console.log('One Tap not displayed - user should use the button')
        }
      })
    } catch (error) {
      console.error('Google Sign-In failed:', error)
      throw error
    }
  }

  // Verify Google token with backend
  private async verifyGoogleToken(token: string): Promise<AuthResponse> {
    console.log('=== Backend Token Verification ===')
    console.log('API URL:', `${API_BASE_URL}/auth/verify-token`)
    console.log('Token length:', token.length)
    console.log('Token preview:', token.substring(0, 50) + '...')
    console.log('⚠️ Note: Backend may be cold (Render free tier). This may take 30-60 seconds...')
    
    try {
      // Increased timeout for Render cold starts (free tier can take 50+ seconds)
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 90000) // 90 second timeout
      
      const response = await fetch(`${API_BASE_URL}/auth/verify-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token }),
        credentials: 'include',
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)

      console.log('Response status:', response.status)
      console.log('Response headers:', [...response.headers.entries()])

      const data = await response.json()
      console.log('Response data:', data)
      
      if (response.ok && data.success) {
        return {
          success: true,
          user: data.user
        }
      } else {
        return {
          success: false,
          error: data.error || 'Token verification failed'
        }
      }
    } catch (error) {
      console.error('Network/parsing error:', error)
      
      // Check if it's a timeout/abort error (backend cold start)
      if (error instanceof Error && error.name === 'AbortError') {
        return {
          success: false,
          error: 'Backend is taking too long to respond. Please try again in a moment (Render free tier cold start).'
        }
      }
      
      // Check if it's a connection error (backend not responding)
      if (error instanceof TypeError && error.message.includes('fetch')) {
        return {
          success: false,
          error: 'Cannot connect to backend. The server may be starting up (Render free tier). Please wait 30-60 seconds and try again.'
        }
      }
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error'
      }
    }
  }

  // Get current user from localStorage
  getCurrentUser(): GoogleUser | null {
    try {
      const userData = localStorage.getItem('user')
      return userData ? JSON.parse(userData) : null
    } catch (error) {
      return null
    }
  }

  // Sign out
  async signOut(): Promise<void> {
    try {
      // Call backend logout endpoint
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      })
      
      // Clear localStorage
      localStorage.removeItem('user')
      
      // Sign out from Google
      if (window.google?.accounts.id) {
        window.google.accounts.id.disableAutoSelect()
      }
      
      // Redirect to home
      window.location.href = '/'
    } catch (error) {
      console.error('Sign out error:', error)
      // Still clear local data even if backend call fails
      localStorage.removeItem('user')
      window.location.href = '/'
    }
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null
  }
}

// Extend Window interface for Google Sign-In
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void
          prompt: (callback: (notification: any) => void) => void
          renderButton: (element: Element | null, config: any) => void
          disableAutoSelect: () => void
        }
      }
    }
  }
}

export const authService = new AuthService()
export default authService