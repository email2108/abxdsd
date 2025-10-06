'use client'

import { useState, useEffect } from 'react'
import { Check, CheckCheck, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MessageStatusProps {
  status: 'sending' | 'sent' | 'delivered' | 'read'
  timestamp?: Date
  className?: string
}

export function MessageStatus({ status, timestamp, className }: MessageStatusProps) {
  const [animated, setAnimated] = useState(false)

  useEffect(() => {
    if (status === 'read') {
      const timer = setTimeout(() => setAnimated(true), 100)
      return () => clearTimeout(timer)
    }
  }, [status])

  const getStatusIcon = () => {
    switch (status) {
      case 'sending':
        return <Clock className="h-3 w-3 text-gray-400" />
      case 'sent':
        return <Check className="h-3 w-3 text-gray-400" />
      case 'delivered':
        return <CheckCheck className="h-3 w-3 text-gray-400" />
      case 'read':
        return (
          <CheckCheck className={cn(
            "h-3 w-3 transition-all duration-300",
            animated ? "text-blue-500 scale-110" : "text-gray-400"
          )} />
        )
      default:
        return null
    }
  }

  const getStatusText = () => {
    switch (status) {
      case 'sending':
        return 'Đang gửi...'
      case 'sent':
        return 'Đã gửi'
      case 'delivered':
        return 'Đã nhận'
      case 'read':
        return 'Đã xem'
      default:
        return ''
    }
  }

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  return (
    <div className={cn("flex items-center gap-1 text-xs", className)}>
      {getStatusIcon()}
      <span className={cn(
        "transition-colors duration-200",
        status === 'read' ? "text-blue-600" : "text-gray-500"
      )}>
        {getStatusText()}
      </span>
      {timestamp && (
        <span className="text-gray-400">
          {formatTime(timestamp)}
        </span>
      )}
    </div>
  )
}

interface MessageReactionsProps {
  reactions: {
    emoji: string
    count: number
    users: string[]
  }[]
  onReaction?: (emoji: string) => void
  className?: string
}

export function MessageReactions({ reactions, onReaction, className }: MessageReactionsProps) {
  const [showPicker, setShowPicker] = useState(false)
  
  const commonEmojis = ['👍', '❤️', '😂', '😮', '😢', '😡']

  return (
    <div className={cn("flex items-center gap-2 mt-2", className)}>
      <div className="flex flex-wrap gap-1">
        {reactions.map((reaction, index) => (
          <button
            key={index}
            onClick={() => onReaction?.(reaction.emoji)}
            className={cn(
              "flex items-center gap-1 px-2 py-1 rounded-full text-sm",
              "bg-gray-100 hover:bg-gray-200 transition-colors",
              "border border-gray-200"
            )}
          >
            <span>{reaction.emoji}</span>
            <span className="text-xs text-gray-600">{reaction.count}</span>
          </button>
        ))}
      </div>
      
      <div className="relative">
        <button
          onClick={() => setShowPicker(!showPicker)}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
        >
          <span className="text-lg">😊</span>
        </button>
        
        {showPicker && (
          <div className="absolute bottom-full left-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-10">
            <div className="grid grid-cols-3 gap-1">
              {commonEmojis.map((emoji, index) => (
                <button
                  key={index}
                  onClick={() => {
                    onReaction?.(emoji)
                    setShowPicker(false)
                  }}
                  className="p-2 hover:bg-gray-100 rounded text-lg transition-colors"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}