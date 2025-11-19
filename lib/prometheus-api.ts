export interface PrometheusMetric {
  url: string;
  name: string;
  status: 'up' | 'down' | 'unknown';
  responseTime: number;
  statusCode: number;
  sslDaysRemaining: number | null;
  lastCheck: string;
  uptime: number;
}

const PROMETHEUS_URL = process.env.PROMETHEUS_URL || 'http://prometheus:9090';
const BLACKBOX_URL = process.env.BLACKBOX_URL || 'http://blackbox:9115';

export async function queryPrometheus(query: string): Promise<any> {
  try {
    const response = await fetch(`${PROMETHEUS_URL}/api/v1/query?query=${encodeURIComponent(query)}`, {
      next: { revalidate: 0 }, // Don't cache
    });
    
    if (!response.ok) {
      throw new Error('Prometheus query failed');
    }
    
    const data = await response.json();
    return data.data.result;
  } catch (error) {
    console.error('Prometheus query error:', error);
    return [];
  }
}

export async function probeDirectly(url: string): Promise<any> {
  try {
    const response = await fetch(`${BLACKBOX_URL}/probe?target=${encodeURIComponent(url)}&module=http_2xx`, {
      next: { revalidate: 0 },
    });
    
    if (!response.ok) {
      throw new Error('Blackbox probe failed');
    }
    
    const text = await response.text();
    
    // Parse Prometheus metrics format
    const lines = text.split('\n');
    const metrics: any = {};
    
    for (const line of lines) {
      if (line.startsWith('#') || !line.trim()) continue;
      
      const match = line.match(/^([a-zA-Z_][a-zA-Z0-9_]*)\s+(.+)$/);
      if (match) {
        metrics[match[1]] = parseFloat(match[2]);
      }
    }
    
    return metrics;
  } catch (error) {
    console.error('Blackbox probe error:', error);
    return null;
  }
}

export async function getURLMetrics(url: string, name: string): Promise<PrometheusMetric> {
  try {
    // Try direct probe first (more reliable)
    const probeMetrics = await probeDirectly(url);
    
    if (probeMetrics) {
      const isUp = probeMetrics.probe_success === 1;
      const responseTime = probeMetrics.probe_duration_seconds || 0;
      const statusCode = probeMetrics.probe_http_status_code || 0;
      const sslExpiry = probeMetrics.probe_ssl_earliest_cert_expiry;
      const sslDaysRemaining = sslExpiry ? Math.floor((sslExpiry - Date.now() / 1000) / 86400) : null;

      // Try to get uptime from Prometheus
      const uptimeQuery = `avg_over_time(probe_success{instance="${url}"}[24h]) * 100`;
      const uptimeResult = await queryPrometheus(uptimeQuery);
      const uptime = uptimeResult.length > 0 ? parseFloat(uptimeResult[0].value[1]) : (isUp ? 100 : 0);

      return {
        url,
        name,
        status: isUp ? 'up' : 'down',
        responseTime,
        statusCode,
        sslDaysRemaining,
        lastCheck: new Date().toISOString(),
        uptime,
      };
    }

    // Fallback to Prometheus queries
    const successQuery = `probe_success{instance="${url}"}`;
    const successResult = await queryPrometheus(successQuery);
    const isUp = successResult.length > 0 && successResult[0].value[1] === '1';

    const durationQuery = `probe_duration_seconds{instance="${url}"}`;
    const durationResult = await queryPrometheus(durationQuery);
    const responseTime = durationResult.length > 0 ? parseFloat(durationResult[0].value[1]) : 0;

    const statusQuery = `probe_http_status_code{instance="${url}"}`;
    const statusResult = await queryPrometheus(statusQuery);
    const statusCode = statusResult.length > 0 ? parseInt(statusResult[0].value[1]) : 0;

    const sslQuery = `(probe_ssl_earliest_cert_expiry{instance="${url}"} - time()) / 86400`;
    const sslResult = await queryPrometheus(sslQuery);
    const sslDaysRemaining = sslResult.length > 0 ? Math.floor(parseFloat(sslResult[0].value[1])) : null;

    const uptimeQuery = `avg_over_time(probe_success{instance="${url}"}[24h]) * 100`;
    const uptimeResult = await queryPrometheus(uptimeQuery);
    const uptime = uptimeResult.length > 0 ? parseFloat(uptimeResult[0].value[1]) : 0;

    return {
      url,
      name,
      status: isUp ? 'up' : 'down',
      responseTime,
      statusCode,
      sslDaysRemaining,
      lastCheck: new Date().toISOString(),
      uptime,
    };
  } catch (error) {
    return {
      url,
      name,
      status: 'unknown',
      responseTime: 0,
      statusCode: 0,
      sslDaysRemaining: null,
      lastCheck: new Date().toISOString(),
      uptime: 0,
    };
  }
}

export async function getAllMetrics(urls: { url: string; name: string }[]): Promise<PrometheusMetric[]> {
  const metrics = await Promise.all(
    urls.map(({ url, name }) => getURLMetrics(url, name))
  );
  return metrics;
}

