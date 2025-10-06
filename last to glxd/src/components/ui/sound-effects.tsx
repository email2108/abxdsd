'use client'

import { useEffect, useRef } from 'react'

interface SoundEffectsProps {
  playMessageSent?: boolean
  playMessageReceived?: boolean
  playUserOnline?: boolean
  playUserOffline?: boolean
}

export function useSoundEffects() {
  const audioContextRef = useRef<AudioContext | null>(null)

  const getAudioContext = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
    return audioContextRef.current
  }

  const playTone = (frequency: number, duration: number, volume: number = 0.1) => {
    try {
      const context = getAudioContext()
      const oscillator = context.createOscillator()
      const gainNode = context.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(context.destination)
      
      oscillator.frequency.setValueAtTime(frequency, context.currentTime)
      oscillator.type = 'sine'
      
      gainNode.gain.setValueAtTime(0, context.currentTime)
      gainNode.gain.linearRampToValueAtTime(volume, context.currentTime + 0.01)
      gainNode.gain.exponentialRampToValueAtTime(0.001, context.currentTime + duration)
      
      oscillator.start(context.currentTime)
      oscillator.stop(context.currentTime + duration)
    } catch (error) {
      console.warn('Could not play sound:', error)
    }
  }

  const playMessageSent = () => {
    // Message sent sound: pleasant ascending tones
    playTone(800, 0.1, 0.05)
    setTimeout(() => playTone(1000, 0.1, 0.05), 50)
  }

  const playMessageReceived = () => {
    // Message received sound: gentle descending tones
    playTone(600, 0.15, 0.08)
    setTimeout(() => playTone(500, 0.15, 0.08), 75)
  }

  const playUserOnline = () => {
    // User online sound: bright ascending chime
    playTone(400, 0.1, 0.06)
    setTimeout(() => playTone(600, 0.1, 0.06), 50)
    setTimeout(() => playTone(800, 0.15, 0.06), 100)
  }

  const playUserOffline = () => {
    // User offline sound: descending tones
    playTone(600, 0.15, 0.06)
    setTimeout(() => playTone(400, 0.2, 0.06), 75)
  }

  const playNotification = () => {
    // Notification sound: attention-grabbing pattern
    playTone(1000, 0.1, 0.08)
    setTimeout(() => playTone(1200, 0.1, 0.08), 100)
    setTimeout(() => playTone(1000, 0.15, 0.08), 200)
  }

  return {
    playMessageSent,
    playMessageReceived,
    playUserOnline,
    playUserOffline,
    playNotification
  }
}

interface SoundToggleProps {
  enabled: boolean
  onToggle: (enabled: boolean) => void
  className?: string
}

export function SoundToggle({ enabled, onToggle, className }: SoundToggleProps) {
  return (
    <button
      onClick={() => onToggle(!enabled)}
      className={cn(
        "p-2 rounded-lg transition-all duration-200",
        "hover:bg-gray-100",
        enabled ? "text-blue-600" : "text-gray-400",
        className
      )}
      title={enabled ? "Tắt âm thanh" : "Bật âm thanh"}
    >
      <svg
        className={cn(
          "w-5 h-5 transition-all duration-200",
          enabled ? "scale-110" : "scale-100"
        )}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        {enabled ? (
          <>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 001.414 1.414m1.414-2.828a9 9 0 010-12.728"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </>
        ) : (
          <>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
              clipRule="evenodd"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
            />
          </>
        )}
      </svg>
    </button>
  )
}