# 🚀 Environment Setup & Scaling Guide

## Quick Start

### 1. Create Environment File
```bash
# Copy template
cp env.template .env.local

# Edit with your settings
nano .env.local
```

### 2. Configure Prometheus URL
```bash
# For local development
PROMETHEUS_URL=http://localhost:9090
BLACKBOX_EXPORTER_URL=http://localhost:9115

# For Docker Compose
PROMETHEUS_URL=http://prometheus:9090
BLACKBOX_EXPORTER_URL=http://blackbox:9115

# For external Prometheus server
PROMETHEUS_URL=http://10.0.1.50:9090
BLACKBOX_EXPORTER_URL=http://10.0.1.51:9115

# For Kubernetes/Cloud
PROMETHEUS_URL=http://prometheus-service.monitoring.svc.cluster.local:9090
```

### 3. Start Application
```bash
# Development
npm run dev

# Production with Docker
docker-compose up -d
```

---

## 📋 Essential Configuration

### Minimum Required
```bash
# Only these 2 are required for basic operation
PROMETHEUS_URL=http://your-prometheus:9090
BLACKBOX_EXPORTER_URL=http://your-blackbox:9115
```

### Recommended for Production
```bash
# Prometheus
PROMETHEUS_URL=http://prometheus:9090
PROMETHEUS_AUTH_USERNAME=admin
PROMETHEUS_AUTH_PASSWORD=secure-password

# Security
SESSION_SECRET=$(openssl rand -base64 32)
DEFAULT_ADMIN_PASSWORD=change-this-now

# Application
NEXT_PUBLIC_APP_URL=https://monitoring.yourdomain.com
```

---

## 🔧 Common Scenarios

### Scenario 1: Separate Prometheus Server
Your Prometheus is on a different machine:

```bash
# In .env.local
PROMETHEUS_URL=http://192.168.1.100:9090
BLACKBOX_EXPORTER_URL=http://192.168.1.100:9115

# Or with domain
PROMETHEUS_URL=http://prometheus.internal.company.com:9090
```

### Scenario 2: Secured Prometheus
Your Prometheus has authentication:

```bash
PROMETHEUS_URL=https://prometheus.company.com:9090
PROMETHEUS_AUTH_USERNAME=monitoring_user
PROMETHEUS_AUTH_PASSWORD=your_secure_password
PROMETHEUS_QUERY_TIMEOUT=60
```

### Scenario 3: Kubernetes Deployment
Running in Kubernetes cluster:

```bash
# Use Kubernetes service names
PROMETHEUS_URL=http://prometheus-service.monitoring:9090
BLACKBOX_EXPORTER_URL=http://blackbox-service.monitoring:9115

# Or with full DNS
PROMETHEUS_URL=http://prometheus-service.monitoring.svc.cluster.local:9090
```

### Scenario 4: Cloud Provider (AWS/GCP/Azure)
Using managed Prometheus or running on cloud:

```bash
# AWS with ALB
PROMETHEUS_URL=https://prometheus.your-alb.us-east-1.elb.amazonaws.com

# GCP
PROMETHEUS_URL=https://prometheus.your-project.run.app

# Azure
PROMETHEUS_URL=https://prometheus.azurewebsites.net
```

---

## 🐳 Docker Compose Usage

### Option 1: Use .env File (Recommended)
```bash
# Create .env file in project root
cat > .env << EOF
PROMETHEUS_URL=http://prometheus:9090
BLACKBOX_EXPORTER_URL=http://blackbox:9115
SESSION_SECRET=$(openssl rand -base64 32)
TELEGRAM_BOT_TOKEN=your-bot-token
EOF

# Start with .env
docker-compose up -d
```

### Option 2: Inline Environment Variables
```bash
# Set variables inline
PROMETHEUS_URL=http://custom-prometheus:9090 docker-compose up -d
```

### Option 3: Custom Environment File
```bash
# Use different env file
docker-compose --env-file .env.production up -d
```

---

## ⚙️ Configuration Priority

The application loads configuration in this order (higher priority first):

1. **Environment Variables** (`.env.local`, `.env.production`)
2. **Docker Compose** environment section
3. **Default Values** (in `lib/config.ts`)

Example:
```bash
# .env.local
PROMETHEUS_URL=http://localhost:9090

# docker-compose.yml
environment:
  - PROMETHEUS_URL=http://prometheus:9090  # This overrides .env.local

# Runtime
docker-compose up -d  # Uses http://prometheus:9090
```

---

## 🔍 Verify Configuration

### Check Current Config
```bash
# View configuration (API endpoint)
curl http://localhost:3000/api/config/debug

# Check Prometheus connectivity
curl http://localhost:3000/api/health/prometheus
```

### Test Prometheus Connection
```bash
# From your app server
curl $PROMETHEUS_URL/api/v1/status/config

# With authentication
curl -u username:password $PROMETHEUS_URL/api/v1/query?query=up
```

### View Logs
```bash
# Docker logs
docker-compose logs web

# Check for configuration errors
docker-compose logs web | grep -i config
docker-compose logs web | grep -i prometheus
```

---

## 🛠️ Troubleshooting

### Problem: "Cannot connect to Prometheus"

**Solution 1**: Check URL is accessible
```bash
# From app container
docker-compose exec web curl $PROMETHEUS_URL/api/v1/status/config
```

**Solution 2**: Check network connectivity
```bash
# Ping Prometheus from app container
docker-compose exec web ping prometheus

# Check DNS resolution
docker-compose exec web nslookup prometheus
```

**Solution 3**: Verify Prometheus is running
```bash
docker-compose ps prometheus
curl http://localhost:9090/-/healthy
```

### Problem: "Authentication failed"

Check credentials:
```bash
# Test with curl
curl -u $PROMETHEUS_AUTH_USERNAME:$PROMETHEUS_AUTH_PASSWORD \
  $PROMETHEUS_URL/api/v1/query?query=up
```

### Problem: "Query timeout"

Increase timeout:
```bash
# In .env
PROMETHEUS_QUERY_TIMEOUT=60  # seconds
```

### Problem: "Environment variables not loading"

**Check 1**: Restart services
```bash
docker-compose down
docker-compose up -d
```

**Check 2**: Verify .env file location
```bash
# Should be in project root, same level as docker-compose.yml
ls -la .env.local
```

**Check 3**: Check for syntax errors
```bash
# No spaces around =
# Correct:
PROMETHEUS_URL=http://localhost:9090

# Incorrect:
PROMETHEUS_URL = http://localhost:9090
```

---

## 📊 Performance Tuning

### For Small Setup (< 50 monitors)
```bash
CONCURRENT_CHECKS=5
PROMETHEUS_QUERY_TIMEOUT=10
MAX_MONITORS_PER_USER=50
```

### For Medium Setup (50-200 monitors)
```bash
CONCURRENT_CHECKS=10
PROMETHEUS_QUERY_TIMEOUT=30
MAX_MONITORS_PER_USER=200
```

### For Large Setup (200+ monitors)
```bash
CONCURRENT_CHECKS=20
PROMETHEUS_QUERY_TIMEOUT=60
MAX_MONITORS_PER_USER=1000

# Consider multiple Prometheus instances with load balancing
```

---

## 🔐 Security Best Practices

### 1. Secure Passwords
```bash
# Generate strong session secret
SESSION_SECRET=$(openssl rand -base64 32)

# Change default admin password
DEFAULT_ADMIN_PASSWORD=$(openssl rand -base64 16)
```

### 2. Use HTTPS
```bash
# Always use HTTPS in production
NEXT_PUBLIC_APP_URL=https://monitoring.yourdomain.com
PROMETHEUS_URL=https://prometheus.yourdomain.com:9090
```

### 3. Restrict Access
```bash
# Add Prometheus authentication
PROMETHEUS_AUTH_USERNAME=monitoring_service
PROMETHEUS_AUTH_PASSWORD=secure_generated_password
```

### 4. Secure .env Files
```bash
# Never commit .env files
echo ".env.local" >> .gitignore
echo ".env.production" >> .gitignore

# Set proper permissions
chmod 600 .env.local
```

---

## 📦 Production Checklist

Before going to production, ensure:

- [ ] Changed `SESSION_SECRET` from default
- [ ] Changed `DEFAULT_ADMIN_PASSWORD` from default
- [ ] Set correct `PROMETHEUS_URL` for your environment
- [ ] Set correct `NEXT_PUBLIC_APP_URL`
- [ ] Configured `PROMETHEUS_AUTH_*` if Prometheus is secured
- [ ] Set up `TELEGRAM_BOT_TOKEN` for alerts
- [ ] Configured database credentials (not defaults)
- [ ] Set `NODE_ENV=production`
- [ ] Enabled HTTPS/TLS
- [ ] Set up backups (`AUTO_BACKUP_ENABLED=true`)
- [ ] Configured log level appropriately
- [ ] Tested Prometheus connectivity
- [ ] Verified monitoring works end-to-end

---

## 🚦 Quick Commands

```bash
# Create .env from template
cp env.template .env.local

# Generate secure random string
openssl rand -base64 32

# Test Prometheus connection
curl $(grep PROMETHEUS_URL .env.local | cut -d'=' -f2)/api/v1/status/config

# Start with custom env
docker-compose --env-file .env.production up -d

# View environment in container
docker-compose exec web env | grep PROMETHEUS

# Restart after config change
docker-compose restart web

# View logs
docker-compose logs -f web
```

---

## 📚 Related Documentation

- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Complete deployment scenarios
- [FEATURES_SUMMARY.md](./FEATURES_SUMMARY.md) - All features and how to use them
- [env.template](./env.template) - Template with all available variables

---

## 💡 Tips

1. **Use descriptive service names** in your URLs
2. **Keep .env files out of version control**
3. **Use different .env files** for dev/staging/prod
4. **Test configuration changes** in development first
5. **Monitor the monitor** - set up alerts for the monitoring system itself
6. **Document custom settings** for your team
7. **Use configuration management** tools (Vault, AWS Secrets Manager) for sensitive data

---

**Need Help?**
- Check logs: `docker-compose logs web`
- Validate config: API at `/api/config/debug`
- Test connectivity: `curl $PROMETHEUS_URL/-/healthy`

**Last Updated**: November 19, 2025

