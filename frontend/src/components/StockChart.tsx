import React, { useEffect, useRef, useState } from 'react'
import { alphaVantageAPI, TimeSeriesData } from '../services/alphaVantageApi'

interface StockChartProps {
  symbol: string
  className?: string
  height?: number
}

export const StockChart: React.FC<StockChartProps> = ({ 
  symbol, 
  className = "",
  height = 300 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [data, setData] = useState<TimeSeriesData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | '3M' | '1Y'>('1D')

  useEffect(() => {
    fetchChartData()
  }, [symbol, timeframe])

  const fetchChartData = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      console.log(`Fetching chart data for ${symbol} with timeframe ${timeframe}`)
      let chartData: TimeSeriesData[] = []
      
      if (timeframe === '1D') {
        chartData = await alphaVantageAPI.getIntradayData(symbol, '5min')
      } else {
        chartData = await alphaVantageAPI.getDailyData(symbol)
      }
      
      console.log(`Received ${chartData.length} data points for ${symbol}`)
      
      if (!chartData || chartData.length === 0) {
        // Fallback to mock data if API fails
        const mockData = generateMockData(symbol, timeframe)
        setData(mockData)
        return
      }
      
      // Sort by timestamp and take recent data based on timeframe
      const sortedData = chartData.sort((a, b) => 
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      )
      
      let filteredData = sortedData
      const now = new Date()
      
      switch (timeframe) {
        case '1D':
          filteredData = sortedData.slice(-78) // Last ~6.5 hours of 5min data
          break
        case '1W':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          filteredData = sortedData.filter(d => new Date(d.timestamp) >= weekAgo)
          break
        case '1M':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
          filteredData = sortedData.filter(d => new Date(d.timestamp) >= monthAgo)
          break
        case '3M':
          const threeMonthsAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
          filteredData = sortedData.filter(d => new Date(d.timestamp) >= threeMonthsAgo)
          break
        case '1Y':
          filteredData = sortedData.slice(-252) // Last ~1 year of trading days
          break
      }
      
      setData(filteredData)
    } catch (err) {
      console.error('Failed to fetch chart data:', err)
      // Fallback to mock data
      const mockData = generateMockData(symbol, timeframe)
      setData(mockData)
    } finally {
      setIsLoading(false)
    }
  }

  const generateMockData = (symbol: string, timeframe: string): TimeSeriesData[] => {
    const basePrice = 150 + Math.random() * 100
    const dataPoints = timeframe === '1D' ? 78 : 30
    const mockData: TimeSeriesData[] = []
    
    for (let i = 0; i < dataPoints; i++) {
      const timestamp = new Date(Date.now() - (dataPoints - i) * 5 * 60 * 1000).toISOString()
      const price = basePrice + (Math.random() - 0.5) * 10
      mockData.push({
        timestamp,
        open: price,
        high: price + Math.random() * 2,
        low: price - Math.random() * 2,
        close: price + (Math.random() - 0.5) * 1,
        volume: Math.floor(Math.random() * 1000000)
      })
    }
    
    return mockData
  }

  useEffect(() => {
    if (!data.length || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * window.devicePixelRatio
    canvas.height = rect.height * window.devicePixelRatio
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height)

    if (data.length === 0) return

    // Calculate price range
    const prices = data.map(d => d.close)
    const minPrice = Math.min(...prices)
    const maxPrice = Math.max(...prices)
    const priceRange = maxPrice - minPrice
    const padding = priceRange * 0.1

    // Chart dimensions
    const chartWidth = rect.width - 40
    const chartHeight = rect.height - 40
    const startX = 20
    const startY = 20

    // Draw price line
    ctx.beginPath()
    ctx.strokeStyle = data[data.length - 1].close > data[0].close ? '#10B981' : '#EF4444'
    ctx.lineWidth = 2
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    data.forEach((point, index) => {
      const x = startX + (index / (data.length - 1)) * chartWidth
      const y = startY + chartHeight - ((point.close - minPrice + padding) / (priceRange + 2 * padding)) * chartHeight

      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })
    ctx.stroke()

    // Fill area under curve
    ctx.lineTo(startX + chartWidth, startY + chartHeight)
    ctx.lineTo(startX, startY + chartHeight)
    ctx.closePath()
    
    const gradient = ctx.createLinearGradient(0, startY, 0, startY + chartHeight)
    const color = data[data.length - 1].close > data[0].close ? '#10B981' : '#EF4444'
    gradient.addColorStop(0, color + '20')
    gradient.addColorStop(1, color + '00')
    ctx.fillStyle = gradient
    ctx.fill()

  }, [data])

  const isPositive = data.length > 0 && data[data.length - 1].close > data[0].close

  return (
    <div className={`bg-white rounded-xl border border-gray-200 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{symbol}</h3>
          {data.length > 0 && (
            <div className="flex items-center gap-2 mt-1">
              <span className="text-2xl font-bold text-gray-900">
                ${data[data.length - 1].close.toFixed(2)}
              </span>
              <span className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {isPositive ? '+' : ''}
                {((data[data.length - 1].close - data[0].close) / data[0].close * 100).toFixed(2)}%
              </span>
            </div>
          )}
        </div>
        
        <div className="flex bg-gray-100 rounded-lg p-1">
          {(['1D', '1W', '1M', '3M', '1Y'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setTimeframe(period)}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                timeframe === period
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      <div className="relative" style={{ height: `${height}px` }}>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        )}
        
        {error && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}
        
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          style={{ width: '100%', height: '100%' }}
        />
      </div>
    </div>
  )
}
