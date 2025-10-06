import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { db } from '@/lib/db'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function POST(request: NextRequest) {
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
    
    const { content, receiverId } = await request.json()

    // Validate input
    if (!content || !receiverId) {
      return NextResponse.json(
        { error: 'Vui lòng điền đầy đủ thông tin' },
        { status: 400 }
      )
    }

    // Create message
    const message = await db.message.create({
      data: {
        content,
        senderId: decoded.userId,
        receiverId
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json(message)
  } catch (error) {
    console.error('Send message error:', error)
    return NextResponse.json(
      { error: 'Lỗi server' },
      { status: 500 }
    )
  }
}