import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Mail, Lock } from 'lucide-react'
import Spline from '@splinetool/react-spline'
import authService from '../services/authService'

// Error boundary wrapper for Spline
const SplineWrapper = ({ onLoad, onError }: { onLoad: () => void; onError: () => void }) => {
  try {
    return (
      <Spline 
        scene="https://prod.spline.design/TAxK4wrLSa-FcNjL/scene.splinecode"
        onLoad={onLoad}
        onError={onError}
      />
    )
  } catch (error) {
    console.error('Spline render error:', error)
    onError()
    return null
  }
}

const AuthPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [splineLoaded, setSplineLoaded] = useState(false)
  const [splineError, setSplineError] = useState(false) // Try new Spline URL
  const [googleButtonRendered, setGoogleButtonRendered] = useState(false)
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const navigate = useNavigate()
  const googleButtonRef = useRef<HTMLDivElement>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Email/password authentication not implemented - use Google Sign-In
    alert('Please use Google Sign-In button below for authentication')
  }

  useEffect(() => {
    console.log('🔵 AuthPage: Initializing Google Sign-In...')
    
    let isMounted = true
    let attempts = 0
    const maxAttempts = 10
    
    // Initialize Google Sign-In when component mounts
    const initializeGoogle = async () => {
      const tryRender = async () => {
        if (!isMounted || attempts >= maxAttempts) return
        
        attempts++
        const element = document.getElementById('google-signin-button')
        console.log(`🔵 AuthPage: Attempt ${attempts}, Element found:`, !!element)
        
        if (element && element.offsetParent !== null) { // Check if element is visible
          try {
            console.log('🔵 AuthPage: Rendering Google button...')
            await authService.renderGoogleButton('google-signin-button')
            console.log('✅ AuthPage: Google button rendered successfully')
            setGoogleButtonRendered(true)
            return true
          } catch (error) {
            console.error('❌ Failed to render Google button:', error)
            setGoogleButtonRendered(false)
          }
        }
        
        // Try again after delay
        if (isMounted && attempts < maxAttempts) {
          setTimeout(tryRender, 500)
        } else if (attempts >= maxAttempts) {
          console.error('❌ Failed to render Google button after', maxAttempts, 'attempts')
        }
        
        return false
      }
      
      // Start trying after initial delay
      setTimeout(tryRender, 1000)
    }
    
    initializeGoogle()
    
    return () => {
      isMounted = false
    }
  }, [])

  return (
    <div className="relative h-screen bg-black overflow-hidden">
      
      {/* Hide Spline Watermark */}
      <style>{`
        /* Aggressively hide Spline watermark and "Built with Spline" text */
        #spline-watermark,
        [id*="spline"],
        [class*="spline"],
        canvas + div,
        canvas ~ div,
        canvas ~ div a,
        canvas ~ a,
        div[style*="position: absolute"][style*="bottom"],
        div[style*="position: fixed"][style*="bottom"],
        div[style*="z-index: 100000"],
        div[style*="z-index: 99999"],
        a[href*="spline.design"],
        a[target="_blank"][rel*="noopener"] {
          display: none !important;
          opacity: 0 !important;
          visibility: hidden !important;
          pointer-events: none !important;
          width: 0 !important;
          height: 0 !important;
          overflow: hidden !important;
        }
        
        /* Hide any text containing "Built" or "Spline" */
        *:not(script):not(style) {
          font-size: inherit;
        }
      `}</style>
      
      {/* 3D Spline Background */}
      <div className="absolute inset-0 z-0 [&_*]:pointer-events-none [&_canvas]:pointer-events-auto">
        {splineError ? (
          // Fallback dark gradient if Spline fails
          <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-black to-gray-900">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gray-600 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gray-700 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>
          </div>
        ) : (
          <>
            {!splineLoaded && (
              <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900 animate-pulse" />
            )}
            <SplineWrapper 
              onLoad={() => {
                console.log('✅ Spline loaded')
                setSplineLoaded(true)
                setSplineError(false)
              }}
              onError={() => {
                console.error('❌ Spline failed to load, using fallback background')
                setSplineError(true)
                setSplineLoaded(true)
              }}
            />
            
            {/* Cover Spline watermark at bottom-right */}
            <div className="absolute bottom-0 right-0 w-48 h-16 bg-black z-50 pointer-events-none" />
          </>
        )}
      </div>

      {/* Back to home link */}
      <div className="absolute top-8 left-8 z-30">
        <button 
          onClick={() => navigate('/')}
          className="text-white/80 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium"
        >
          ← Back to Home
        </button>
      </div>

      {/* Login Form on Top */}
      <div className="relative z-20 flex items-center justify-center h-screen px-4">
        <div className="bg-white/95 backdrop-blur-sm p-8 rounded-2xl w-96 shadow-2xl">
          {/* Logo */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center space-x-2 mb-3">
              <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <span className="text-gray-900 font-bold text-2xl">FinLit</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome Back</h1>
            <p className="text-gray-600 text-sm">Sign in to continue your investment journey</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-colors"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-colors"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 bg-black text-white hover:bg-gray-800"
            >
              Sign In
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          {/* Divider */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            {/* Google Sign-In */}
            <div className="mt-4 w-full space-y-3">
              {/* Loading indicator outside the Google button div */}
              {!googleButtonRendered && (
                <div className="text-center text-gray-400 text-xs animate-pulse">
                  Loading Google Sign-In...
                </div>
              )}
              
              {/* Google Sign-In Button Container - Don't put any React content inside */}
              <div 
                id="google-signin-button" 
                ref={googleButtonRef} 
                className="w-full flex justify-center items-center min-h-[44px] bg-transparent"
                style={{ 
                  position: 'relative', 
                  zIndex: 9999,
                  isolation: 'isolate'
                }}
              />
              
              {/* Fallback manual Google Sign-In button if auto-render fails */}
              {!googleButtonRendered && (
                <button
                  onClick={async () => {
                    try {
                      await authService.signInWithGoogle()
                    } catch (error) {
                      console.error('Manual Google Sign-In failed:', error)
                      alert('Please wait for the Google button to load or refresh the page')
                    }
                  }}
                  className="w-full py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span>Continue with Google</span>
                </button>
              )}
            </div>
          </div>

          {/* Sign up link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Don't have an account?{' '}
              <button
                onClick={() => navigate('/onboarding')}
                className="text-black hover:text-gray-700 font-semibold"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthPage