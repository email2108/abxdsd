import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create users
  const hashedPassword = await bcrypt.hash('password123', 12)

  const user1 = await prisma.user.upsert({
    where: { email: 'user1@example.com' },
    update: {},
    create: {
      email: 'user1@example.com',
      name: 'Nguyễn Văn A',
      password: hashedPassword,
      role: 'USER',
      isOnline: true,
    },
  })

  const user2 = await prisma.user.upsert({
    where: { email: 'user2@example.com' },
    update: {},
    create: {
      email: 'user2@example.com',
      name: 'Trần Thị B',
      password: hashedPassword,
      role: 'USER',
      isOnline: false,
    },
  })

  const user3 = await prisma.user.upsert({
    where: { email: 'user3@example.com' },
    update: {},
    create: {
      email: 'user3@example.com',
      name: 'Lê Văn C',
      password: hashedPassword,
      role: 'USER',
      isOnline: true,
    },
  })

  const user4 = await prisma.user.upsert({
    where: { email: 'user4@example.com' },
    update: {},
    create: {
      email: 'user4@example.com',
      name: 'Phạm Thị D',
      password: hashedPassword,
      role: 'USER',
      isOnline: false,
    },
  })

  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      password: hashedPassword,
      role: 'ADMIN',
      isOnline: false,
    },
  })

  // Create sample messages
  await prisma.message.createMany({
    data: [
      {
        content: 'Xin chào! Bạn có khỏe không?',
        senderId: user1.id,
        receiverId: user3.id,
      },
      {
        content: 'Chào bạn! Mình khỏe, cảm ơn bạn đã hỏi thăm.',
        senderId: user3.id,
        receiverId: user1.id,
      },
      {
        content: 'Hôm nay thời tiết thật đẹp!',
        senderId: user1.id,
        receiverId: user3.id,
      },
      {
        content: 'Đúng vậy! Mình cũng nghĩ như vậy.',
        senderId: user3.id,
        receiverId: user1.id,
      },
    ],
  })

  console.log('Database seeded successfully!')
  console.log('Users created:')
  console.log('- user1@example.com / password123 (Nguyễn Văn A - USER)')
  console.log('- user2@example.com / password123 (Trần Thị B - USER)')
  console.log('- user3@example.com / password123 (Lê Văn C - USER)')
  console.log('- user4@example.com / password123 (Phạm Thị D - USER)')
  console.log('- admin@example.com / password123 (Admin User - ADMIN)')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })