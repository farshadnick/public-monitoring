# ✅ Scaling Configuration Complete

## What's Been Added

Your monitoring application now supports **full environment variable configuration** for easy scaling and deployment across different infrastructure setups.

---

## 🎯 Key Features

### 1. **Centralized Configuration** (`lib/config.ts`)
- Single source of truth for all configuration
- Type-safe configuration access
- Default values with environment override
- Configuration validation on startup

### 2. **Environment Template** (`env.template`)
- Complete template with all available variables
- Documented with examples
- Copy to `.env.local` or `.env.production`

### 3. **Updated Prometheus Integration** (`lib/prometheus-api.ts`)
- Uses centralized config
- Supports basic authentication
- Configurable timeouts
- Better error handling
- Connection retry logic

### 4. **Docker Compose Integration**
- All environment variables configurable
- Sensible defaults
- Easy override via `.env` file

---

## 🚀 Quick Start for Scaling

### Step 1: Configure Prometheus Address
```bash
# Create .env.local
cat > .env.local << EOF
PROMETHEUS_URL=http://your-prometheus-server:9090
BLACKBOX_EXPORTER_URL=http://your-blackbox-server:9115
EOF
```

### Step 2: Start Application
```bash
# Development
npm run dev

# Production
docker-compose up -d
```

### Step 3: Verify
```bash
# Check connectivity
curl http://localhost:3000/api/health/prometheus
```

---

## 📋 Common Scaling Scenarios

### Scenario 1: External Prometheus
```bash
# Your Prometheus is on a different server
PROMETHEUS_URL=http://10.0.1.100:9090
```

### Scenario 2: Cloud Deployment
```bash
# AWS
PROMETHEUS_URL=https://prometheus.your-alb.us-east-1.elb.amazonaws.com

# GCP
PROMETHEUS_URL=https://prometheus.your-project.run.app

# Azure
PROMETHEUS_URL=https://prometheus.azurewebsites.net
```

### Scenario 3: Kubernetes
```bash
# Use Kubernetes service discovery
PROMETHEUS_URL=http://prometheus-service.monitoring:9090
BLACKBOX_EXPORTER_URL=http://blackbox-service.monitoring:9115
```

### Scenario 4: High Availability
```bash
# Point to load balancer
PROMETHEUS_URL=http://prometheus-lb.internal:9090

# Or use Prometheus federation
PROMETHEUS_URL=http://prometheus-federation.internal:9090
```

---

## 🔧 Configuration Files Created

| File | Purpose |
|------|---------|
| `env.template` | Template with all variables and documentation |
| `lib/config.ts` | Centralized configuration management |
| `ENV_SETUP_GUIDE.md` | Step-by-step setup instructions |
| `DEPLOYMENT_GUIDE.md` | Complete deployment scenarios |
| Updated `docker-compose.yml` | Environment variable support |
| Updated `lib/prometheus-api.ts` | Uses config, adds auth support |

---

## 🎨 What You Can Configure

### Infrastructure
- ✅ Prometheus URL and authentication
- ✅ Blackbox Exporter URL
- ✅ Database connection
- ✅ Application URL

### Security
- ✅ Session secret
- ✅ Admin credentials
- ✅ API keys
- ✅ Prometheus authentication

### Monitoring
- ✅ Check intervals
- ✅ Timeout values
- ✅ Concurrent checks
- ✅ Metrics retention

### Features
- ✅ Enable/disable cron monitoring
- ✅ Enable/disable pushgateway
- ✅ Enable/disable status pages
- ✅ Enable/disable SSL monitoring

### Integrations
- ✅ Telegram bot configuration
- ✅ Slack webhooks
- ✅ Discord webhooks
- ✅ Email SMTP settings
- ✅ PagerDuty integration

---

## 📊 Example Configurations

### Development Setup
```bash
# .env.local
NODE_ENV=development
PROMETHEUS_URL=http://localhost:9090
BLACKBOX_EXPORTER_URL=http://localhost:9115
NEXT_PUBLIC_APP_URL=http://localhost:3000
LOG_LEVEL=debug
```

### Production Setup
```bash
# .env.production
NODE_ENV=production
PROMETHEUS_URL=http://prometheus.internal:9090
BLACKBOX_EXPORTER_URL=http://blackbox.internal:9115
NEXT_PUBLIC_APP_URL=https://monitoring.yourdomain.com

# Security (change these!)
SESSION_SECRET=your-generated-secret-here
DEFAULT_ADMIN_PASSWORD=secure-password-here
PROMETHEUS_AUTH_USERNAME=monitoring_user
PROMETHEUS_AUTH_PASSWORD=prometheus-password

# Database
DB_HOST=mysql.internal
DB_NAME=monitoring_prod
DB_USER=monitoring_user
DB_PASSWORD=secure-db-password

# Telegram Alerts
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
TELEGRAM_CHAT_ID=123456789

# Performance
CONCURRENT_CHECKS=20
PROMETHEUS_QUERY_TIMEOUT=60
```

### Kubernetes ConfigMap
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: monitoring-config
data:
  PROMETHEUS_URL: "http://prometheus-service.monitoring:9090"
  BLACKBOX_EXPORTER_URL: "http://blackbox-service.monitoring:9115"
  NEXT_PUBLIC_APP_URL: "https://monitoring.example.com"
  DEFAULT_CHECK_INTERVAL: "30"
  CONCURRENT_CHECKS: "20"
```

---

## ✨ New Capabilities

### Before (Hardcoded)
```typescript
// Old way
const PROMETHEUS_URL = 'http://localhost:9090';
```

### After (Configurable)
```typescript
// New way
import config from './config';
const prometheusUrl = config.prometheus.url; // From environment
```

### Benefits
- ✅ **No code changes** needed for different environments
- ✅ **Easy scaling** - just change environment variables
- ✅ **Secure** - credentials in environment, not code
- ✅ **Flexible** - supports any infrastructure setup
- ✅ **Validated** - configuration checked on startup
- ✅ **Documented** - all options in template with examples

---

## 🔍 Troubleshooting

### Check Current Configuration
```bash
# View loaded configuration (sanitized)
curl http://localhost:3000/api/config/debug
```

### Test Prometheus Connection
```bash
# From your server
curl $PROMETHEUS_URL/-/healthy

# With authentication
curl -u username:password $PROMETHEUS_URL/api/v1/query?query=up
```

### View Logs
```bash
# Docker
docker-compose logs web | grep -i config
docker-compose logs web | grep -i prometheus

# Check environment variables in container
docker-compose exec web env | grep PROMETHEUS
```

---

## 📚 Documentation

All documentation is ready:

1. **[env.template](./env.template)** - Copy this to get started
2. **[ENV_SETUP_GUIDE.md](./ENV_SETUP_GUIDE.md)** - Quick start guide
3. **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Complete deployment scenarios
4. **[FEATURES_SUMMARY.md](./FEATURES_SUMMARY.md)** - All features explained

---

## ✅ Production Checklist

Before deploying to production:

- [ ] Copy `env.template` to `.env.production`
- [ ] Set your `PROMETHEUS_URL`
- [ ] Set your `BLACKBOX_EXPORTER_URL`
- [ ] Generate and set `SESSION_SECRET`
- [ ] Change `DEFAULT_ADMIN_PASSWORD`
- [ ] Configure database credentials
- [ ] Set up Telegram bot for alerts
- [ ] Test Prometheus connectivity
- [ ] Verify monitoring works
- [ ] Set up backups
- [ ] Configure log level

---

## 🚀 Next Steps

1. **Copy the template**:
   ```bash
   cp env.template .env.local
   ```

2. **Edit with your Prometheus URL**:
   ```bash
   nano .env.local
   # Set PROMETHEUS_URL to your server
   ```

3. **Start the application**:
   ```bash
   docker-compose up -d
   ```

4. **Verify it works**:
   ```bash
   # Check app is running
   curl http://localhost:3000/
   
   # Check Prometheus connectivity
   docker-compose logs web | grep -i prometheus
   ```

---

## 💡 Pro Tips

1. **Use `.env.local` for development** - not tracked in git
2. **Use `.env.production` for production** - deploy securely
3. **Never commit `.env` files** - add to `.gitignore`
4. **Use secrets management** in production (Vault, AWS Secrets, etc.)
5. **Test config changes** in dev before production
6. **Document custom settings** for your team
7. **Monitor the monitor** - set up alerts for the monitoring system

---

## 🎉 Summary

Your application is now **production-ready** and can scale across:
- ✅ Single server setups
- ✅ Multi-server deployments
- ✅ Docker Swarm
- ✅ Kubernetes clusters
- ✅ Cloud providers (AWS/GCP/Azure)
- ✅ Hybrid cloud
- ✅ Multi-region deployments

Just set the `PROMETHEUS_URL` environment variable and you're good to go! 🚀

---

**Questions?**
- Check `ENV_SETUP_GUIDE.md` for setup instructions
- See `DEPLOYMENT_GUIDE.md` for deployment scenarios
- View logs: `docker-compose logs web`

