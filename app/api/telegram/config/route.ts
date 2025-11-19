import { NextRequest, NextResponse } from 'next/server';
import { getTelegramConfig, saveTelegramConfig } from '@/lib/telegram';

export async function GET() {
  try {
    const config = await getTelegramConfig();
    return NextResponse.json(config || { botToken: '', chatId: '', enabled: false });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get config' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    await saveTelegramConfig(body);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save config' }, { status: 500 });
  }
}

