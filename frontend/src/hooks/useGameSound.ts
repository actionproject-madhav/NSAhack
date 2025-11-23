// hooks/useGameSound.ts
import { useRef, useCallback } from 'react'
import { Howl } from 'howler'

const useGameSound = () => {
  const soundsRef = useRef({
    click: new Howl({ src: ['/sounds/click.mp3'], volume: 0.5 }),
    correct: new Howl({ src: ['/sounds/correct.mp3'], volume: 0.6 }),
    incorrect: new Howl({ src: ['/sounds/incorrect.mp3'], volume: 0.6 }),
    levelUp: new Howl({ src: ['/sounds/levelup.mp3'], volume: 0.8 }),
    coinCollect: new Howl({ src: ['/sounds/coin.mp3'], volume: 0.5 }),
    unlock: new Howl({ src: ['/sounds/unlock.mp3'], volume: 0.7 }),
    achievement: new Howl({ src: ['/sounds/achievement.mp3'], volume: 0.8 }),
    combo: new Howl({ src: ['/sounds/combo.mp3'], volume: 0.6 }),
    islandSelect: new Howl({ src: ['/sounds/island-select.mp3'], volume: 0.5 }),
    locked: new Howl({ src: ['/sounds/locked.mp3'], volume: 0.4 }),
    heartLost: new Howl({ src: ['/sounds/heart-lost.mp3'], volume: 0.5 })
  })

  const bgMusicRef = useRef(null)

  const playSound = useCallback((soundName) => {
    if (soundsRef.current[soundName]) {
      soundsRef.current[soundName].play()
    }
  }, [])

  const startBgMusic = useCallback((musicFile) => {
    if (bgMusicRef.current) {
      bgMusicRef.current.stop()
    }
    bgMusicRef.current = new Howl({
      src: [`/sounds/music/${musicFile}`],
      loop: true,
      volume: 0.3
    })
    bgMusicRef.current.play()
  }, [])

  const stopBgMusic = useCallback(() => {
    if (bgMusicRef.current) {
      bgMusicRef.current.fade(0.3, 0, 1000)
      setTimeout(() => bgMusicRef.current?.stop(), 1000)
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