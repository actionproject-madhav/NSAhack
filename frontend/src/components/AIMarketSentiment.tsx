import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TrendingUp, TrendingDown, BarChart3, Globe, Zap, AlertTriangle, CheckCircle, Clock, Target, RefreshCw, ExternalLink, Search } from 'lucide-react'

interface SentimentData {
  ticker: string
  headline: string
  time: string
  sentiment_score: number
  boost_reason: string
  open_price?: string
  close_price?: string
}

const AIMarketSentiment = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [sentimentData, setSentimentData] = useState<SentimentData[]>([])
  const [filteredData, setFilteredData] = useState<SentimentData[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'sentiment' | 'time' | 'ticker'>('sentiment')

  const mockSentimentData: SentimentData[] = [
    {
      ticker: 'DGNX',
      headline: 'Diginex Limited Announces Completion of Definitive Agreement to Acquire Matter DK ApS, Expanding Its Sustainability Data and AI Capabilities',
      time: '09:00 AM',
      sentiment_score: 0.970,
      boost_reason: 'Acquisition'
    },
    {
      ticker: 'BLK',
      headline: 'Global Infrastructure Partners Enters Agreement to Acquire Co-Control Stake of 49.99% in Eni CCUS Holding',
      time: '09:00 AM',
      sentiment_score: 0.970,
      boost_reason: 'Acquisition'
    },
    {
      ticker: 'VNTG',
      headline: 'Vantage Corp Further Expands Asia-Pacific Presence with Two Additional LOIs to Acquire a Hong Kong and Mainland China-Based Shipbroking Firm',
      time: '08:30 AM',
      sentiment_score: 0.970,
      boost_reason: 'Acquisition'
    },
    {
      ticker: 'ONDS',
      headline: 'Ondas Enters into Definitive Agreement to Strengthen Multi-Domain Autonomy Leadership with Strategic Acquisition of Robotics Innovator Apeiro Motion',
      time: '08:30 AM',
      sentiment_score: 0.970,
      boost_reason: 'Acquisition'
    },
    {
      ticker: 'LII',
      headline: 'Lennox Signs Agreement to Acquire HVAC Division of NSI Industries',
      time: '08:00 AM',
      sentiment_score: 0.970,
      boost_reason: 'Acquisition'
    },
    {
      ticker: 'EMPD',
      headline: 'Empery Digital Secures $25 Million Credit Facility to Fund Share Repurchases',
      time: '06:00 AM',
      sentiment_score: 0.970,
      boost_reason: 'Acquisition'
    },
    {
      ticker: 'ATLX',
      headline: 'Atlas Lithium Reports Excellent Exploration Progress at 100%-Owned Salinas Project',
      time: '06:00 AM',
      sentiment_score: 0.943,
      boost_reason: 'Base'
    },
    {
      ticker: 'RSKD',
      headline: 'Riskified Reports Strong Q2 Results with Revenue Growth and Improved Profitability',
      time: '06:00 AM',
      sentiment_score: 0.933,
      boost_reason: 'Base'
    }
  ]

  // Simulate AI sentiment analysis
  const runSentimentAnalysis = async () => {
    setIsAnalyzing(true)
    
    // Simulate API call to your Python backend
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    setSentimentData(mockSentimentData)
    setFilteredData(mockSentimentData)
    setIsAnalyzing(false)
  }

  // Filter and sort data
  useEffect(() => {
    let filtered = sentimentData
    
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.ticker.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.headline.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    // Sort data
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'sentiment':
          return b.sentiment_score - a.sentiment_score
        case 'time':
          return new Date(b.time).getTime() - new Date(a.time).getTime()
        case 'ticker':
          return a.ticker.localeCompare(b.ticker)
        default:
          return 0
      }
    })
    
    setFilteredData(filtered)
  }, [sentimentData, searchTerm, sortBy])

  const getCategoryFromTicker = (ticker: string) => {
    // Simple category mapping - you can customize this
    const categories = ['Finance', 'Technology', 'Healthcare', 'Energy', 'Consumer', 'Industrial']
    return categories[Math.floor(Math.random() * categories.length)]
  }

  const getSentimentColor = (score: number) => {
    if (score >= 0.7) return 'text-green-600 bg-green-100'
    if (score >= 0.4) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const getSentimentLabel = (score: number) => {
    if (score >= 0.7) return 'Very Positive'
    if (score >= 0.6) return 'Positive'
    if (score >= 0.4) return 'Neutral'
    if (score >= 0.3) return 'Negative'
    return 'Very Negative'
  }

  return (
    <div className="space-y-6">
      {/* Analysis Controls */}
      <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">StockTitan News Sentiment Engine</h3>
            <p className="text-sm text-gray-600">Scrapes today's financial news and analyzes sentiment using FinBERT + VADER + Custom Rules</p>
          </div>
          <motion.button
            onClick={runSentimentAnalysis}
            disabled={isAnalyzing}
            className="bg-gray-900 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Scraping News...</span>
              </>
            ) : (
              <>
                <Zap className="w-5 h-5" />
                <span>Scrape Today's News</span>
              </>
            )}
          </motion.button>
        </div>
        
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
            <span>FinBERT: Financial BERT model</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
            <span>VADER: Rule-based sentiment</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
            <span>Custom ML: Financial patterns</span>
          </div>
        </div>
      </div>

      {/* Search and Sort */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search headlines or tickers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-transparent"
        >
          <option value="sentiment">Sort by Sentiment</option>
          <option value="time">Sort by Time</option>
          <option value="ticker">Sort by Ticker</option>
        </select>
      </div>

      {/* News Grid */}
      <AnimatePresence>
        {filteredData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredData.map((item, index) => (
              <motion.div
                key={`${item.ticker}-${index}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 hover:border-gray-300"
              >
                {/* Category and AI Status Tags */}
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                    {getCategoryFromTicker(item.ticker)}
                  </span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    AI checked
                  </span>
                </div>

                {/* Headline */}
                <h3 className="font-semibold text-gray-900 text-lg leading-tight mb-4 line-clamp-3">
                  {item.headline}
                </h3>

                {/* Author and Time */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-gray-600">{item.ticker[0]}</span>
                    </div>
                    <span className="text-sm text-gray-600">{item.ticker}</span>
                  </div>
                  <span className="text-sm text-gray-500">{item.time}</span>
                </div>

                {/* Sentiment Score */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getSentimentColor(item.sentiment_score)}`}>
                      {getSentimentLabel(item.sentiment_score)}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">
                      {(item.sentiment_score * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Disclaimer */}
      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-center gap-2 text-gray-800 mb-2">
          <AlertTriangle className="w-4 h-4" />
          <span className="text-sm font-medium">Disclaimer</span>
        </div>
        <p className="text-sm text-gray-700">
          This sentiment analysis scrapes real-time news from StockTitan and uses FinBERT, VADER, and custom financial pattern recognition. 
          Sentiment scores are for informational purposes only and should not be considered as investment advice.
        </p>
      </div>
    </div>
  )
}

export default AIMarketSentiment
