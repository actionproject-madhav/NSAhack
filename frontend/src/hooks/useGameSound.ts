// hooks/useGameSound.ts
import { useRef, useCallback } from 'react'
import { Howl, HowlOptions } from 'howler'

type SoundName = 'click' | 'correct' | 'incorrect' | 'levelUp' | 'coinCollect' | 'unlock' | 'achievement' | 'combo' | 'islandSelect' | 'locked' | 'heartLost'

const useGameSound = () => {
  // Only load sounds that actually exist - others will be silent
  const soundsRef = useRef<Partial<Record<SoundName, Howl>>>({
    // click: File doesn't exist - will be silent
    correct: new Howl({ src: ['/assets/sounds/effects/correct.mp3'], volume: 0.6, preload: false }),
    incorrect: new Howl({ src: ['/assets/sounds/effects/wrong.mp3'], volume: 0.6, preload: false }),
    levelUp: new Howl({ src: ['/assets/sounds/effects/level_up.mp3'], volume: 0.8, preload: false }),
    coinCollect: new Howl({ src: ['/assets/sounds/effects/coin-collect.mp3'], volume: 0.5, preload: false }),
    unlock: new Howl({ src: ['/assets/sounds/effects/unlock.mp3'], volume: 0.7, preload: false }),
    // achievement: File doesn't exist - will be silent
    combo: new Howl({ src: ['/assets/sounds/effects/combo.mp3'], volume: 0.6, preload: false }),
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
    bgMusicRef.current = new Howl({
      src: [`/assets/sounds/music/${musicFile}`],
      loop: true,
      volume: 0.3,
      preload: false
    })
    bgMusicRef.current.play()
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