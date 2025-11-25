import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

interface FinnyMascotProps {
  position: { x: number; y: number }
  mood?: 'happy' | 'excited' | 'thinking' | 'proud' | 'encouraging' | 'sad' | 'surprised'
  message?: string | null
}

// Your custom mascot - Finny the Finance Fox
const FinnyMascot = ({ position, mood = 'happy', message = null }: FinnyMascotProps) => {
  const [currentExpression, setCurrentExpression] = useState<'happy' | 'excited' | 'thinking' | 'proud' | 'encouraging' | 'sad' | 'surprised'>(mood)
  
  const expressions: Record<'happy' | 'excited' | 'thinking' | 'proud' | 'encouraging' | 'sad' | 'surprised', string> = {
    happy: '😊',
    excited: '🎉',
    thinking: '🤔',
    proud: '😎',
    encouraging: '💪',
    sad: '😢',
    surprised: '😲'
  }

  // For now using emojis, but replace with actual mascot images
  return (
    <motion.div
      className="finny-mascot"
      style={{ 
        position: 'absolute',
        left: position?.x || 100,
        top: position?.y || 100
      }}
      animate={{
        y: [0, -10, 0],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <div className="finny-body">
        {/* Replace with actual mascot image */}
        <img 
          src="/mascot/finny-happy.svg" 
          alt="Finny"
          className="finny-image"
        />
        
        {/* Expression bubble */}
        <motion.div 
          className="finny-expression"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring" }}
        >
          {expressions[currentExpression]}
        </motion.div>
      </div>
      
      {/* Message bubble */}
      {message && (
        <motion.div
          className="finny-message"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {message}
        </motion.div>
      )}
    </motion.div>
  )
}

export default FinnyMascot