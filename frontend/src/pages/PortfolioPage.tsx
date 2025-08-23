import { useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, MoreHorizontal, Plus, ArrowUpRight, ArrowDownRight, DollarSign, Percent, Calendar, Eye } from 'lucide-react'
import { useUser } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import Navigation from '../components/Navigation'
import Logo from '../components/Logo'

interface HoldingItem {
  ticker: string
  company: string
  shares: number
  avgPrice: number
  currentPrice: number
  totalValue: number
  gainLoss: number
  gainLossPercent: number
  logo: string
}

const PortfolioPage = () => {
  const { user } = useUser()
  const navigate = useNavigate()
  const [selectedTimeframe, setSelectedTimeframe] = useState('1D')

  // Mock portfolio data based on user's portfolio or default
  const holdings: HoldingItem[] = user?.portfolio?.map(item => ({
    ticker: item.ticker,
    company: item.company,
    shares: item.quantity,
    avgPrice: item.avgPrice,
    currentPrice: item.currentPrice,
    totalValue: item.quantity * item.currentPrice,
    gainLoss: (item.currentPrice - item.avgPrice) * item.quantity,
    gainLossPercent: ((item.currentPrice - item.avgPrice) / item.avgPrice) * 100,
    logo: item.logo
  })) || [
    {
      ticker: 'AAPL',
      company: 'Apple Inc.',
      shares: 10,
      avgPrice: 150.00,
      currentPrice: 175.30,
      totalValue: 1753.00,
      gainLoss: 253.00,
      gainLossPercent: 16.87,
      logo: '🍎'
    },
    {
      ticker: 'TSLA',
      company: 'Tesla Inc.',
      shares: 5,
      avgPrice: 220.00,
      currentPrice: 242.15,
      totalValue: 1210.75,
      gainLoss: 110.75,
      gainLossPercent: 10.07,
      logo: '🚗'
    },
    {
      ticker: 'NVDA',
      company: 'NVIDIA Corp.',
      shares: 8,
      avgPrice: 180.00,
      currentPrice: 203.65,
      totalValue: 1629.20,
      gainLoss: 189.20,
      gainLossPercent: 13.14,
      logo: '🔥'
    }
  ]

  const totalPortfolioValue = holdings.reduce((sum, holding) => sum + holding.totalValue, 0)
  const totalGainLoss = holdings.reduce((sum, holding) => sum + holding.gainLoss, 0)
  const totalGainLossPercent = (totalGainLoss / (totalPortfolioValue - totalGainLoss)) * 100

  const timeframes = ['1D', '1W', '1M', '3M', '1Y', 'All']

  if (!user) {
    navigate('/')
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Portfolio</h1>
              <p className="text-gray-600">Track your investments and performance</p>
            </div>
            <button
              onClick={() => navigate('/trade')}
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Position
            </button>
          </div>
        </motion.div>

        {/* Portfolio Overview Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Total Value */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="text-sm text-gray-500">Total Value</h3>
                <p className="text-2xl font-bold">${totalPortfolioValue.toLocaleString()}</p>
              </div>
            </div>
          </motion.div>

          {/* Total Gain/Loss */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                totalGainLoss >= 0 ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {totalGainLoss >= 0 ? 
                  <ArrowUpRight className="w-5 h-5 text-green-600" /> :
                  <ArrowDownRight className="w-5 h-5 text-red-600" />
                }
              </div>
              <div>
                <h3 className="text-sm text-gray-500">Total Return</h3>
                <div className="flex items-center gap-2">
                  <p className={`text-2xl font-bold ${totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {totalGainLoss >= 0 ? '+' : ''}${totalGainLoss.toFixed(2)}
                  </p>
                  <span className={`text-sm font-medium ${totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ({totalGainLoss >= 0 ? '+' : ''}{totalGainLossPercent.toFixed(2)}%)
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Holdings Count */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Eye className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-sm text-gray-500">Holdings</h3>
                <p className="text-2xl font-bold">{holdings.length}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Performance Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Performance</h2>
            <div className="flex bg-gray-100 rounded-lg p-1">
              {timeframes.map((timeframe) => (
                <button
                  key={timeframe}
                  onClick={() => setSelectedTimeframe(timeframe)}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                    selectedTimeframe === timeframe
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {timeframe}
                </button>
              ))}
            </div>
          </div>

          {/* Simple chart placeholder */}
          <div className="h-64 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <TrendingUp className="w-12 h-12 text-purple-500 mx-auto mb-4" />
              <p className="text-gray-600">Portfolio performance chart</p>
              <p className="text-sm text-gray-500">Chart integration coming soon</p>
            </div>
          </div>
        </motion.div>

        {/* Holdings List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Your Holdings</h2>
            <button className="text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1">
              View All <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4">
            {holdings.map((holding, index) => (
              <motion.div
                key={holding.ticker}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer"
                onClick={() => navigate(`/trade?symbol=${holding.ticker}`)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                    <Logo 
                      company={holding.company.replace(' Inc.', '').replace(' Corp.', '')} 
                      fallback={holding.logo} 
                      size={32}
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{holding.ticker}</h3>
                    <p className="text-sm text-gray-500">{holding.company}</p>
                    <p className="text-xs text-gray-400">{holding.shares} shares × ${holding.currentPrice}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-semibold text-gray-900">${holding.totalValue.toLocaleString()}</p>
                  <div className={`flex items-center gap-1 justify-end ${
                    holding.gainLoss >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {holding.gainLoss >= 0 ? 
                      <TrendingUp className="w-4 h-4" /> :
                      <TrendingDown className="w-4 h-4" />
                    }
                    <span className="font-medium">
                      {holding.gainLoss >= 0 ? '+' : ''}${holding.gainLoss.toFixed(2)}
                    </span>
                  </div>
                  <p className={`text-sm font-medium ${
                    holding.gainLossPercent >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {holding.gainLossPercent >= 0 ? '+' : ''}{holding.gainLossPercent.toFixed(2)}%
                  </p>
                </div>

                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <MoreHorizontal className="w-5 h-5 text-gray-400" />
                </button>
              </motion.div>
            ))}
          </div>

          {holdings.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">No holdings yet</h3>
              <p className="text-gray-600 mb-6">Start building your portfolio by making your first investment</p>
              <button
                onClick={() => navigate('/trade')}
                className="btn-primary"
              >
                Make Your First Investment
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default PortfolioPage