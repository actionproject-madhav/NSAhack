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

// Company domain mappings for common brands
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
  'UPS': 'ups.com'
} as const

/**
 * Get logo URL for a known company by name
 * @param companyName - Company name (e.g., 'Apple', 'Google')
 * @param options - Logo options
 * @returns Logo URL or null if company not found
 */
export const getCompanyLogo = (companyName: string, options: LogoOptions = {}): string | null => {
  // Clean company name - remove common suffixes
  const cleanName = companyName
    .replace(/\s+(Inc\.?|Corp\.?|Corporation|Company|Co\.?|Ltd\.?|LLC)$/i, '')
    .trim()
  
  // Try exact match first
  let domain = COMPANY_DOMAINS[cleanName as keyof typeof COMPANY_DOMAINS]
  
  // If no exact match, try original name
  if (!domain) {
    domain = COMPANY_DOMAINS[companyName as keyof typeof COMPANY_DOMAINS]
  }
  
  // Debug logging
  console.log(`Logo lookup for "${companyName}" (cleaned: "${cleanName}") -> domain: ${domain}`)
  
  return domain ? getLogoUrl(domain, options) : null
}