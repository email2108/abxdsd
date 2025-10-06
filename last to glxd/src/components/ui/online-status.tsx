'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface OnlineStatusProps {
  isOnline: boolean
  showText?: boolean
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function OnlineStatus({ 
  isOnline, 
  showText = false, 
  className,
  size = 'md' 
}: OnlineStatusProps) {
  const [pulse, setPulse] = useState(false)

  useEffect(() => {
    if (isOnline) {
      // Start pulsing when user comes online
      setPulse(true)
      const timer = setTimeout(() => setPulse(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [isOnline])

  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  }

  const textClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative">
        <div
          className={cn(
            "rounded-full transition-all duration-300",
            sizeClasses[size],
            isOnline 
              ? "bg-green-500" 
              : "bg-gray-400"
          )}
        />
        {isOnline && pulse && (
          <div
            className={cn(
              "absolute inset-0 rounded-full bg-green-500 animate-ping",
              sizeClasses[size]
            )}
          />
        )}
        {isOnline && (
          <div
            className={cn(
              "absolute inset-0 rounded-full bg-green-400 animate-pulse",
              sizeClasses[size]
            )}
            style={{
              animationDuration: '2s',
              animationDelay: '0.5s'
            }}
          />
        )}
      </div>
      {showText && (
        <span className={cn(
          "font-medium transition-colors duration-200",
          textClasses[size],
          isOnline ? "text-green-600" : "text-gray-500"
        )}>
          {isOnline ? "Online" : "Offline"}
        </span>
      )}
    </div>
  )
}

interface UserStatusCardProps {
  user: {
    id: string
    name: string
    email: string
    isOnline: boolean
    lastSeen?: Date
  }
  isSelected?: boolean
  onClick?: () => void
  className?: string
}

export function UserStatusCard({ 
  user, 
  isSelected = false, 
  onClick, 
  className 
}: UserStatusCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const formatLastSeen = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Vừa xong'
    if (minutes < 60) return `${minutes} phút trước`
    if (hours < 24) return `${hours} giờ trước`
    if (days < 7) return `${days} ngày trước`
    return new Date(date).toLocaleDateString('vi-VN')
  }

  return (
    <div
      onClick={onClick}
      className={cn(
        "p-3 rounded-lg cursor-pointer transition-all duration-200",
        "border hover:shadow-md",
        isSelected 
          ? "bg-blue-50 border-blue-200 shadow-sm" 
          : "bg-white border-gray-200 hover:border-gray-300",
        isHovered && "transform scale-[1.02]",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
            {user.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="absolute -bottom-1 -right-1">
            <OnlineStatus isOnline={user.isOnline} size="sm" />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-900 truncate">
              {user.name}
            </h3>
            <OnlineStatus 
              isOnline={user.isOnline} 
              showText={true} 
              size="sm" 
            />
          </div>
          <p className="text-sm text-gray-500 truncate">
            {user.email}
          </p>
          {!user.isOnline && user.lastSeen && (
            <p className="text-xs text-gray-400 mt-1">
              Hoạt động lần cuối: {formatLastSeen(user.lastSeen)}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}