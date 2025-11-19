import { promises as fs } from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const TELEGRAM_CONFIG_FILE = path.join(DATA_DIR, 'telegram-config.json');

export interface TelegramConfig {
  botToken: string;
  chatId: string;
  enabled: boolean;
}

async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (error) {
    // Directory already exists
  }
}

export async function getTelegramConfig(): Promise<TelegramConfig | null> {
  try {
    await ensureDataDir();
    const data = await fs.readFile(TELEGRAM_CONFIG_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return null;
  }
}

export async function saveTelegramConfig(config: TelegramConfig): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(TELEGRAM_CONFIG_FILE, JSON.stringify(config, null, 2));
}

export async function sendTelegramMessage(message: string): Promise<boolean> {
  const config = await getTelegramConfig();
  
  if (!config || !config.enabled || !config.botToken || !config.chatId) {
    return false;
  }

  try {
    const url = `https://api.telegram.org/bot${config.botToken}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: config.chatId,
        text: message,
        parse_mode: 'HTML',
      }),
    });

    return response.ok;
  } catch (error) {
    console.error('Telegram send error:', error);
    return false;
  }
}

export async function sendAlertNotification(
  siteName: string,
  siteUrl: string,
  status: 'down' | 'up',
  responseTime?: number
): Promise<void> {
  const emoji = status === 'down' ? '🔴' : '🟢';
  const statusText = status === 'down' ? 'DOWN' : 'RECOVERED';
  
  let message = `${emoji} <b>${statusText}</b>\n\n`;
  message += `<b>Site:</b> ${siteName}\n`;
  message += `<b>URL:</b> ${siteUrl}\n`;
  
  if (responseTime) {
    message += `<b>Response Time:</b> ${(responseTime * 1000).toFixed(0)}ms\n`;
  }
  
  message += `<b>Time:</b> ${new Date().toLocaleString()}\n`;

  await sendTelegramMessage(message);
}

