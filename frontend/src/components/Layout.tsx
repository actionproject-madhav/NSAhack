import { useState, useEffect, ReactNode } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Menu, Moon, Sun, Home, Briefcase, Wallet, BarChart3, BookOpen, Brain, LogOut, Settings, X } from 'lucide-react'
import { useUser } from '../context/UserContext'
import authService from '../services/authService'

interface LayoutProps {
  children: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  const { user } = useUser()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true')

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: Briefcase, label: 'Portfolio', path: '/portfolio' },
    { icon: Wallet, label: 'Wallet', path: '/wallet' },
    { icon: BarChart3, label: 'Trade', path: '/trade' },
    { icon: BookOpen, label: 'Learn', path: '/learn' },
    { icon: Brain, label: 'AI Hub', path: '/ai-hub' },
  ]

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('darkMode', darkMode.toString())
  }, [darkMode])

  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors flex relative z-10">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Left Sidebar */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out fixed lg:static inset-y-0 left-0 z-50 lg:z-auto w-64 bg-white dark:bg-black border-r border-gray-200 dark:border-gray-800 flex flex-col`}>
        {/* Logo */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
            <div className="w-8 h-8 bg-black dark:bg-white rounded-lg flex items-center justify-center">
              <span className="text-white dark:text-black font-bold text-sm">F</span>
            </div>
            <span className="font-bold text-xl text-black dark:text-white">FinLit</span>
          </div>
        </div>

        {/* User Profile Section */}
        {user && (
          <div className="px-3 py-4 border-b border-gray-200 dark:border-gray-800">
            <button
              onClick={() => setProfileOpen(true)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg transition-colors"
            >
              {user.picture ? (
                <img 
                  src={user.picture} 
                  alt={user.name} 
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 bg-black dark:bg-white rounded-full flex items-center justify-center text-white dark:text-black font-semibold">
                  {user.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
              )}
              <div className="flex-1 text-left">
                <div className="text-sm font-semibold text-black dark:text-white truncate">
                  {user.name || 'User'}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  View Profile
                </div>
              </div>
            </button>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path
              return (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path)
                    setSidebarOpen(false)
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                    isActive
                      ? 'bg-black dark:bg-white text-white dark:text-black font-semibold'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900'
                  }`}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm">{item.label}</span>
                </button>
              )
            })}
          </div>
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-gray-200 dark:border-gray-800">
          <button 
            onClick={async () => await authService.signOut()}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="border-b border-gray-200 dark:border-gray-800 sticky top-0 z-30 bg-white dark:bg-black">
          <div className="px-4 h-16 flex items-center justify-between">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg"
            >
              <Menu className="w-5 h-5 text-black dark:text-white" />
            </button>

            <div className="flex-1" />

            {/* Dark Mode & Profile */}
            <div className="flex items-center gap-3 ml-auto">
              <button 
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg transition-colors"
              >
                {darkMode ? <Sun className="w-5 h-5 text-white" /> : <Moon className="w-5 h-5 text-black" />}
              </button>
              
              {user && (
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
                      {user.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                  )}
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>

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
                <div className="mb-4">
                  {user.picture && user.picture.length > 0 ? (
                    <img 
                      src={user.picture} 
                      alt={user.name} 
                      className="w-24 h-24 rounded-full object-cover border-4 border-gray-200 dark:border-gray-800"
                      onError={(e) => e.currentTarget.style.display = 'none'}
                    />
                  ) : null}
                  
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
                  onClick={async () => await authService.signOut()}
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
    </div>
  )
}

export default Layout

