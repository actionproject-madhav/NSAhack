import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Sparkles, X, Loader2, TrendingUp, DollarSign, BarChart3, AlertTriangle } from 'lucide-react'
import GeminiService from '../services/geminiService'

interface StockAnalysisChatProps {
  isOpen: boolean;
  onClose: () => void;
  stockData: {
    symbol: string;
    shortName: string;
    fullExchangeName: string;
    regularMarketPrice: number;
    regularMarketChange: number;
    regularMarketChangePercent: number;
    currency: string;
    marketCap: number;
    volume: number;
    peRatio: number;
    open: number;
    high: number;
    low: number;
    divYield: number;
    beta: number;
    eps: number;
    description: string;
    sector: string;
    industry: string;
    employees: number;
    website: string;
  };
}

const StockAnalysisChat: React.FC<StockAnalysisChatProps> = ({ isOpen, onClose, stockData }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: `Hi! I'm your AI stock analyst 📊 I've analyzed ${stockData.shortName} (${stockData.symbol}) and I'm ready to help you understand this investment opportunity. What would you like to know about this stock?`,
      isBot: true,
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const formatLargeNumber = (value: number) => {
    if (value >= 1e12) {
      return `${(value / 1e12).toFixed(2)}T`;
    } else if (value >= 1e9) {
      return `${(value / 1e9).toFixed(2)}B`;
    } else if (value >= 1e6) {
      return `${(value / 1e6).toFixed(2)}M`;
    }
    return `${value}`;
  };

  const isPositive = stockData.regularMarketChange >= 0;

  const quickAnalysisActions = [
    { 
      icon: TrendingUp, 
      text: "Analyze price trends and momentum", 
      color: "bg-green-100 text-green-700",
      prompt: `Analyze the price trends and momentum for ${stockData.symbol}. The stock is currently at ${formatCurrency(stockData.regularMarketPrice)} with a ${isPositive ? 'gain' : 'loss'} of ${stockData.regularMarketChangePercent.toFixed(2)}% today.`
    },
    { 
      icon: BarChart3, 
      text: "Evaluate valuation metrics", 
      color: "bg-blue-100 text-blue-700",
      prompt: `Evaluate the valuation metrics for ${stockData.symbol}. The stock has a P/E ratio of ${stockData.peRatio}, market cap of ${formatLargeNumber(stockData.marketCap)}, and EPS of $${stockData.eps}.`
    },
    { 
      icon: DollarSign, 
      text: "Investment recommendation", 
      color: "bg-purple-100 text-purple-700",
      prompt: `Should I invest in ${stockData.symbol}? Give me your investment recommendation based on current fundamentals and market conditions.`
    },
    { 
      icon: AlertTriangle, 
      text: "Risk assessment", 
      color: "bg-orange-100 text-orange-700",
      prompt: `What are the key risks associated with investing in ${stockData.symbol}? Consider the beta of ${stockData.beta} and current market conditions.`
    }
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Reset messages when stock changes
  useEffect(() => {
    if (isOpen) {
      setMessages([
        {
          id: 1,
          text: `Hi! I'm your AI stock analyst 📊 I've analyzed ${stockData.shortName} (${stockData.symbol}) and I'm ready to help you understand this investment opportunity. What would you like to know about this stock?`,
          isBot: true,
          timestamp: new Date()
        }
      ])
    }
  }, [isOpen, stockData.symbol])

  const buildStockContext = () => {
    return `
    STOCK ANALYSIS CONTEXT for ${stockData.symbol}:
    
    Current Stock Information:
    - Company: ${stockData.shortName} (${stockData.symbol})
    - Exchange: ${stockData.fullExchangeName}
    - Sector: ${stockData.sector}
    - Industry: ${stockData.industry}
    - Current Price: ${formatCurrency(stockData.regularMarketPrice)}
    - Daily Change: ${stockData.regularMarketChange >= 0 ? '+' : ''}${stockData.regularMarketChange.toFixed(2)} (${stockData.regularMarketChangePercent >= 0 ? '+' : ''}${stockData.regularMarketChangePercent.toFixed(2)}%)
    - Market Cap: ${formatLargeNumber(stockData.marketCap)}
    - Volume: ${stockData.volume.toLocaleString()}
    - P/E Ratio: ${stockData.peRatio}
    - EPS: $${stockData.eps}
    - Beta: ${stockData.beta}
    - Dividend Yield: ${stockData.divYield}%
    - Day Range: ${formatCurrency(stockData.low)} - ${formatCurrency(stockData.high)}
    - Open: ${formatCurrency(stockData.open)}
    - Employees: ${stockData.employees.toLocaleString()}
    
    Company Description: ${stockData.description}
    
    You are analyzing this specific stock for investment purposes. Provide detailed, insightful analysis based on these fundamentals.
    `;
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage = {
      id: Date.now(),
      text: inputValue,
      isBot: false,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    const currentInput = inputValue
    setInputValue('')
    setIsLoading(true)

    try {
      const stockContext = buildStockContext()
      const context = {
        userLevel: 'intermediate' as const,
        stockAnalysis: true,
        symbol: stockData.symbol
      }

      const analysisPrompt = `${stockContext}

      User Question: ${currentInput}
      
      Please provide detailed stock analysis and investment insights. Use the specific data provided above to give accurate, contextual responses. Include relevant financial metrics, comparisons, and actionable insights. Be conversational but professional, and use emojis appropriately to make the analysis engaging.`

      const aiResponse = await GeminiService.generateContent(analysisPrompt, context)
      
      const botResponse = {
        id: Date.now() + 1,
        text: aiResponse,
        isBot: true,
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, botResponse])
    } catch (error) {
      console.error('Error getting AI response:', error)
      
      const fallbackResponse = `I'm having trouble analyzing ${stockData.symbol} right now, but based on the current metrics I can see:

• Current price: ${formatCurrency(stockData.regularMarketPrice)} (${stockData.regularMarketChangePercent >= 0 ? '+' : ''}${stockData.regularMarketChangePercent.toFixed(2)}%)
• P/E ratio of ${stockData.peRatio} suggests ${stockData.peRatio > 25 ? 'higher valuation' : 'reasonable valuation'}
• Beta of ${stockData.beta} indicates ${stockData.beta > 1.5 ? 'high volatility' : stockData.beta > 1 ? 'moderate volatility' : 'lower volatility'}

Please try your question again! 📊`
      
      const errorResponse = {
        id: Date.now() + 1,
        text: fallbackResponse,
        isBot: true,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorResponse])
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickAction = (action: typeof quickAnalysisActions[0]) => {
    setInputValue(action.prompt)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-200 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    AI Stock Analysis - {stockData.symbol}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {stockData.shortName} • {formatCurrency(stockData.regularMarketPrice)} 
                    <span className={`ml-2 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                      ({isPositive ? '+' : ''}{stockData.regularMarketChangePercent.toFixed(2)}%)
                    </span>
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 flex overflow-hidden">
            {/* Chat Messages */}
            <div className="flex-1 flex flex-col">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                    >
                      <div className={`flex gap-3 max-w-[85%] ${message.isBot ? 'flex-row' : 'flex-row-reverse'}`}>
                        {message.isBot && (
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                            <Sparkles className="w-4 h-4 text-white" />
                          </div>
                        )}
                        <div
                          className={`p-4 rounded-2xl text-sm ${
                            message.isBot
                              ? 'bg-gray-100 text-gray-900 rounded-tl-lg'
                              : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-tr-lg'
                          }`}
                        >
                          <p className="whitespace-pre-wrap leading-relaxed">{message.text}</p>
                          <p className={`text-xs mt-2 opacity-60 ${
                            message.isBot ? 'text-gray-500' : 'text-blue-200'
                          }`}>
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {/* Loading indicator */}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="flex gap-3 max-w-[85%]">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <Sparkles className="w-4 h-4 text-white" />
                      </div>
                      <div className="bg-gray-100 text-gray-900 p-4 rounded-2xl rounded-tl-lg">
                        <div className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span className="text-sm">Analyzing {stockData.symbol}...</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-6 border-t border-gray-200 flex-shrink-0">
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <textarea
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder={`Ask me anything about ${stockData.symbol}...`}
                      disabled={isLoading}
                      className="w-full px-4 py-3 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                      rows={2}
                      style={{
                        minHeight: '48px',
                        maxHeight: '120px'
                      }}
                      onInput={(e) => {
                        e.target.style.height = 'auto'
                        e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'
                      }}
                    />
                  </div>
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isLoading}
                    className="px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed text-white rounded-xl transition-all duration-200 flex items-center justify-center min-w-[48px]"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Analysis Actions Sidebar */}
            <div className="w-80 border-l border-gray-200 p-6 flex-shrink-0">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Quick Analysis</h3>
              
              {/* Stock Summary Card */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 mb-6 border">
                <div className="text-sm font-medium text-gray-900 mb-2">{stockData.symbol}</div>
                <div className="text-lg font-bold mb-1">{formatCurrency(stockData.regularMarketPrice)}</div>
                <div className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  {isPositive ? '+' : ''}{stockData.regularMarketChange.toFixed(2)} ({isPositive ? '+' : ''}{stockData.regularMarketChangePercent.toFixed(2)}%)
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <div className="text-gray-500">P/E Ratio</div>
                    <div className="font-medium">{stockData.peRatio}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Market Cap</div>
                    <div className="font-medium">{formatLargeNumber(stockData.marketCap)}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Beta</div>
                    <div className="font-medium">{stockData.beta}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Volume</div>
                    <div className="font-medium">{(stockData.volume / 1e6).toFixed(1)}M</div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-3">
                {quickAnalysisActions.map((action, index) => (
                  <motion.button
                    key={index}
                    onClick={() => handleQuickAction(action)}
                    disabled={isLoading}
                    className={`w-full flex items-start gap-3 p-3 rounded-xl text-left transition-colors hover:opacity-80 disabled:opacity-50 ${action.color}`}
                    whileHover={{ scale: isLoading ? 1 : 1.02 }}
                    whileTap={{ scale: isLoading ? 1 : 0.98 }}
                  >
                    <action.icon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span className="text-sm font-medium">{action.text}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default StockAnalysisChat