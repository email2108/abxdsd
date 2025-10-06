# 🚀 GLXD Shop Chat - Real-time Chat Application

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/glxd-shop-chat)

**GLXD Shop Chat** là một ứng dụng chat real-time hiện đại được xây dựng với Next.js 15, TypeScript, và Socket.IO. Ứng dụng cung cấp nền tảng chat mạnh mẽ với phân quyền rõ ràng giữa admin và user.

## ✨ Features

### 🎯 Core Features
- **Real-time Chat**: Chat real-time với Socket.IO
- **User Authentication**: JWT authentication bảo mật
- **Admin Dashboard**: Full control panel cho admin
- **Role-based Access**: Phân quyền USER/ADMIN rõ ràng
- **Responsive Design**: Works trên cả mobile và desktop

### 🛡️ Admin Features
- **User Management**: Quản lý tất cả users
- **Message Monitoring**: Xem tất cả tin nhắn hệ thống
- **System Statistics**: Thống kê real-time
- **Online Status**: Theo dõi user online/offline
- **Full Control**: Complete admin access

### 💬 User Features
- **1-1 Chat**: Chat riêng tư giữa users
- **Online Status**: Biết ai đang online/offline
- **Message History**: Lưu trữ lịch sử chat
- **Profile Management**: Quản lý profile cá nhân
- **Modern UI**: Giao diện thân thiện

## 🚀 Quick Start

### Development
```bash
# Clone repository
git clone https://github.com/your-username/glxd-shop-chat.git
cd glxd-shop-chat

# Install dependencies
npm install

# Setup database
npm run db:push
npm run db:seed

# Start development server
npm run dev
```

### Access URLs
- **User App**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin

### Demo Accounts
- **Admin**: admin@example.com / password123
- **User**: user1@example.com / password123
- **User**: user2@example.com / password123
- **User**: user3@example.com / password123

## 🛠️ Tech Stack

### Frontend
- **Next.js 15**: React framework với App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS 4**: Modern CSS framework
- **shadcn/ui**: Premium UI components
- **Socket.IO Client**: Real-time connection

### Backend
- **Next.js API Routes**: Serverless API endpoints
- **Socket.IO Server**: WebSocket real-time server
- **Prisma ORM**: Database management
- **SQLite Database**: Lightweight database
- **JWT**: Authentication tokens

### Security
- **bcryptjs**: Password hashing
- **jsonwebtoken**: JWT tokens
- **Role-based Access**: USER/ADMIN permissions
- **Environment Variables**: Secure configuration

## 📁 Project Structure

```
src/
├── app/
│   ├── api/              # API routes
│   │   ├── auth/         # Authentication APIs
│   │   ├── users/        # User APIs
│   │   ├── messages/     # Message APIs
│   │   └── admin/        # Admin APIs
│   ├── chat/             # Chat page
│   ├── admin/            # Admin pages
│   ├── login/            # Login page
│   ├── register/         # Register page
│   └── page.tsx          # Home page
├── components/
│   └── ui/               # shadcn/ui components
├── lib/
│   ├── db.ts             # Database connection
│   └── socket.ts         # Socket.IO setup
└── hooks/                # Custom hooks
```

## 🔧 Configuration

### Environment Variables
```bash
# Database
DATABASE_URL="file:./data/prisma.db"

# JWT Secret
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Telegram Bot (optional)
TELEGRAM_BOT_TOKEN="your-telegram-bot-token"

# App URL
NEXT_PUBLIC_APP_URL="https://glxd.shop"
```

### Database Schema
```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  password  String
  role      Role     @default(USER)
  isOnline  Boolean  @default(false)
  avatar    String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  sentMessages     Message[] @relation("SentMessages")
  receivedMessages Message[] @relation("ReceivedMessages")
}

model Message {
  id         String   @id @default(cuid())
  content    String
  senderId   String
  receiverId String
  createdAt  DateTime @default(now())
  
  sender     User     @relation("SentMessages")
  receiver   User     @relation("ReceivedMessages")
}

enum Role {
  USER
  ADMIN
}
```

## 🚀 Deployment

### Vercel Deployment
1. **Tạo GitHub repository**
2. **Push code lên GitHub**
3. **Import project vào Vercel**
4. **Cấu hình environment variables**
5. **Add custom domain**: `glxd.shop`
6. **Deploy**

Xem chi tiết trong [DEPLOYMENT.md](./DEPLOYMENT.md)

### Environment Variables cho Production
```bash
DATABASE_URL=file:./data/prisma.db
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
TELEGRAM_BOT_TOKEN=your-telegram-bot-token
NEXT_PUBLIC_APP_URL=https://glxd.shop
```

## 📱 Screenshots

### User Interface
- **Home Page**: Landing page với call-to-action
- **Chat Interface**: Modern chat UI với online status
- **User List**: Danh sách users với online/offline indicators
- **Message History**: Lịch sử chat với timestamps

### Admin Interface
- **Admin Dashboard**: Overview với statistics
- **User Management**: List và manage users
- **Message Monitoring**: View all messages
- **System Stats**: Real-time statistics

## 🔐 Security Features

### Authentication
- **JWT Tokens**: Stateless authentication
- **Password Hashing**: bcryptjs encryption
- **Role-based Access**: USER/ADMIN permissions
- **Route Protection**: Protected routes and APIs

### Data Protection
- **Environment Variables**: Sensitive data protection
- **HTTPS**: SSL encryption (Vercel auto-enable)
- **Input Validation**: Form validation and sanitization
- **SQL Injection Prevention**: Prisma ORM protection

## 🎨 UI/UX Features

### Design System
- **shadcn/ui Components**: Consistent design system
- **Tailwind CSS**: Utility-first styling
- **Responsive Design**: Mobile-first approach
- **Dark Mode Ready**: Theme support

### User Experience
- **Real-time Updates**: Instant UI updates
- **Loading States**: Loading indicators
- **Error Handling**: User-friendly error messages
- **Smooth Animations**: Framer Motion transitions

## 📊 Monitoring & Analytics

### Vercel Analytics
- **Performance Monitoring**: Track app performance
- **Error Tracking**: Monitor and debug errors
- **Usage Analytics**: User behavior insights
- **Uptime Monitoring**: Service availability

### Logging
- **Function Logs**: Vercel function logs
- **Console Logging**: Development debugging
- **Error Tracking**: Error boundary logging
- **Performance Metrics**: Response time tracking

## 🔄 API Documentation

### Authentication APIs
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### User APIs
- `GET /api/users` - Get all users
- `GET /api/messages/[userId]` - Get messages between users
- `POST /api/messages` - Send new message

### Admin APIs
- `GET /api/admin/users` - Get all users (admin only)
- `GET /api/admin/messages` - Get all messages (admin only)
- `GET /api/admin/stats` - Get system stats (admin only)

## 🤝 Contributing

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/new-feature`
3. **Commit changes**: `git commit -am 'Add new feature'`
4. **Push to branch**: `git push origin feature/new-feature`
5. **Submit pull request**

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team** For the amazing framework
- **Vercel** For the hosting platform
- **Prisma** For the modern ORM
- **shadcn/ui** For the beautiful components
- **Socket.IO** For real-time communication

## 📞 Support

For support and questions:
- **Email**: support@glxd.shop
- **Documentation**: [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Issues**: GitHub Issues

---

**Built with ❤️ for GLXD Shop**

🌐 **Live Demo**: [https://glxd.shop](https://glxd.shop)
🛡️ **Admin Panel**: [https://glxd.shop/admin](https://glxd.shop/admin)