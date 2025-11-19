#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const YAML = require('yaml');

const configDir = path.join(process.cwd(), 'prometheus-config');

// Create config directory
if (!fs.existsSync(configDir)) {
  fs.mkdirSync(configDir, { recursive: true });
  console.log('✓ Created prometheus-config directory');
}

// Initial Prometheus config
const prometheusConfig = {
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

// Initial Blackbox config
const blackboxConfig = {
  modules: {
    http_2xx: {
      prober: 'http',
      timeout: '5s',
      http: {
        valid_http_versions: ['HTTP/1.1', 'HTTP/2.0'],
        valid_status_codes: [200, 201, 202, 203, 204, 205, 206],
        method: 'GET',
        preferred_ip_protocol: 'ip4',
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

// Write config files
try {
  fs.writeFileSync(
    path.join(configDir, 'prometheus.yml'),
    YAML.stringify(prometheusConfig)
  );
  console.log('✓ Created prometheus.yml');

  fs.writeFileSync(
    path.join(configDir, 'blackbox.yml'),
    YAML.stringify(blackboxConfig)
  );
  console.log('✓ Created blackbox.yml');

  console.log('\n🎉 Configuration files initialized successfully!');
  console.log('\nYou can now start the monitoring stack:');
  console.log('  docker-compose up -d');
  console.log('\nAdd URLs in the web interface to start monitoring.');
} catch (error) {
  console.error('❌ Error creating config files:', error.message);
  process.exit(1);
}

