import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, TrendingUp, DollarSign, Zap, Check } from 'lucide-react'
import { useUser } from '../context/UserContext'
import { MOCK_PRICES, LIFESTYLE_BRANDS } from '../utils/mockData'
import Navigation from '../components/Navigation'

const TradePage = () => {
  const { user, updatePortfolio } = useUser()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStock, setSelectedStock] = useState('')
  const [amount, setAmount] = useState('')
  const [naturalLanguageInput, setNaturalLanguageInput] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)

  const filteredStocks = LIFESTYLE_BRANDS.filter(brand =>
    brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    brand.ticker.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleTrade = () => {
    if (!selectedStock || !amount) return

    const brand = LIFESTYLE_BRANDS.find(b => b.ticker === selectedStock)
    if (!brand) return

    const currentPrice = MOCK_PRICES[selectedStock]
    const investmentAmount = parseFloat(amount)
    const quantity = Math.floor(investmentAmount / currentPrice)

    const portfolioItem = {
      ticker: selectedStock,
      company: brand.name,
      quantity,
      avgPrice: currentPrice,
      currentPrice,
      reason: `You invested $${amount} because you believe in this company`,
      logo: brand.logo
    }

    updatePortfolio(portfolioItem)
    setShowSuccess(true)
    setSelectedStock('')
    setAmount('')
    
    setTimeout(() => setShowSuccess(false), 3000)
  }

  const parseNaturalLanguage = () => {
    const input = naturalLanguageInput.toLowerCase()
    
    // Simple parsing logic
    const buyMatch = input.match(/buy.*\$(\d+).*(\w{3,4})|buy.*(\w{3,4}).*\$(\d+)/)
    if (buyMatch) {
      const amount = buyMatch[1] || buyMatch[4]
      const ticker = (buyMatch[2] || buyMatch[3]).toUpperCase()
      
      const brand = LIFESTYLE_BRANDS.find(b => 
        b.ticker === ticker || b.name.toLowerCase().includes(ticker.toLowerCase())
      )
      
      if (brand) {
        setSelectedStock(brand.ticker)
        setAmount(amount)
        setNaturalLanguageInput('')
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">Make a Trade 📈</h1>
          <p className="text-gray-600">Invest in companies you know and love</p>
        </motion.div>

        {/* Success Message */}
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-4 bg-green-100 border border-green-200 rounded-xl flex items-center gap-3"
          >
            <Check className="w-6 h-6 text-green-600" />
            <span className="text-green-800 font-medium">Trade executed successfully! 🎉</span>
          </motion.div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Natural Language Input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card"
          >
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-accent-500" />
              <h2 className="text-xl font-semibold">AI Trade Assistant</h2>
            </div>
            
            <p className="text-gray-600 mb-4">
              Just tell me what you want to do! Try: "Buy $500 Tesla" or "Invest $200 in Apple"
            </p>
            
            <div className="flex gap-2">
              <input
                type="text"
                value={naturalLanguageInput}
                onChange={(e) => setNaturalLanguageInput(e.target.value)}
                placeholder="Buy $200 Tesla..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && parseNaturalLanguage()}
              />
              <button
                onClick={parseNaturalLanguage}
                className="btn-primary"
              >
                Parse
              </button>
            </div>
            
            <div className="mt-4 text-sm text-gray-500">
              <p>Examples:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>"Buy $500 worth of Tesla"</li>
                <li>"Invest $200 in Apple stock"</li>
                <li>"Purchase $300 Netflix"</li>
              </ul>
            </div>
          </motion.div>

          {/* Manual Trade Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card"
          >
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="w-5 h-5 text-primary-600" />
              <h2 className="text-xl font-semibold">Manual Trade</h2>
            </div>

            {/* Stock Search */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Stock
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by company or ticker..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Stock Results */}
            {searchTerm && (
              <div className="mb-4 max-h-40 overflow-y-auto border border-gray-200 rounded-xl">
                {filteredStocks.map((stock) => (
                  <button
                    key={stock.ticker}
                    onClick={() => {
                      setSelectedStock(stock.ticker)
                      setSearchTerm('')
                    }}
                    className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-2xl">{stock.logo}</span>
                    <div className="text-left">
                      <div className="font-medium">{stock.name}</div>
                      <div className="text-sm text-gray-500">{stock.ticker}</div>
                    </div>
                    <div className="ml-auto font-medium">
                      ${MOCK_PRICES[stock.ticker]}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Selected Stock */}
            {selectedStock && (
              <div className="mb-4 p-3 bg-primary-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">
                    {LIFESTYLE_BRANDS.find(b => b.ticker === selectedStock)?.logo}
                  </span>
                  <div>
                    <div className="font-medium">{selectedStock}</div>
                    <div className="text-sm text-gray-600">
                      ${MOCK_PRICES[selectedStock]} per share
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Amount Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Investment Amount ($)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="500"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              {selectedStock && amount && (
                <div className="mt-2 text-sm text-gray-600">
                  You'll get approximately {Math.floor(parseFloat(amount) / MOCK_PRICES[selectedStock])} shares
                </div>
              )}
            </div>

            {/* Trade Button */}
            <button
              onClick={handleTrade}
              disabled={!selectedStock || !amount}
              className="w-full btn-primary disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <TrendingUp className="w-5 h-5" />
              Execute Trade
            </button>
          </motion.div>
        </div>

        {/* Popular Stocks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8"
        >
          <h2 className="text-xl font-semibold mb-4">Popular Among Students 🔥</h2>
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
            {LIFESTYLE_BRANDS.slice(0, 8).map((stock) => (
              <button
                key={stock.ticker}
                onClick={() => setSelectedStock(stock.ticker)}
                className={`card hover:shadow-md transition-all duration-200 ${
                  selectedStock === stock.ticker ? 'ring-2 ring-primary-500' : ''
                }`}
              >
                <div className="text-center">
                  <div className="text-3xl mb-2">{stock.logo}</div>
                  <div className="font-medium">{stock.ticker}</div>
                  <div className="text-sm text-gray-500 mb-2">{stock.name}</div>
                  <div className="font-semibold text-primary-600">
                    ${MOCK_PRICES[stock.ticker]}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default TradePage