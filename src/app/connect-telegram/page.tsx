'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useAuth } from '@/context/AuthContext' // Corrected path

export default function ConnectTelegramPage() {
  const { user } = useAuth()
  const [telegramChatId, setTelegramChatId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (!user) {
      // Handle case where user is not logged in, maybe redirect
      console.error('User not logged in');
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      setError('Bạn phải đăng nhập để thực hiện hành động này.');
      return;
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/user/connect-telegram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.id, telegramChatId }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Không thể lưu ID.');
      }

      setSuccess('Đã lưu ID Telegram thành công!')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Kết nối với Telegram</CardTitle>
          <CardDescription>
            Liên kết tài khoản của bạn với Telegram để nhận mã OTP và các thông báo quan trọng.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-4">
            <h3 className="font-semibold text-blue-800">Làm thế nào để lấy ID của bạn?</h3>
            <ol className="list-decimal list-inside text-sm text-blue-700 mt-2 space-y-1">
              <li>Mở ứng dụng Telegram.</li>
              <li>Tìm kiếm bot có tên là <strong><code>@userinfobot</code></strong>.</li>
              <li>Bắt đầu cuộc trò chuyện với bot bằng cách nhấn nút "Start".</li>
              <li>Bot sẽ trả về một tin nhắn chứa thông tin của bạn, bao gồm cả <strong>ID</strong>.</li>
              <li>Sao chép và dán ID đó vào ô bên dưới.</li>
            </ol>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="telegramChatId">Telegram Chat ID</Label>
              <Input
                id="telegramChatId"
                value={telegramChatId}
                onChange={(e) => setTelegramChatId(e.target.value)}
                placeholder="Dán ID của bạn ở đây"
                required
              />
            </div>
            
            {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
            {success && <Alert variant="success"><AlertDescription>{success}</AlertDescription></Alert>}

            <Button type="submit" className="w-full" disabled={loading || !user}>
              {loading ? 'Đang lưu...' : 'Lưu liên kết'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
