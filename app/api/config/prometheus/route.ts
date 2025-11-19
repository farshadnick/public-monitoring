import { NextResponse } from 'next/server';
import { getPrometheusConfig, generatePrometheusConfig } from '@/lib/prometheus';
import { getURLs } from '@/lib/storage';

export async function GET() {
  try {
    let config = await getPrometheusConfig();
    
    // If config doesn't exist, generate it
    if (!config) {
      const urls = await getURLs();
      config = await generatePrometheusConfig(urls);
    }

    return new NextResponse(config, {
      headers: {
        'Content-Type': 'text/yaml',
        'Content-Disposition': 'attachment; filename="prometheus.yml"',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get config' }, { status: 500 });
  }
}

export async function POST() {
  try {
    const urls = await getURLs();
    const config = await generatePrometheusConfig(urls);
    return NextResponse.json({ success: true, config });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to regenerate config' }, { status: 500 });
  }
}

