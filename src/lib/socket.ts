import { Server } from 'socket.io'
import jwt from 'jsonwebtoken'
import { db } from '@/lib/db'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export const setupSocket = (io: Server) => {
  // Map to store online users
  const onlineUsers = new Map<string, string>()

  io.use((socket, next) => {
    const token = socket.handshake.auth.token
    
    if (!token) {
      return next(new Error('Authentication error'))
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }
      socket.data.userId = decoded.userId
      next()
    } catch (err) {
      next(new Error('Authentication error'))
    }
  })

  io.on('connection', async (socket) => {
    const userId = socket.data.userId as string
    
    console.log('User connected:', userId)
    
    // Add user to online users
    onlineUsers.set(userId, socket.id)
    
    // Update user status in database
    await db.user.update({
      where: { id: userId },
      data: { isOnline: true }
    })
    
    // Join user to their room
    socket.join(userId)
    
    // Broadcast user online status
    socket.broadcast.emit('userStatus', { userId, isOnline: true })
    
    // Handle sending messages
    socket.on('sendMessage', async (messageData: {
      content: string
      receiverId: string
      senderId: string
    }) => {
      try {
        // Create message in database
        const message = await db.message.create({
          data: {
            content: messageData.content,
            senderId: messageData.senderId,
            receiverId: messageData.receiverId
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
        
        // Send message to receiver
        io.to(messageData.receiverId).emit('newMessage', message)
        
        // Also send back to sender for UI consistency
        socket.emit('newMessage', message)
        
      } catch (error) {
        console.error('Error sending message:', error)
        socket.emit('error', { message: 'Failed to send message' })
      }
    })
    
    // Handle typing indicators
    socket.on('typing', (data: { receiverId: string, isTyping: boolean }) => {
      socket.to(data.receiverId).emit('userTyping', {
        userId,
        isTyping: data.isTyping
      })
    })
    
    // Handle read receipts
    socket.on('markAsRead', async (data: { messageId: string }) => {
      try {
        // Update message read status (you would need to add a 'read' field to Message model)
        // For now, just emit the event
        socket.broadcast.emit('messageRead', {
          messageId: data.messageId,
          readBy: userId
        })
      } catch (error) {
        console.error('Error marking message as read:', error)
      }
    })
    
    // Handle disconnect
    socket.on('disconnect', async () => {
      console.log('User disconnected:', userId)
      
      // Remove from online users
      onlineUsers.delete(userId)
      
      // Update user status in database
      await db.user.update({
        where: { id: userId },
        data: { isOnline: false }
      })
      
      // Broadcast user offline status
      socket.broadcast.emit('userStatus', { userId, isOnline: false })
    })
    
    // Send online users list to the connected user
    const users = await db.user.findMany({
      where: {
        id: { not: userId }
      },
      select: {
        id: true,
        name: true,
        email: true,
        isOnline: true
      }
    })
    
    socket.emit('onlineUsers', users)
  })
}