// components/education/IslandModelViewer.tsx
import { useEffect, useRef } from 'react'

interface IslandModelViewerProps {
  modelPath: string
  className?: string
  autoRotate?: boolean
  scale?: number
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': any
    }
  }
}

const IslandModelViewer = ({ 
  modelPath, 
  className = '', 
  autoRotate = true,
  scale = 1 
}: IslandModelViewerProps) => {
  const viewerRef = useRef<any>(null)

  useEffect(() => {
    // Load model-viewer script if not already loaded
    if (!document.querySelector('script[src*="model-viewer"]')) {
      const script = document.createElement('script')
      script.type = 'module'
      script.src = 'https://ajax.googleapis.com/ajax/libs/model-viewer/3.3.0/model-viewer.min.js'
      document.head.appendChild(script)
    }
  }, [])

  return (
    <div className={`w-full h-full ${className}`}>
      <model-viewer
        ref={viewerRef}
        src={modelPath}
        alt="3D Island Model"
        auto-rotate={autoRotate}
        camera-controls
        interaction-policy="allow-when-focused"
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: 'transparent'
        }}
        camera-orbit={`auto ${autoRotate ? 'auto' : '0deg'}`}
        min-camera-orbit="auto 0deg auto"
        max-camera-orbit="auto 180deg auto"
        field-of-view="45deg"
      />
    </div>
  )
}

export default IslandModelViewer

