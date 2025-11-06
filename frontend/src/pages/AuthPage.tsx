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
        scene="https://prod.spline.design/eKDX1S3hy3D6e9bl/scene.splinecode"
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
  const [splineError, setSplineError] = useState(false)
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
    
    // Initialize Google Sign-In when component mounts
    const initializeGoogle = async () => {
      // Try multiple times with increasing delays to ensure DOM is ready
      const attempts = [1000, 2000, 3000]
      
      for (const delay of attempts) {
        await new Promise(resolve => setTimeout(resolve, delay))
        
        const element = document.getElementById('google-signin-button')
        console.log(`🔵 AuthPage: Element check (${delay}ms):`, element)
        
        if (element) {
          try {
            console.log('🔵 AuthPage: Rendering Google button...')
            await authService.renderGoogleButton('google-signin-button')
            console.log('✅ AuthPage: Google button rendered')
            return // Success, exit
          } catch (error) {
            console.error('❌ Failed to render Google button:', error)
          }
        }
      }
      
      console.error('❌ Element google-signin-button not found after multiple attempts')
    }
    
    initializeGoogle()
  }, [])

  return (
    <div className="relative h-screen bg-black overflow-hidden">
      
      {/* 3D Spline Background */}
      <div className="absolute inset-0 z-0">
        {splineError ? (
          // Fallback gradient background if Spline fails
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-black to-blue-900">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
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
              }}
              onError={() => {
                console.error('❌ Spline failed to load, using fallback background')
                setSplineError(true)
                setSplineLoaded(true)
              }}
            />
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
            <div className="mt-4 w-full">
              <div 
                id="google-signin-button" 
                ref={googleButtonRef} 
                className="w-full flex justify-center items-center min-h-[44px]"
                style={{ position: 'relative', zIndex: 999 }}
              >
                {/* Google button will render here */}
              </div>
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