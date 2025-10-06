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
    
    // Get all users except current user
    const users = await db.user.findMany({
      where: {
        id: { not: decoded.userId }
      },
      select: {
        id: true,
        name: true,
        email: true,
        isOnline: true,
        avatar: true
      },
      orderBy: {
        name: 'asc'
      }
    })

    return NextResponse.json(users)
  } catch (error) {
    console.error('Get users error:', error)
    return NextResponse.json(
      { error: 'Lỗi server' },
      { status: 500 }
    )
  }
}