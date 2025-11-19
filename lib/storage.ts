import { MonitoredURL } from '@/types';
import { promises as fs } from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const URLS_FILE = path.join(DATA_DIR, 'urls.json');

async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (error) {
    // Directory already exists
  }
}

export async function getURLs(): Promise<MonitoredURL[]> {
  try {
    await ensureDataDir();
    const data = await fs.readFile(URLS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

export async function saveURLs(urls: MonitoredURL[]): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(URLS_FILE, JSON.stringify(urls, null, 2));
}

export async function addURL(url: Omit<MonitoredURL, 'id' | 'createdAt'>): Promise<MonitoredURL> {
  const urls = await getURLs();
  const newURL: MonitoredURL = {
    ...url,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    status: 'unknown',
  };
  urls.push(newURL);
  await saveURLs(urls);
  return newURL;
}

export async function deleteURL(id: string): Promise<boolean> {
  const urls = await getURLs();
  const filteredURLs = urls.filter(url => url.id !== id);
  if (filteredURLs.length === urls.length) {
    return false;
  }
  await saveURLs(filteredURLs);
  return true;
}

export async function updateURL(id: string, updates: Partial<MonitoredURL>): Promise<MonitoredURL | null> {
  const urls = await getURLs();
  const index = urls.findIndex(url => url.id === id);
  if (index === -1) {
    return null;
  }
  urls[index] = { ...urls[index], ...updates };
  await saveURLs(urls);
  return urls[index];
}

