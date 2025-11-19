# URL Monitoring Dashboard

A modern web application for monitoring website availability using Prometheus and Blackbox Exporter.

## Features

- 🌐 Add and manage URLs to monitor
- ⚙️ Automatic Prometheus and Blackbox Exporter configuration generation
- 📊 Beautiful, modern UI with real-time updates
- 🐳 Docker Compose setup for easy deployment
- 📈 Integration with Grafana for advanced visualization
- ⏱️ Customizable check intervals per URL

## Quick Start

### Option 1: Run Everything with Docker (Recommended for Production)

**One command to start everything:**

```bash
docker-compose up -d
```

This will start all services:
- **Web Dashboard** on http://localhost:3000
- **Prometheus** on http://localhost:9090
- **Blackbox Exporter** on http://localhost:9115
- **Grafana** on http://localhost:3001 (default credentials: admin/admin)

**That's it!** Open http://localhost:3000 and start adding URLs to monitor.

### Option 2: Run Web App Locally (For Development)

If you want to develop or run the web app locally:

```bash
# Install dependencies
npm install

# Start the web application
npm run dev

# In another terminal, start monitoring services
docker-compose up -d prometheus blackbox grafana
```

### Usage

1. Open [http://localhost:3000](http://localhost:3000) in your browser
2. Click "Add New URL" button
3. Enter the website URL (e.g., https://example.com)
4. Give it a display name and choose a check interval
5. Click "Add URL"
6. Download the updated configuration files (automatic in Docker setup)
7. Restart Prometheus to pick up changes: `docker-compose restart prometheus`

### 6. View Metrics

Access Prometheus at http://localhost:9090 and run queries like:

```promql
# Check if websites are up (1 = up, 0 = down)
probe_success

# Response time in seconds
probe_duration_seconds

# HTTP status code
probe_http_status_code
```

## Prometheus Queries Examples

Here are some useful queries you can run in Prometheus:

```promql
# Website uptime percentage (last hour)
avg_over_time(probe_success[1h]) * 100

# Average response time
avg(probe_duration_seconds)

# List of down websites
probe_success == 0

# SSL certificate expiry (in days)
(probe_ssl_earliest_cert_expiry - time()) / 86400
```

## Grafana Dashboard

1. Access Grafana at http://localhost:3001
2. Login with admin/admin
3. Add Prometheus as a data source:
   - URL: http://prometheus:9090
   - Access: Server (default)
4. Create a new dashboard or import a Blackbox Exporter dashboard (ID: 7587)

## Project Structure

```
.
├── app/
│   ├── api/
│   │   ├── urls/           # URL management endpoints
│   │   └── config/         # Configuration download endpoints
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx            # Main UI
├── lib/
│   ├── storage.ts          # URL storage management
│   └── prometheus.ts       # Config generation
├── types/
│   └── index.ts            # TypeScript types
├── data/                   # URL storage (auto-generated)
├── prometheus-config/      # Generated configs (auto-generated)
├── docker-compose.yml
└── package.json
```

## API Endpoints

- `GET /api/urls` - Get all monitored URLs
- `POST /api/urls` - Add a new URL
- `DELETE /api/urls/[id]` - Delete a URL
- `PATCH /api/urls/[id]` - Update a URL
- `GET /api/config/prometheus` - Download Prometheus config
- `GET /api/config/blackbox` - Download Blackbox config

## Configuration

### Prometheus

The application automatically generates a Prometheus configuration file that includes:
- Self-scraping for Prometheus metrics
- Blackbox Exporter integration
- Individual jobs for each monitored URL with custom intervals

### Blackbox Exporter

The Blackbox configuration includes multiple modules:
- `http_2xx` - HTTP probe accepting 2xx status codes
- `http_post_2xx` - POST request probe
- `tcp_connect` - TCP connection probe
- `icmp` - ICMP (ping) probe

## Customization

### Change Check Intervals

Edit the URL in the web interface or modify the `interval` field when adding URLs:
- `15s` - Every 15 seconds
- `30s` - Every 30 seconds
- `1m` - Every minute
- `5m` - Every 5 minutes
- `15m` - Every 15 minutes

### Modify Blackbox Modules

Edit `lib/prometheus.ts` to customize the Blackbox Exporter modules with different probing options.

## Troubleshooting

### URLs not being probed

1. Make sure you've added URLs in the web interface (http://localhost:3000)
2. The configuration is automatically updated
3. Restart Prometheus: `docker-compose restart prometheus`

### Can't connect to the Web Dashboard

1. Check if containers are running: `docker-compose ps`
2. View logs: `docker-compose logs web`
3. Ensure port 3000 is not in use: `lsof -i :3000`

### Can't connect to Prometheus

1. Check if containers are running: `docker-compose ps`
2. View logs: `docker-compose logs prometheus`
3. Ensure port 9090 is not in use by another service

### Configuration not updating in Prometheus

1. Configurations are automatically generated when you add/remove URLs
2. Restart Prometheus to reload config: `docker-compose restart prometheus`
3. Check config files: `cat prometheus-config/prometheus.yml`

### Build errors

If you get build errors:
```bash
# Clean everything and rebuild
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

## Production Deployment

For production use:

1. **Secure Grafana**: Change the default admin password
2. **Persistent Storage**: The docker-compose file already includes volumes for data persistence
3. **Reverse Proxy**: Consider using Nginx or Traefik in front of the services
4. **SSL/TLS**: Enable HTTPS for the web interface
5. **Authentication**: Add authentication middleware to the Next.js app

## Technologies Used

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Prometheus** - Metrics collection and alerting
- **Blackbox Exporter** - HTTP/HTTPS/TCP/ICMP probing
- **Grafana** - Visualization and dashboards
- **Docker & Docker Compose** - Containerization

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

