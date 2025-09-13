'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { MessageSquare, Send, Users, Online, LogOut } from 'lucide-react'
import { io, Socket } from 'socket.io-client'

interface User {
  id: string
  name: string
  email: string
  isOnline: boolean
  avatar?: string
}

interface Message {
  id: string
  content: string
  senderId: string
  receiverId: string
  createdAt: string
  sender?: User
}

export default function ChatPage() {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [newMessage, setNewMessage] = useState('')
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [socket, setSocket] = useState<Socket | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Check if user is logged in
    const userJson = localStorage.getItem('user')
    if (!userJson) {
      router.push('/login')
      return
    }
    
    const user = JSON.parse(userJson)
    setCurrentUser(user)

    // Initialize socket connection
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }
    
    const newSocket = io('http://localhost:3000', {
      auth: {
        token: token
      }
    })
    setSocket(newSocket)

    // Listen for new messages
    newSocket.on('newMessage', (message: Message) => {
      setMessages(prev => [...prev, message])
    })

    // Listen for user status updates
    newSocket.on('userStatus', ({ userId, isOnline }) => {
      setUsers(prev => prev.map(u => 
        u.id === userId ? { ...u, isOnline } : u
      ))
    })

    // Fetch users and messages
    fetchUsers()
    if (selectedUser) {
      fetchMessages(selectedUser.id)
    }

    return () => {
      newSocket.close()
    }
  }, [router, selectedUser])

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setUsers(data.filter((u: User) => u.id !== currentUser?.id))
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  const fetchMessages = async (userId: string) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/messages/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setMessages(data)
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedUser || !currentUser) return

    const messageData = {
      content: newMessage,
      receiverId: selectedUser.id,
      senderId: currentUser.id
    }

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(messageData)
      })

      if (response.ok) {
        const message = await response.json()
        socket?.emit('sendMessage', message)
        setMessages(prev => [...prev, message])
        setNewMessage('')
      }
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const logout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    router.push('/')
  }

  const filteredMessages = messages.filter(msg => 
    (msg.senderId === currentUser?.id && msg.receiverId === selectedUser?.id) ||
    (msg.senderId === selectedUser?.id && msg.receiverId === currentUser?.id)
  )

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [filteredMessages])

  if (!currentUser) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10">
              <img
                src="/logo.png"
                alt="GLXD Shop Chat Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <h1 className="text-2xl font-bold">GLXD Shop Chat</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  {currentUser.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{currentUser.name}</p>
                <Badge variant="secondary" className="text-xs">
                  <Online className="h-3 w-3 mr-1" />
                  Online
                </Badge>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={logout}>
              <LogOut className="h-4 w-4 mr-2" />
              Đăng xuất
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-8rem)]">
          {/* Users List */}
          <Card className="lg:col-span-1">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="h-5 w-5" />
                Người dùng
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[calc(100vh-12rem)]">
                <div className="p-4 space-y-2">
                  {users.map(user => (
                    <div
                      key={user.id}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedUser?.id === user.id
                          ? 'bg-blue-100'
                          : 'hover:bg-gray-100'
                      }`}
                      onClick={() => {
                        setSelectedUser(user)
                        fetchMessages(user.id)
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium">{user.name}</p>
                            {user.isOnline && (
                              <Badge variant="secondary" className="text-xs">
                                <Online className="h-3 w-3 mr-1" />
                                Online
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground truncate">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Chat Area */}
          <Card className="lg:col-span-3 flex flex-col">
            {selectedUser ? (
              <>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>
                        {selectedUser.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{selectedUser.name}</CardTitle>
                      <div className="flex items-center gap-2">
                        {selectedUser.isOnline ? (
                          <Badge variant="secondary" className="text-xs">
                            <Online className="h-3 w-3 mr-1" />
                            Online
                          </Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground">Offline</span>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {selectedUser.email}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="flex-1 p-0">
                  <ScrollArea className="h-[calc(100vh-20rem)] p-4">
                    <div className="space-y-4">
                      {filteredMessages.map(message => (
                        <div
                          key={message.id}
                          className={`flex ${
                            message.senderId === currentUser?.id ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              message.senderId === currentUser?.id
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 text-gray-900'
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                            <p
                              className={`text-xs mt-1 ${
                                message.senderId === currentUser?.id
                                  ? 'text-blue-100'
                                  : 'text-gray-500'
                              }`}
                            >
                              {new Date(message.createdAt).toLocaleTimeString('vi-VN', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>
                </CardContent>
                
                <Separator />
                
                <CardContent className="p-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Nhập tin nhắn..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="flex-1"
                      disabled={!selectedUser?.isOnline}
                    />
                    <Button
                      onClick={sendMessage}
                      disabled={!newMessage.trim() || !selectedUser?.isOnline}
                      size="icon"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  {!selectedUser?.isOnline && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Người dùng này hiện đang offline. Tin nhắn sẽ được gửi khi họ online.
                    </p>
                  )}
                </CardContent>
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <MessageSquare className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Chọn người dùng để chat
                  </h3>
                  <p className="text-gray-500">
                    Chọn một người dùng từ danh sách bên trái để bắt đầu trò chuyện
                  </p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}