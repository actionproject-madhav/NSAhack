import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const PortfolioChart = () => {
  const timeframes = ['1D', '5D', '1M', '6M', '1Y', '5Y', 'Max']

  return (
    <div className="bg-white rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Portfolio Analytics</h3>
        <div className="flex gap-2">
          {timeframes.map((timeframe, index) => (
            <button
              key={timeframe}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                timeframe === '1D' 
                  ? 'bg-purple-100 text-purple-700 font-medium' 
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              {timeframe}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Container */}
      <div className="relative h-80 mb-4">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 py-4">
          <span>$15000</span>
          <span>$12000</span>
          <span>$9000</span>
          <span>$6000</span>
          <span>$3000</span>
          <span>$0</span>
        </div>

        {/* Chart area */}
        <div className="ml-12 h-full relative bg-gray-50/30 rounded-lg">
          <svg width="100%" height="100%" viewBox="0 0 700 300" className="absolute inset-0">
            {/* Grid lines */}
            <defs>
              <pattern id="grid" width="70" height="50" patternUnits="userSpaceOnUse">
                <path d="M 70 0 L 0 0 0 50" fill="none" stroke="#f1f5f9" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />

            {/* Main chart line - purple */}
            <path
              d="M50 250 L120 220 L180 200 L240 180 L300 160 L360 140 L420 120 L480 100 L540 90 L600 80 L650 70"
              stroke="#8b5cf6"
              strokeWidth="3"
              fill="none"
            />

            {/* Area under curve */}
            <defs>
              <linearGradient id="portfolio-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d="M50 250 L120 220 L180 200 L240 180 L300 160 L360 140 L420 120 L480 100 L540 90 L600 80 L650 70 L650 300 L50 300 Z"
              fill="url(#portfolio-gradient)"
            />

            {/* Highlight point with tooltip */}
            <circle cx="420" cy="120" r="6" fill="#8b5cf6" />
            <circle cx="420" cy="120" r="3" fill="white" />

            {/* Tooltip */}
            <g transform="translate(360, 80)">
              <rect x="0" y="0" width="140" height="45" rx="8" fill="#8b5cf6" />
              <text x="70" y="18" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">
                Jan 30 04:12:18 AM
              </text>
              <text x="70" y="35" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold">
                $14,032.56
              </text>
            </g>
          </svg>

          {/* X-axis labels */}
          <div className="absolute bottom-2 left-0 right-0 flex justify-between text-xs text-gray-500 px-4">
            <span>10 am</span>
            <span>11 am</span>
            <span>12 pm</span>
            <span>1 pm</span>
            <span>12 pm</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-6 pt-4 border-t border-gray-100">
        <div>
          <p className="text-xs text-gray-500 mb-1">High</p>
          <p className="font-semibold text-gray-900">11,691.89</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Prev Close (Apr 28 Days)</p>
          <p className="font-semibold text-gray-900">11,512.41</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Low</p>
          <p className="font-semibold text-gray-900">11,470.47</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Open</p>
          <p className="font-semibold text-gray-900">11,690.11</p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-center gap-4 mt-6">
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ChevronLeft className="w-5 h-5 text-gray-400" />
        </button>
        <span className="text-sm text-gray-600 font-medium">2 / 3</span>
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </button>
      </div>
    </div>
  )
}

export default PortfolioChart