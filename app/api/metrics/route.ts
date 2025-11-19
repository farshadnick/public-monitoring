import { NextResponse } from 'next/server';
import { getURLs } from '@/lib/storage';
import { getAllMetrics } from '@/lib/prometheus-api';
import { saveMonitoringResult, initDB } from '@/lib/database-mysql';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Initialize database on first request
    await initDB();
    
    const urls = await getURLs();
    const metrics = await getAllMetrics(urls.map(u => ({ url: u.url, name: u.name })));
    
    // Save metrics to database
    for (const metric of metrics) {
      try {
        await saveMonitoringResult({
          url: metric.url,
          name: metric.name,
          status: metric.status,
          response_time: metric.responseTime,
          status_code: metric.statusCode,
          ssl_days_remaining: metric.sslDaysRemaining,
          uptime: metric.uptime,
          checked_at: metric.lastCheck,
        });
      } catch (dbError) {
        console.error('Failed to save metric to DB:', dbError);
      }
    }
    
    return NextResponse.json(metrics);
  } catch (error) {
    console.error('Metrics error:', error);
    return NextResponse.json({ error: 'Failed to fetch metrics' }, { status: 500 });
  }
}

