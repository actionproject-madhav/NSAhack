import { useState, useEffect } from 'react'
import Spline from '@splinetool/react-spline'

const SplineBackground = () => {
  const [splineError, setSplineError] = useState(false)
  const [splineLoaded, setSplineLoaded] = useState(false)
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark')
    }
    return false
  })

  // Watch for dark mode changes
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const isDark = document.documentElement.classList.contains('dark')
      setDarkMode(isDark)
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })

    return () => observer.disconnect()
  }, [])

  if (splineError) {
    return null
  }

  return (
    <>
      {/* Spline 3D Background - Fixed behind everything */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          opacity: 0.3,
          pointerEvents: 'none',
          zIndex: 0
        }}
      >
        <Spline 
          scene="https://prod.spline.design/h7c4yHQYVyL4bjdf/scene.splinecode"
          onLoad={() => {
            console.log('✅ Global Spline background loaded')
            setSplineLoaded(true)
          }}
          onError={(error) => {
            console.error('❌ Spline background failed to load:', error)
            setSplineError(true)
          }}
        />
      </div>

      {/* Cover Spline watermark at bottom right - adapts to dark/light mode with smooth gradient */}
      <div 
        className="fixed bottom-0 right-0 z-[1] pointer-events-none"
        style={{
          width: '220px',
          height: '90px',
          background: darkMode 
            ? 'radial-gradient(ellipse 200px 90px at bottom right, #000000 0%, #000000 50%, rgba(0,0,0,0.8) 70%, transparent 100%)'
            : 'radial-gradient(ellipse 200px 90px at bottom right, #ffffff 0%, #ffffff 50%, rgba(255,255,255,0.8) 70%, transparent 100%)',
        }}
      />
    </>
  )
}

export default SplineBackground

