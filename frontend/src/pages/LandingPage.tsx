import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import { motion, useScroll, useTransform } from 'framer-motion'

const LandingPage = () => {
  const navigate = useNavigate()
  const { user, isLoading } = useUser()
  const [isDark, setIsDark] = useState(false)
  const { scrollYProgress } = useScroll()

  // Parallax effects
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100])
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -200])
  const y3 = useTransform(scrollYProgress, [0, 1], [0, 50])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  // Redirect authenticated users
  useEffect(() => {
    if (!isLoading && user) {
      navigate('/dashboard')
    }
  }, [user, isLoading, navigate])

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDark(!isDark)
  }

  return (
    <div className={`${isDark ? 'dark' : ''}`}>
      <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-950 dark:via-black dark:to-gray-900 transition-colors duration-700 relative overflow-hidden">
        
        {/* Animated Background Gradient Orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-emerald-400/20 to-teal-600/20 dark:from-emerald-500/10 dark:to-teal-700/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              rotate: [0, -90, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-purple-400/20 to-pink-600/20 dark:from-purple-500/10 dark:to-pink-700/10 rounded-full blur-3xl"
          />
        </div>

        {/* Navigation */}
        <motion.nav
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="fixed top-6 left-1/2 -translate-x-1/2 z-50 backdrop-blur-xl bg-white/70 dark:bg-black/70 rounded-full px-6 py-3 shadow-lg border border-gray-200/50 dark:border-gray-800/50"
        >
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <motion.div
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.3 }}
                className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg"
              >
                <span className="text-white font-bold text-sm">F</span>
              </motion.div>
              <span className="text-gray-900 dark:text-white font-semibold text-lg">FinLit</span>
            </div>

            {/* Nav Links */}
            <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
              <a href="#features" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">Features</a>
              <a href="#invest" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">Invest</a>
              <a href="#learn" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">Learn</a>
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:scale-110 transition-transform"
            >
              {isDark ? '☀️' : '🌙'}
            </button>

            {/* CTA */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/auth')}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg hover:shadow-xl transition-shadow"
            >
              Get Started
            </motion.button>
          </div>
        </motion.nav>

        {/* Hero Section */}
        <div className="relative z-10 pt-32 pb-20 px-6">
          <div className="max-w-7xl mx-auto">
            
            {/* Hero Content */}
            <motion.div
              style={{ opacity }}
              className="text-center mb-20"
            >
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="inline-block mb-6"
              >
                <span className="px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full text-sm font-semibold">
                  Built for International Students
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="text-6xl md:text-8xl font-bold text-gray-900 dark:text-white mb-8 leading-tight"
              >
                Investing,
                <br />
                <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Simplified
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
              >
                Start your investment journey with real-time market data, AI-powered insights, and educational resources designed for you.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/auth')}
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-2xl hover:shadow-emerald-500/50 transition-all"
                >
                  Start Investing
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="backdrop-blur-xl bg-white/50 dark:bg-black/50 text-gray-900 dark:text-white px-8 py-4 rounded-full text-lg font-semibold border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 transition-all"
                >
                  Watch Demo
                </motion.button>
              </motion.div>
            </motion.div>

            {/* Floating Dashboard Preview with Parallax */}
            <div className="relative max-w-6xl mx-auto">
              
              {/* Main Dashboard Image */}
              <motion.div
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.4 }}
                style={{ y: y1 }}
                className="relative z-20"
              >
                {/* MAIN DASHBOARD PREVIEW */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border border-gray-200 dark:border-gray-800 p-2">
                  <div className="aspect-video rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center relative overflow-hidden">
                    {/* Placeholder for main dashboard screenshot */}
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-600/5" />
                    <div className="text-center z-10 p-8">
                      <div className="text-6xl mb-4">📱</div>
                      <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">Main Dashboard Preview</p>
                      <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">dashboard-hero.png or dashboard-hero.mp4</p>
                      <p className="text-gray-400 dark:text-gray-500 text-xs mt-4 max-w-md">
                        Replace with: Animated screen recording of your app's dashboard, 
                        or a high-quality screenshot with subtle motion blur
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Floating Element 1 - Portfolio Card (Top Left) */}
              <motion.div
                initial={{ opacity: 0, x: -100, rotate: -10 }}
                animate={{ opacity: 1, x: 0, rotate: -6 }}
                transition={{ duration: 1, delay: 0.6 }}
                style={{ y: y2 }}
                className="absolute -top-20 -left-10 md:-left-20 w-64 md:w-80 z-30"
              >
                <div className="backdrop-blur-xl bg-white/90 dark:bg-gray-900/90 rounded-3xl p-6 shadow-2xl border border-gray-200 dark:border-gray-800 hover:scale-105 transition-transform duration-500">
                  <div className="aspect-square rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl mb-2">💰</div>
                      <p className="text-gray-600 dark:text-gray-300 font-medium text-sm">Portfolio Card</p>
                      <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">portfolio-float.png</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Floating Element 2 - Stock Chart (Top Right) */}
              <motion.div
                initial={{ opacity: 0, x: 100, rotate: 10 }}
                animate={{ opacity: 1, x: 0, rotate: 6 }}
                transition={{ duration: 1, delay: 0.8 }}
                style={{ y: y3 }}
                className="absolute -top-10 -right-10 md:-right-20 w-72 md:w-96 z-30"
              >
                <div className="backdrop-blur-xl bg-white/90 dark:bg-gray-900/90 rounded-3xl p-6 shadow-2xl border border-gray-200 dark:border-gray-800 hover:scale-105 transition-transform duration-500">
                  <div className="aspect-video rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl mb-2">📈</div>
                      <p className="text-gray-600 dark:text-gray-300 font-medium text-sm">Live Chart</p>
                      <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">stock-chart-float.png</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Floating Element 3 - Transaction List (Bottom Left) */}
              <motion.div
                initial={{ opacity: 0, x: -100, rotate: 8 }}
                animate={{ opacity: 1, x: 0, rotate: 4 }}
                transition={{ duration: 1, delay: 1 }}
                style={{ y: y1 }}
                className="absolute -bottom-16 -left-10 md:-left-16 w-56 md:w-72 z-10"
              >
                <div className="backdrop-blur-xl bg-white/90 dark:bg-gray-900/90 rounded-3xl p-6 shadow-2xl border border-gray-200 dark:border-gray-800 hover:scale-105 transition-transform duration-500">
                  <div className="aspect-[4/5] rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl mb-2">🧾</div>
                      <p className="text-gray-600 dark:text-gray-300 font-medium text-sm">Transactions</p>
                      <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">transactions-float.png</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Floating Element 4 - AI Chat Preview (Bottom Right) */}
              <motion.div
                initial={{ opacity: 0, x: 100, rotate: -8 }}
                animate={{ opacity: 1, x: 0, rotate: -4 }}
                transition={{ duration: 1, delay: 1.2 }}
                style={{ y: y2 }}
                className="absolute -bottom-12 -right-10 md:-right-16 w-64 md:w-80 z-10"
              >
                <div className="backdrop-blur-xl bg-white/90 dark:bg-gray-900/90 rounded-3xl p-6 shadow-2xl border border-gray-200 dark:border-gray-800 hover:scale-105 transition-transform duration-500">
                  <div className="aspect-[3/4] rounded-2xl bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl mb-2">🤖</div>
                      <p className="text-gray-600 dark:text-gray-300 font-medium text-sm">AI Assistant</p>
                      <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">ai-chat-float.png</p>
                    </div>
                  </div>
                </div>
              </motion.div>

            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="relative z-10 py-32 px-6 bg-gradient-to-b from-transparent to-white/50 dark:to-black/50">
          <div className="max-w-7xl mx-auto">
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-20"
            >
              <h2 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                Everything you need to
                <br />
                <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  start investing
                </span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Powerful tools and resources designed specifically for international students and immigrants
              </p>
            </motion.div>

            {/* Feature Cards */}
            <div className="grid md:grid-cols-3 gap-8">
              
              {/* Feature 1 */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                whileHover={{ y: -10 }}
                className="backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 rounded-3xl p-8 border border-gray-200 dark:border-gray-800 shadow-lg hover:shadow-2xl transition-all"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <span className="text-3xl">📊</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Real-Time Data</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Access live market prices, charts, and financial data powered by Yahoo Finance. No delays, no mock data.
                </p>
              </motion.div>

              {/* Feature 2 */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                whileHover={{ y: -10 }}
                className="backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 rounded-3xl p-8 border border-gray-200 dark:border-gray-800 shadow-lg hover:shadow-2xl transition-all"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <span className="text-3xl">🤖</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">AI-Powered Insights</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Get personalized investment recommendations and portfolio analysis from our intelligent AI advisor.
                </p>
              </motion.div>

              {/* Feature 3 */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                whileHover={{ y: -10 }}
                className="backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 rounded-3xl p-8 border border-gray-200 dark:border-gray-800 shadow-lg hover:shadow-2xl transition-all"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <span className="text-3xl">🎓</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Learn & Grow</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Master investing with interactive courses, video tutorials, and resources tailored for international students.
                </p>
              </motion.div>

            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="relative z-10 py-20 px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-5xl mx-auto backdrop-blur-xl bg-gradient-to-br from-emerald-500/10 to-teal-600/10 dark:from-emerald-500/5 dark:to-teal-600/5 rounded-3xl p-12 border border-emerald-500/20 dark:border-emerald-500/10"
          >
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-5xl font-bold text-gray-900 dark:text-white mb-2">10K+</div>
                <div className="text-gray-600 dark:text-gray-400">Active Students</div>
              </div>
              <div>
                <div className="text-5xl font-bold text-gray-900 dark:text-white mb-2">$50M+</div>
                <div className="text-gray-600 dark:text-gray-400">Assets Managed</div>
              </div>
              <div>
                <div className="text-5xl font-bold text-gray-900 dark:text-white mb-2">98%</div>
                <div className="text-gray-600 dark:text-gray-400">Satisfaction Rate</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* CTA Section */}
        <div className="relative z-10 py-32 px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-8">
              Ready to start your
              <br />
              investment journey?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
              Join thousands of international students already building their financial future with FinLit.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/auth')}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-10 py-5 rounded-full text-xl font-semibold shadow-2xl hover:shadow-emerald-500/50 transition-all"
            >
              Get Started for Free
            </motion.button>
          </motion.div>
        </div>

        {/* Footer */}
        <footer className="relative z-10 border-t border-gray-200 dark:border-gray-800 py-12 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-sm">F</span>
                </div>
                <span className="text-gray-900 dark:text-white font-semibold">FinLit</span>
              </div>
              
              <div className="flex items-center gap-8 text-sm text-gray-600 dark:text-gray-400">
                <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Privacy</a>
                <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Terms</a>
                <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Contact</a>
              </div>

              <p className="text-sm text-gray-500 dark:text-gray-500">
                © 2024 FinLit. Real-time data • No mock prices
              </p>
            </div>
          </div>
        </footer>

      </div>
    </div>
  )
}

export default LandingPage