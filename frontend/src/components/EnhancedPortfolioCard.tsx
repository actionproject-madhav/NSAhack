import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, ChevronDown } from 'lucide-react'

const EnhancedPortfolioCard = () => {
  return (
    <motion.div 
      className="bg-white rounded-2xl p-5 shadow-sm flex flex-col h-[320px]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Balance Section */}
      <div className="mb-4">
        <h3 className="text-base font-medium text-gray-600 mb-2">Balance</h3>
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl px-4 py-3 flex-1">
            <div className="text-white text-lg font-semibold">$14,032.56</div>
          </div>
          <div className="bg-green-100 rounded-xl px-3 py-3">
            <span className="text-green-700 font-medium text-sm">+5.63%</span>
          </div>
        </div>
      </div>

      {/* Invested Section */}
      <div className="mb-4">
        <h3 className="text-base font-medium text-gray-600 mb-2">Invested</h3>
        <div className="bg-gray-800 rounded-xl p-3 flex items-center justify-between">
          <div className="text-white text-lg font-semibold">$7,532.21</div>
          <motion.button
            className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowRight className="w-3 h-3 text-white" />
          </motion.button>
        </div>
      </div>

      {/* Portfolio Summary Section */}
      <div className="flex-1">
        <h3 className="text-base font-medium text-gray-400 mb-3">Portfolio Summary</h3>
        
        {/* Portfolio Stats */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-gray-500 text-xs mb-1">Total Stocks</p>
            <p className="font-medium text-gray-900 text-lg">5</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs mb-1">Avg. Performance</p>
            <p className="font-medium text-green-500 text-lg">+12.4%</p>
          </div>
          <div className="flex items-end">
            <svg width="60" height="20" viewBox="0 0 60 20">
              <polyline
                points="0,15 10,10 20,12 30,8 40,11 50,6 60,9"
                fill="none"
                stroke="#34D399"
                strokeWidth="1.5"
              />
            </svg>
          </div>
        </div>      
      </div>
    </motion.div>
  )
}

export default EnhancedPortfolioCard