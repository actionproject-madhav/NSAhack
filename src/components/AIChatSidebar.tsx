import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Sparkles, TrendingUp, DollarSign, BookOpen, Minimize2, Maximize2 } from 'lucide-react'

const AIChatSidebar = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm your AI investment advisor 🤖 I can help you with portfolio analysis, market insights, and investment strategies. What would you like to know?",
      isBot: true,
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isMinimized, setIsMinimized] = useState(false)

  const quickActions = [
    { icon: TrendingUp, text: "Analyze my portfolio", color: "bg-green-100 text-green-700" },
    { icon: DollarSign, text: "Investment suggestions", color: "bg-blue-100 text-blue-700" },
    { icon: BookOpen, text: "Explain diversification", color: "bg-purple-100 text-purple-700" }
  ]

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const userMessage = {
      id: messages.length + 1,
      text: inputValue,
      isBot: false,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')

    // Simulate AI response
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        text: generateAIResponse(inputValue),
        isBot: true,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, botResponse])
    }, 1000)
  }

  const generateAIResponse = (input: string) => {
    const responses = [
      "Based on your current portfolio, I see you have a good mix of tech and growth stocks! Your Tesla position is performing well with +7.03% gains. Consider diversifying into some defensive sectors like utilities or consumer staples for better risk management. 📈",
      "Great question! Your portfolio shows strong momentum with NVDA leading at $203.65. However, I notice you're heavily weighted in tech. Would you like me to suggest some ETFs or bonds to balance your risk? 💡",
      "Looking at your $14,032.56 balance, you're in a great position! Your 5.63% gain today is impressive. For your next investment, consider dollar-cost averaging into index funds. This strategy works especially well for international students building long-term wealth. 🎯",
      "Smart thinking! Diversification is like not putting all your eggs in one basket. Your current holdings (NVDA, META, TSLA, AAPL) are all growth stocks. Adding some value stocks or international exposure could reduce volatility while maintaining growth potential. 🌍",
      "Excellent timing to ask! With your current $7,532.21 invested, you're building a solid foundation. The key is consistency - keep investing regularly regardless of market conditions. Your Tesla gains show you're picking quality companies! 🚀"
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  const handleQuickAction = (actionText: string) => {
    setInputValue(actionText)
  }

  return (
    <div className={`bg-white border-l border-gray-200 flex flex-col h-full transition-all duration-300 ${
      isMinimized ? 'w-16' : 'w-80'
    }`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!isMinimized && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">AI Advisor</h3>
                <p className="text-xs text-green-600">● Online</p>
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
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-96">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                      message.isBot
                        ? 'bg-gray-100 text-gray-900'
                        : 'bg-gradient-to-r from-purple-600 to-purple-700 text-white'
                    }`}
                  >
                    <p>{message.text}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Quick Actions */}
          <div className="p-4 border-t border-gray-100">
            <p className="text-xs text-gray-500 mb-3">Quick actions:</p>
            <div className="space-y-2">
              {quickActions.map((action, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleQuickAction(action.text)}
                  className={`w-full flex items-center gap-2 p-2 rounded-lg text-xs transition-colors hover:opacity-80 ${action.color}`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <action.icon className="w-3 h-3" />
                  <span>{action.text}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask about investments..."
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                className="p-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 disabled:from-gray-300 disabled:to-gray-300 text-white rounded-lg transition-all duration-200"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </>
      )}

      {/* Minimized State */}
      {isMinimized && (
        <div className="flex-1 flex flex-col items-center justify-center p-2">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center mb-2">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        </div>
      )}
    </div>
  )
}

export default AIChatSidebar