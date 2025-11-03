import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import TradingViewWidget from '../components/TradingViewWidget'
import Navigation from '../components/Navigation'
import StockAnalysisChat from '../components/StockAnalysisChat'
import InternationalStudentAlerts from '../components/InternationalStudentAlerts'
import F1StockCompliance from '../components/F1StockCompliance'
import apiService from '../services/apiService'
import { useUser } from '../context/UserContext'

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
};

const formatLargeNumber = (value: number) => {
  if (value >= 1e12) {
    return `${(value / 1e12).toFixed(2)}T`;
  } else if (value >= 1e9) {
    return `${(value / 1e9).toFixed(2)}B`;
  } else if (value >= 1e6) {
    return `${(value / 1e6).toFixed(2)}M`;
  }
  return `${value}`;
};

export default function StockDetailPage() {
  const { symbol } = useParams<{ symbol: string }>();
  const navigate = useNavigate();
  const { user, updatePortfolio } = useUser();
  const [stock, setStock] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAnalysisChatOpen, setIsAnalysisChatOpen] = useState(false)
  const [complianceStatus, setComplianceStatus] = useState<{ isCompliant: boolean; warnings: string[] }>({
    isCompliant: true,
    warnings: []
  })
  const [tradeQuantity, setTradeQuantity] = useState(10)
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy')

  // Fetch real stock data from API
  useEffect(() => {
    const fetchStockDetails = async () => {
      if (!symbol) return
      
      setIsLoading(true)
      setError(null)
      
      try {
        console.log(`📊 Fetching real stock details for ${symbol}...`)
        const details = await apiService.getStockDetails(symbol)
        
        if (details) {
          setStock(details)
          console.log(`✅ Loaded real data for ${symbol}`)
        } else {
          setError('Stock not found')
        }
      } catch (err) {
        console.error('Error fetching stock details:', err)
        setError('Failed to load stock data')
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchStockDetails()
  }, [symbol])

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <h1 className="text-2xl font-bold mb-4">Loading {symbol}...</h1>
            <p className="text-gray-600">Fetching real-time stock data...</p>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !stock) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Stock Not Found</h1>
            <p className="text-gray-600">{error || 'The requested stock symbol could not be found.'}</p>
            <button onClick={() => navigate('/screener')} className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg">
              Back to Screener
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isPositive = stock.regularMarketChange >= 0;

  const handleAnalyzeClick = () => {
    setIsAnalysisChatOpen(true)
  }

  const handleComplianceCheck = (isCompliant: boolean, warnings: string[]) => {
    setComplianceStatus({ isCompliant, warnings })
  }

  const handleTrade = () => {
    if (!user) {
      alert('Please log in to trade')
      return
    }

    if (tradeType === 'buy') {
      updatePortfolio({
        ticker: stock.symbol,
        company: stock.shortName,
        quantity: tradeQuantity,
        avgPrice: stock.regularMarketPrice,
        currentPrice: stock.regularMarketPrice,
        reason: 'Manual purchase',
        logo: '📈'
      })
      alert(`Successfully added ${tradeQuantity} shares of ${stock.symbol} to your portfolio!`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <button 
            onClick={() => navigate('/screener')}
            className="text-gray-600 hover:text-gray-900 flex items-center gap-2 mb-4"
          >
            ← Back to Screener
          </button>
          
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{stock.shortName}</h1>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <span className="font-medium">{stock.symbol}</span>
                <span>•</span>
                <span>{stock.fullExchangeName}</span>
                <span>•</span>
                <span>{stock.sector}</span>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-900">
                {formatCurrency(stock.regularMarketPrice)}
              </div>
              <div className={`text-lg font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {isPositive ? '+' : ''}{stock.regularMarketChange.toFixed(2)} ({isPositive ? '+' : ''}{stock.regularMarketChangePercent.toFixed(2)}%)
              </div>
            </div>
          </div>
        </div>

        {/* Main Chart */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <TradingViewWidget symbol={stock.symbol} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - Stock Info */}
          <div className="lg:col-span-8 space-y-6">
            {/* Key Statistics */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-semibold text-lg mb-4">Key Statistics</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <div className="text-sm text-gray-600">Market Cap</div>
                  <div className="font-semibold">{formatLargeNumber(stock.marketCap)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">P/E Ratio</div>
                  <div className="font-semibold">{stock.peRatio.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Volume</div>
                  <div className="font-semibold">{formatLargeNumber(stock.volume)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Open</div>
                  <div className="font-semibold">{formatCurrency(stock.open)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">High</div>
                  <div className="font-semibold">{formatCurrency(stock.high)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Low</div>
                  <div className="font-semibold">{formatCurrency(stock.low)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Previous Close</div>
                  <div className="font-semibold">{formatCurrency(stock.previousClose)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">52W High</div>
                  <div className="font-semibold">{formatCurrency(stock.fiftyTwoWeekHigh || 0)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">52W Low</div>
                  <div className="font-semibold">{formatCurrency(stock.fiftyTwoWeekLow || 0)}</div>
                </div>
              </div>
            </div>

            {/* Company Information */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-semibold text-lg mb-4">About {stock.shortName}</h3>
              <div className="space-y-4">
                <p className="text-gray-700">{stock.description}</p>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <div className="text-sm text-gray-600">Industry</div>
                    <div className="font-medium">{stock.industry}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Sector</div>
                    <div className="font-medium">{stock.sector}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Employees</div>
                    <div className="font-medium">{stock.employees?.toLocaleString() || 'N/A'}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Website</div>
                    {stock.website && (
                      <a href={stock.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        Visit Site
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Trading & Alerts */}
          <div className="lg:col-span-4 space-y-6">
            {/* International Student Alerts */}
            {user?.visaStatus && (
              <InternationalStudentAlerts
                ticker={stock.symbol}
                tradeAmount={stock.regularMarketPrice * tradeQuantity}
                tradeType={tradeType}
              />
            )}

            {/* Trade Panel */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-semibold text-lg mb-4">Trade {stock.symbol}</h3>
              
              <div className="space-y-4">
                {/* Buy/Sell Toggle */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setTradeType('buy')}
                    className={`px-4 py-2 rounded-lg font-medium ${
                      tradeType === 'buy' 
                        ? 'bg-green-600 text-white' 
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    Buy
                  </button>
                  <button
                    onClick={() => setTradeType('sell')}
                    className={`px-4 py-2 rounded-lg font-medium ${
                      tradeType === 'sell' 
                        ? 'bg-red-600 text-white' 
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    Sell
                  </button>
                </div>

                {/* Quantity */}
                <div>
                  <label className="text-sm text-gray-600 mb-2 block">Quantity (shares)</label>
                  <input
                    type="number"
                    value={tradeQuantity}
                    onChange={(e) => setTradeQuantity(parseInt(e.target.value) || 1)}
                    min="1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                {/* Total */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total</span>
                    <span className="text-xl font-bold text-gray-900">
                      {formatCurrency(stock.regularMarketPrice * tradeQuantity)}
                    </span>
                  </div>
                </div>

                {/* Trade Button */}
                <button
                  onClick={handleTrade}
                  className={`w-full py-3 rounded-lg font-semibold text-white ${
                    tradeType === 'buy' 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {tradeType === 'buy' ? 'Buy' : 'Sell'} {stock.symbol}
                </button>
              </div>
            </div>

            {/* F-1 Compliance Check */}
            {user?.visaStatus && (
              <F1StockCompliance
                ticker={stock.symbol}
                tradeAmount={stock.regularMarketPrice * tradeQuantity}
                tradeType={tradeType}
                onComplianceCheck={handleComplianceCheck}
              />
            )}

            {/* AI Analysis Button */}
            <button
              onClick={handleAnalyzeClick}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
            >
              🤖 AI Analysis
            </button>
          </div>
        </div>

        {/* Real Data Notice */}
        <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-green-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h4 className="font-medium text-green-900 mb-1">Real-Time Data</h4>
              <p className="text-sm text-green-700">
                All stock data on this page is fetched in real-time from Yahoo Finance. Prices, statistics, and company information are current and accurate.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* AI Analysis Chat */}
      {isAnalysisChatOpen && (
        <StockAnalysisChat
          symbol={stock.symbol}
          companyName={stock.shortName}
          currentPrice={stock.regularMarketPrice}
          onClose={() => setIsAnalysisChatOpen(false)}
        />
      )}
    </div>
  )
}

