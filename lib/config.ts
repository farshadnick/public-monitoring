/**
 * Application Configuration
 * Centralized configuration management using environment variables
 */

export const config = {
  // Application
  app: {
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    nodeEnv: process.env.NODE_ENV || 'development',
  },

  // Prometheus
  prometheus: {
    url: process.env.PROMETHEUS_URL || 'http://localhost:9090',
    timeout: parseInt(process.env.PROMETHEUS_QUERY_TIMEOUT || '30', 10),
    scrapeInterval: process.env.PROMETHEUS_SCRAPE_INTERVAL || '30s',
    auth: {
      username: process.env.PROMETHEUS_AUTH_USERNAME || '',
      password: process.env.PROMETHEUS_AUTH_PASSWORD || '',
    },
  },

  // Blackbox Exporter
  blackbox: {
    url: process.env.BLACKBOX_EXPORTER_URL || 'http://localhost:9115',
  },

  // Database
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    name: process.env.DB_NAME || 'monitoring',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
  },

  // Authentication
  auth: {
    sessionSecret: process.env.SESSION_SECRET || 'development-secret-change-in-production',
    defaultUsername: process.env.DEFAULT_ADMIN_USERNAME || 'admin',
    defaultPassword: process.env.DEFAULT_ADMIN_PASSWORD || 'admin123',
    sessionExpiryHours: parseInt(process.env.SESSION_EXPIRY_HOURS || '24', 10),
  },

  // Telegram
  telegram: {
    botToken: process.env.TELEGRAM_BOT_TOKEN || '',
    chatId: process.env.TELEGRAM_CHAT_ID || '',
  },

  // Monitoring
  monitoring: {
    defaultInterval: parseInt(process.env.DEFAULT_CHECK_INTERVAL || '30', 10),
    defaultTimeout: parseInt(process.env.DEFAULT_HTTP_TIMEOUT || '10', 10),
    defaultResponseTimeThreshold: parseInt(process.env.DEFAULT_RESPONSE_TIME_THRESHOLD || '5000', 10),
    metricsRetentionDays: parseInt(process.env.METRICS_RETENTION_DAYS || '90', 10),
    concurrentChecks: parseInt(process.env.CONCURRENT_CHECKS || '10', 10),
    maxMonitorsPerUser: parseInt(process.env.MAX_MONITORS_PER_USER || '100', 10),
  },

  // Alerting
  alerts: {
    enabled: process.env.ALERTS_ENABLED !== 'false',
    cooldownMinutes: parseInt(process.env.ALERT_COOLDOWN_MINUTES || '5', 10),
    sslAlertDays: (process.env.SSL_ALERT_DAYS || '30,14,7').split(',').map(d => parseInt(d.trim(), 10)),
  },

  // Pushgateway
  pushgateway: {
    enabled: process.env.PUSHGATEWAY_ENABLED !== 'false',
    retentionHours: parseInt(process.env.PUSHGATEWAY_RETENTION_HOURS || '168', 10),
  },

  // Rate Limiting
  rateLimit: {
    enabled: process.env.RATE_LIMITING_ENABLED !== 'false',
    pingPerMinute: parseInt(process.env.PING_RATE_LIMIT || '60', 10),
    apiPerMinute: parseInt(process.env.API_RATE_LIMIT || '100', 10),
  },

  // Logging
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    verbose: process.env.VERBOSE_LOGGING === 'true',
  },

  // External Services
  external: {
    slack: {
      webhookUrl: process.env.SLACK_WEBHOOK_URL || '',
    },
    discord: {
      webhookUrl: process.env.DISCORD_WEBHOOK_URL || '',
    },
    pagerduty: {
      integrationKey: process.env.PAGERDUTY_INTEGRATION_KEY || '',
    },
    email: {
      smtp: {
        host: process.env.SMTP_HOST || '',
        port: parseInt(process.env.SMTP_PORT || '587', 10),
        user: process.env.SMTP_USER || '',
        password: process.env.SMTP_PASSWORD || '',
        from: process.env.SMTP_FROM || 'noreply@uptimemonitor.com',
      },
    },
  },

  // Security
  security: {
    corsOrigins: (process.env.CORS_ORIGINS || 'http://localhost:3000').split(','),
    apiKey: process.env.API_KEY || '',
  },

  // Performance
  performance: {
    statusCacheTTL: parseInt(process.env.STATUS_CACHE_TTL || '10', 10),
  },

  // Feature Flags
  features: {
    cronMonitoring: process.env.FEATURE_CRON_MONITORING !== 'false',
    pushgateway: process.env.FEATURE_PUSHGATEWAY !== 'false',
    statusPages: process.env.FEATURE_STATUS_PAGES !== 'false',
    incidentManagement: process.env.FEATURE_INCIDENT_MANAGEMENT !== 'false',
    sslMonitoring: process.env.FEATURE_SSL_MONITORING !== 'false',
    multiTenant: process.env.MULTI_TENANT_ENABLED === 'true',
  },

  // Backup
  backup: {
    enabled: process.env.AUTO_BACKUP_ENABLED === 'true',
    intervalHours: parseInt(process.env.BACKUP_INTERVAL_HOURS || '24', 10),
    retentionDays: parseInt(process.env.BACKUP_RETENTION_DAYS || '30', 10),
    path: process.env.BACKUP_PATH || '/backups',
  },
} as const;

/**
 * Validate critical configuration on startup
 */
export function validateConfig(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check Prometheus URL
  if (!config.prometheus.url) {
    errors.push('PROMETHEUS_URL is not configured');
  }

  // Validate URLs
  try {
    new URL(config.prometheus.url);
  } catch {
    errors.push('PROMETHEUS_URL is not a valid URL');
  }

  // Check session secret in production
  if (config.app.nodeEnv === 'production' && config.auth.sessionSecret === 'development-secret-change-in-production') {
    errors.push('SESSION_SECRET must be changed in production');
  }

  // Warn about default credentials in production
  if (config.app.nodeEnv === 'production' && config.auth.defaultPassword === 'admin123') {
    console.warn('⚠️  WARNING: Using default admin password in production. Please change immediately!');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Get configuration as JSON for debugging (sanitized)
 */
export function getConfigDebug() {
  return {
    app: config.app,
    prometheus: {
      url: config.prometheus.url,
      timeout: config.prometheus.timeout,
      hasAuth: !!(config.prometheus.auth.username && config.prometheus.auth.password),
    },
    blackbox: {
      url: config.blackbox.url,
    },
    features: config.features,
    monitoring: config.monitoring,
  };
}

export default config;

