import React, { useState } from 'react'
import { Shield, AlertTriangle, CheckCircle, Clock, FileText, Download } from 'lucide-react'

const F1ComplianceTracker: React.FC = () => {
  const [trades, setTrades] = useState([
    { date: '2025-01-20', type: 'buy', ticker: 'VTI', amount: 500, status: 'safe' },
    { date: '2025-01-18', type: 'buy', ticker: 'SPY', amount: 300, status: 'safe' },
    { date: '2025-01-15', type: 'sell', ticker: 'AAPL', amount: 200, status: 'safe' },
    { date: '2025-01-12', type: 'buy', ticker: 'TSLA', amount: 400, status: 'warning' },
  ])

  const dayTrades = trades.filter(trade => {
    // Mock day trade detection logic
    return trade.ticker === 'TSLA' && trade.amount > 300
  }).length

  const totalTrades = trades.length
  const riskLevel = dayTrades >= 3 ? 'high' : dayTrades >= 1 ? 'medium' : 'low'

  const requiredDocuments = [
    { name: 'I-20 Form', status: 'valid', expiry: '2026-05-15', description: 'Certificate of Eligibility for Nonimmigrant Student Status' },
    { name: 'F-1 Visa', status: 'valid', expiry: '2026-05-15', description: 'Student visa in passport' },
  ]

  const complianceRules = [
    'Maintain full-time enrollment (12+ credits)',
    'No more than 3 day trades per 5 business days',
    'Keep trading activity passive (not day trading)',
    'Maintain valid immigration status',
    'Report address changes within 10 days'
  ]

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border h-[400px] flex flex-col">
      <div className="flex items-center gap-3 mb-4">
        
        <div>
          <h3 className="text-lg font-semibold text-gray-900">F-1 Compliance Tracker</h3>
          <p className="text-sm text-gray-600">Monitor visa-safe trading patterns</p>
        </div>
      </div>

      {/* Risk Status */}
      <div className={`rounded-lg p-4 mb-4 ${
        riskLevel === 'high' ? 'bg-red-50 border border-red-200' :
        riskLevel === 'medium' ? 'bg-yellow-50 border border-yellow-200' :
        'bg-green-50 border border-green-200'
      }`}>
        <div className="flex items-center gap-2 mb-2">
          {riskLevel === 'high' ? (
            <AlertTriangle className="w-4 h-4 text-red-600" />
          ) : riskLevel === 'medium' ? (
            <Clock className="w-4 h-4 text-yellow-600" />
          ) : (
            <CheckCircle className="w-4 h-4 text-green-600" />
          )}
          <span className={`font-medium text-sm ${
            riskLevel === 'high' ? 'text-red-800' :
            riskLevel === 'medium' ? 'text-yellow-800' :
            'text-green-800'
          }`}>
            {riskLevel === 'high' ? 'High Risk' :
             riskLevel === 'medium' ? 'Moderate Risk' :
             'Safe Trading Pattern'}
          </span>
        </div>
        <p className={`text-xs ${
          riskLevel === 'high' ? 'text-red-700' :
          riskLevel === 'medium' ? 'text-yellow-700' :
          'text-green-700'
        }`}>
          {riskLevel === 'high' ? 'Frequent trading may violate F-1 status' :
           riskLevel === 'medium' ? 'Monitor trading frequency carefully' :
           'Your trading pattern is visa-compliant'}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{dayTrades}</div>
          <div className="text-xs text-gray-600">Day Trades (5 days)</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{totalTrades}</div>
          <div className="text-xs text-gray-600">Total Trades (30 days)</div>
        </div>
      </div>

      {/* Required Documents */}
      <div className="flex-1">
        <h4 className="font-medium text-gray-900 mb-3 text-sm flex items-center gap-2">
          <FileText className="w-4 h-4 text-blue-600" />
          Required Documents
        </h4>
        <div className="space-y-2 max-h-24 overflow-y-auto">
          {requiredDocuments.slice(0, 3).map((doc, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-3 h-3 text-green-500" />
                <span className="font-medium">{doc.name}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  doc.status === 'valid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {doc.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Button */}
      <button className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
        View Full Report
      </button>
    </div>
  )
}

export default F1ComplianceTracker