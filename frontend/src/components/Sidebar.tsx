import { motion } from 'framer-motion'
import { LayoutDashboard, Briefcase, TrendingUp, FileText, CreditCard, BarChart3, BookOpen, LogOut } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'

const Sidebar = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Briefcase, label: 'Portfolio', path: '/portfolio' },
    { icon: CreditCard, label: 'Wallet', path: '/wallet' },
    { icon: TrendingUp, label: 'Trade', path: '/trade' },
    { icon: BookOpen, label: 'Learn', path: '/learn' },
  ]

  return (
    <div className="w-64 bg-white flex flex-col h-screen shadow-sm">
      {/* Logo */}
      <div className="p-6">
        <h1 className="text-xl font-bold text-gray-900">StudVest</h1>
      </div>

      {/* User Panel */}
      <div className="px-6 py-2">
        <p className="text-sm text-gray-500 font-medium">User Panel</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 lg:px-4 py-4 overflow-y-auto">
        <div className="space-y-1">
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.path
            return (
              <motion.button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-semibold'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <item.icon className="w-4 h-4 lg:w-5 lg:h-5 flex-shrink-0" />
                <span className="text-xs lg:text-sm truncate">{item.label}</span>
              </motion.button>
            )
          })}
        </div>
      </nav>

      {/* Thoughts Time Card */}
      <div className="mx-3 lg:mx-4 mb-4 p-3 lg:p-4 bg-green-100 rounded-2xl">
        <div className="text-center mb-3">
          <div className="w-10 h-10 lg:w-12 lg:h-12 bg-green-200 rounded-full mx-auto mb-2 flex items-center justify-center">
            💡
          </div>
          <p className="text-xs font-medium text-green-800">Thoughts Time</p>
        </div>
        <p className="text-xs text-green-700 leading-relaxed">
          If you aren't willing to own a stock for 10 years, don't even think about owning it for 10 minutes.
        </p>
      </div>

      {/* Logout */}
      <div className="p-3 lg:p-4 border-t border-gray-200">
        <button className="w-full flex items-center gap-3 px-3 lg:px-4 py-2.5 lg:py-3 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors">
          <LogOut className="w-4 h-4 lg:w-5 lg:h-5" />
          <span className="text-xs lg:text-sm">Logout</span>
        </button>
      </div>
    </div>
  )
}

export default Sidebar