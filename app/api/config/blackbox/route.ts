import { NextResponse } from 'next/server';
import { getBlackboxConfig, generateBlackboxConfig } from '@/lib/prometheus';

export async function GET() {
  try {
    let config = await getBlackboxConfig();
    
    // If config doesn't exist, generate it
    if (!config) {
      config = await generateBlackboxConfig();
    }

    return new NextResponse(config, {
      headers: {
        'Content-Type': 'text/yaml',
        'Content-Disposition': 'attachment; filename="blackbox.yml"',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get config' }, { status: 500 });
  }
}

export async function POST() {
  try {
    const config = await generateBlackboxConfig();
    return NextResponse.json({ success: true, config });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to regenerate config' }, { status: 500 });
  }
}

