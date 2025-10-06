
import { Telegraf } from 'telegraf';
import { NextRequest, NextResponse } from 'next/server';

const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) {
  throw new Error('TELEGRAM_BOT_TOKEN is not set');
}

const bot = new Telegraf(token);

// Command handler for /start
bot.start((ctx) => {
  const chatId = ctx.chat.id;
  const message = `Welcome to GLXD Shop Bot!\n\nYour personal Chat ID is: 
${chatId}
\nPlease copy this ID and paste it into the "Connect Telegram" page on our website to receive OTPs and notifications.`;
  ctx.reply(message, { parse_mode: 'Markdown' });
});

// Generic message handler to provide help
bot.on('message', (ctx) => {
    const chatId = ctx.chat.id;
    const message = `Your Chat ID is: 
${chatId}
\nIf you intended to start the bot, please type /start.`;
    ctx.reply(message, { parse_mode: 'Markdown' });
});


// This is the main handler for the webhook.
const handler = async (req: NextRequest): Promise<NextResponse> => {
  try {
    const body = await req.json();
    await bot.handleUpdate(body);
    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error('Error handling Telegram update:', error);
    return NextResponse.json({ status: 'error' }, { status: 500 });
  }
};

// Export the handler for POST requests, which is how Telegram sends webhooks.
export const POST = handler;

// A GET handler to quickly check if the endpoint is reachable.
export async function GET(request: NextRequest) {
  return NextResponse.json({ message: 'Hello from the GLXD Shop Telegram Bot Webhook Endpoint!' });
}
