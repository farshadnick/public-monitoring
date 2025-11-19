import { NextRequest, NextResponse } from 'next/server';
import { getRecentResults, getUptimeStats, getHistoricalData } from '@/lib/database-mysql';

export async function GET(
  request: NextRequest,
  { params }: { params: { url: string } }
) {
  try {
    const url = decodeURIComponent(params.url);
    const searchParams = request.nextUrl.searchParams;
    const hours = parseInt(searchParams.get('hours') || '24');
    const type = searchParams.get('type') || 'recent';

    if (type === 'stats') {
      const stats = await getUptimeStats(url, hours);
      return NextResponse.json(stats);
    } else if (type === 'historical') {
      const data = await getHistoricalData(url, hours);
      return NextResponse.json(data);
    } else {
      const results = await getRecentResults(url, 100);
      return NextResponse.json(results);
    }
  } catch (error) {
    console.error('History error:', error);
    return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 });
  }
}

