export interface MonitoredURL {
  id: string;
  url: string;
  name: string;
  interval: string;
  zone?: string;
  createdAt: string;
  status?: 'up' | 'down' | 'unknown';
  monitorType?: 'http' | 'https' | 'ping' | 'port' | 'keyword';
  keyword?: string;
  port?: number;
  alertThreshold?: number; // Response time in ms
  sslMonitoring?: boolean;
}

export interface Zone {
  id: string;
  name: string;
  location: string;
  flag: string;
}

export interface Incident {
  id: string;
  monitorId: string;
  monitorName: string;
  type: 'down' | 'slow' | 'ssl_expiring';
  startTime: string;
  endTime?: string;
  duration?: number;
  resolved: boolean;
  message: string;
}

export interface StatusPageConfig {
  id: string;
  name: string;
  description: string;
  monitors: string[]; // Monitor IDs
  isPublic: boolean;
  customDomain?: string;
}

export interface PrometheusConfig {
  scrape_configs: ScrapeConfig[];
}

export interface ScrapeConfig {
  job_name: string;
  metrics_path: string;
  scrape_interval: string;
  static_configs: StaticConfig[];
}

export interface StaticConfig {
  targets: string[];
  labels?: Record<string, string>;
}

export interface BlackboxConfig {
  modules: Record<string, BlackboxModule>;
}

export interface BlackboxModule {
  prober: string;
  timeout?: string;
  http?: {
    valid_http_versions?: string[];
    valid_status_codes?: number[];
    method?: string;
    fail_if_ssl?: boolean;
    fail_if_not_ssl?: boolean;
    preferred_ip_protocol?: string;
  };
}

