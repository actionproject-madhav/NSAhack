import { useState, useEffect, memo } from 'react'
import Spline from '@splinetool/react-spline'
import { useTheme } from '../context/ThemeContext'

const SplineBackground = memo(() => {
  const [splineError, setSplineError] = useState(false)
  const [splineLoaded, setSplineLoaded] = useState(false)
  const { isDark } = useTheme()

  if (splineError) {
    return null
  }

  return (
    <>
      {/* Spline 3D Background - Fixed behind everything, smooth and blended */}
      <div 
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          width: '250vw',
          height: '250vh',
          transform: 'translate(-50%, -50%) scale(0.35)',
          opacity: isDark ? 0.4 : 0.5,
          pointerEvents: 'none',
          zIndex: 0,
          willChange: 'transform',
          mixBlendMode: 'normal'
        }}
        className="spline-background"
      >
        <Spline 
          scene="https://prod.spline.design/f7MEBGBa8Fh0o30l/scene.splinecode"
          onLoad={() => {
            if (import.meta.env.DEV) {
              console.log('✅ Global Spline background loaded')
            }
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
          background: isDark 
            ? 'radial-gradient(ellipse 200px 90px at bottom right, #000000 0%, #000000 50%, rgba(0,0,0,0.8) 70%, transparent 100%)'
            : 'radial-gradient(ellipse 200px 90px at bottom right, #ffffff 0%, #ffffff 50%, rgba(255,255,255,0.8) 70%, transparent 100%)',
        }}
      />
    </>
  )
})

SplineBackground.displayName = 'SplineBackground'

export default SplineBackground

