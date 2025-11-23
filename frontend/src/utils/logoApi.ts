const LOGO_DEV_API_KEY = 'pk_P_BXl4cLSeK5GysWppL1Og'
const LOGO_DEV_BASE_URL = 'https://img.logo.dev'

export interface LogoOptions {
  size?: number
  format?: 'png' | 'svg' | 'jpg'
  token?: string
}

/**
 * Get a company logo URL from logo.dev API
 * @param domain - Company domain (e.g., 'google.com', 'apple.com')
 * @param options - Logo options (size, format, etc.)
 * @returns Logo URL
 */
export const getLogoUrl = (domain: string, options: LogoOptions = {}): string => {
  const { size = 128, format = 'png', token = LOGO_DEV_API_KEY } = options
  
  // Clean domain - remove protocol and www
  const cleanDomain = domain
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .split('/')[0]
  
  return `${LOGO_DEV_BASE_URL}/${cleanDomain}?token=${token}&size=${size}&format=${format}`
}

/**
 * Get logo URL with error handling and fallback
 * @param domain - Company domain
 * @param fallback - Fallback emoji or text
 * @param options - Logo options
 * @returns Object with logo URL and fallback
 */
export const getLogoWithFallback = (domain: string, fallback: string, options: LogoOptions = {}) => {
  const logoUrl = getLogoUrl(domain, options)
  
  return {
    logoUrl,
    fallback,
    onError: (e: React.SyntheticEvent<HTMLImageElement>) => {
      const target = e.target as HTMLImageElement
      target.style.display = 'none'
      // Show fallback (handled by parent component)
    }
  }
}

// Company domain mappings for common brands (by company name)
export const COMPANY_DOMAINS = {
  'Google': 'google.com',
  'Facebook': 'facebook.com',
  'Meta': 'meta.com',
  'Apple': 'apple.com',
  'Amazon': 'amazon.com',
  'Tesla': 'tesla.com',
  'Netflix': 'netflix.com',
  'Starbucks': 'starbucks.com',
  'Nike': 'nike.com',
  'McDonald\'s': 'mcdonalds.com',
  'Disney': 'disney.com',
  'Walmart': 'walmart.com',
  'Spotify': 'spotify.com',
  'Uber': 'uber.com',
  'Microsoft': 'microsoft.com',
  'Nvidia': 'nvidia.com',
  'AMD': 'amd.com',
  'BMW': 'bmw.com',
  'Coca-Cola': 'coca-cola.com',
  'UPS': 'ups.com',
  'Target': 'target.com',
  'Home Depot': 'homedepot.com',
  'CVS': 'cvs.com',
  'Walgreens': 'walgreens.com',
  'Chipotle': 'chipotle.com',
  'Costco': 'costco.com'
} as const

// Ticker symbol to company domain mapping (for direct ticker lookup)
export const TICKER_TO_DOMAIN: Record<string, string> = {
  // Tech
  'AAPL': 'apple.com',
  'GOOGL': 'google.com',
  'GOOG': 'google.com',
  'MSFT': 'microsoft.com',
  'AMZN': 'amazon.com',
  'META': 'meta.com',
  'NFLX': 'netflix.com',
  'TSLA': 'tesla.com',
  'NVDA': 'nvidia.com',
  'AMD': 'amd.com',
  'SPOT': 'spotify.com',
  'UBER': 'uber.com',
  
  // Retail
  'WMT': 'walmart.com',
  'TGT': 'target.com',
  'COST': 'costco.com',
  'HD': 'homedepot.com',
  'SBUX': 'starbucks.com',
  'MCD': 'mcdonalds.com',
  'CMG': 'chipotle.com',
  
  // Consumer
  'NKE': 'nike.com',
  'DIS': 'disney.com',
  'KO': 'coca-cola.com',
  
  // Healthcare/Pharmacy
  'CVS': 'cvs.com',
  'WBA': 'walgreens.com',
  
  // Add more as needed
} as const

/**
 * Get logo URL for a known company by name or ticker symbol
 * @param identifier - Company name (e.g., 'Apple', 'Google') or ticker symbol (e.g., 'AAPL', 'GOOGL')
 * @param options - Logo options
 * @returns Logo URL or null if company not found
 */
export const getCompanyLogo = (identifier: string, options: LogoOptions = {}): string | null => {
  // First, try ticker symbol lookup (faster and more reliable)
  const ticker = identifier.toUpperCase().trim()
  if (TICKER_TO_DOMAIN[ticker]) {
    const domain = TICKER_TO_DOMAIN[ticker]
    return getLogoUrl(domain, options)
  }
  
  // If not a ticker, try company name lookup
  const cleanName = identifier
    .replace(/\s+(Inc\.?|Corp\.?|Corporation|Company|Co\.?|Ltd\.?|LLC)$/i, '')
    .trim()
  
  // Try exact match first
  let domain = COMPANY_DOMAINS[cleanName as keyof typeof COMPANY_DOMAINS]
  
  // If no exact match, try original name
  if (!domain) {
    domain = COMPANY_DOMAINS[identifier as keyof typeof COMPANY_DOMAINS]
  }
  
  return domain ? getLogoUrl(domain, options) : null
}

/**
 * Get logo URL directly from ticker symbol
 * @param ticker - Stock ticker symbol (e.g., 'AAPL', 'GOOGL')
 * @param options - Logo options
 * @returns Logo URL or null if ticker not found
 */
export const getLogoByTicker = (ticker: string, options: LogoOptions = {}): string | null => {
  const domain = TICKER_TO_DOMAIN[ticker.toUpperCase()]
  return domain ? getLogoUrl(domain, options) : null
}