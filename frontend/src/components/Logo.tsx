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
  
  // If no logo URL available, show fallback immediately
  if (!logoUrl) {
    console.log(`No logo URL found for ${company}, showing fallback`)
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <span style={{ fontSize: size / 2 }}>{fallback}</span>
      </div>
    )
  }
  
  // If image failed to load, show fallback
  if (imageError) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <span style={{ fontSize: size / 2 }}>{fallback}</span>
      </div>
    )
  }
  
  return (
    <div className={`flex items-center justify-center ${className}`} style={{ position: 'relative' }}>
      {/* Show fallback while loading */}
      {!imageLoaded && (
        <span style={{ fontSize: size / 2 }}>{fallback}</span>
      )}
      
      {/* Logo image */}
      <img
        src={logoUrl}
        alt={`${company} logo`}
        width={size}
        height={size}
        onError={handleImageError}
        onLoad={handleImageLoad}
        className={`object-contain ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
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