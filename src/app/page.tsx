'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MessageSquare, Users, LogIn, UserPlus } from 'lucide-react'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token')
    if (token) {
      router.push('/chat')
    }
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="relative w-32 h-32 md:w-40 md:h-40">
              <img
                src="/logo.png"
                alt="GLXD Shop Chat Logo"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
            GLXD Shop Chat
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto">
            Kết nối và trò chuyện với bạn bè theo thời gian thực
          </p>
        </div>

        {/* Hero Image */}
        <div className="flex justify-center">
          <div className="w-full max-w-4xl">
            <img
              src="/landing-page.png"
              alt="GLXD Shop Chat Interface"
              className="w-full h-auto rounded-lg shadow-xl"
            />
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="text-center">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <img
                  src="/messaging-interface.png"
                  alt="Real-time Chat"
                  className="w-16 h-16 object-cover rounded-lg"
                />
              </div>
              <CardTitle className="text-lg">Chat Real-time</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Gửi và nhận tin nhắn ngay lập tức với công nghệ WebSocket
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <img
                  src="/chat-interface.png"
                  alt="Multi-user Chat"
                  className="w-16 h-16 object-cover rounded-lg"
                />
              </div>
              <CardTitle className="text-lg">Đa người dùng</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Kết nối với nhiều người dùng cùng lúc, biết ai đang online
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <img
                  src="/admin-dashboard.png"
                  alt="Security Dashboard"
                  className="w-16 h-16 object-cover rounded-lg"
                />
              </div>
              <CardTitle className="text-lg">Bảo mật</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Hệ thống xác thực JWT bảo mật, dữ liệu được mã hóa
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            onClick={() => router.push('/login')}
            className="flex items-center gap-2"
          >
            <LogIn className="h-5 w-5" />
            Đăng nhập
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => router.push('/register')}
            className="flex items-center gap-2"
          >
            <UserPlus className="h-5 w-5" />
            Đăng ký
          </Button>
        </div>

        {/* Admin Link */}
        <div className="text-center">
          <button
            onClick={() => router.push('/admin/login')}
            className="text-gray-600 hover:text-gray-800 text-sm underline"
          >
            Đăng nhập với tư cách Admin
          </button>
        </div>

        {/* Gallery Link */}
        <div className="text-center">
          <button
            onClick={() => router.push('/gallery')}
            className="text-blue-600 hover:text-blue-800 text-sm underline font-medium"
          >
            Xem bộ sưu tập hình ảnh thiết kế
          </button>
        </div>

        {/* Demo Info */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Tài khoản demo: user1@example.com / password123
          </p>
        </div>
      </div>
    </div>
  )
}