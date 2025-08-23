import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, Upload, X, Check, TrendingUp, DollarSign } from 'lucide-react'

interface ScannedItem {
  brand: string
  ticker: string
  amount: number
  suggestion: string
  logo: string
}

const ReceiptScanner = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isScanning, setIsScanning] = useState(false)
  const [scannedItems, setScannedItems] = useState<ScannedItem[]>([])
  const [totalSpent, setTotalSpent] = useState(0)

  // Mock OCR results - in real app this would come from OCR service
  const mockScanResults = [
    {
      brand: 'Starbucks',
      ticker: 'SBUX',
      amount: 12.50,
      suggestion: 'You spent $12.50 at Starbucks. Invest the same amount in SBUX stock?',
      logo: '☕'
    },
    {
      brand: 'Target',
      ticker: 'TGT',
      amount: 45.80,
      suggestion: 'Target purchase detected! Consider investing $45.80 in Target stock.',
      logo: '🎯'
    },
    {
      brand: 'Nike',
      ticker: 'NKE',
      amount: 89.99,
      suggestion: 'Nike shoes purchased! Want to invest in the company you support?',
      logo: '👟'
    }
  ]

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      simulateOCR()
    }
  }

  const simulateOCR = () => {
    setIsScanning(true)
    
    // Simulate OCR processing time
    setTimeout(() => {
      setScannedItems(mockScanResults)
      setTotalSpent(mockScanResults.reduce((sum, item) => sum + item.amount, 0))
      setIsScanning(false)
    }, 2000)
  }

  const handleInvest = (item: ScannedItem) => {
    // This would integrate with your investment flow
    console.log(`Investing $${item.amount} in ${item.ticker}`)
    // You could navigate to trade page with pre-filled data
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
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {!isScanning && scannedItems.length === 0 && (
                  <div className="text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Camera className="w-10 h-10 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Scan Your Receipt
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Upload a photo of your receipt and we'll suggest investments based on where you shop
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
                      
                      <button
                        onClick={simulateOCR}
                        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
                      >
                        <Camera className="w-5 h-5" />
                        Try Demo Receipt
                      </button>
                    </div>
                  </div>
                )}

                {/* Scanning State */}
                {isScanning && (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                      <Camera className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Scanning Receipt...
                    </h3>
                    <p className="text-gray-600">
                      Analyzing your spending patterns and finding investment opportunities
                    </p>
                  </div>
                )}

                {/* Results */}
                {scannedItems.length > 0 && (
                  <div>
                    <div className="mb-6 p-4 bg-green-50 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <Check className="w-5 h-5 text-green-600" />
                        <span className="font-semibold text-green-800">Receipt Analyzed!</span>
                      </div>
                      <p className="text-sm text-green-700">
                        Total spent: <span className="font-bold">${totalSpent.toFixed(2)}</span> on public companies
                      </p>
                    </div>

                    <div className="space-y-4 max-h-60 overflow-y-auto">
                      {scannedItems.map((item, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="border border-gray-200 rounded-xl p-4"
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-xl">
                              {item.logo}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900">{item.brand}</h4>
                              <p className="text-sm text-gray-500">{item.ticker} • ${item.amount}</p>
                            </div>
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-3">{item.suggestion}</p>
                          
                          <button
                            onClick={() => handleInvest(item)}
                            className="w-full bg-purple-100 hover:bg-purple-200 text-purple-700 py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                          >
                            <DollarSign className="w-4 h-4" />
                            Invest ${item.amount} in {item.ticker}
                          </button>
                        </motion.div>
                      ))}
                    </div>

                    {/* Summary */}
                    <div className="mt-6 p-4 bg-purple-50 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-5 h-5 text-purple-600" />
                        <span className="font-semibold text-purple-800">Investment Insight</span>
                      </div>
                      <p className="text-sm text-purple-700">
                        If you invested every time you shopped at these brands, you'd have built a 
                        <span className="font-bold"> ${totalSpent.toFixed(2)} portfolio</span> this month!
                      </p>
                    </div>
                  </div>
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