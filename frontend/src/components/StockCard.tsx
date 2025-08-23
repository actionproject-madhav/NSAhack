import { motion } from 'framer-motion'

interface StockCardProps {
  stock: {
    symbol: string
    company: string
    value: string
    change: string
    color: string
    chartColor: string
  }
}

const StockCard = ({ stock }: StockCardProps) => {
  const isPositive = stock.change.startsWith('+')

  // Company logos based on the design
  const getCompanyLogo = (symbol: string) => {
    switch (symbol) {
      case 'NVDA': return '🔥'
      case 'META': return '📱'
      case 'TSLA': return '⚡'
      case 'AAPL': return '🍎'
      case 'SHOP': return '🛍️'
      default: return '📈'
    }
  }

  // Mini chart SVG that matches the design
  const MiniChart = () => (
    <svg width="80" height="40" viewBox="0 0 80 40" className="absolute bottom-3 right-3">
      <defs>
        <linearGradient id={`gradient-${stock.symbol}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.6)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
      </defs>
      <path
        d="M5 35 L20 28 L35 22 L50 18 L65 15 L75 12"
        stroke="rgba(255,255,255,0.8)"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M5 35 L20 28 L35 22 L50 18 L65 15 L75 12 L75 40 L5 40 Z"
        fill={`url(#gradient-${stock.symbol})`}
      />
    </svg>
  )

  return (
    <motion.div
      className={`flex-shrink-0 w-48 h-32 ${stock.color} rounded-3xl p-4 text-white relative overflow-hidden shadow-lg`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Company Logo/Icon */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
          <span className="text-sm">{getCompanyLogo(stock.symbol)}</span>
        </div>
        <div>
          <p className="text-xs opacity-90 font-medium">{stock.company}</p>
          <p className="text-xs font-bold">{stock.symbol}</p>
        </div>
      </div>

      {/* Current Value */}
      <div className="mb-2">
        <p className="text-xs opacity-75 mb-1">Current Value</p>
        <p className="text-xl font-bold">{stock.value}</p>
      </div>

      {/* Mini Chart */}
      <MiniChart />

      {/* Change Indicator - positioned in top right */}
      <div className="absolute top-4 right-4">
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
          isPositive ? 'bg-white/20' : 'bg-red-500/30'
        }`}>
          {stock.change}
        </span>
      </div>
    </motion.div>
  )
}

export default StockCard