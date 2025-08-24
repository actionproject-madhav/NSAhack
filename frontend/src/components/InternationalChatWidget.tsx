import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MessageCircle, X, Send, Sparkles, Bot, Loader, Flag, 
  AlertTriangle, CheckCircle, Globe, Shield, Calculator,
  FileCheck, Phone, ExternalLink, BookOpen, TrendingUp
} from 'lucide-react'
import InternationalGeminiService from '../services/internationalGeminiService'

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: Date;
  type?: 'normal' | 'warning' | 'success' | 'info';
  quickActions?: QuickAction[];
}

interface QuickAction {
  label: string;
  action: string;
  icon?: any;
  urgent?: boolean;
}

interface VisaContext {
  status: 'F1' | 'OPT' | 'H1B' | 'L1' | 'GreenCard' | 'Citizen';
  timeRemaining?: string;
  restrictions: string[];
}

interface InternationalChatWidgetProps {
  currentCourse?: string;
  currentModule?: string;
  visaStatus?: VisaContext;
}

const InternationalChatWidget: React.FC<InternationalChatWidgetProps> = ({ 
  currentCourse, 
  currentModule,
  visaStatus = { status: 'F1', restrictions: ['No day trading', 'Report investment income'] }
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: `Welcome! I'm your specialized AI advisor for international student investing.\n\nI understand ${visaStatus.status} visa requirements and can help with:\n• Investment compliance and restrictions\n• Tax obligations and filing requirements\n• Banking and credit building strategies\n• Safe investment options for your visa status\n\n${currentCourse ? `I also have complete knowledge of "${currentCourse}" to assist with course questions.` : 'Ask me about visa-compliant investing, tax planning, or financial strategies!'}`,
      isBot: true,
      timestamp: new Date(),
      type: 'info',
      quickActions: [
        { label: 'Visa Investment Rules', action: 'What investment restrictions do I have on my visa?', icon: Shield, urgent: true },
        { label: 'Tax Obligations', action: 'What are my US tax obligations?', icon: FileCheck, urgent: true },
        { label: 'Safe Investments', action: 'What investments are safe for my visa status?', icon: CheckCircle }
      ]
    }
  ])
  const [inputValue, setInputValue] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [chatMode, setChatMode] = useState<'general' | 'visa' | 'tax' | 'course'>('general')
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
          ? `Now studying: "${currentModule}" from "${currentCourse}". I have complete context of this lesson and can explain any concepts or answer questions.`
          : `Course context updated: "${currentCourse}". I can help explain concepts and answer questions about this course material.`,
        isBot: true,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, contextMessage])
    }
  }, [currentCourse, currentModule])

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

    try {
      // Get AI response using International Gemini Service
      const context = {
        currentCourse,
        currentModule,
        userLevel: 'beginner' as const,
        visaStatus: visaStatus.status
      }
      
      const aiResponse = await InternationalGeminiService.generateContent(currentInput, context)
      
      const botMessage: Message = {
        id: Date.now() + 1,
        text: aiResponse,
        isBot: true,
        timestamp: new Date(),
        type: 'normal',
        quickActions: getQuickActionsForResponse(currentInput)
      }
      
      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      console.error('Chat error:', error)
      
      // Use fallback response
      const fallbackResponse = InternationalGeminiService.getFallbackResponse(currentInput, { 
        currentCourse, 
        currentModule, 
        visaStatus: visaStatus.status 
      })
      
      const errorMessage: Message = {
        id: Date.now() + 1,
        text: fallbackResponse,
        isBot: true,
        timestamp: new Date(),
        type: 'warning'
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const getQuickActionsForResponse = (input: string): QuickAction[] => {
    const lowerInput = input.toLowerCase()
    
    if (lowerInput.includes('tax')) {
      return [
        { label: 'ITIN Application', action: 'How do I apply for ITIN?', icon: FileCheck },
        { label: 'Tax Calculator', action: 'Calculate my investment taxes', icon: Calculator },
        { label: 'Find Tax Professional', action: 'Find a CPA for international students', icon: Phone, urgent: true }
      ]
    }
    
    if (lowerInput.includes('visa') || lowerInput.includes('legal')) {
      return [
        { label: 'Investment Rules', action: 'What are specific investment rules for my visa?', icon: Shield },
        { label: 'Day Trading Rules', action: 'Why can\'t I day trade on my visa?', icon: AlertTriangle, urgent: true },
        { label: 'Safe Strategies', action: 'What investment strategies are completely safe?', icon: CheckCircle }
      ]
    }
    
    return [
      { label: 'Portfolio Review', action: 'Review my investment portfolio for visa compliance', icon: TrendingUp },
      { label: 'Learning Path', action: 'What should I learn next as an international investor?', icon: BookOpen }
    ]
  }

  const handleQuickAction = (action: string): void => {
    setInputValue(action)
  }

  const getChatModeColor = (): string => {
    switch (chatMode) {
      case 'visa': return 'from-red-500 to-orange-500'
      case 'tax': return 'from-green-500 to-emerald-500' 
      case 'course': return 'from-blue-500 to-cyan-500'
      default: return 'from-primary-600 to-accent-600'
    }
  }

  const chatModes = [
    { key: 'general', label: 'General', icon: MessageCircle },
    { key: 'visa', label: 'Visa Rules', icon: Shield },
    { key: 'tax', label: 'Tax Help', icon: FileCheck },
    { key: 'course', label: 'Course Help', icon: BookOpen, disabled: !currentCourse }
  ]

  return (
    <>
      {/* Enhanced Chat Button with Visa Status */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r ${getChatModeColor()} hover:scale-110 text-white rounded-full shadow-lg flex flex-col items-center justify-center z-50 transition-all`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <MessageCircle className="w-6 h-6" />
        <div className="text-xs font-medium mt-1">{visaStatus.status}</div>
        {/* Urgent notification dot */}
        <motion.div
          className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <AlertTriangle className="w-2 h-2 text-white" />
        </motion.div>
      </motion.button>

      {/* Enhanced Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-24 right-6 w-[420px] h-[36rem] bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 flex flex-col overflow-hidden"
          >
            {/* Enhanced Header with Visa Status */}
            <div className={`bg-gradient-to-r ${getChatModeColor()} text-white p-4`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">International Student AI</h3>
                    <div className="flex items-center gap-2 text-xs text-white/80">
                      <Flag className="w-3 h-3" />
                      <span>{visaStatus.status} Visa Specialist</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Chat Mode Selector */}
              <div className="flex gap-1">
                {chatModes.map(mode => (
                  <button
                    key={mode.key}
                    onClick={() => !mode.disabled && setChatMode(mode.key as any)}
                    disabled={mode.disabled}
                    className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs transition-colors ${
                      chatMode === mode.key 
                        ? 'bg-white/30 text-white' 
                        : mode.disabled
                          ? 'bg-white/10 text-white/50 cursor-not-allowed'
                          : 'bg-white/20 text-white/80 hover:bg-white/30'
                    }`}
                  >
                    <mode.icon className="w-3 h-3" />
                    {mode.label}
                  </button>
                ))}
              </div>

              {/* Current Context Display */}
              {(currentCourse || currentModule) && (
                <div className="mt-2 px-3 py-1 bg-white/20 rounded-full text-xs">
                  <BookOpen className="w-3 h-3 inline mr-1" />
                  {currentModule || currentCourse}
                </div>
              )}
            </div>

            {/* Visa Status Alert */}
            <div className="p-3 bg-yellow-50 border-b border-yellow-200">
              <div className="flex items-center gap-2 text-yellow-800">
                <AlertTriangle className="w-4 h-4" />
                <div className="text-xs">
                  <strong>{visaStatus.status} Reminder:</strong> {visaStatus.restrictions[0]}
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`flex items-start gap-2 max-w-[90%] ${message.isBot ? '' : 'flex-row-reverse'}`}>
                    {message.isBot && (
                      <div className="w-8 h-8 bg-gradient-to-r from-primary-100 to-accent-100 rounded-full flex items-center justify-center flex-shrink-0">
                        {message.type === 'warning' ? (
                          <AlertTriangle className="w-4 h-4 text-orange-600" />
                        ) : message.type === 'success' ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <Sparkles className="w-4 h-4 text-primary-600" />
                        )}
                      </div>
                    )}
                    <div
                      className={`p-3 rounded-2xl ${
                        message.isBot
                          ? message.type === 'warning'
                            ? 'bg-orange-50 border border-orange-200 text-orange-900'
                            : message.type === 'success'
                              ? 'bg-green-50 border border-green-200 text-green-900'
                              : 'bg-gray-100 text-gray-900'
                          : 'bg-gradient-to-r from-primary-600 to-accent-600 text-white'
                      } ${message.isBot ? 'rounded-bl-sm' : 'rounded-br-sm'}`}
                    >
                      <div className="text-sm whitespace-pre-wrap">{message.text}</div>
                      <div className={`text-xs mt-2 ${message.isBot ? 'text-gray-500' : 'text-white/70'}`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      
                      {/* Quick Actions */}
                      {message.quickActions && (
                        <div className="mt-3 space-y-2">
                          {message.quickActions.map((action, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleQuickAction(action.action)}
                              className={`flex items-center gap-2 w-full text-left px-3 py-2 rounded-lg text-xs transition-colors ${
                                action.urgent 
                                  ? 'bg-red-100 hover:bg-red-200 text-red-800'
                                  : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200'
                              }`}
                            >
                              {action.icon && <action.icon className="w-3 h-3" />}
                              {action.label}
                            </button>
                          ))}
                        </div>
                      )}
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

            {/* Enhanced Input with Quick Buttons */}
            <div className="border-t border-gray-200">
              {/* Quick Question Buttons */}
              <div className="p-3 bg-gray-50">
                <div className="text-xs text-gray-600 mb-2">Quick questions:</div>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Can I invest with my visa?',
                    'Tax filing requirements?', 
                    'Safe investment options?',
                    currentCourse && 'Explain this concept'
                  ].filter(Boolean).map((question, idx) => (
                    <button
                      key={idx}
                      onClick={() => setInputValue(question!)}
                      className="text-xs px-3 py-1 bg-white border border-gray-200 rounded-full hover:bg-primary-50 hover:border-primary-200 transition-colors"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input Area */}
              <div className="p-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
                    placeholder={
                      chatMode === 'visa' ? 'Ask about visa investment rules...' :
                      chatMode === 'tax' ? 'Ask about tax obligations...' :
                      chatMode === 'course' ? 'Ask about course concepts...' :
                      'Ask about investing as international student...'
                    }
                    disabled={isLoading}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50 text-sm"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isLoading}
                    className={`px-4 py-2 bg-gradient-to-r ${getChatModeColor()} hover:scale-105 disabled:from-gray-300 disabled:to-gray-300 disabled:hover:scale-100 text-white rounded-xl transition-all duration-200 disabled:cursor-not-allowed`}
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default InternationalChatWidget