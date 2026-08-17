import { useCallback, useEffect, useRef, useState } from 'react'

export function useAmbientSound() {
  const contextRef = useRef<AudioContext | null>(null)
  const gainRef = useRef<GainNode | null>(null)
  const voicesRef = useRef<OscillatorNode[]>([])
  const timerRef = useRef<number | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolumeState] = useState(0.18)

  const stop = useCallback(() => {
    if (timerRef.current) window.clearInterval(timerRef.current)
    timerRef.current = null
    voicesRef.current.forEach((voice) => voice.stop())
    voicesRef.current = []
    setIsPlaying(false)
  }, [])

  const start = useCallback(() => {
    const context = contextRef.current ?? new AudioContext()
    contextRef.current = context
    const gain = context.createGain()
    gain.gain.value = volume
    gain.connect(context.destination)
    gainRef.current = gain

    const makeVoice = (frequency: number, type: OscillatorType, level: number) => {
      const oscillator = context.createOscillator()
      const voiceGain = context.createGain()
      oscillator.type = type
      oscillator.frequency.value = frequency
      voiceGain.gain.value = level
      oscillator.connect(voiceGain)
      voiceGain.connect(gain)
      oscillator.start()
      return oscillator
    }

    voicesRef.current = [
      makeVoice(146.83, 'sine', 0.22),
      makeVoice(220, 'triangle', 0.08),
      makeVoice(293.66, 'sine', 0.035),
    ]
    timerRef.current = window.setInterval(() => {
      const now = context.currentTime
      const bell = context.createOscillator()
      const bellGain = context.createGain()
      bell.type = 'sine'
      bell.frequency.setValueAtTime(587.33, now)
      bell.frequency.exponentialRampToValueAtTime(440, now + 1.7)
      bellGain.gain.setValueAtTime(0.0001, now)
      bellGain.gain.exponentialRampToValueAtTime(0.13, now + 0.05)
      bellGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8)
      bell.connect(bellGain)
      bellGain.connect(gain)
      bell.start(now)
      bell.stop(now + 1.9)
    }, 6800)
    setIsPlaying(true)
  }, [volume])

  const toggle = useCallback(() => {
    if (isPlaying) stop()
    else start()
  }, [isPlaying, start, stop])

  const setVolume = useCallback((nextVolume: number) => {
    setVolumeState(nextVolume)
    if (gainRef.current && contextRef.current) gainRef.current.gain.setTargetAtTime(nextVolume, contextRef.current.currentTime, 0.08)
  }, [])

  useEffect(() => () => stop(), [stop])

  return { isPlaying, volume, toggle, setVolume }
}
