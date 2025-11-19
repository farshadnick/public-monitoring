# Quick Start Guide

Get your URL monitoring system up and running in 5 minutes!

## Step 1: Install Dependencies

```bash
npm install
# or use the setup script
chmod +x scripts/setup.sh
./scripts/setup.sh
```

## Step 2: Start the Web Application

```bash
npm run dev
```

Open your browser to [http://localhost:3000](http://localhost:3000)

## Step 3: Add Your First URL

1. Click the **"+ Add New URL"** button
2. Fill in the form:
   - **Website URL**: `https://google.com`
   - **Display Name**: `Google`
   - **Check Interval**: `30s`
3. Click **"Add URL"**

## Step 4: Restart Prometheus (Important!)

After adding URLs, restart Prometheus to load the new configuration:

```bash
docker-compose restart prometheus
```

The web app automatically updates the config files when you add/remove URLs.

## Step 5: View Your Metrics

### Prometheus
Visit [http://localhost:9090](http://localhost:9090)

Try these queries:
```promql
# Check if website is up (1 = up, 0 = down)
probe_success

# Response time
probe_duration_seconds

# HTTP status code
probe_http_status_code
```

### Grafana (Optional)
Visit [http://localhost:3001](http://localhost:3001)
- Username: `admin`
- Password: `admin`

## Troubleshooting

**Problem: "No targets" in Prometheus**
- Make sure you've added URLs in the web interface
- Download the configuration files again
- Restart Prometheus: `docker-compose restart prometheus`

**Problem: Can't access Prometheus**
- Check if containers are running: `docker-compose ps`
- View logs: `docker-compose logs prometheus`

**Problem: URLs showing as down**
- Check if the URLs are accessible from your machine
- Try pinging them manually
- Check Blackbox Exporter logs: `docker-compose logs blackbox`

## Next Steps

- Add more URLs to monitor
- Set up custom check intervals for different URLs
- Create Grafana dashboards for visualization
- Set up alerting rules in Prometheus

## Common Prometheus Queries

```promql
# Websites that are down
probe_success == 0

# Average response time
avg(probe_duration_seconds)

# 95th percentile response time
histogram_quantile(0.95, probe_duration_seconds)

# SSL certificate expiry (days remaining)
(probe_ssl_earliest_cert_expiry - time()) / 86400

# Uptime percentage (last 24 hours)
avg_over_time(probe_success[24h]) * 100
```

## Architecture

```
┌─────────────┐
│   Web App   │ ← You add URLs here
│ (Next.js)   │
└──────┬──────┘
       │ generates
       ↓
┌─────────────────┐
│ Config Files    │
│ - prometheus.yml│
│ - blackbox.yml  │
└──────┬──────────┘
       │ used by
       ↓
┌─────────────┐      ┌──────────────┐
│ Prometheus  │─────→│   Blackbox   │
│             │      │   Exporter   │
└──────┬──────┘      └──────┬───────┘
       │                    │
       │                    │ probes
       ↓                    ↓
   ┌───────┐         ┌──────────────┐
   │Grafana│         │Your Websites │
   └───────┘         └──────────────┘
```

Enjoy monitoring! 🚀

