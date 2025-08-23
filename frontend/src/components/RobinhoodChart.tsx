import React from 'react'
import TradingViewMiniWidget from './TradingViewMiniWidget'

const RobinhoodChart = () => {
  return (
    <div className="w-full bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Portfolio</h3>
           
          </div>
          <span className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-md">1W</span>
        </div>
      </div>
      <TradingViewMiniWidget 
        symbol="QQQ" 
        height="280px"
        theme="light"
      />
    </div>
  )
}

export default RobinhoodChart