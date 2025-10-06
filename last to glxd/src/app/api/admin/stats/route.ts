import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { db } from '@/lib/db'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function GET(request: NextRequest) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }
    
    // Check if user is admin
    const currentUser = await db.user.findUnique({
      where: { id: decoded.userId }
    })

    if (!currentUser || currentUser.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }
    
    // Get stats
    const totalUsers = await db.user.count()
    const onlineUsers = await db.user.count({
      where: { isOnline: true }
    })
    const totalMessages = await db.message.count()
    
    // Get today's messages
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    const todayMessages = await db.message.count({
      where: {
        createdAt: {
          gte: today,
          lt: tomorrow
        }
      }
    })

    const stats = {
      totalUsers,
      onlineUsers,
      totalMessages,
      todayMessages
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Get stats error:', error)
    return NextResponse.json(
      { error: 'Lỗi server' },
      { status: 500 }
    )
  }
}