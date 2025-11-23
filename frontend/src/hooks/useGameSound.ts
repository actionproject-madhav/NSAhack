// hooks/useGameSound.ts
import { useRef, useCallback } from 'react'
import { Howl, HowlOptions } from 'howler'

type SoundName = 'click' | 'correct' | 'incorrect' | 'levelUp' | 'coinCollect' | 'unlock' | 'achievement' | 'combo' | 'islandSelect' | 'locked' | 'heartLost'

const useGameSound = () => {
  // Only load sounds that actually exist - others will be silent
  const baseUrl = import.meta.env.BASE_URL || '/'
  const soundsRef = useRef<Partial<Record<SoundName, Howl>>>({
    // click: File doesn't exist - will be silent
    correct: new Howl({ src: [`${baseUrl}assets/sounds/effects/correct.mp3`], volume: 0.6, preload: true, html5: true }),
    incorrect: new Howl({ src: [`${baseUrl}assets/sounds/effects/wrong.mp3`], volume: 0.6, preload: true, html5: true }),
    levelUp: new Howl({ src: [`${baseUrl}assets/sounds/effects/level_up.mp3`], volume: 0.8, preload: true, html5: true }),
    coinCollect: new Howl({ src: [`${baseUrl}assets/sounds/effects/coin-collect.mp3`], volume: 0.5, preload: true, html5: true }),
    unlock: new Howl({ src: [`${baseUrl}assets/sounds/effects/unlock.mp3`], volume: 0.7, preload: true, html5: true }),
    // achievement: File doesn't exist - will be silent
    combo: new Howl({ src: [`${baseUrl}assets/sounds/effects/combo.mp3`], volume: 0.6, preload: true, html5: true }),
    // islandSelect: File doesn't exist - will be silent
    // locked: File doesn't exist - will be silent
    // heartLost: File doesn't exist - will be silent
  })

  const bgMusicRef = useRef<Howl | null>(null)

  const playSound = useCallback((soundName: SoundName) => {
    const sound = soundsRef.current[soundName]
    if (sound) {
      try {
        sound.play()
      } catch (e) {
        // Silently fail if sound can't play
      }
    }
  }, [])

  const startBgMusic = useCallback((musicFile: string) => {
    if (bgMusicRef.current) {
      bgMusicRef.current.stop()
    }
    // Use import.meta.env.BASE_URL for proper asset resolution in Vite
    const baseUrl = import.meta.env.BASE_URL || '/'
    bgMusicRef.current = new Howl({
      src: [`${baseUrl}assets/sounds/music/${musicFile}`],
      loop: true,
      volume: 0.3,
      preload: true, // Preload for better playback
      html5: true // Use HTML5 audio for better compatibility
    })
    try {
      bgMusicRef.current.play()
      if (import.meta.env.DEV) {
        console.log('🎵 Playing music:', musicFile)
      }
    } catch (e) {
      console.warn('Failed to play music:', musicFile, e)
    }
  }, [])

  const stopBgMusic = useCallback(() => {
    if (bgMusicRef.current) {
      bgMusicRef.current.fade(0.3, 0, 1000)
      setTimeout(() => {
        if (bgMusicRef.current) {
          bgMusicRef.current.stop()
        }
      }, 1000)
    }
  }, [])

  const toggleMusic = useCallback(() => {
    if (bgMusicRef.current?.playing()) {
      bgMusicRef.current.pause()
    } else {
      bgMusicRef.current?.play()
    }
  }, [])

  return { playSound, startBgMusic, stopBgMusic, toggleMusic }
}

export default useGameSound