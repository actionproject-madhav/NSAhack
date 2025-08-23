// Google OAuth configuration
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '830698799863-5k8e24o51cam7rnrpjtn5lc97rb7jirv.apps.googleusercontent.com'
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
      // Load Google Sign-In script
      const script = document.createElement('script')
      script.src = 'https://accounts.google.com/gsi/client'
      script.async = true
      script.defer = true
      
      script.onload = () => {
        // Initialize Google Sign-In
        if (window.google?.accounts?.id) {
          window.google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: this.handleGoogleResponse.bind(this),
            auto_select: false,
            cancel_on_tap_outside: false
          })
          this.isInitialized = true
          resolve()
        } else {
          reject(new Error('Google Sign-In library not available'))
        }
      }
      
      script.onerror = () => {
        reject(new Error('Failed to load Google Sign-In script'))
      }
      
      document.head.appendChild(script)
    })
  }

  // Handle Google Sign-In response
  private async handleGoogleResponse(response: any) {
    console.log('=== Google Sign-In Response ===')
    console.log('Full response:', response)
    console.log('Credential token:', response.credential ? 'Present' : 'Missing')
    
    try {
      if (!response.credential) {
        throw new Error('No credential token received from Google')
      }

      console.log('Sending token to backend for verification...')
      // Verify token with backend
      const result = await this.verifyGoogleToken(response.credential)
      console.log('Backend verification result:', result)
      
      if (result.success && result.user) {
        console.log('Authentication successful! User:', result.user)
        
        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify(result.user))
        console.log('User data stored in localStorage')
        
        // Redirect to onboarding
        console.log('Redirecting to /onboarding...')
        window.location.href = '/onboarding'
      } else {
        throw new Error(result.error || 'Authentication failed')
      }
    } catch (error) {
      console.error('=== Google Authentication Error ===')
      console.error('Error details:', error)
      alert(`Authentication failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  // Render Google Sign-In button
  async renderGoogleButton(elementId: string = 'google-signin-button'): Promise<void> {
    try {
      await this.initialize()
      
      const element = document.getElementById(elementId)
      if (element && window.google?.accounts.id) {
        // Clear any existing content
        element.innerHTML = ''
        
        window.google.accounts.id.renderButton(element, {
          theme: 'outline',
          size: 'large',
          text: 'signin_with',
          shape: 'rectangular',
          width: 300
        })
        console.log('Google Sign-In button rendered successfully')
      } else {
        console.error('Element not found or Google Sign-In not available')
      }
    } catch (error) {
      console.error('Failed to render Google button:', error)
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
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token }),
        credentials: 'include'
      })

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