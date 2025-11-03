import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import { motion } from 'framer-motion'

const LandingPage = () => {
  const navigate = useNavigate()
  const { user, isLoading } = useUser()

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (!isLoading && user) {
      console.log('✅ User already authenticated, redirecting to dashboard...')
      navigate('/dashboard')
    }
  }, [user, isLoading, navigate])

  return (
    <div className="min-h-screen bg-white dark:bg-black relative overflow-hidden">
      {/* Floating Navigation */}
      <nav className="absolute top-8 left-1/2 transform -translate-x-1/2 z-30 bg-black dark:bg-white rounded-full px-6 py-3 flex items-center space-x-8 shadow-lg">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-white dark:bg-black rounded-full flex items-center justify-center">
            <span className="text-black dark:text-white font-bold text-xs">F</span>
          </div>
          <span className="text-white dark:text-black font-medium">FinLit</span>
        </div>

        <div className="flex items-center space-x-6 text-white/70 dark:text-black/70 text-sm">
          <a href="#" className="hover:text-white dark:hover:text-black transition-colors">Product</a>
          <a href="#" className="hover:text-white dark:hover:text-black transition-colors">Features</a>
          <a href="#" className="hover:text-white dark:hover:text-black transition-colors">About</a>
        </div>

        <button
          onClick={() => navigate('/auth')}
          className="bg-white dark:bg-black text-black dark:text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
        >
          Sign In
        </button>
      </nav>

      {/* Main Content */}
      <div className="relative z-20 flex flex-col items-center justify-center px-8 pt-32 pb-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-6xl md:text-7xl font-bold text-black dark:text-white mb-8 leading-tight">
            Investing Made
            <br />
            <span className="text-gray-800 dark:text-gray-200">Simple & Accessible</span>
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
            Start your investment journey with real-time data, AI-powered insights, and tools designed for international students.
          </p>

          <button
            onClick={() => navigate('/auth')}
            className="bg-black dark:bg-white text-white dark:text-black px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors shadow-lg"
          >
            Get Started
          </button>
        </div>

        {/* Floating Image Placeholders */}
        <div className="mt-16 relative w-full max-w-6xl mx-auto">
          {/* Main Dashboard Preview - Center */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10"
          >
            {/* PLACEHOLDER: Add your dashboard screenshot here */}
            <div className="bg-gray-100 dark:bg-gray-900 rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-gray-800">
              <div className="text-center text-gray-400 dark:text-gray-600">
                <p className="text-sm mb-2">📸 Image Placeholder</p>
                <p className="text-xs">dashboard-preview.png</p>
                <p className="text-xs mt-2 italic">Add your dashboard screenshot here</p>
              </div>
            </div>
          </motion.div>

          {/* Floating Element 1 - Top Left */}
          <motion.div
            initial={{ opacity: 0, x: -50, y: -50 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="absolute -top-20 -left-20 w-64 h-64"
          >
            {/* PLACEHOLDER: floating-element-1.png */}
            <div className="w-full h-full bg-gray-100 dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-800 flex items-center justify-center">
              <div className="text-center text-gray-400 dark:text-gray-600">
                <p className="text-xs">📸 Floating Element 1</p>
                <p className="text-xs mt-1">floating-element-1.png</p>
              </div>
            </div>
          </motion.div>

          {/* Floating Element 2 - Top Right */}
          <motion.div
            initial={{ opacity: 0, x: 50, y: -50 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="absolute -top-12 -right-32 w-72 h-48"
          >
            {/* PLACEHOLDER: floating-element-2.png */}
            <div className="w-full h-full bg-gray-100 dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-800 flex items-center justify-center">
              <div className="text-center text-gray-400 dark:text-gray-600">
                <p className="text-xs">📸 Floating Element 2</p>
                <p className="text-xs mt-1">floating-element-2.png</p>
              </div>
            </div>
          </motion.div>

          {/* Floating Element 3 - Bottom Left */}
          <motion.div
            initial={{ opacity: 0, x: -50, y: 50 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="absolute -bottom-16 -left-24 w-56 h-56"
          >
            {/* PLACEHOLDER: floating-element-3.png */}
            <div className="w-full h-full bg-gray-100 dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-800 flex items-center justify-center">
              <div className="text-center text-gray-400 dark:text-gray-600">
                <p className="text-xs">📸 Floating Element 3</p>
                <p className="text-xs mt-1">floating-element-3.png</p>
              </div>
            </div>
          </motion.div>

          {/* Floating Element 4 - Bottom Right */}
          <motion.div
            initial={{ opacity: 0, x: 50, y: 50 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 1, delay: 0.9 }}
            className="absolute -bottom-8 -right-28 w-64 h-40"
          >
            {/* PLACEHOLDER: floating-element-4.png */}
            <div className="w-full h-full bg-gray-100 dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-800 flex items-center justify-center">
              <div className="text-center text-gray-400 dark:text-gray-600">
                <p className="text-xs">📸 Floating Element 4</p>
                <p className="text-xs mt-1">floating-element-4.png</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Features Section */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-900 rounded-2xl mx-auto mb-4 flex items-center justify-center border border-gray-200 dark:border-gray-800">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="text-xl font-semibold text-black dark:text-white mb-2">Real-Time Data</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Live stock prices and market data powered by Yahoo Finance
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-900 rounded-2xl mx-auto mb-4 flex items-center justify-center border border-gray-200 dark:border-gray-800">
              <span className="text-2xl">🤖</span>
            </div>
            <h3 className="text-xl font-semibold text-black dark:text-white mb-2">AI Assistance</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Get personalized investment guidance from our AI advisor
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-900 rounded-2xl mx-auto mb-4 flex items-center justify-center border border-gray-200 dark:border-gray-800">
              <span className="text-2xl">🎓</span>
            </div>
            <h3 className="text-xl font-semibold text-black dark:text-white mb-2">Learn & Grow</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Interactive courses and resources for international students
            </p>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="absolute bottom-8 left-0 right-0 text-center text-sm text-gray-500 dark:text-gray-400 z-20">
        <p>Powered by real-time market data • No mock prices • 100% authentic</p>
      </div>
    </div>
  )
}

export default LandingPage
