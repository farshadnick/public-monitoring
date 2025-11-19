import { NextRequest, NextResponse } from 'next/server';
import { getURLs, addURL } from '@/lib/storage';
import { generatePrometheusConfig } from '@/lib/prometheus';

export async function GET() {
  try {
    const urls = await getURLs();
    return NextResponse.json(urls);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch URLs' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, name, interval } = body;

    if (!url || !name) {
      return NextResponse.json({ error: 'URL and name are required' }, { status: 400 });
    }

    const newURL = await addURL({
      url,
      name,
      interval: interval || '30s',
    });

    // Regenerate Prometheus config
    const urls = await getURLs();
    await generatePrometheusConfig(urls);

    return NextResponse.json(newURL, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add URL' }, { status: 500 });
  }
}

