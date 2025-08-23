import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, MoreHorizontal } from 'lucide-react'

interface PortfolioItem {
  ticker: string
  company: string
  quantity: number
  avgPrice: number
  currentPrice: number
  reason: string
  logo: string
}

interface PortfolioCardProps {
  item: PortfolioItem
}

const PortfolioCard = ({ item }: PortfolioCardProps) => {
  const totalValue = item.quantity * item.currentPrice
  const gainLoss = (item.currentPrice - item.avgPrice) * item.quantity
  const gainLossPercent = ((item.currentPrice - item.avgPrice) / item.avgPrice) * 100
  const isPositive = gainLoss >= 0

  return (
    <motion.div
      className="card hover:shadow-lg transition-all duration-200 cursor-pointer"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-2xl">
            {item.logo}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{item.ticker}</h3>
            <p className="text-sm text-gray-500">{item.company}</p>
          </div>
        </div>
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <MoreHorizontal className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      {/* Value */}
      <div className="mb-4">
        <div className="text-2xl font-bold text-gray-900 mb-1">
          ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </div>
        <div className="text-sm text-gray-500">
          {item.quantity} shares × ${item.currentPrice.toFixed(2)}
        </div>
      </div>

      {/* Performance */}
      <div className="flex items-center justify-between mb-4">
        <div className={`flex items-center gap-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          <span className="font-medium">
            {isPositive ? '+' : ''}${Math.abs(gainLoss).toFixed(2)}
          </span>
        </div>
        <div className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {isPositive ? '+' : ''}{gainLossPercent.toFixed(2)}%
        </div>
      </div>

      {/* Reason */}
      <div className="bg-gray-50 rounded-lg p-3">
        <p className="text-sm text-gray-600">
          <span className="font-medium">Why this stock:</span> {item.reason}
        </p>
      </div>
    </motion.div>
  )
}

export default PortfolioCard