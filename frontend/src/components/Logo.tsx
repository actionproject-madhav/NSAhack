import React, { useState } from 'react'
import { getCompanyLogo, LogoOptions } from '../utils/logoApi'

interface LogoProps {
  company: string
  fallback: string
  size?: number
  className?: string
  options?: LogoOptions
}

const Logo: React.FC<LogoProps> = ({ 
  company, 
  fallback, 
  size = 32, 
  className = '', 
  options = {} 
}) => {
  const [imageError, setImageError] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  
  const logoUrl = getCompanyLogo(company, { size, ...options })
  
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.log(`Logo failed to load for ${company}:`, e.currentTarget.src)
    setImageError(true)
  }
  
  const handleImageLoad = () => {
    console.log(`Logo loaded successfully for ${company}`)
    setImageLoaded(true)
  }
  
  // Debug logging
  console.log(`Logo component for ${company}: logoUrl=${logoUrl}, imageError=${imageError}, imageLoaded=${imageLoaded}`)
  
  // If no logo URL available, show ticker/company initial as fallback
  if (!logoUrl) {
    return (
      <div className={`flex items-center justify-center ${className} bg-gray-200 dark:bg-gray-700 rounded`} style={{ width: size, height: size }}>
        <span className="text-gray-600 dark:text-gray-300 font-semibold" style={{ fontSize: size * 0.4 }}>
          {fallback.toUpperCase()}
        </span>
      </div>
    )
  }
  
  // If image failed to load, show ticker/company initial as fallback
  if (imageError) {
    return (
      <div className={`flex items-center justify-center ${className} bg-gray-200 dark:bg-gray-700 rounded`} style={{ width: size, height: size }}>
        <span className="text-gray-600 dark:text-gray-300 font-semibold" style={{ fontSize: size * 0.4 }}>
          {fallback.toUpperCase()}
        </span>
      </div>
    )
  }
  
  return (
    <div className={`flex items-center justify-center ${className}`} style={{ position: 'relative', width: size, height: size }}>
      {/* Show placeholder while loading */}
      {!imageLoaded && (
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
          <span className="text-gray-400 dark:text-gray-500 text-xs font-semibold">
            {fallback.toUpperCase()}
          </span>
        </div>
      )}
      
      {/* Logo image */}
      <img
        src={logoUrl}
        alt={`${company} logo`}
        width={size}
        height={size}
        onError={handleImageError}
        onLoad={handleImageLoad}
        className={`object-contain rounded ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
        style={{ 
          maxWidth: size, 
          maxHeight: size,
          position: imageLoaded ? 'static' : 'absolute',
          top: 0,
          left: 0
        }}
      />
    </div>
  )
}

export default Logo