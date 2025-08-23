import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import Logo from './Logo'

const Watchlist = () => {
  const watchlistItems = [
    { symbol: 'AMZN', company: 'Amazon', price: '$102.21', change: '+3.67', positive: true, fallback: '📦' },
    { symbol: 'KO', company: 'Coca-Cola', price: '$60.49', change: '+0.72', positive: true, fallback: '🥤' },
    { symbol: 'BMW', company: 'BMW', price: '$92.94', change: '-0.68', positive: false, fallback: '🚗' },
    { symbol: 'MSFT', company: 'Microsoft', price: '$248.16', change: '+0.10', positive: true, fallback: '💻' },
    { symbol: 'UPS', company: 'UPS', price: '$182.09', change: '-7.39', positive: false, fallback: '📮' }
  ]

  return (
    <div className="bg-white rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Watchlist</h3>
        <motion.button
          className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center text-white"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Plus className="w-4 h-4" />
        </motion.button>
      </div>

      <div className="space-y-4 max-h-80 overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin', scrollbarColor: '#d1d5db #f9fafb' }}>
        {watchlistItems.map((item, index) => (
          <motion.div
            key={item.symbol}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer"
          >
            {/* Company Icon */}
            <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                 style={{
                   backgroundColor: 
                     item.symbol === 'AMZN' ? '#ff9900' :
                     item.symbol === 'KO' ? '#f40009' :
                     item.symbol === 'BMW' ? '#0066b2' :
                     item.symbol === 'MSFT' ? '#00a1f1' :
                     '#8b4513'
                 }}>
              <Logo 
                company={item.company} 
                fallback={item.fallback} 
                size={24}
              />
            </div>

            {/* Company Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-gray-900 text-sm">{item.symbol}</p>
                <p className="font-semibold text-gray-900 text-sm">{item.price}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500 truncate">{item.company === 'Coca-Cola' ? 'Coca-Cola Co' : item.company === 'BMW' ? 'Bayerische Motoren Werke AG' : item.company === 'UPS' ? 'United Parcel Service, Inc.' : item.company + '.com, Inc.'}</p>
                <p className={`text-xs font-medium ${
                  item.positive ? 'text-green-600' : 'text-red-600'
                }`}>
                  {item.positive ? '+' : ''}{item.change}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default Watchlist