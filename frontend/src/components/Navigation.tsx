import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Menu, X, Home, Briefcase, Wallet, BarChart3, BookOpen, Brain, Moon, Sun, LogOut, Settings, User } from 'lucide-react'
import { useUser } from '../context/UserContext'
import { useTheme } from '../context/ThemeContext'
import authService from '../services/authService'

const Navigation = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useUser()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const { theme, toggleTheme, isDark } = useTheme()

  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/portfolio', icon: Briefcase, label: 'Portfolio' },
    { path: '/wallet', icon: Wallet, label: 'Wallet' },
    { path: '/trade', icon: BarChart3, label: 'Trade' },
    { path: '/learn', icon: BookOpen, label: 'Learn' },
    { path: '/ai-hub', icon: Brain, label: 'AI Hub' },
  ]

  const isActive = (path: string) => location.pathname === path


  return (
    <>
      {/* Main Navigation Bar */}
      <nav className="bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40 transition-colors">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
              <div className="w-8 h-8 bg-black dark:bg-white rounded-lg flex items-center justify-center">
                <span className="text-white dark:text-black font-bold text-sm">F</span>
              </div>
              <span className="font-bold text-xl text-black dark:text-white">FinLit</span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    isActive(item.path)
                      ? 'bg-black dark:bg-white text-white dark:text-black font-semibold'
                      : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-900'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-sm">{item.label}</span>
                </button>
              ))}
            </div>

            {/* Right Side - Dark Mode & Profile */}
            <div className="flex items-center gap-3">
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg transition-colors"
              >
                {isDark ? <Sun className="w-5 h-5 text-white" /> : <Moon className="w-5 h-5 text-black" />}
              </button>

              {/* Profile Button */}
              {user ? (
                <button
                  onClick={() => setProfileOpen(true)}
                  className="hover:opacity-80 transition-opacity"
                >
                  {user.picture ? (
                    <img 
                      src={user.picture} 
                      alt={user.name} 
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-black dark:bg-white rounded-full flex items-center justify-center text-white dark:text-black font-semibold text-sm">
                      {user.name?.charAt(0) || 'U'}
            </div>
                  )}
                </button>
              ) : (
                <button
                  onClick={() => navigate('/auth')}
                  className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg font-semibold text-sm hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
                >
                  Sign In
                </button>
              )}

            {/* Mobile Menu Button */}
            <button
                className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
                {mobileMenuOpen ? <X className="w-6 h-6 text-black dark:text-white" /> : <Menu className="w-6 h-6 text-black dark:text-white" />}
            </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path)
                    setMobileMenuOpen(false)
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                    isActive(item.path)
                      ? 'bg-black dark:bg-white text-white dark:text-black font-semibold'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Profile Modal */}
      {profileOpen && user && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setProfileOpen(false)}>
          <div className="bg-white dark:bg-black rounded-2xl max-w-md w-full shadow-2xl border border-gray-200 dark:border-gray-800" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
              <h2 className="text-xl font-bold text-black dark:text-white">Profile</h2>
              <button 
                onClick={() => setProfileOpen(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* User Info with Avatar */}
              <div className="flex flex-col items-center text-center">
                {/* Large Avatar - Always show initials or picture */}
                <div className="mb-4">
                  {user.picture && user.picture.length > 0 ? (
                    <img 
                      src={user.picture} 
                      alt={user.name} 
                      className="w-24 h-24 rounded-full object-cover border-4 border-gray-200 dark:border-gray-800"
                      onError={(e) => {
                        // If image fails to load, hide it and show initial instead
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  ) : null}
                  
                  {/* Fallback Initial (Always render as backup) */}
                  {(!user.picture || user.picture.length === 0) && (
                    <div className="w-24 h-24 bg-black dark:bg-white rounded-full flex items-center justify-center text-white dark:text-black font-bold text-4xl shadow-lg">
                      {user.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                  )}
                </div>
                
                <h3 className="text-2xl font-bold text-black dark:text-white mb-1">{user.name}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{user.email}</p>
              </div>

              {/* Portfolio Stats */}
              {user.portfolio && user.portfolio.length > 0 && (
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-800">
                  <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Portfolio Value</div>
                  <div className="text-2xl font-bold text-black dark:text-white">
                    ${user.totalValue?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {user.portfolio.length} {user.portfolio.length === 1 ? 'position' : 'positions'}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="space-y-2 pt-4 border-t border-gray-200 dark:border-gray-800">
                <button 
                  onClick={() => {
                    setProfileOpen(false)
                    navigate('/onboarding')
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-lg transition-colors text-left"
                >
                  <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <span className="text-sm font-medium text-black dark:text-white">Settings</span>
                </button>
                
                <button 
                  onClick={async () => {
                    await authService.signOut()
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-lg transition-colors text-left"
                >
                  <LogOut className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <span className="text-sm font-medium text-black dark:text-white">Log Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Navigation
