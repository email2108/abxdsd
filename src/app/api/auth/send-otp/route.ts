import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

async function sendTelegramMessage(chatId: string, text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    console.error('TELEGRAM_BOT_TOKEN is not set.');
    throw new Error('Telegram bot is not configured.');
  }

  const url = `https://api.telegram.org/bot${token}/sendMessage`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      chat_id: chatId,
      text: text,
      parse_mode: 'Markdown',
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error('Failed to send Telegram message:', errorData);
    throw new Error('Failed to send OTP via Telegram.');
  }

  return response.json();
}

export async function POST(request: NextRequest) {
  try {
    const { email, phone, type } = await request.json();

    if (!email && !phone) {
      return NextResponse.json({ error: 'Email hoặc số điện thoại là bắt buộc' }, { status: 400 });
    }

    if (!type || !['LOGIN', 'ADMIN_LOGIN'].includes(type)) {
      return NextResponse.json({ error: 'Loại OTP không hợp lệ' }, { status: 400 });
    }

    const user = await db.user.findFirst({
      where: { OR: [{ email }, { phone }] },
    });

    if (!user) {
      return NextResponse.json({ error: 'Tài khoản không tồn tại' }, { status: 404 });
    }

    if (!user.telegramChatId) {
      return NextResponse.json(
        { error: 'Tài khoản chưa được liên kết với Telegram. Vui lòng liên kết để nhận OTP.' },
        { status: 400 }
      );
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    await db.user.update({
      where: { id: user.id },
      data: { otpCode, otpExpiry },
    });

    // Send OTP via Telegram
    const message = `Mã OTP của bạn cho GLXD Shop là: *${otpCode}*\n\nMã này sẽ hết hạn sau 5 phút.`;
    await sendTelegramMessage(user.telegramChatId, message);

    return NextResponse.json({
      success: true,
      message: 'OTP đã được gửi thành công qua Telegram.',
    });

  } catch (error) {
    console.error('Error sending OTP:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to send OTP';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
