# Hướng dẫn Deploy GLXD Shop Chat lên Vercel

## 🚀 Deploy GLXD Shop Chat lên glxd.shop

### 1. Chuẩn bị trước khi deploy

#### Tạo repository trên GitHub
1. Tạo repository mới trên GitHub
2. Push code của bạn lên repository đó

#### Cấu hình Environment Variables trên Vercel
1. Đăng nhập vào [Vercel](https://vercel.com)
2. Import project từ GitHub
3. Trong project settings, thêm các environment variables sau:

```bash
# Database URL (sử dụng SQLite cho production)
DATABASE_URL=file:./data/prisma.db

# JWT Secret (tạo một chuỗi ngẫu nhiên)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Telegram Bot Token (nếu cần)
TELEGRAM_BOT_TOKEN=your-telegram-bot-token

# App URL
NEXT_PUBLIC_APP_URL=https://glxd.shop
```

### 2. Cấu hình Vercel

#### Cấu hình Build Command
1. Trong project settings → Build & Development
2. Build Command: `npm run vercel-build`
3. Output Directory: `.next`
4. Install Command: `npm install`

#### Cấu hình Environment Variables cho Production
1. Vào tab "Environment Variables"
2. Thêm các biến môi trường như trên
3. Đảm bảo chọn "Production" cho tất cả environments

### 3. Cấu hình Domain

#### Thêm Custom Domain
1. Trong project settings → Domains
2. Add domain: `glxd.shop`
3. Vercel sẽ tự động cấu hình DNS và SSL certificate
4. Kiểm tra DNS settings và chờ propagation

#### Cấu hình DNS (nếu cần)
Nếu domain đã được mua ở nơi khác:
1. Trỏ DNS records về Vercel:
   - CNAME record: `glxd.shop` → `cname.vercel-dns.com`
   - Hoặc A record: `glxd.shop` → `76.76.21.21`

### 4. Xử lý Database cho Production

#### Tạo file seed cho production
Tạo file `prisma/seed.ts`:

```typescript
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 12)

  // Create admin user
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      password: hashedPassword,
      role: 'ADMIN'
    }
  })

  // Create sample users
  const users = [
    { email: 'user1@example.com', name: 'Nguyễn Văn A' },
    { email: 'user2@example.com', name: 'Trần Thị B' },
    { email: 'user3@example.com', name: 'Lê Văn C' }
  ]

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        email: user.email,
        name: user.name,
        password: hashedPassword,
        role: 'USER'
      }
    })
  }

  console.log('Database seeded!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

#### Cập nhật package.json
```json
{
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  }
}
```

### 5. Deploy

#### Deploy thủ công
1. Commit và push code lên GitHub
2. Vào Vercel dashboard
3. Click "Deploy"

#### Auto deploy
1. Mỗi khi push code lên main branch, Vercel sẽ auto deploy
2. Có thể cấu hình deploy branch trong settings

### 6. Testing sau khi deploy

#### Kiểm tra các chức năng
1. **User Access**: `https://glxd.shop`
   - Đăng ký tài khoản mới
   - Đăng nhập với tài khoản có sẵn
   - Chat real-time

2. **Admin Access**: `https://glxd.shop/admin`
   - Đăng nhập với admin account
   - Kiểm tra dashboard
   - Quản lý users và messages

#### Tài khoản demo
- **Admin**: admin@example.com / password123
- **User**: user1@example.com / password123
- **User**: user2@example.com / password123
- **User**: user3@example.com / password123

### 7. Troubleshooting

#### Common Issues
1. **Domain không hoạt động**: Kiểm tra DNS configuration
2. **Database errors**: Kiểm tra DATABASE_URL
3. **JWT errors**: Kiểm tra JWT_SECRET
4. **Build errors**: Kiểm tra dependencies và scripts
5. **Socket.IO errors**: Kiểm tra cấu hình server

#### Logs và Monitoring
1. Vào Vercel dashboard → Functions
2. Kiểm tra logs để debug errors
3. Sử dụng Vercel Analytics để monitoring

### 8. Production Best Practices

#### Security
1. Change JWT secret thành một chuỗi mạnh
2. Sử dụng environment variables cho sensitive data
3. Enable HTTPS (Vercel auto enable)
4. Regular updates dependencies

#### Performance
1. Enable caching strategies
2. Optimize images and assets
3. Monitor performance with Vercel Analytics
4. Use CDN for static assets

#### Monitoring
1. Set up error tracking
2. Monitor uptime and performance
3. Set up alerts for critical issues
4. Regular backup database

### 9. Domain Configuration

#### Custom Domain đã được cấu hình
- **Primary Domain**: glxd.shop
- **SSL**: Auto-generated bởi Vercel
- **CDN**: Auto-enabled bởi Vercel

#### Environment Variables cho glxd.shop
```bash
NEXT_PUBLIC_APP_URL=https://glxd.shop
```

### 10. Branding GLXD Shop

#### App Branding
- **App Name**: GLXD Shop Chat
- **Admin Panel**: GLXD Shop Admin
- **Domain**: glxd.shop
- **Color Scheme**: Blue theme
- **Logo**: MessageSquare icon

#### Features
- **Real-time Chat**: Users có thể chat với nhau
- **Admin Dashboard**: Full control panel cho admin
- **User Management**: Quản lý users và permissions
- **Message Monitoring**: Xem tất cả tin nhắn trong hệ thống
- **Statistics**: Thống kê hệ thống real-time

### 11. Scale Up

#### Database Considerations
- Nếu cần scale, consider migrating từ SQLite sang PostgreSQL
- Sử dụng database hosting services như PlanetScale, Supabase
- Implement database backups

#### Additional Features
- Add file upload functionality
- Implement push notifications
- Add video/audio calling
- Implement end-to-end encryption
- Integration với Telegram bot

---

## 🎉 GLXD SHOP CHAT DEPLOYMENT COMPLETE!

**User Access**: `https://glxd.shop`
**Admin Access**: `https://glxd.shop/admin`

**Tài khoản demo**:
- Admin: admin@example.com / password123
- Users: user1@example.com / password123

**Features**:
- ✅ Real-time chat
- ✅ Admin dashboard
- ✅ User management
- ✅ Message monitoring
- ✅ System statistics
- ✅ JWT authentication
- ✅ Role-based access control
- ✅ Modern UI/UX
- ✅ Mobile responsive
- ✅ SSL security
- ✅ Custom domain

Chúc mừng! GLXD Shop Chat đã được deploy thành công! 🚀