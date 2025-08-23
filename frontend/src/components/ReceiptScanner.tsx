import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, Upload, X, Check, TrendingUp, DollarSign, AlertCircle, Loader2, ShoppingCart, Star, Zap } from 'lucide-react'

// Types for backend response
interface ReceiptScanResponse {
  success: boolean
  company_name: string
  total_amount: number
  confidence: 'high' | 'medium' | 'low'
  extracted_text: string
  receipt_id?: string
  error?: string
  ticker?: string
  logo?: string
  is_popular_company?: boolean
}

interface ScannedReceipt {
  company_name: string
  total_amount: number
  confidence: 'high' | 'medium' | 'low'
  extracted_text: string
  receipt_id?: string
  ticker?: string
  logo?: string
  suggestion?: string
  is_popular_company?: boolean
}

// Enhanced company to ticker mapping with more companies
const COMPANY_TICKER_MAP: Record<string, { ticker: string; logo: string; isPremium?: boolean }> = {
  'starbucks corporation': { ticker: 'SBUX', logo: '☕', isPremium: true },
  'starbucks': { ticker: 'SBUX', logo: '☕', isPremium: true },
  'target corporation': { ticker: 'TGT', logo: '🎯', isPremium: true },
  'target': { ticker: 'TGT', logo: '🎯', isPremium: true },
  'walmart inc': { ticker: 'WMT', logo: '🛒', isPremium: true },
  'walmart': { ticker: 'WMT', logo: '🛒', isPremium: true },
  'nike inc': { ticker: 'NKE', logo: '👟', isPremium: true },
  'nike': { ticker: 'NKE', logo: '👟', isPremium: true },
  'apple inc': { ticker: 'AAPL', logo: '🍎', isPremium: true },
  'apple': { ticker: 'AAPL', logo: '🍎', isPremium: true },
  'amazon.com inc': { ticker: 'AMZN', logo: '📦', isPremium: true },
  'amazon': { ticker: 'AMZN', logo: '📦', isPremium: true },
  'mcdonald\'s corporation': { ticker: 'MCD', logo: '🍟', isPremium: true },
  'mcdonalds': { ticker: 'MCD', logo: '🍟', isPremium: true },
  'the coca-cola company': { ticker: 'KO', logo: '🥤', isPremium: true },
  'coca cola': { ticker: 'KO', logo: '🥤', isPremium: true },
  'tesla inc': { ticker: 'TSLA', logo: '🚗', isPremium: true },
  'tesla': { ticker: 'TSLA', logo: '🚗', isPremium: true },
  'microsoft corporation': { ticker: 'MSFT', logo: '💻', isPremium: true },
  'microsoft': { ticker: 'MSFT', logo: '💻', isPremium: true },
  'netflix inc': { ticker: 'NFLX', logo: '📺', isPremium: true },
  'netflix': { ticker: 'NFLX', logo: '📺', isPremium: true },
  'uber technologies inc': { ticker: 'UBER', logo: '🚕', isPremium: true },
  'uber': { ticker: 'UBER', logo: '🚕', isPremium: true },
  'spotify technology sa': { ticker: 'SPOT', logo: '🎵', isPremium: true },
  'spotify': { ticker: 'SPOT', logo: '🎵', isPremium: true },
  'meta platforms inc': { ticker: 'META', logo: '📱', isPremium: true },
  'meta': { ticker: 'META', logo: '📱', isPremium: true },
  'the walt disney company': { ticker: 'DIS', logo: '🏰', isPremium: true },
  'disney': { ticker: 'DIS', logo: '🏰', isPremium: true },
  'costco wholesale corporation': { ticker: 'COST', logo: '🏪', isPremium: true },
  'costco': { ticker: 'COST', logo: '🏪', isPremium: true },
  'the home depot inc': { ticker: 'HD', logo: '🔨', isPremium: true },
  'home depot': { ticker: 'HD', logo: '🔨', isPremium: true },
  'cvs health corporation': { ticker: 'CVS', logo: '💊', isPremium: true },
  'cvs': { ticker: 'CVS', logo: '💊', isPremium: true },
  'walgreens boots alliance inc': { ticker: 'WBA', logo: '💊' },
  'walgreens': { ticker: 'WBA', logo: '💊' },
  'chipotle mexican grill inc': { ticker: 'CMG', logo: '🌯', isPremium: true },
  'chipotle': { ticker: 'CMG', logo: '🌯', isPremium: true }
}

const API_BASE_URL = 'http://localhost:5000' // Change this to your backend URL

const ReceiptScanner = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isScanning, setIsScanning] = useState(false)
  const [scannedReceipt, setScannedReceipt] = useState<ScannedReceipt | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  // Investment flow states
  const [showInvestmentModal, setShowInvestmentModal] = useState(false)
  const [investmentAmount, setInvestmentAmount] = useState('')
  const [isInvesting, setIsInvesting] = useState(false)
  const [investmentSuccess, setInvestmentSuccess] = useState(false)

  // Get user ID - modify this based on your user context
  const getUserId = () => {
    // Replace this with your actual user context/auth system
    return 'demo_user_123' // or get from useUser() hook
  }

  const mapCompanyToTicker = (companyName: string, backendTicker?: string, backendLogo?: string): { ticker?: string; logo?: string; isPremium?: boolean } => {
    // If backend already detected the ticker, use it
    if (backendTicker && backendLogo) {
      return {
        ticker: backendTicker,
        logo: backendLogo,
        isPremium: true // Backend detected companies are considered premium
      }
    }

    const normalizedName = companyName.toLowerCase()
    
    // Check for exact matches first
    if (COMPANY_TICKER_MAP[normalizedName]) {
      return COMPANY_TICKER_MAP[normalizedName]
    }
    
    // Check for partial matches
    for (const [company, data] of Object.entries(COMPANY_TICKER_MAP)) {
      if (normalizedName.includes(company) || company.includes(normalizedName)) {
        return data
      }
    }
    
    return { ticker: undefined, logo: '🏪', isPremium: false }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      await scanReceipt(file)
    }
  }

  const scanReceipt = async (file: File) => {
    setIsScanning(true)
    setError(null)
    setScannedReceipt(null)

    try {
      const formData = new FormData()
      formData.append('receipt', file)
      formData.append('user_id', getUserId())

      const response = await fetch(`${API_BASE_URL}/api/scan-receipt`, {
        method: 'POST',
        body: formData,
      })

      const data: ReceiptScanResponse = await response.json()

      if (data.success) {
        const { ticker, logo, isPremium } = mapCompanyToTicker(
          data.company_name, 
          data.ticker, 
          data.logo
        )
        
        const receipt: ScannedReceipt = {
          company_name: data.company_name,
          total_amount: data.total_amount,
          confidence: data.confidence,
          extracted_text: data.extracted_text,
          receipt_id: data.receipt_id,
          ticker: ticker || data.ticker,
          logo: logo || data.logo || '🏪',
          is_popular_company: data.is_popular_company || isPremium,
          suggestion: (ticker || data.ticker)
            ? `Great! You spent ${data.total_amount.toFixed(2)} at ${data.company_name}. Want to invest in ${ticker || data.ticker}?`
            : `Receipt from ${data.company_name} recorded. Total: ${data.total_amount.toFixed(2)}`
        }

        setScannedReceipt(receipt)
      } else {
        setError(data.error || 'Failed to scan receipt')
      }
    } catch (err) {
      console.error('Scan error:', err)
      setError('Network error. Please check if the backend is running.')
    } finally {
      setIsScanning(false)
    }
  }

  const handleInvestmentClick = (receipt: ScannedReceipt) => {
    if (!receipt.ticker) return
    
    // Pre-fill with the amount they spent on the receipt
    setInvestmentAmount(receipt.total_amount.toString())
    setShowInvestmentModal(true)
  }

  const executeInvestment = async () => {
    if (!scannedReceipt || !scannedReceipt.ticker || !investmentAmount) return

    setIsInvesting(true)
    
    try {
      // Here you would make an API call to your investment/trading endpoint
      // For now, we'll simulate the investment
      
      const investmentData = {
        user_id: getUserId(),
        symbol: scannedReceipt.ticker,
        company_name: scannedReceipt.company_name,
        amount: parseFloat(investmentAmount),
        receipt_id: scannedReceipt.receipt_id,
        investment_type: 'receipt_based'
      }

      // Simulate API call - replace with actual endpoint
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // In reality, you'd do:
      // const response = await fetch(`${API_BASE_URL}/api/invest`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(investmentData)
      // })
      
      console.log('Investment executed:', investmentData)
      
      setInvestmentSuccess(true)
      setTimeout(() => {
        setShowInvestmentModal(false)
        setInvestmentSuccess(false)
        setInvestmentAmount('')
      }, 2000)
      
    } catch (err) {
      console.error('Investment error:', err)
      setError('Failed to execute investment. Please try again.')
    } finally {
      setIsInvesting(false)
    }
  }

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high': return 'text-green-600 bg-green-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'low': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const resetScanner = () => {
    setScannedReceipt(null)
    setError(null)
    setShowInvestmentModal(false)
    setInvestmentAmount('')
    setInvestmentSuccess(false)
  }

  const closeModal = () => {
    setIsOpen(false)
    resetScanner()
  }

  return (
    <>
      {/* Trigger Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-6 w-14 h-14 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-full shadow-lg flex items-center justify-center z-40"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Camera className="w-6 h-6" />
      </motion.button>

      {/* Main Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-md max-h-[80vh] overflow-hidden"
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Receipt Scanner</h2>
                    <p className="text-sm text-gray-600">Invest in brands you already love</p>
                  </div>
                  <button
                    onClick={closeModal}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Initial State */}
                {!isScanning && !scannedReceipt && !error && (
                  <div className="text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Camera className="w-10 h-10 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Scan Your Receipt
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Upload a photo of your receipt and we'll extract the details automatically
                    </p>
                    
                    <div className="space-y-3">
                      <label className="block">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                        <div className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 px-6 rounded-xl cursor-pointer transition-all duration-200 flex items-center justify-center gap-2">
                          <Upload className="w-5 h-5" />
                          Upload Receipt
                        </div>
                      </label>
                    </div>

                    {/* Popular Companies Hint */}
                    <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <Star className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-semibold text-blue-800">Enhanced Detection</span>
                      </div>
                      <p className="text-xs text-blue-700">
                        We support instant recognition for 20+ popular companies including Starbucks, Target, Apple, Tesla, and more!
                      </p>
                    </div>
                  </div>
                )}

                {/* Scanning State */}
                {isScanning && (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Scanning Receipt...
                    </h3>
                    <p className="text-gray-600">
                      Using advanced OCR and company detection
                    </p>
                    <div className="mt-4 flex items-center justify-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                )}

                {/* Error State */}
                {error && (
                  <div className="text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <AlertCircle className="w-8 h-8 text-red-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Scan Failed
                    </h3>
                    <p className="text-red-600 mb-4 text-sm">{error}</p>
                    <button
                      onClick={resetScanner}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-xl transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                )}

                {/* Results */}
                {scannedReceipt && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {/* Success Banner */}
                    <div className={`mb-6 p-4 rounded-xl ${
                      scannedReceipt.is_popular_company 
                        ? 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200' 
                        : 'bg-green-50 border border-green-200'
                    }`}>
                      <div className="flex items-center gap-2 mb-2">
                        {scannedReceipt.is_popular_company ? (
                          <Zap className="w-5 h-5 text-emerald-600" />
                        ) : (
                          <Check className="w-5 h-5 text-green-600" />
                        )}
                        <span className={`font-semibold ${
                          scannedReceipt.is_popular_company ? 'text-emerald-800' : 'text-green-800'
                        }`}>
                          {scannedReceipt.is_popular_company ? 'Popular Company Detected!' : 'Receipt Scanned!'}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${getConfidenceColor(scannedReceipt.confidence)}`}>
                          {scannedReceipt.confidence} confidence
                        </span>
                        {scannedReceipt.is_popular_company && (
                          <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-700">
                            <Star className="w-3 h-3 inline mr-1" />
                            Premium
                          </span>
                        )}
                      </div>
                      <p className={`text-sm ${
                        scannedReceipt.is_popular_company ? 'text-emerald-700' : 'text-green-700'
                      }`}>
                        Store: <span className="font-bold">{scannedReceipt.company_name}</span> • 
                        Amount: <span className="font-bold">${scannedReceipt.total_amount.toFixed(2)}</span>
                      </p>
                    </div>

                    <div className="border border-gray-200 rounded-xl p-4 mb-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${
                          scannedReceipt.is_popular_company 
                            ? 'bg-gradient-to-br from-purple-100 to-blue-100' 
                            : 'bg-gray-100'
                        }`}>
                          {scannedReceipt.logo}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                            {scannedReceipt.company_name}
                            {scannedReceipt.is_popular_company && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700">
                                <Zap className="w-3 h-3 mr-1" />
                                Recognized
                              </span>
                            )}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {scannedReceipt.ticker ? `${scannedReceipt.ticker} • ` : ''}
                            ${scannedReceipt.total_amount.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-4">{scannedReceipt.suggestion}</p>
                      
                      {scannedReceipt.ticker ? (
                        <div className="space-y-2">
                          <button
                            onClick={() => handleInvestmentClick(scannedReceipt)}
                            className={`w-full py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 text-sm font-medium shadow-md ${
                              scannedReceipt.is_popular_company
                                ? 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white'
                                : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white'
                            }`}
                          >
                            <ShoppingCart className="w-4 h-4" />
                            Buy {scannedReceipt.ticker} Stock
                          </button>
                          <p className="text-xs text-center text-gray-500">
                            {scannedReceipt.is_popular_company 
                              ? 'Invest on what you spend' 
                              : 'Turn your spending into investing'
                            }
                          </p>
                        </div>
                      ) : (
                        <div className="w-full bg-gray-100 text-gray-500 py-3 px-4 rounded-lg text-center text-sm">
                          Company not publicly traded
                        </div>
                      )}
                    </div>

                    {/* Scan Another Button */}
                    <button
                      onClick={resetScanner}
                      className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-xl transition-colors"
                    >
                      Scan Another Receipt
                    </button>

                    {/* Investment Insight */}
                    {scannedReceipt.ticker && (
                      <div className={`mt-4 p-4 rounded-xl ${
                        scannedReceipt.is_popular_company
                          ? 'bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200'
                          : 'bg-purple-50 border border-purple-200'
                      }`}>
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className={`w-5 h-5 ${
                            scannedReceipt.is_popular_company ? 'text-indigo-600' : 'text-purple-600'
                          }`} />
                          <span className={`font-semibold ${
                            scannedReceipt.is_popular_company ? 'text-indigo-800' : 'text-purple-800'
                          }`}>
                            {scannedReceipt.is_popular_company ? 'Premium Investment Opportunity' : 'Investment Opportunity'}
                          </span>
                        </div>
                        <p className={`text-sm ${
                          scannedReceipt.is_popular_company ? 'text-indigo-700' : 'text-purple-700'
                        }`}>
                          You're already a customer of {scannedReceipt.company_name}. 
                          {scannedReceipt.is_popular_company 
                            ? ' Our AI instantly recognized this popular brand - perfect for seamless investing!' 
                            : ' Consider becoming a shareholder too!'
                          }
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Investment Modal */}
      <AnimatePresence>
        {showInvestmentModal && scannedReceipt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-md overflow-hidden"
            >
              {investmentSuccess ? (
                /* Success State */
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Investment Successful! 🎉</h3>
                  <p className="text-gray-600 mb-2">
                    You've invested <span className="font-bold">${parseFloat(investmentAmount).toFixed(2)}</span> in {scannedReceipt.ticker}
                  </p>
                  <p className="text-sm text-gray-500">
                    Your investment has been added to your portfolio
                  </p>
                </div>
              ) : (
                /* Investment Form */
                <>
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">Invest in {scannedReceipt.ticker}</h3>
                        <p className="text-sm text-gray-600">{scannedReceipt.company_name}</p>
                      </div>
                      <button
                        onClick={() => setShowInvestmentModal(false)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <X className="w-5 h-5 text-gray-500" />
                      </button>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className={`flex items-center gap-3 mb-6 p-4 rounded-xl ${
                      scannedReceipt.is_popular_company
                        ? 'bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200'
                        : 'bg-purple-50 border border-purple-200'
                    }`}>
                      <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-xl shadow-sm">
                        {scannedReceipt.logo}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 flex items-center gap-2">
                          {scannedReceipt.ticker}
                          {scannedReceipt.is_popular_company && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-700">
                              <Star className="w-3 h-3 mr-1" />
                              Premium
                            </span>
                          )}
                        </p>
                        <p className="text-sm text-gray-600">{scannedReceipt.company_name}</p>
                      </div>
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Investment Amount ($)
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="number"
                          value={investmentAmount}
                          onChange={(e) => setInvestmentAmount(e.target.value)}
                          placeholder="0.00"
                          min="1"
                          step="0.01"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg font-semibold"
                        />
                      </div>
                      <div className="mt-2 flex gap-2">
                        <button
                          onClick={() => setInvestmentAmount(scannedReceipt.total_amount.toString())}
                          className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs transition-colors"
                        >
                          Receipt Amount (${scannedReceipt.total_amount})
                        </button>
                        <button
                          onClick={() => setInvestmentAmount('50')}
                          className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs transition-colors"
                        >
                          $50
                        </button>
                        <button
                          onClick={() => setInvestmentAmount('100')}
                          className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs transition-colors"
                        >
                          $100
                        </button>
                      </div>
                    </div>

                    <div className={`mb-6 p-4 rounded-xl ${
                      scannedReceipt.is_popular_company
                        ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200'
                        : 'bg-blue-50 border border-blue-200'
                    }`}>
                      <p className={`text-sm ${
                        scannedReceipt.is_popular_company ? 'text-indigo-800' : 'text-blue-800'
                      }`}>
                        <span className="font-semibold">
                          {scannedReceipt.is_popular_company ? 'Premium Tip:' : 'Smart Tip:'}
                        </span> You spent ${scannedReceipt.total_amount.toFixed(2)} at {scannedReceipt.company_name}. 
                        {scannedReceipt.is_popular_company 
                          ? ' Our AI recognized this popular brand instantly - invest with confidence!'
                          : ' Investing the same amount helps you become a shareholder in a company you already support!'
                        }
                      </p>
                    </div>

                    <div className="space-y-3">
                      <button
                        onClick={executeInvestment}
                        disabled={!investmentAmount || parseFloat(investmentAmount) <= 0 || isInvesting}
                        className={`w-full py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 font-medium ${
                          scannedReceipt.is_popular_company
                            ? 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 disabled:from-gray-300 disabled:to-gray-300'
                            : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-300 disabled:to-gray-300'
                        } disabled:cursor-not-allowed text-white`}
                      >
                        {isInvesting ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Processing Investment...
                          </>
                        ) : (
                          <>
                            <TrendingUp className="w-5 h-5" />
                            Invest ${investmentAmount || '0.00'}
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => setShowInvestmentModal(false)}
                        disabled={isInvesting}
                        className="w-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 text-gray-700 py-3 px-4 rounded-xl transition-colors font-medium"
                      >
                        Cancel
                      </button>
                    </div>

                    <p className="text-xs text-gray-500 text-center mt-4">
                      {scannedReceipt.is_popular_company 
                        ? 'Premium company detected - enhanced investment experience'
                        : 'This is a simulated investment for demo purposes'
                      }
                    </p>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default ReceiptScanner