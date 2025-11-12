import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Send, Wand2, Check } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import { LIFESTYLE_BRANDS } from '../utils/mockData'
import Layout from '../components/Layout'
import apiService from '../services/apiService'

type Risk = 'low' | 'medium' | 'high'
type Horizon = 'short' | 'medium' | 'long'

type Msg = {
  id: string
  role: 'assistant' | 'user'
  content: string
  options?: { label: string; value: any }[]
}

const TradePage = () => {
  const { user, updatePortfolio } = useUser()
  const navigate = useNavigate()

  const [messages, setMessages] = useState<Msg[]>([])
  const [input, setInput] = useState('')
  const [risk, setRisk] = useState<Risk | null>(null)
  const [horizon, setHorizon] = useState<Horizon | null>(null)
  const [budget, setBudget] = useState<number | null>(null)
  const [themes, setThemes] = useState<string[]>([])
  const [activated, setActivated] = useState(false)
  const [stockPrices, setStockPrices] = useState<Record<string, number>>({})
  const [loadingPrices, setLoadingPrices] = useState(false)
  const endRef = useRef<HTMLDivElement | null>(null)

  // Seed conversation
  useEffect(() => {
    const firstName = user?.name ? user.name.split(' ')[0] : 'there'
    setMessages([
      { id: 'm0', role: 'assistant', content: `Hi ${firstName}! I'm your AI Auto-Trader. I'll help you set up a personalized monthly investing plan with real stock prices.` },
      { id: 'm1', role: 'assistant', content: "First, what's your risk tolerance?", options: [
        { label: 'Low', value: 'low' },
        { label: 'Medium', value: 'medium' },
        { label: 'High', value: 'high' },
      ] }
    ])
  }, [])

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const addAssistant = (content: string, options?: Msg['options']) =>
    setMessages(prev => [...prev, { id: crypto.randomUUID(), role: 'assistant', content, options }])

  const addUser = (content: string) =>
    setMessages(prev => [...prev, { id: crypto.randomUUID(), role: 'user', content }])

  const chooseOption = (opt: { label: string; value: any }) => {
    addUser(opt.label)
    proceed(opt.value)
  }

  const proceed = (value?: any) => {
    // Fill answers progressively
    if (!risk) {
      const v = (value ?? (input.trim().toLowerCase() as Risk)) as Risk
      if (!['low', 'medium', 'high'].includes(v)) return
      setRisk(v)
      setInput('')
      addAssistant('Great. What’s your time horizon?', [
        { label: '0-1 yr', value: 'short' },
        { label: '1-3 yrs', value: 'medium' },
        { label: '3+ yrs', value: 'long' },
      ])
      return
    }
    if (!horizon) {
      const v = (value ?? input.trim().toLowerCase()) as Horizon
      if (!['short', 'medium', 'long'].includes(v)) return
      setHorizon(v)
      setInput('')
      addAssistant('Awesome. What monthly budget should I invest?', [
        { label: '$50', value: 50 }, { label: '$100', value: 100 }, { label: '$250', value: 250 }, { label: '$500', value: 500 }
      ])
      return
    }
    if (budget == null) {
      const v = Number(value ?? input.replace(/[^0-9]/g, ''))
      if (!v || v < 10) return
      setBudget(v)
      setInput('')
      addAssistant('Last step: pick up to 3 themes you like. Tap to toggle, then type "done" when ready.',
        LIFESTYLE_BRANDS.slice(0, 9).map(b => ({ label: b.name, value: b.name })))
      return
    }
    // Themes collection stage
    const txt = String(value ?? input).trim().toLowerCase()
    if (txt === 'done') {
      if (themes.length === 0) { addAssistant('Choose at least one theme, then type "done".'); return }
      showPlan()
      setInput('')
      return
    }
    // Toggle theme if it's a known brand
    const brand = LIFESTYLE_BRANDS.find(b => b.name.toLowerCase() === txt)
    if (brand) {
      setThemes(prev => prev.includes(brand.name) ? prev.filter(n => n !== brand.name) : [...prev, brand.name].slice(0, 3))
      addUser(brand.name)
      return
    }
  }

  const selectedBrands = useMemo(() => (
    (themes.length ? themes : LIFESTYLE_BRANDS.slice(0, 3).map(b => b.name))
      .slice(0, 3)
      .map(n => LIFESTYLE_BRANDS.find(b => b.name === n)!)
  ), [themes])

  const allocations = useMemo(() => {
    if (risk === 'low') return [50, 30, 20]
    if (risk === 'high') return [60, 25, 15]
    return [45, 35, 20]
  }, [risk])

  const plan = useMemo(() => {
    const b = budget ?? 0
    return selectedBrands.map((brand, i) => {
      const pct = allocations[i] || 0
      const dollars = Math.round((pct / 100) * b)
      const price = stockPrices[brand.ticker] || 100 // Use real price or fallback
      const qty = Math.max(0, Math.floor(dollars / price))
      return { brand, pct, dollars, price, qty }
    })
  }, [selectedBrands, allocations, budget, stockPrices])

  const showPlan = async () => {
    // Fetch real stock prices before showing plan
    setLoadingPrices(true)
    addAssistant('Fetching real-time stock prices...')
    
    try {
      const tickers = selectedBrands.map(b => b.ticker)
      const quotes = await apiService.getMultipleStockQuotes(tickers)
      
      const prices: Record<string, number> = {}
      quotes.forEach(q => {
        if (q.price > 0) {
          prices[q.symbol] = q.price
        }
      })
      setStockPrices(prices)
      
      // Wait a moment for plan to recalculate with new prices
      setTimeout(() => {
        addAssistant(`Here's your plan: Risk ${risk}, Horizon ${horizon}, Budget $${budget}/mo.`)
        const lines = plan.map(p => `${p.brand.name}: ${p.pct}% ($${p.dollars}/mo) ~${p.qty} shares/mo @ $${p.price.toFixed(2)}`)
        addAssistant(lines.join('\n'))
        addAssistant('Ready to activate auto-trade?', [
          { label: 'Activate plan', value: 'activate' },
          { label: 'Adjust later', value: 'later' },
        ])
        setLoadingPrices(false)
      }, 500)
    } catch (error) {
      console.error('Error fetching stock prices:', error)
      addAssistant('Error fetching real-time prices. Using approximate values.')
      setLoadingPrices(false)
    }
  }

  const activate = () => {
    plan.forEach(p => {
      if (p.qty <= 0) return
      updatePortfolio({
        ticker: p.brand.ticker,
        company: p.brand.name,
        quantity: p.qty,
        avgPrice: p.price,
        currentPrice: p.price,
        reason: `Auto-invest ${p.pct}% ($${p.dollars}) monthly via AI plan (${risk}/${horizon}).`,
        logo: p.brand.logo
      })
    })
    setActivated(true)
    addAssistant('Plan activated. Redirecting to your portfolio... ')
    setTimeout(() => navigate('/portfolio'), 1200)
  }

  const handleSend = () => {
    const text = input.trim()
    if (!text) return
    addUser(text)
    setInput('')
    if (!risk || !horizon || budget == null || themes.length === 0) proceed(text)
    else if (/activate/i.test(text)) activate()
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <img src="/orb.gif" alt="orb" className="w-12 h-12 rounded-full object-cover" />
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1"><Wand2 className="w-3 h-3" /> AI Auto-Trading</div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Personalized AI Assistant</h1>
          </div>
        </div>

        {/* Chat window */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 h-[65vh] flex flex-col transition-colors">
          <div className="flex-1 overflow-y-auto pr-1">
            {messages.map(m => (
              <motion.div key={m.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mb-3">
                <div className={`max-w-[80%] rounded-2xl px-4 py-3 whitespace-pre-wrap ${m.role === 'assistant' ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100' : 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 ml-auto'}`}>
                  {m.content}
                </div>
                {m.options && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {m.options.map(o => (
                      <button key={o.label} onClick={() => chooseOption(o)} className="px-3 py-1.5 rounded-full border border-gray-300 dark:border-gray-700 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors">
                        {o.label}
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
            {/* Live selections (themes) */}
            {themes.length > 0 && (!risk || !horizon || budget == null ? null : (
              <div className="mb-2 text-xs text-gray-500 dark:text-gray-400">Selected themes: {themes.join(', ')}</div>
            ))}
            <div ref={endRef} />
          </div>

          {/* Composer */}
          <div className="pt-3 border-t border-gray-200 dark:border-gray-800 mt-2 flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={risk && horizon && budget != null ? 'Type "activate" to confirm or say anything...' : 'Type your answer…'}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSend() }}
              className="flex-1 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 transition-colors"
            />
            <button onClick={handleSend} className="px-6 py-3 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-xl hover:bg-gray-800 dark:hover:bg-gray-200 inline-flex items-center gap-2 transition-colors">
              <Send className="w-4 h-4" /> Send
            </button>
          </div>
        </div>

        {/* Footer action after plan */}
        {risk && horizon && budget != null && messages.some(m => m.content.includes('your plan')) && (
          <button onClick={activate} className="mt-4 w-full px-6 py-3 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-xl hover:bg-gray-800 dark:hover:bg-gray-200 flex items-center justify-center gap-2 transition-colors">
            <Check className="w-4 h-4" /> {activated ? 'Plan activated' : 'Activate Auto-Trade'}
          </button>
        )}
      </div>
    </Layout>
  )
}

export default TradePage