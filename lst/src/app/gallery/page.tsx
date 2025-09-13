'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Download, Eye } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function GalleryPage() {
  const router = useRouter()

  const images = [
    {
      name: 'Logo',
      file: 'logo.png',
      description: 'Logo chính thức của GLXD Shop Chat',
      size: '1024x1024'
    },
    {
      name: 'Favicon',
      file: 'favicon.png',
      description: 'Icon cho trình duyệt',
      size: '1024x1024'
    },
    {
      name: 'Landing Page',
      file: 'landing-page.png',
      description: 'Hero section của trang chủ',
      size: '1024x1024'
    },
    {
      name: 'Chat Interface',
      file: 'chat-interface.png',
      description: 'Giao diện chat chính',
      size: '1024x1024'
    },
    {
      name: 'Messaging Interface',
      file: 'messaging-interface.png',
      description: 'Giao diện nhắn tin real-time',
      size: '1024x1024'
    },
    {
      name: 'Admin Dashboard',
      file: 'admin-dashboard.png',
      description: 'Giao diện admin dashboard',
      size: '1024x1024'
    },
    {
      name: 'Login Form',
      file: 'login-form.png',
      description: 'Giao diện đăng nhập',
      size: '1024x1024'
    },
    {
      name: 'Register Form',
      file: 'register-form.png',
      description: 'Giao diện đăng ký',
      size: '1024x1024'
    }
  ]

  const downloadImage = (filename: string) => {
    const link = document.createElement('a')
    link.href = `/${filename}`
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => router.push('/')} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Quay lại
            </Button>
            <div>
              <h1 className="text-3xl font-bold">GLXD Shop Chat Gallery</h1>
              <p className="text-gray-600">Bộ sưu tập hình ảnh thiết kế</p>
            </div>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {images.map((image, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{image.name}</CardTitle>
                <CardDescription>{image.description}</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="aspect-square bg-gray-100 flex items-center justify-center">
                  <img
                    src={`/${image.file}`}
                    alt={image.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>Kích thước: {image.size}</span>
                    <span>{image.file}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => window.open(`/${image.file}`, '_blank')}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Xem
                    </Button>
                    <Button 
                      variant="default" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => downloadImage(image.file)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Tải xuống
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Info Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Thông tin về bộ hình ảnh</CardTitle>
            <CardDescription>
              Tất cả hình ảnh được tạo bởi AI và được tối ưu hóa cho GLXD Shop Chat
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">Thông số kỹ thuật</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Định dạng: PNG</li>
                  <li>• Kích thước: 1024x1024 pixels</li>
                  <li>• Màu sắc: Blue theme</li>
                  <li>• Style: Modern, Clean, Professional</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Cách sử dụng</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Logo: Sử dụng cho branding</li>
                  <li>• Favicon: Icon trình duyệt</li>
                  <li>• UI Images: Demo và showcase</li>
                  <li>• Forms: Hướng dẫn thiết kế</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}