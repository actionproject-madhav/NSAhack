import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, Upload, X, Check, TrendingUp, DollarSign, AlertCircle, Loader2 } from 'lucide-react'

// Types for backend response
interface ReceiptScanResponse {
  success: boolean
  company_name: string
  total_amount: number
  confidence: 'high' | 'medium' | 'low'
  extracted_text: string
  receipt_id?: string
  error?: string
}

interface ScannedReceipt {
  company_name: string
  total_amount: number
  confidence: 'high' | 'medium' | 'low'
  extracted_text: string
  receipt_id?: string
  ticker?: string // We'll map company to ticker
  logo?: string
  suggestion?: string
}

// Company to ticker mapping (you can expand this)
const COMPANY_TICKER_MAP: Record<string, { ticker: string; logo: string }> = {
  'starbucks': { ticker: 'SBUX', logo: '☕' },
  'target': { ticker: 'TGT', logo: '🎯' },
  'walmart': { ticker: 'WMT', logo: '🛒' },
  'nike': { ticker: 'NKE', logo: '👟' },
  'apple': { ticker: 'AAPL', logo: '🍎' },
  'amazon': { ticker: 'AMZN', logo: '📦' },
  'mcdonalds': { ticker: 'MCD', logo: '🍟' },
  'coca cola': { ticker: 'KO', logo: '🥤' },
  'tesla': { ticker: 'TSLA', logo: '🚗' },
  'microsoft': { ticker: 'MSFT', logo: '💻' },
}

const API_BASE_URL = 'http://localhost:5000' // Change this to your backend URL

const ReceiptScanner = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isScanning, setIsScanning] = useState(false)
  const [scannedReceipt, setScannedReceipt] = useState<ScannedReceipt | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Get user ID - modify this based on your user context
  const getUserId = () => {
    // Replace this with your actual user context/auth system
    return 'demo_user_123' // or get from useUser() hook
  }

  const mapCompanyToTicker = (companyName: string): { ticker?: string; logo?: string } => {
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
    
    return { ticker: undefined, logo: '🏪' }
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
        const { ticker, logo } = mapCompanyToTicker(data.company_name)
        
        const receipt: ScannedReceipt = {
          company_name: data.company_name,
          total_amount: data.total_amount,
          confidence: data.confidence,
          extracted_text: data.extracted_text,
          receipt_id: data.receipt_id,
          ticker,
          logo: logo || '🏪',
          suggestion: ticker 
            ? `You spent $${data.total_amount.toFixed(2)} at ${data.company_name}. Consider investing in ${ticker}!`
            : `Receipt from ${data.company_name} recorded. Total: $${data.total_amount.toFixed(2)}`
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

  const handleInvest = (receipt: ScannedReceipt) => {
    if (!receipt.ticker) return
    
    // This would integrate with your investment flow
    console.log(`Investing $${receipt.total_amount} in ${receipt.ticker}`)
    
    // You could navigate to trade page with pre-filled data
    // navigate(`/trade?symbol=${receipt.ticker}&amount=${receipt.total_amount}`)
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

      {/* Modal */}
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
                    onClick={() => {
                      setIsOpen(false)
                      resetScanner()
                    }}
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
                      Using OCR to extract information from your receipt
                    </p>
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
                    <div className="mb-6 p-4 bg-green-50 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <Check className="w-5 h-5 text-green-600" />
                        <span className="font-semibold text-green-800">Receipt Scanned!</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${getConfidenceColor(scannedReceipt.confidence)}`}>
                          {scannedReceipt.confidence} confidence
                        </span>
                      </div>
                      <p className="text-sm text-green-700">
                        Store: <span className="font-bold">{scannedReceipt.company_name}</span> • 
                        Amount: <span className="font-bold">${scannedReceipt.total_amount.toFixed(2)}</span>
                      </p>
                    </div>

                    <div className="border border-gray-200 rounded-xl p-4 mb-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-xl">
                          {scannedReceipt.logo}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{scannedReceipt.company_name}</h4>
                          <p className="text-sm text-gray-500">
                            {scannedReceipt.ticker ? `${scannedReceipt.ticker} • ` : ''}
                            ${scannedReceipt.total_amount.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">{scannedReceipt.suggestion}</p>
                      
                      {scannedReceipt.ticker ? (
                        <button
                          onClick={() => handleInvest(scannedReceipt)}
                          className="w-full bg-purple-100 hover:bg-purple-200 text-purple-700 py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                        >
                          <DollarSign className="w-4 h-4" />
                          Invest ${scannedReceipt.total_amount.toFixed(2)} in {scannedReceipt.ticker}
                        </button>
                      ) : (
                        <div className="w-full bg-gray-100 text-gray-500 py-2 px-4 rounded-lg text-center text-sm">
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
                      <div className="mt-4 p-4 bg-purple-50 rounded-xl">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="w-5 h-5 text-purple-600" />
                          <span className="font-semibold text-purple-800">Investment Opportunity</span>
                        </div>
                        <p className="text-sm text-purple-700">
                          You're already a customer of {scannedReceipt.company_name}. Consider becoming a shareholder too!
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
    </>
  )
}

export default ReceiptScanner