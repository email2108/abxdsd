import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// WARNING: This endpoint is not secure. It trusts the userId sent from the client.
// In a production environment, you should get the user ID from a server-side session
// to ensure that a user can only change their own data.

export async function POST(request: NextRequest) {
  try {
    const { userId, telegramChatId } = await request.json()

    if (!userId || !telegramChatId) {
      return NextResponse.json(
        { error: 'userId and telegramChatId are required' },
        { status: 400 }
      )
    }

    // Check if the user exists
    const user = await db.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Update the user with the new Telegram Chat ID
    await db.user.update({
      where: { id: userId },
      data: { telegramChatId: telegramChatId.toString() }, // Ensure it's a string
    })

    return NextResponse.json({
      success: true,
      message: 'Telegram Chat ID updated successfully.',
    })
  } catch (error) {
    console.error('Error updating Telegram Chat ID:', error)
    return NextResponse.json(
      { error: 'Failed to update Telegram Chat ID' },
      { status: 500 }
    )
  }
}
