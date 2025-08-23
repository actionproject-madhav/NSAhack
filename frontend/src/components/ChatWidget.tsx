import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Sparkles, Bot, Loader } from 'lucide-react'
import GeminiService from '../services/geminiService'

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

interface EnhancedChatWidgetProps {
  currentCourse?: string;
  currentModule?: string;
}

const EnhancedChatWidget: React.FC<EnhancedChatWidgetProps> = ({ currentCourse, currentModule }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: currentCourse 
        ? `Hi! I'm your AI tutor for "${currentCourse}" 🎓 I know everything about this course and can help you understand any concept better!` 
        : "Hi! I'm your AI investment advisor 🤖 Ask me anything about investing, your portfolio, or financial concepts!",
      isBot: true,
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = (): void => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Update welcome message when course context changes
  useEffect(() => {
    if (currentCourse) {
      const contextMessage: Message = {
        id: Date.now(),
        text: currentModule 
          ? `📚 I see you're now in "${currentModule}" from "${currentCourse}". I have full context of this lesson and can help explain any concepts!`
          : `🎓 Welcome to "${currentCourse}"! I'm here to help you understand all the concepts in this course.`,
        isBot: true,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, contextMessage])
    }
  }, [currentCourse, currentModule])

  // Remove the old callGeminiAPI function since we're using the service

  const handleSendMessage = async (): Promise<void> => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now(),
      text: inputValue,
      isBot: false,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    const currentInput = inputValue
    setInputValue('')
    setIsLoading(true)

    // Get AI response using Gemini Service
    try {
      const context = {
        currentCourse,
        currentModule,
        userLevel: 'beginner' as const // You can make this dynamic based on user progress
      }
      
      const aiResponse = await GeminiService.generateContent(currentInput, context)
      
      const botMessage: Message = {
        id: Date.now() + 1,
        text: aiResponse,
        isBot: true,
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      console.error('Chat error:', error)
      
      // Use fallback response
      const fallbackResponse = GeminiService.getFallbackResponse(currentInput, { currentCourse, currentModule })
      
      const errorMessage: Message = {
        id: Date.now() + 1,
        text: fallbackResponse,
        isBot: true,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const quickQuestions: string[] = [
    "Explain this concept simply",
    "Give me an example",
    "How does this apply to students?",
    "What should I remember most?"
  ]

  return (
    <>
      {/* Chat Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white rounded-full shadow-lg flex items-center justify-center z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{ 
          boxShadow: isOpen ? "0 0 0 0 rgba(20, 184, 166, 0.4)" : "0 0 0 10px rgba(20, 184, 166, 0.4)"
        }}
        transition={{ 
          boxShadow: { duration: 2, repeat: Infinity, repeatType: "reverse" }
        }}
      >
        <MessageCircle className="w-7 h-7" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-24 right-6 w-96 h-[32rem] bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-600 to-accent-600 text-white p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">AI Learning Assistant</h3>
                    <p className="text-xs text-white/80">
                      {currentCourse ? `📚 ${currentCourse}` : '💡 Ready to help'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {currentModule && (
                <div className="mt-2 px-3 py-1 bg-white/20 rounded-full text-xs">
                  Currently: {currentModule}
                </div>
              )}
            </div>

            {/* Quick Questions */}
            {currentCourse && (
              <div className="p-3 bg-gray-50 border-b">
                <div className="text-xs text-gray-600 mb-2">Quick questions:</div>
                <div className="flex flex-wrap gap-1">
                  {quickQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => setInputValue(question)}
                      className="text-xs px-2 py-1 bg-white border border-gray-200 rounded-full hover:bg-primary-50 hover:border-primary-200 transition-colors"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`flex items-start gap-2 max-w-[85%] ${message.isBot ? '' : 'flex-row-reverse'}`}>
                    {message.isBot && (
                      <div className="w-8 h-8 bg-gradient-to-r from-primary-100 to-accent-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-4 h-4 text-primary-600" />
                      </div>
                    )}
                    <div
                      className={`p-3 rounded-2xl ${
                        message.isBot
                          ? 'bg-gray-100 text-gray-900'
                          : 'bg-gradient-to-r from-primary-600 to-accent-600 text-white'
                      } ${message.isBot ? 'rounded-bl-sm' : 'rounded-br-sm'}`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                      <div className={`text-xs mt-1 ${message.isBot ? 'text-gray-500' : 'text-white/70'}`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-primary-100 to-accent-100 rounded-full flex items-center justify-center">
                      <Loader className="w-4 h-4 text-primary-600 animate-spin" />
                    </div>
                    <div className="bg-gray-100 p-3 rounded-2xl rounded-bl-sm">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
                  placeholder={currentCourse ? "Ask about this course..." : "Ask me anything..."}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  className="px-4 py-2 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 disabled:from-gray-300 disabled:to-gray-300 text-white rounded-xl transition-all duration-200 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default EnhancedChatWidget