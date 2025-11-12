import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { aiHubApi, DailyBrief, StockAnalysis, TrendingStock, InternationalStock } from '../services/aiHubApi'

const AIHub = () => {
  const [dailyBrief, setDailyBrief] = useState<DailyBrief | null>(null)
  const [searchTicker, setSearchTicker] = useState('')
  const [stockAnalysis, setStockAnalysis] = useState<StockAnalysis | null>(null)
  const [trendingStocks, setTrendingStocks] = useState<TrendingStock[]>([])
  const [internationalStocks, setInternationalStocks] = useState<InternationalStock[]>([])
  
  const [loadingBrief, setLoadingBrief] = useState(false)
  const [loadingAnalysis, setLoadingAnalysis] = useState(false)
  const [loadingTrending, setLoadingTrending] = useState(false)
  const [loadingInternational, setLoadingInternational] = useState(false)
  
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadDailyBrief()
    loadTrendingStocks()
    loadInternationalStocks()
  }, [])

  const loadDailyBrief = async () => {
    setLoadingBrief(true)
    setError(null)
    try {
      const brief = await aiHubApi.getDailyBrief()
      setDailyBrief(brief)
    } catch (err) {
      setError('Failed to load daily brief')
      console.error(err)
    } finally {
      setLoadingBrief(false)
    }
  }

  const loadTrendingStocks = async () => {
    setLoadingTrending(true)
    try {
      const stocks = await aiHubApi.getTrendingStocks()
      setTrendingStocks(stocks)
    } catch (err) {
      console.error('Failed to load trending stocks:', err)
    } finally {
      setLoadingTrending(false)
    }
  }

  const loadInternationalStocks = async () => {
    setLoadingInternational(true)
    try {
      const stocks = await aiHubApi.getInternationalStocks()
      setInternationalStocks(stocks)
    } catch (err) {
      console.error('Failed to load international stocks:', err)
    } finally {
      setLoadingInternational(false)
    }
  }

  const handleStockSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchTicker.trim()) return

    setLoadingAnalysis(true)
    setError(null)
    setStockAnalysis(null)

    try {
      const analysis = await aiHubApi.getStockIntelligence(searchTicker.toUpperCase())
      setStockAnalysis(analysis)
    } catch (err) {
      setError('Failed to analyze stock. Check ticker symbol.')
      console.error(err)
    } finally {
      setLoadingAnalysis(false)
    }
  }

  const formatTime = (isoString: string) => {
    const date = new Date(isoString)
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    })
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black dark:text-white mb-2">
            AI Market Intelligence
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Real-time market insights powered by AI, tailored for international students
          </p>
        </div>

        {/* Daily Market Brief */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-black dark:text-white">
              Today's Market Brief
            </h2>
            {dailyBrief && (
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Updated {formatTime(dailyBrief.generated_at)}
              </span>
            )}
          </div>

          {loadingBrief && (
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4 mb-3"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full mb-3"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-5/6"></div>
            </div>
          )}

          {!loadingBrief && dailyBrief && (
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">
                {dailyBrief.summary}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                Based on {dailyBrief.news_count} recent market news articles
              </p>
            </div>
          )}

          {error && !loadingBrief && (
            <p className="text-red-600 dark:text-red-400">{error}</p>
          )}
        </div>

        {/* Stock Intelligence Search */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 mb-6">
          <h2 className="text-xl font-bold text-black dark:text-white mb-4">
            Stock Intelligence Search
          </h2>

          <form onSubmit={handleStockSearch} className="mb-6">
            <div className="flex gap-3">
              <input
                type="text"
                value={searchTicker}
                onChange={(e) => setSearchTicker(e.target.value)}
                placeholder="Enter stock ticker (e.g., AAPL, TSLA, BABA)"
                className="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 text-black dark:text-white"
              />
              <button
                type="submit"
                disabled={loadingAnalysis || !searchTicker.trim()}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors"
              >
                {loadingAnalysis ? 'Analyzing...' : 'Analyze'}
              </button>
            </div>
          </form>

          {loadingAnalysis && (
            <div className="animate-pulse space-y-3">
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-5/6"></div>
            </div>
          )}

          {stockAnalysis && !loadingAnalysis && (
            <div className="space-y-4">
              <div className="flex items-baseline gap-4">
                <h3 className="text-2xl font-bold text-black dark:text-white">
                  {stockAnalysis.ticker}
                </h3>
                <span className="text-xl font-semibold text-black dark:text-white">
                  ${stockAnalysis.price.toFixed(2)}
                </span>
                <span className={`text-sm font-medium ${
                  stockAnalysis.change >= 0 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {stockAnalysis.change >= 0 ? '+' : ''}{stockAnalysis.change.toFixed(2)} 
                  ({stockAnalysis.change_percent >= 0 ? '+' : ''}{stockAnalysis.change_percent.toFixed(2)}%)
                </span>
              </div>

              <div className="prose dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">
                  {stockAnalysis.analysis}
                </p>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-700">
                <span>Based on {stockAnalysis.news_count} recent news articles</span>
                <span>Generated {formatTime(stockAnalysis.generated_at)}</span>
              </div>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Trending Stocks */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <h2 className="text-xl font-bold text-black dark:text-white mb-4">
              Trending Now
            </h2>

            {loadingTrending && (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="animate-pulse flex justify-between">
                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/4"></div>
                  </div>
                ))}
              </div>
            )}

            {!loadingTrending && trendingStocks.length > 0 && (
              <div className="space-y-3">
                {trendingStocks.map(stock => (
                  <div 
                    key={stock.ticker}
                    className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0"
                  >
                    <div>
                      <span className="font-semibold text-black dark:text-white">
                        {stock.ticker}
                      </span>
                      <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                        {stock.news_count} news
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-black dark:text-white">
                        ${stock.price.toFixed(2)}
                      </div>
                      <div className={`text-sm ${
                        stock.change_percent >= 0 
                          ? 'text-green-600 dark:text-green-400' 
                          : 'text-red-600 dark:text-red-400'
                      }`}>
                        {stock.change_percent >= 0 ? '+' : ''}{stock.change_percent.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* International Stocks */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <h2 className="text-xl font-bold text-black dark:text-white mb-4">
              Popular International
            </h2>

            {loadingInternational && (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="animate-pulse flex justify-between">
                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/4"></div>
                  </div>
                ))}
              </div>
            )}

            {!loadingInternational && internationalStocks.length > 0 && (
              <div className="space-y-3">
                {internationalStocks.map(stock => (
                  <div 
                    key={stock.ticker}
                    className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0"
                  >
                    <span className="font-semibold text-black dark:text-white">
                      {stock.ticker}
                    </span>
                    <div className="text-right">
                      <div className="font-medium text-black dark:text-white">
                        ${stock.price.toFixed(2)}
                      </div>
                      <div className={`text-sm ${
                        stock.change_percent >= 0 
                          ? 'text-green-600 dark:text-green-400' 
                          : 'text-red-600 dark:text-red-400'
                      }`}>
                        {stock.change_percent >= 0 ? '+' : ''}{stock.change_percent.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* International Student Note */}
        <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
          <p className="text-sm text-blue-900 dark:text-blue-100">
            <strong>Note for International Students:</strong> Consider currency exchange rates, tax implications for non-US residents, and ADR structure when investing. This is educational information, not investment advice.
          </p>
        </div>
      </div>
    </Layout>
  )
}

export default AIHub