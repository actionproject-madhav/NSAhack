import { useState } from 'react'
import { motion } from 'framer-motion'
import { Globe, Zap, Clock, Target, RefreshCw, Search, BarChart3 } from 'lucide-react'
import Navigation from '../components/Navigation'
import AIMarketSentiment from '../components/AIMarketSentiment'

const AIHub = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors">
      <Navigation />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            AI News Hub
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Real-time financial news with AI-powered sentiment analysis from StockTitan
          </p>
        </div>

        {/* Main Sentiment Analysis */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 transition-colors">
          <div className="p-6 border-b border-gray-200 dark:border-gray-800">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Live News Analysis</h2>
            <p className="text-gray-600 dark:text-gray-400">Analyze real-time financial news sentiment from today's market data</p>
          </div>
          
          <div className="p-6">
            <AIMarketSentiment />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AIHub
