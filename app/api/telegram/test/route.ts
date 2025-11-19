import { NextResponse } from 'next/server';
import { sendTelegramMessage } from '@/lib/telegram';

export async function POST() {
  try {
    const success = await sendTelegramMessage(
      '✅ <b>Test Message</b>\n\nYour Telegram integration is working correctly!\n\nURL Monitoring System'
    );
    
    if (success) {
      return NextResponse.json({ success: true, message: 'Test message sent successfully!' });
    } else {
      return NextResponse.json({ error: 'Failed to send message. Check your bot token and chat ID.' }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send test message' }, { status: 500 });
  }
}

