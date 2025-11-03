export const LIFESTYLE_BRANDS = [
  { name: 'Walmart', ticker: 'WMT', logo: '🛒' },
  { name: 'Starbucks', ticker: 'SBUX', logo: '☕' },
  { name: 'Netflix', ticker: 'NFLX', logo: '📺' },
  { name: 'Apple', ticker: 'AAPL', logo: '🍎' },
  { name: 'Amazon', ticker: 'AMZN', logo: '📦' },
  { name: 'Tesla', ticker: 'TSLA', logo: '🚗' },
  { name: 'Nike', ticker: 'NKE', logo: '👟' },
  { name: 'McDonald\'s', ticker: 'MCD', logo: '🍟' },
  { name: 'Disney', ticker: 'DIS', logo: '🏰' },
  { name: 'Spotify', ticker: 'SPOT', logo: '🎵' },
  { name: 'Uber', ticker: 'UBER', logo: '🚕' },
  { name: 'Meta', ticker: 'META', logo: '📱' }
]

// REMOVED MOCK_PRICES - All prices now fetched from real APIs!

export const INVESTMENT_GOALS = [
  {
    id: 'save',
    title: 'Save Money',
    emoji: '💰',
    description: 'Build an emergency fund and save for short-term goals',
    color: 'bg-green-100 text-green-800'
  },
  {
    id: 'grow',
    title: 'Grow Wealth',
    emoji: '📈',
    description: 'Long-term investing for building wealth over time',
    color: 'bg-blue-100 text-blue-800'
  },
  {
    id: 'learn',
    title: 'Learn Investing',
    emoji: '🎓',
    description: 'Start with basics and learn as you invest',
    color: 'bg-purple-100 text-purple-800'
  },
  {
    id: 'options',
    title: 'Explore Options',
    emoji: '⚡',
    description: 'Advanced strategies and higher-risk investments',
    color: 'bg-orange-100 text-orange-800'
  }
]

export const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' }
]

export const LESSONS = [
  {
    id: 1,
    title: 'Investing 101',
    description: 'Learn the basics of investing and why it matters',
    level: 'beginner',
    emoji: '🌱',
    duration: '5 min',
    unlocked: true
  },
  {
    id: 2,
    title: 'Stocks vs ETFs',
    description: 'Understand the difference and when to use each',
    level: 'beginner',
    emoji: '📊',
    duration: '7 min',
    unlocked: true
  },
  {
    id: 3,
    title: 'Diversification Magic',
    description: 'Why putting all eggs in one basket is risky',
    level: 'intermediate',
    emoji: '🎯',
    duration: '6 min',
    unlocked: false
  },
  {
    id: 4,
    title: 'Options Trading',
    description: 'Advanced strategies for experienced investors',
    level: 'advanced',
    emoji: '⚡',
    duration: '10 min',
    unlocked: false
  }
]

export const generatePortfolioReason = (brand: string, goal: string): string => {
  const reasons = {
    save: `You shop at ${brand}, so you understand their business model`,
    grow: `${brand} has strong growth potential and you're familiar with their products`,
    learn: `${brand} is a great company to learn about investing - you use their products daily`,
    options: `${brand} has high volatility, perfect for options strategies`
  }
  return reasons[goal as keyof typeof reasons] || `You're familiar with ${brand}`
}