'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Shield, Eye, EyeOff } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (response.ok) {
        // Check if user is admin
        if (data.user.role !== 'ADMIN') {
          setError('Bạn không có quyền truy cập trang admin')
          return
        }

        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        router.push('/admin')
      } else {
        setError(data.error || 'Đăng nhập thất bại')
      }
    } catch (error) {
      setError('Lỗi kết nối server')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20">
              <img
                src="/logo.png"
                alt="GLXD Shop Admin Logo"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          <CardTitle className="text-2xl">GLXD Shop Admin Login</CardTitle>
          <CardDescription>
            Đăng nhập để truy cập trang quản trị GLXD Shop
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded">
                {error}
              </div>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập Admin'}
            </Button>
          </form>
          <div className="mt-6 text-center">
            <button
              onClick={() => router.push('/')}
              className="text-blue-600 hover:underline text-sm"
            >
              ← Quay lại trang chủ
            </button>
          </div>
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Tài khoản admin:</p>
            <div className="space-y-1 text-xs">
              <p><strong>Email:</strong> admin@example.com</p>
              <p><strong>Password:</strong> password123</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Admin Dashboard Image */}
      <div className="mt-8 flex justify-center">
        <div className="w-full max-w-md">
          <img
            src="/admin-dashboard.png"
            alt="Admin Dashboard Design"
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>
      </div>
    </div>
  )
}