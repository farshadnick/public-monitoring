import { MonitoredURL, PrometheusConfig, BlackboxConfig } from '@/types';
import { promises as fs } from 'fs';
import path from 'path';
import YAML from 'yaml';

const CONFIG_DIR = path.join(process.cwd(), 'prometheus-config');
const PROMETHEUS_CONFIG = path.join(CONFIG_DIR, 'prometheus.yml');
const BLACKBOX_CONFIG = path.join(CONFIG_DIR, 'blackbox.yml');

async function ensureConfigDir() {
  try {
    await fs.mkdir(CONFIG_DIR, { recursive: true });
  } catch (error) {
    // Directory already exists
  }
}

export async function generatePrometheusConfig(urls: MonitoredURL[]): Promise<string> {
  await ensureConfigDir();

  const config: any = {
    global: {
      scrape_interval: '15s',
      evaluation_interval: '15s',
    },
    scrape_configs: [
      {
        job_name: 'prometheus',
        static_configs: [
          {
            targets: ['localhost:9090'],
          },
        ],
      },
    ],
  };

  // Add individual jobs for each URL with custom intervals
  urls.forEach(url => {
    config.scrape_configs.push({
      job_name: `${url.name.replace(/[^a-zA-Z0-9]/g, '_')}`,
      metrics_path: '/probe',
      params: {
        module: ['http_2xx'],
      },
      scrape_interval: url.interval || '30s',
      static_configs: [
        {
          targets: [url.url],
        },
      ],
      relabel_configs: [
        {
          source_labels: ['__address__'],
          target_label: '__param_target',
        },
        {
          source_labels: ['__param_target'],
          target_label: 'instance',
        },
        {
          target_label: '__address__',
          replacement: 'blackbox:9115',
        },
      ],
    });
  });

  const yamlContent = YAML.stringify(config);
  await fs.writeFile(PROMETHEUS_CONFIG, yamlContent);
  return yamlContent;
}

export async function generateBlackboxConfig(): Promise<string> {
  await ensureConfigDir();

  const config: any = {
    modules: {
      http_2xx: {
        prober: 'http',
        timeout: '10s',
        http: {
          valid_http_versions: ['HTTP/1.1', 'HTTP/2.0'],
          valid_status_codes: [200, 201, 202, 203, 204, 205, 206, 301, 302, 303, 307, 308],
          method: 'GET',
          preferred_ip_protocol: 'ip4',
          follow_redirects: true,
          fail_if_ssl: false,
          fail_if_not_ssl: false,
        },
      },
      http_post_2xx: {
        prober: 'http',
        timeout: '5s',
        http: {
          valid_http_versions: ['HTTP/1.1', 'HTTP/2.0'],
          valid_status_codes: [200, 201, 202, 203, 204, 205, 206],
          method: 'POST',
          preferred_ip_protocol: 'ip4',
        },
      },
      tcp_connect: {
        prober: 'tcp',
        timeout: '5s',
      },
      icmp: {
        prober: 'icmp',
        timeout: '5s',
      },
    },
  };

  const yamlContent = YAML.stringify(config);
  await fs.writeFile(BLACKBOX_CONFIG, yamlContent);
  return yamlContent;
}

export async function getPrometheusConfig(): Promise<string> {
  try {
    return await fs.readFile(PROMETHEUS_CONFIG, 'utf-8');
  } catch (error) {
    return '';
  }
}

export async function getBlackboxConfig(): Promise<string> {
  try {
    return await fs.readFile(BLACKBOX_CONFIG, 'utf-8');
  } catch (error) {
    return '';
  }
}

