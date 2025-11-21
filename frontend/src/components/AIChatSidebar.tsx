import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Sparkles, Loader2 } from 'lucide-react'
import GeminiService from '../services/geminiService'
import { useUser } from '../context/UserContext'

const AIChatSidebar = () => {
  const { user } = useUser()
  
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm your personalized AI investment assistant. I have full access to your portfolio and can provide insights based on your actual holdings. How can I help you today?",
      isBot: true,
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
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
      console.log('🔵 AIChatSidebar: Sending message to Gemini...')
      
      // Build portfolio context
      const portfolioContext = user?.portfolio?.length ? 
        user.portfolio.map(p => `${p.ticker}: ${p.quantity} shares at $${p.currentPrice.toFixed(2)} (avg cost: $${p.avgPrice.toFixed(2)})`).join(', ') :
        'No holdings yet'
      
      const portfolioValue = user?.totalValue || 0
      const hasPositions = (user?.portfolio?.length || 0) > 0
      
      // Create context for personalized advice
      const context = {
        userLevel: 'beginner' as const,
        dashboardContext: true
      }

      // Build personalized investment prompt with actual portfolio data
      const investmentPrompt = `${currentInput}

      Context: You are a personalized AI investment assistant helping a user with their portfolio.

      User's Current Portfolio:
      - Holdings: ${portfolioContext}
      - Portfolio Value: $${portfolioValue.toFixed(2)}
      - Number of Positions: ${user?.portfolio?.length || 0}
      ${hasPositions ? '- The user has an active portfolio and is learning to invest' : '- The user is just starting out and has not made any trades yet'}

      Please provide personalized, helpful advice based on their actual portfolio. Be specific about their holdings when relevant. Keep responses conversational and engaging, using emojis appropriately. Focus on education and practical tips. Remind them this is educational content, not professional financial advice.`

      console.log('🔵 AIChatSidebar: Calling GeminiService with portfolio context...')
      const aiResponse = await GeminiService.generateContent(investmentPrompt, context)
      console.log('✅ AIChatSidebar: Got response from Gemini:', aiResponse.substring(0, 100))
      
      const botResponse = {
        id: Date.now() + 1,
        text: aiResponse,
        isBot: true,
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, botResponse])
    } catch (error) {
      console.error('❌ AIChatSidebar Error getting AI response:', error)
      
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
    <div className="bg-white dark:bg-gray-900 flex flex-col h-full">
          {/* AI Orb at top middle */}
      <div className="flex justify-center p-4 border-b border-gray-200 dark:border-gray-800">
            <img 
              src="/orb.gif" 
              alt="AI Orb" 
          className="w-20 h-20 rounded-full object-cover"
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
                  <div className="w-6 h-6 bg-black dark:bg-white rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Sparkles className="w-3 h-3 text-white dark:text-black" />
                      </div>
                    )}
                    <div
                      className={`p-3 rounded-2xl text-sm ${
                        message.isBot
                      ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-tl-md'
                      : 'bg-black dark:bg-white text-white dark:text-black rounded-tr-md'
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
              <div className="w-6 h-6 bg-black dark:bg-white rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <Sparkles className="w-3 h-3 text-white dark:text-black" />
                  </div>
              <div className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white p-3 rounded-2xl rounded-tl-md">
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
      <div className="p-4 border-t border-gray-200 dark:border-gray-800 flex-shrink-0">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything..."
                  disabled={isLoading}
              className="w-full px-4 py-3 text-sm border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent resize-none disabled:opacity-50 disabled:cursor-not-allowed placeholder-gray-400 dark:placeholder-gray-500"
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
    </div>
  )
}

export default AIChatSidebar