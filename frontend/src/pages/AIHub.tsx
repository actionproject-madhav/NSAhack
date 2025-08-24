import { useState } from 'react'
import { motion } from 'framer-motion'
import { Globe, Zap, Clock, Target, RefreshCw, Search, BarChart3 } from 'lucide-react'
import Navigation from '../components/Navigation'
import AIMarketSentiment from '../components/AIMarketSentiment'

const AIHub = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI News Hub
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Real-time financial news with AI-powered sentiment analysis from StockTitan
          </p>
        </div>

        {/* Main Sentiment Analysis */}
        <div className="bg-white rounded-2xl border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">Live News Analysis</h2>
            <p className="text-gray-600">Analyze real-time financial news sentiment from today's market data</p>
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
