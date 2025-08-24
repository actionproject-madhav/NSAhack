import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Sparkles, Minimize2, Maximize2, Loader2, Plus } from 'lucide-react'
import GeminiService from '../services/geminiService'

const AIChatSidebar = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! How can I help you today?",
      isBot: true,
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isMinimized, setIsMinimized] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

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
      // Create context for the dashboard - generic investment advice
      const context = {
        userLevel: 'beginner' as const,
        // Add dashboard-specific context
        dashboardContext: true
      }

      // Build investment-focused prompt
      const investmentPrompt = `${currentInput}

      Context: You are helping a user on their investment dashboard. They can see their portfolio performance, stock holdings (likely NVDA, META, TSLA, AAPL, AMD), and market data. They have a portfolio value around $14,000+ and are looking for practical investment advice.

      Please provide helpful, actionable investment guidance. Keep responses conversational and engaging, using emojis appropriately. Focus on education and practical tips while reminding users this is not professional financial advice.`

      const aiResponse = await GeminiService.generateContent(investmentPrompt, context)
      
      const botResponse = {
        id: Date.now() + 1,
        text: aiResponse,
        isBot: true,
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, botResponse])
    } catch (error) {
      console.error('Error getting AI response:', error)
      
      // Use fallback response from GeminiService
      const fallbackResponse = GeminiService.getFallbackResponse(currentInput, { userLevel: 'beginner' })
      
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

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className={`bg-white border-l border-gray-200 flex flex-col h-full transition-all duration-300 ${
      isMinimized ? 'w-16' : 'w-80'
    }`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-between">
          {!isMinimized && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                <Plus className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Personalised AI Assistant</h3>
              </div>
            </div>
          )}
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* AI Orb at top middle */}
          <div className="flex justify-center p-4">
            <img 
              src="/orb.gif" 
              alt="AI Orb" 
              className="w-24 h-24 rounded-full object-cover"
            />
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`flex gap-2 max-w-[85%] ${message.isBot ? 'flex-row' : 'flex-row-reverse'}`}>
                    {message.isBot && (
                      <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <Plus className="w-3 h-3 text-white" />
                      </div>
                    )}
                    <div
                      className={`p-3 rounded-2xl text-sm ${
                        message.isBot
                          ? 'bg-gray-100 text-gray-900 rounded-tl-md'
                          : 'bg-black text-white rounded-tr-md'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{message.text}</p>
                      <p className={`text-xs mt-1 opacity-60 ${
                        message.isBot ? 'text-gray-500' : 'text-gray-300'
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
                <div className="flex gap-2 max-w-[85%]">
                  <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Plus className="w-3 h-3 text-white" />
                  </div>
                  <div className="bg-gray-100 text-gray-900 p-3 rounded-2xl rounded-tl-md">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm">Thinking...</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200 flex-shrink-0">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything..."
                  disabled={isLoading}
                  className="w-full px-4 py-3 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                  rows={1}
                  style={{
                    minHeight: '44px',
                    maxHeight: '100px',
                    height: 'auto'
                  }}
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement
                    target.style.height = 'auto'
                    target.style.height = Math.min(target.scrollHeight, 100) + 'px'
                  }}
                />
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="p-3 bg-black hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl transition-all duration-200 flex items-center justify-center min-w-[44px]"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </>
      )}

      {/* Minimized State */}
      {isMinimized && (
        <div className="flex-1 flex flex-col items-center justify-center p-2">
          <motion.div
            className="w-10 h-10 bg-black rounded-full flex items-center justify-center mb-2 cursor-pointer"
            whileHover={{ scale: 1.1 }}
            onClick={() => setIsMinimized(false)}
          >
            <Plus className="w-5 h-5 text-white" />
          </motion.div>
          <p className="text-xs text-gray-500 mt-2 writing-mode-vertical text-center">AI Chat</p>
        </div>
      )}
    </div>
  )
}

export default AIChatSidebar