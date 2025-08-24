import React, { useState } from 'react'
import { TrendingUp, TrendingDown, Eye, EyeOff, RefreshCw } from 'lucide-react'

interface OrderBookEntry {
  price: number
  amount: number
  total: number
  orders: number
  side: 'bid' | 'ask'
}

interface EnhancedOrderBookProps {
  symbol: string
  currentPrice: number
}

const EnhancedOrderBook: React.FC<EnhancedOrderBookProps> = ({ symbol, currentPrice }) => {
  const [showDetailed, setShowDetailed] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(true)

  // Mock enhanced order book data
  const generateOrderBookData = (): OrderBookEntry[] => {
    const data: OrderBookEntry[] = []
    
    // Bids (buy orders)
    for (let i = 0; i < 15; i++) {
      const price = currentPrice - (i * 0.05) - 0.02
      const amount = Math.floor(Math.random() * 2000) + 100
      const orders = Math.floor(Math.random() * 50) + 1
      data.push({
        price,
        amount,
        total: price * amount,
        orders,
        side: 'bid'
      })
    }
    
    // Asks (sell orders)
    for (let i = 0; i < 15; i++) {
      const price = currentPrice + (i * 0.05) + 0.02
      const amount = Math.floor(Math.random() * 2000) + 100
      const orders = Math.floor(Math.random() * 50) + 1
      data.push({
        price,
        amount,
        total: price * amount,
        orders,
        side: 'ask'
      })
    }
    
    return data.sort((a, b) => b.price - a.price)
  }

  const orderBookData = generateOrderBookData()
  const bids = orderBookData.filter(order => order.side === 'bid').slice(0, 10)
  const asks = orderBookData.filter(order => order.side === 'ask').slice(0, 10)

  const formatPrice = (price: number) => {
    return price.toFixed(2)
  }

  const formatAmount = (amount: number) => {
    return amount.toLocaleString()
  }

  const formatTotal = (total: number) => {
    return total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  const getPriceColor = (price: number, side: 'bid' | 'ask') => {
    if (side === 'bid') {
      return price < currentPrice ? 'text-green-600' : 'text-gray-900'
    } else {
      return price > currentPrice ? 'text-red-600' : 'text-gray-900'
    }
  }

  const getDepthColor = (side: 'bid' | 'ask') => {
    return side === 'bid' ? 'bg-green-100' : 'bg-red-100'
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mt-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Enhanced Order Book</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowDetailed(!showDetailed)}
            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
          >
            {showDetailed ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showDetailed ? 'Simple View' : 'Detailed View'}
          </button>
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`flex items-center gap-1 text-sm px-2 py-1 rounded ${
              autoRefresh 
                ? 'bg-green-100 text-green-700' 
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            <RefreshCw className={`w-4 h-4 ${autoRefresh ? 'animate-spin' : ''}`} />
            Auto
          </button>
        </div>
      </div>

      {showDetailed ? (
        // Detailed View
        <div className="grid grid-cols-2 gap-6">
          {/* Bids */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-green-600 flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                Bids (Buy Orders)
              </h4>
              <span className="text-sm text-gray-500">Total: {bids.reduce((sum, bid) => sum + bid.amount, 0).toLocaleString()}</span>
            </div>
            <div className="space-y-1">
              {bids.map((bid, index) => (
                <div key={index} className="flex items-center justify-between text-sm py-1">
                  <div className="flex items-center gap-3">
                    <span className={`font-medium ${getPriceColor(bid.price, 'bid')}`}>
                      {formatPrice(bid.price)}
                    </span>
                    <span className="text-gray-600 w-16 text-right">
                      {formatAmount(bid.amount)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 text-xs">
                      {bid.orders} orders
                    </span>
                    <span className="text-gray-600 font-medium">
                      {formatTotal(bid.total)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Asks */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-red-600 flex items-center gap-1">
                <TrendingDown className="w-4 h-4" />
                Asks (Sell Orders)
              </h4>
              <span className="text-sm text-gray-500">Total: {asks.reduce((sum, ask) => sum + ask.amount, 0).toLocaleString()}</span>
            </div>
            <div className="space-y-1">
              {asks.map((ask, index) => (
                <div key={index} className="flex items-center justify-between text-sm py-1">
                  <div className="flex items-center gap-3">
                    <span className={`font-medium ${getPriceColor(ask.price, 'ask')}`}>
                      {formatPrice(ask.price)}
                    </span>
                    <span className="text-gray-600 w-16 text-right">
                      {formatAmount(ask.amount)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 text-xs">
                      {ask.orders} orders
                    </span>
                    <span className="text-gray-600 font-medium">
                      {formatTotal(ask.total)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        // Simple View
        <div className="grid grid-cols-2 gap-6">
          {/* Bids */}
          <div>
            <h4 className="font-medium text-green-600 mb-3">Bids</h4>
            <div className="space-y-2">
              {bids.slice(0, 5).map((bid, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-green-600 font-medium">{formatPrice(bid.price)}</span>
                  <span className="text-gray-600">{formatAmount(bid.amount)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Asks */}
          <div>
            <h4 className="font-medium text-red-600 mb-3">Asks</h4>
            <div className="space-y-2">
              {asks.slice(0, 5).map((ask, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-red-600 font-medium">{formatPrice(ask.price)}</span>
                  <span className="text-gray-600">{formatAmount(ask.amount)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Market Depth Visualization */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <h4 className="font-medium text-gray-900 mb-3">Market Depth</h4>
        <div className="flex items-end h-20 gap-1">
          {bids.slice(0, 8).reverse().map((bid, index) => (
            <div
              key={`bid-${index}`}
              className="flex-1 bg-green-200 rounded-t"
              style={{ height: `${(bid.amount / 2000) * 100}%` }}
              title={`Bid: $${formatPrice(bid.price)} - ${formatAmount(bid.amount)} shares`}
            />
          ))}
          <div className="w-1 h-full bg-gray-400 mx-2"></div>
          {asks.slice(0, 8).map((ask, index) => (
            <div
              key={`ask-${index}`}
              className="flex-1 bg-red-200 rounded-t"
              style={{ height: `${(ask.amount / 2000) * 100}%` }}
              title={`Ask: $${formatPrice(ask.price)} - ${formatAmount(ask.amount)} shares`}
            />
          ))}
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Bids</span>
          <span>Current: ${formatPrice(currentPrice)}</span>
          <span>Asks</span>
        </div>
      </div>

      {/* Order Book Statistics */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">
              {orderBookData.length}
            </div>
            <div className="text-gray-600">Total Orders</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-green-600">
              ${formatPrice(bids[0]?.price || 0)}
            </div>
            <div className="text-gray-600">Best Bid</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-red-600">
              ${formatPrice(asks[0]?.price || 0)}
            </div>
            <div className="text-gray-600">Best Ask</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EnhancedOrderBook
