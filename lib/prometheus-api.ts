import config from './config';

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

/**
 * Create authentication headers if configured
 */
function getAuthHeaders(): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (config.prometheus.auth.username && config.prometheus.auth.password) {
    // Use btoa for base64 encoding in browser/edge environments
    const auth = typeof btoa !== 'undefined'
      ? btoa(`${config.prometheus.auth.username}:${config.prometheus.auth.password}`)
      : Buffer.from(`${config.prometheus.auth.username}:${config.prometheus.auth.password}`).toString('base64');
    headers['Authorization'] = `Basic ${auth}`;
  }

  return headers;
}

/**
 * Query Prometheus with configured URL and authentication
 */
export async function queryPrometheus(query: string): Promise<any> {
  try {
    const url = `${config.prometheus.url}/api/v1/query?query=${encodeURIComponent(query)}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.prometheus.timeout * 1000);

    const response = await fetch(url, {
      headers: getAuthHeaders(),
      signal: controller.signal,
      cache: 'no-store', // Don't cache
    });

    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`Prometheus query failed: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.data.result;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Prometheus query error:', error.message);
      if (error.name === 'AbortError') {
        console.error(`Query timeout after ${config.prometheus.timeout}s`);
      }
    }
    return [];
  }
}

/**
 * Probe URL directly via Blackbox Exporter
 */
export async function probeDirectly(url: string): Promise<any> {
  try {
    const probeUrl = `${config.blackbox.url}/probe?target=${encodeURIComponent(url)}&module=http_2xx`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.monitoring.defaultTimeout * 1000);

    const response = await fetch(probeUrl, {
      signal: controller.signal,
      cache: 'no-store',
    });

    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`Blackbox probe failed: ${response.status}`);
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
    if (error instanceof Error) {
      console.error('Blackbox probe error:', error.message);
    }
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

