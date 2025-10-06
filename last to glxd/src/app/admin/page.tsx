'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Shield, Users, MessageSquare, LogOut, Eye, EyeOff, BarChart3, Settings, UserCheck } from 'lucide-react'
import { io, Socket } from 'socket.io-client'

interface User {
  id: string
  name: string
  email: string
  role: 'USER' | 'ADMIN'
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

interface SystemStats {
  totalUsers: number
  onlineUsers: number
  totalMessages: number
  todayMessages: number
}

export default function AdminPage() {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [stats, setStats] = useState<SystemStats>({
    totalUsers: 0,
    onlineUsers: 0,
    totalMessages: 0,
    todayMessages: 0
  })
  const [socket, setSocket] = useState<Socket | null>(null)
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  useEffect(() => {
    // Check if user is logged in and is admin
    const userJson = localStorage.getItem('user')
    if (!userJson) {
      router.push('/admin/login')
      return
    }
    
    const user = JSON.parse(userJson)
    if (user.role !== 'ADMIN') {
      router.push('/')
      return
    }
    
    setCurrentUser(user)

    // Initialize socket connection
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/admin/login')
      return
    }
    
    const newSocket = io('http://localhost:3000', {
      auth: {
        token: token
      }
    })
    setSocket(newSocket)

    // Fetch initial data
    fetchUsers()
    fetchMessages()
    fetchStats()

    return () => {
      newSocket.close()
    }
  }, [router])

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setUsers(data)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/admin/messages', {
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

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const logout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    router.push('/admin/login')
  }

  if (!currentUser) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10">
                <img
                  src="/logo.png"
                  alt="GLXD Shop Admin Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1 className="text-xl font-bold">GLXD Shop Admin</h1>
                <p className="text-sm text-gray-500">Quản lý hệ thống chat</p>
              </div>
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
                  <Badge variant="destructive" className="text-xs">
                    ADMIN
                  </Badge>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" />
                Đăng xuất
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Users Online</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.onlineUsers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng Tin nhắn</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalMessages}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tin nhắn hôm nay</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.todayMessages}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Users Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Quản lý Users
              </CardTitle>
              <CardDescription>
                Danh sách tất cả người dùng trong hệ thống
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-2">
                  {users.map(user => (
                    <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={user.role === 'ADMIN' ? 'destructive' : 'secondary'}>
                          {user.role}
                        </Badge>
                        {user.isOnline && (
                          <Badge variant="outline" className="text-green-600">
                            Online
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Recent Messages */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Tin nhắn gần đây
              </CardTitle>
              <CardDescription>
                Các tin nhắn gần nhất trong hệ thống
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-3">
                  {messages.slice(0, 20).map(message => (
                    <div key={message.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">
                              {message.sender?.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium text-sm">{message.sender?.name}</span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(message.createdAt).toLocaleString('vi-VN')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{message.content}</p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}