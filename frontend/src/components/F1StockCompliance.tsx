import React, { useState, useEffect } from 'react'
import { Shield, AlertTriangle, CheckCircle, Clock, FileText, Lock, Info, TrendingUp } from 'lucide-react'

interface F1StockComplianceProps {
  ticker: string
  tradeAmount: number
  tradeType: 'buy' | 'sell'
  onComplianceCheck: (isCompliant: boolean, warnings: string[]) => void
}

interface TradingHistory {
  date: string
  ticker: string
  type: 'buy' | 'sell'
  amount: number
  timestamp: string
}

const F1StockCompliance: React.FC<F1StockComplianceProps> = ({ 
  ticker, 
  tradeAmount, 
  tradeType, 
  onComplianceCheck 
}) => {
  const [tradingHistory, setTradingHistory] = useState<TradingHistory[]>([])
  const [dayTradeCount, setDayTradeCount] = useState(0)
  const [weeklyTradeCount, setWeeklyTradeCount] = useState(0)
  const [complianceStatus, setComplianceStatus] = useState<'safe' | 'warning' | 'critical'>('safe')
  const [warnings, setWarnings] = useState<string[]>([])
  const [showDetails, setShowDetails] = useState(false)

  // Mock trading history - in real app, this would come from API
  useEffect(() => {
    const mockHistory: TradingHistory[] = [
      {
        date: '2025-01-27',
        ticker: 'AAPL',
        type: 'buy',
        amount: 500,
        timestamp: '09:30:00'
      },
      {
        date: '2025-01-26',
        ticker: 'TSLA',
        type: 'sell',
        amount: 300,
        timestamp: '14:45:00'
      },
      {
        date: '2025-01-25',
        ticker: 'NVDA',
        type: 'buy',
        amount: 400,
        timestamp: '11:20:00'
      },
      {
        date: '2025-01-24',
        ticker: 'META',
        type: 'sell',
        amount: 250,
        timestamp: '15:30:00'
      },
      {
        date: '2025-01-23',
        ticker: 'AAPL',
        type: 'buy',
        amount: 600,
        timestamp: '10:15:00'
      }
    ]
    setTradingHistory(mockHistory)
  }, [])

  // Calculate compliance metrics
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]
    const fiveDaysAgo = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    
    const todayTrades = tradingHistory.filter(trade => 
      trade.date === today && trade.ticker === ticker
    ).length
    
    const fiveDayTrades = tradingHistory.filter(trade => 
      trade.date >= fiveDaysAgo && trade.ticker === ticker
    ).length
    
    const weeklyTrades = tradingHistory.filter(trade => 
      trade.date >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    ).length

    setDayTradeCount(todayTrades)
    setWeeklyTradeCount(weeklyTrades)

    // Compliance rules enforcement
    const newWarnings: string[] = []
    let status: 'safe' | 'warning' | 'critical' = 'safe'

    // Rule 1: Pattern Day Trading (4+ trades in 5 business days)
    if (fiveDayTrades >= 4) {
      newWarnings.push('⚠️ Pattern Day Trader (PDT) status triggered. Requires $25,000 minimum balance.')
      status = 'critical'
    } else if (fiveDayTrades >= 2) {
      newWarnings.push('⚠️ Approaching PDT limit. Only ' + (4 - fiveDayTrades) + ' trades remaining in 5-day window.')
      status = 'warning'
    }

    // Rule 2: F-1 Visa Compliance - Frequent trading risk
    if (weeklyTrades >= 10) {
      newWarnings.push('🚨 High trading frequency may violate F-1 visa status. Consider reducing activity.')
      status = 'critical'
    } else if (weeklyTrades >= 5) {
      newWarnings.push('⚠️ Moderate trading frequency. Monitor for visa compliance.')
      status = 'warning'
    }

    // Rule 3: Large trade amounts
    if (tradeAmount > 5000) {
      newWarnings.push('📋 Large trade amount requires additional documentation for tax purposes.')
      status = status === 'safe' ? 'warning' : status
    }

    // Rule 4: Same-day buy/sell of same stock
    const todayStockTrades = tradingHistory.filter(trade => 
      trade.date === today && trade.ticker === ticker
    )
    if (todayStockTrades.length >= 2) {
      newWarnings.push('🔄 Multiple trades of same stock today may trigger day trading rules.')
      status = status === 'safe' ? 'warning' : status
    }

    setWarnings(newWarnings)
    setComplianceStatus(status)
    onComplianceCheck(status === 'safe', newWarnings)
  }, [ticker, tradeAmount, tradeType, tradingHistory, onComplianceCheck])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'safe': return 'text-green-600 bg-green-50 border-green-200'
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'critical': return 'text-red-600 bg-red-50 border-red-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'safe': return <CheckCircle className="w-4 h-4" />
      case 'warning': return <Clock className="w-4 h-4" />
      case 'critical': return <AlertTriangle className="w-4 h-4" />
      default: return <Info className="w-4 h-4" />
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900">F-1 Compliance Status</h3>
        </div>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-sm text-blue-600 hover:text-blue-700"
        >
          {showDetails ? 'Hide Details' : 'Show Details'}
        </button>
      </div>

      {/* Status Indicator */}
      <div className={`rounded-lg p-3 mb-4 border ${getStatusColor(complianceStatus)}`}>
        <div className="flex items-center gap-2 mb-2">
          {getStatusIcon(complianceStatus)}
          <span className="font-medium text-sm">
            {complianceStatus === 'safe' ? 'Safe to Trade' :
             complianceStatus === 'warning' ? 'Trade with Caution' :
             'Trading Restricted'}
          </span>
        </div>
        <p className="text-xs">
          {complianceStatus === 'safe' ? 'Your trading pattern complies with F-1 visa requirements.' :
           complianceStatus === 'warning' ? 'Monitor your trading frequency to maintain compliance.' :
           'Immediate action required to maintain visa status.'}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="text-lg font-bold text-gray-900">{dayTradeCount}</div>
          <div className="text-xs text-gray-600">Today's Trades</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-gray-900">{weeklyTradeCount}</div>
          <div className="text-xs text-gray-600">Weekly Trades</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-gray-900">4</div>
          <div className="text-xs text-gray-600">PDT Limit</div>
        </div>
      </div>

      {/* Warnings */}
      {warnings.length > 0 && (
        <div className="mb-4">
          <h4 className="font-medium text-gray-900 mb-2 text-sm">Compliance Warnings</h4>
          <div className="space-y-2">
            {warnings.map((warning, index) => (
              <div key={index} className="flex items-start gap-2 text-sm">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-700">{warning}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detailed View */}
      {showDetails && (
        <div className="border-t pt-4">
          <h4 className="font-medium text-gray-900 mb-3 text-sm">Recent Trading Activity</h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {tradingHistory.slice(0, 5).map((trade, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <TrendingUp className={`w-3 h-3 ${
                    trade.type === 'buy' ? 'text-green-600' : 'text-red-600'
                  }`} />
                  <span className="font-medium">{trade.ticker}</span>
                  <span className="text-gray-500">${trade.amount}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-gray-500">{trade.date}</span>
                  <span className="text-xs text-gray-400">{trade.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Button */}
      <button className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
        View Full Compliance Report
      </button>
    </div>
  )
}

export default F1StockCompliance
