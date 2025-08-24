import React from 'react'
import { motion } from 'framer-motion'

const SnapshotCard = () => {
  return (
    <motion.div 
      className="bg-white rounded-2xl p-5 shadow-sm flex flex-col h-[400px]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {/* Header */}
      <h3 className="text-base font-medium text-gray-900 mb-3">Snapshot</h3>

      {/* Top Row - Prev Close & Open */}
      <div className="flex justify-between mb-4">
        <div>
          <p className="text-gray-500 text-xs mb-1">Prev Close</p>
          <p className="text-base font-medium text-gray-900">12,051.48</p>
        </div>
        <div className="text-right">
          <p className="text-gray-500 text-xs mb-1">Open</p>
          <p className="text-base font-medium text-gray-900">12,000.21</p>
        </div>
      </div>

      {/* Day Range Slider */}
      <div className="mb-4">
        <div className="flex justify-between mb-1">
          <p className="text-xs font-medium text-gray-900">11,999.87</p>
          <p className="text-xs font-medium text-gray-900">12,248.15</p>
        </div>
        <div className="flex justify-between mb-2">
          <p className="text-gray-500 text-xs">Day Low</p>
          <p className="text-gray-500 text-xs">Day High</p>
        </div>
        <div className="relative">
          <div className="h-1.5 bg-gray-200 rounded-full">
            <div 
              className="h-1.5 bg-pink-500 rounded-full relative"
              style={{ width: '60%', marginLeft: '20%' }}
            >
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-0.5 h-3 bg-gray-400"></div>
            </div>
          </div>
          <p className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-900">
            12,166.60
          </p>
        </div>
      </div>

      {/* 52 Week Range Slider */}
      <div className="mb-4">
        <div className="flex justify-between mb-1">
          <p className="text-xs font-medium text-gray-900">10,440.64</p>
          <p className="text-xs font-medium text-gray-900">15,245.42</p>
        </div>
        <div className="flex justify-between mb-2">
          <p className="text-gray-500 text-xs">52 Week Low</p>
          <p className="text-gray-500 text-xs">52 Week High</p>
        </div>
        <div className="relative">
          <div className="h-1.5 bg-gray-200 rounded-full">
            <div 
              className="h-1.5 bg-pink-500 rounded-full relative"
              style={{ width: '40%', marginLeft: '30%' }}
            >
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-0.5 h-3 bg-gray-400"></div>
            </div>
          </div>
          <p className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-900">
            12,166.60
          </p>
        </div>
      </div>

      {/* Bottom Row - Trade Time & Date */}
      <div className="flex justify-between mt-auto">
        <div>
          <p className="text-gray-500 text-xs mb-1">Trade Time</p>
          <p className="text-base font-medium text-gray-900">05:16 PM</p>
        </div>
        <div className="text-right">
          <p className="text-gray-500 text-xs mb-1">Trade Date</p>
          <p className="text-base font-medium text-gray-900">01/27/23</p>
        </div>
      </div>
    </motion.div>
  )
}

export default SnapshotCard