import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Mail, Lock, User, Eye, EyeOff } from 'lucide-react'
import Logo from '../components/Logo'

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const navigate = useNavigate()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Mock authentication - always succeed and navigate to onboarding
    console.log('Mock authentication successful for:', isLogin ? 'login' : 'signup')
    navigate('/onboarding')
  }

  const handleSocialLogin = (provider: string) => {
    // Mock social login - always succeed and navigate to onboarding
    console.log(`Mock ${provider} authentication successful`)
    navigate('/onboarding')
  }



  return (
    <div 
      className="min-h-screen relative overflow-hidden flex items-center justify-center py-8 px-4"
      style={{
        backgroundImage: 'url(/landingPage.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/50"></div>
      
      {/* Back to home link */}
      <div className="absolute top-8 left-8 z-20">
        <button 
          onClick={() => navigate('/')}
          className="text-white/80 hover:text-white transition-colors flex items-center gap-2"
        >
          ← Back to Home
        </button>
      </div>

      {/* Auth Form */}
      <div className="relative z-10 w-full max-w-md mx-auto my-6">
        <div className="bg-white rounded-2xl shadow-2xl p-7">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">F</span>
              </div>
              <span className="text-gray-800 font-semibold text-xl">FinLit</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {isLogin ? 'Welcome back' : 'Create your account'}
            </h1>
            <p className="text-gray-600">
              {isLogin ? 'Sign in to continue your investment journey' : 'Start your investment journey today'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
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
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                    placeholder="Confirm your password"
                  />
                </div>
                {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">Passwords don't match</p>
                )}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 bg-black text-white hover:bg-gray-800"
            >
              {isLogin ? 'Sign In' : 'Create Account'}
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          {/* Toggle between login/signup */}
          <div className="mt-4 text-center">
            <p className="text-gray-600 text-sm">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-orange-500 hover:text-orange-600 font-medium"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>

          {/* Social login options */}
          <div className="mt-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <button 
                onClick={() => handleSocialLogin('Google')}
                className="w-full inline-flex justify-center items-center py-2 px-3 border border-gray-300 rounded-lg bg-white text-xs font-medium text-gray-500 hover:bg-gray-50 transition-colors"
              >
                <Logo 
                  company="Google" 
                  fallback="G" 
                  size={16} 
                  className="mr-1"
                />
                <span>Google</span>
              </button>

              <button 
                onClick={() => handleSocialLogin('Facebook')}
                className="w-full inline-flex justify-center items-center py-2 px-3 border border-gray-300 rounded-lg bg-white text-xs font-medium text-gray-500 hover:bg-gray-50 transition-colors"
              >
                <Logo 
                  company="Facebook" 
                  fallback="f" 
                  size={16} 
                  className="mr-1"
                />
                <span>Facebook</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthPage