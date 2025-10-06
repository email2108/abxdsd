'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Heart, Laugh, ThumbsUp, Shocked, Smile } from 'lucide-react'

interface MessageReactionsProps {
  messageId: string
  reactions: { emoji: string; count: number; users: string[] }[]
  onReaction: (messageId: string, emoji: string) => void
  className?: string
}

const EMOJI_REACTIONS = [
  { emoji: '❤️', icon: Heart, label: 'Love' },
  { emoji: '😄', icon: Laugh, label: 'Laugh' },
  { emoji: '👍', icon: ThumbsUp, label: 'Like' },
  { emoji: '😮', icon: Shocked, label: 'Wow' },
  { emoji: '😊', icon: Smile, label: 'Smile' }
]

export function MessageReactions({ 
  messageId, 
  reactions, 
  onReaction, 
  className 
}: MessageReactionsProps) {
  const [showPicker, setShowPicker] = useState(false)

  const handleReaction = (emoji: string) => {
    onReaction(messageId, emoji)
    setShowPicker(false)
  }

  return (
    <div className={cn("flex items-center gap-2 flex-wrap", className)}>
      {/* Existing reactions */}
      {reactions.map((reaction, index) => (
        <button
          key={index}
          onClick={() => handleReaction(reaction.emoji)}
          className={cn(
            "flex items-center gap-1 px-2 py-1 rounded-full text-sm transition-all",
            "bg-gray-100 hover:bg-gray-200"
          )}
        >
          <span>{reaction.emoji}</span>
          <span className="text-xs">{reaction.count}</span>
        </button>
      ))}

      {/* Reaction picker */}
      <div className="relative">
        <button
          onClick={() => setShowPicker(!showPicker)}
          className={cn(
            "w-8 h-8 rounded-full border-2 border-gray-300",
            "flex items-center justify-center text-lg",
            "hover:border-gray-400 transition-colors"
          )}
        >
          +
        </button>
        
        {showPicker && (
          <div className="absolute bottom-full left-0 mb-2 bg-white rounded-lg shadow-lg border p-2 z-10">
            <div className="flex gap-1">
              {EMOJI_REACTIONS.map(({ emoji, icon: Icon, label }) => (
                <button
                  key={emoji}
                  onClick={() => handleReaction(emoji)}
                  className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center",
                    "hover:bg-gray-100 transition-colors",
                    "group relative"
                  )}
                  title={label}
                >
                  <span className="text-xl">{emoji}</span>
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                    {label}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

interface MessageStatusProps {
  status: 'sent' | 'delivered' | 'read'
  timestamp: string
  className?: string
}

export function MessageStatus({ status, timestamp, className }: MessageStatusProps) {
  const getStatusIcon = () => {
    switch (status) {
      case 'sent':
        return <div className="w-2 h-2 bg-gray-400 rounded-full" />
      case 'delivered':
        return <div className="w-2 h-2 bg-blue-400 rounded-full" />
      case 'read':
        return <div className="w-2 h-2 bg-green-400 rounded-full" />
      default:
        return null
    }
  }

  const getStatusText = () => {
    switch (status) {
      case 'sent':
        return 'Đã gửi'
      case 'delivered':
        return 'Đã nhận'
      case 'read':
        return 'Đã đọc'
      default:
        return ''
    }
  }

  return (
    <div className={cn("flex items-center gap-2 text-xs text-gray-500", className)}>
      <span>{new Date(timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>
      <div className="flex items-center gap-1">
        {getStatusIcon()}
        <span>{getStatusText()}</span>
      </div>
    </div>
  )
}