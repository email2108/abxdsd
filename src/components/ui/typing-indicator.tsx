'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface TypingIndicatorProps {
  isTyping: boolean
  userName?: string
  className?: string
}

export function TypingIndicator({ isTyping, userName, className }: TypingIndicatorProps) {
  const [dots, setDots] = useState(['', '', ''])

  useEffect(() => {
    if (!isTyping) {
      setDots(['', '', ''])
      return
    }

    const interval = setInterval(() => {
      setDots(prev => {
        const newDots = [...prev]
        const activeIndex = newDots.findIndex(dot => dot === '')
        
        if (activeIndex === -1) {
          // All dots are filled, reset
          return ['', '', '']
        } else {
          // Fill the next dot
          newDots[activeIndex] = '•'
          return newDots
        }
      })
    }, 400)

    return () => clearInterval(interval)
  }, [isTyping])

  if (!isTyping) return null

  return (
    <div className={cn("flex items-center gap-2 text-sm text-gray-500", className)}>
      <div className="flex items-center gap-1">
        <div className="flex space-x-1">
          {dots.map((dot, index) => (
            <div
              key={index}
              className={cn(
                "w-2 h-2 bg-blue-500 rounded-full transition-all duration-300",
                dot && "animate-bounce"
              )}
              style={{
                animationDelay: dot ? `${index * 100}ms` : '0ms'
              }}
            />
          ))}
        </div>
      </div>
      {userName && (
        <span className="text-xs font-medium text-gray-600">
          {userName} đang nhập...
        </span>
      )}
    </div>
  )
}

interface TypingBubbleProps {
  userName: string
  className?: string
}

export function TypingBubble({ userName, className }: TypingBubbleProps) {
  return (
    <div className={cn("flex items-start gap-2 mb-4", className)}>
      <div className="flex-shrink-0">
        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
          <span className="text-xs font-medium text-gray-600">
            {userName.split(' ').map(n => n[0]).join('')}
          </span>
        </div>
      </div>
      <div className="flex-1">
        <div className="bg-gray-100 rounded-2xl px-4 py-3 inline-block">
          <TypingIndicator isTyping={true} />
        </div>
      </div>
    </div>
  )
}