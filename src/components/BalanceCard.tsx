import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const BalanceCard = () => {
  return (
    <div className="space-y-4">
      {/* Balance */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Balance</h3>
          <div className="flex gap-2">
            <span className="px-2 py-1 bg-white/20 rounded text-xs">NASDAQ</span>
            <span className="px-2 py-1 bg-white/20 rounded text-xs">BSE</span>
            <span className="px-2 py-1 bg-white/20 rounded text-xs">Euronext</span>
            <span className="px-2 py-1 bg-white/20 rounded text-xs">BSE</span>
          </div>
        </div>

        <div className="mb-4">
          <div className="text-3xl font-bold mb-1">$14,032.56</div>
          <div className="flex items-center gap-2">
            <span className="text-green-300 text-sm">+5.63%</span>
          </div>
        </div>
      </div>

      {/* Invested */}
      <div className="bg-gray-800 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-2">Invested</h3>
            <div className="text-2xl font-bold">$7532.21</div>
          </div>
          <motion.button
            className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      {/* Top Stock */}
      <div className="bg-white rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Stock</h3>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
            <span className="text-red-600 font-bold text-sm">T</span>
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold text-gray-900">Tesla Inc</p>
                <p className="text-sm text-gray-500">TSLA</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">+7.03</p>
                <p className="text-sm text-gray-500">+2.34%</p>
              </div>
            </div>
            <div className="mt-3 flex justify-between text-sm">
              <div>
                <p className="text-gray-500">Invested Value</p>
                <p className="font-semibold">$26.34</p>
              </div>
              <div className="text-right">
                <p className="text-gray-500">Current Value</p>
                <p className="font-semibold">$177.90</p>
              </div>
            </div>

            {/* Mini chart */}
            <div className="mt-3">
              <svg width="100%" height="40" viewBox="0 0 200 40">
                <path
                  d="M10 30 L50 25 L90 20 L130 15 L170 10 L190 8"
                  stroke="#10b981"
                  strokeWidth="2"
                  fill="none"
                />
                <defs>
                  <linearGradient id="tesla-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d="M10 30 L50 25 L90 20 L130 15 L170 10 L190 8 L190 40 L10 40 Z"
                  fill="url(#tesla-gradient)"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BalanceCard