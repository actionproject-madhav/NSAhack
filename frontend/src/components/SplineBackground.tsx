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

      {/* Cover Spline watermark at bottom right - adapts to dark/light mode */}
      <div 
        className="fixed bottom-0 right-0 w-[200px] h-[80px] z-[1] pointer-events-none"
        style={{
          background: darkMode 
            ? 'linear-gradient(to top left, #000000 0%, #000000 60%, transparent 100%)'
            : 'linear-gradient(to top left, #ffffff 0%, #ffffff 60%, transparent 100%)',
        }}
      />
    </>
  )
}

export default SplineBackground

