import React from 'react'
import { StockChart } from './StockChart'

const RobinhoodChart = () => {
  return (
    <div className="w-full">
      <StockChart 
        symbol="SPY" 
        height={250}
        className="shadow-sm"
      />
    </div>
  )
}

export default RobinhoodChart