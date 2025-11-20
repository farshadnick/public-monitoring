# ✅ Watcher - Scaling Configuration Complete

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
- Copy to `.env` or `.env.local`

### 3. **Updated Backend Integration** (`lib/prometheus-api.ts`)
- Uses centralized config
- Supports authentication
- Configurable timeouts
- Better error handling
- Connection retry logic

### 4. **Docker Compose Integration**
- All environment variables configurable
- Sensible defaults
- Easy override via `.env` file

---

## 🚀 Quick Start for Scaling

### Step 1: Configure Backend Services
```bash
# Create .env file
cat > .env << EOF
# Backend service addresses
PROMETHEUS_URL=http://monitoring-backend:9090
BLACKBOX_EXPORTER_URL=http://monitoring-probe:9115

# Database
DB_HOST=database-server
DB_PASSWORD=secure_password

# Authentication
SESSION_SECRET=$(openssl rand -hex 32)
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
# Check application health
curl http://localhost:3000/

# Check backend connectivity
docker-compose logs web
```

---

## 📋 Common Scaling Scenarios

### Scenario 1: External Backend Services
```bash
# Backend services on different servers
PROMETHEUS_URL=http://10.0.1.100:9090
BLACKBOX_EXPORTER_URL=http://10.0.1.101:9115
```

### Scenario 2: Cloud Deployment
```bash
# AWS
PROMETHEUS_URL=https://monitoring-backend.us-east-1.elb.amazonaws.com
DB_HOST=mydb.abc123.us-east-1.rds.amazonaws.com

# GCP
PROMETHEUS_URL=https://monitoring-backend.run.app
DB_HOST=10.0.0.10

# Azure
PROMETHEUS_URL=https://monitoring-backend.azurewebsites.net
DB_HOST=myserver.mysql.database.azure.com
```

### Scenario 3: Kubernetes
```bash
# Use Kubernetes service DNS
PROMETHEUS_URL=http://prometheus-service.monitoring.svc.cluster.local:9090
BLACKBOX_EXPORTER_URL=http://blackbox-service.monitoring.svc.cluster.local:9115
DB_HOST=mysql-service.database.svc.cluster.local

# With authentication
PROMETHEUS_AUTH_USERNAME=admin
PROMETHEUS_AUTH_PASSWORD=$(kubectl get secret prometheus-auth -o jsonpath='{.data.password}' | base64 -d)
```

### Scenario 4: Multi-Region Deployment
```bash
# US Region
PROMETHEUS_URL=http://monitoring-us.internal:9090
NEXT_PUBLIC_APP_URL=https://monitoring-us.yourdomain.com

# EU Region
PROMETHEUS_URL=http://monitoring-eu.internal:9090
NEXT_PUBLIC_APP_URL=https://monitoring-eu.yourdomain.com
```

### Scenario 5: High Availability
```bash
# Use load balancer
PROMETHEUS_URL=http://prometheus-lb.internal:9090
DB_HOST=mysql-cluster-vip.internal
CONCURRENT_CHECKS=20
```

---

## 📊 Configuration Variables

### Application
```bash
NODE_ENV=production                    # Environment
APP_PORT=3000                         # Web server port
NEXT_PUBLIC_APP_URL=https://your.domain   # Public URL
```

### Backend Services
```bash
PROMETHEUS_URL=http://backend:9090    # Backend service URL
BLACKBOX_EXPORTER_URL=http://probe:9115   # Probe service URL
PROMETHEUS_QUERY_TIMEOUT=30           # Query timeout (seconds)
PROMETHEUS_AUTH_USERNAME=admin        # Optional authentication
PROMETHEUS_AUTH_PASSWORD=secret       # Optional password
```

### Database
```bash
DB_HOST=mysql                         # Database host
DB_PORT=3306                         # Database port
DB_NAME=monitoring                   # Database name
DB_USER=monitoring                   # Database user
DB_PASSWORD=secure_password          # Database password
```

### Authentication
```bash
SESSION_SECRET=random_32_char_string  # Session encryption key
DEFAULT_ADMIN_USERNAME=admin         # Default admin user
DEFAULT_ADMIN_PASSWORD=admin123      # Default admin password (change!)
```

### Telegram Notifications
```bash
TELEGRAM_BOT_TOKEN=123456:ABC-DEF    # Bot token from @BotFather
TELEGRAM_CHAT_ID=123456789           # Your chat ID
```

### Monitoring Settings
```bash
DEFAULT_CHECK_INTERVAL=30            # Default check interval (seconds)
DEFAULT_HTTP_TIMEOUT=10              # HTTP timeout (seconds)
CONCURRENT_CHECKS=10                 # Max concurrent checks
MAX_RETRY_ATTEMPTS=3                 # Retry failed checks
```

### Feature Toggles
```bash
FEATURE_CRON_MONITORING=true         # Enable cron monitoring
FEATURE_PUSHGATEWAY=true             # Enable metrics gateway
FEATURE_STATUS_PAGES=true            # Enable status pages
FEATURE_TELEGRAM_ALERTS=true         # Enable Telegram
```

### Logging
```bash
LOG_LEVEL=info                       # Log level (error, warn, info, debug)
LOG_FORMAT=json                      # Log format (json, pretty)
```

---

## 🏗️ Deployment Architectures

### 1. Single Server (Simple)
```
┌─────────────────────────────────┐
│       Single Server             │
│  ┌──────────┐  ┌──────────┐   │
│  │   Web    │  │ Database │   │
│  │   App    │  │          │   │
│  └──────────┘  └──────────┘   │
│  ┌──────────┐  ┌──────────┐   │
│  │ Backend  │  │  Probe   │   │
│  │ Service  │  │  Service │   │
│  └──────────┘  └──────────┘   │
└─────────────────────────────────┘
```

**Config**:
```bash
# Use container names (Docker Compose)
PROMETHEUS_URL=http://prometheus:9090
DB_HOST=mysql
```

### 2. Separated Services (Medium Scale)
```
┌──────────┐    ┌──────────────┐    ┌──────────┐
│   Web    │───→│   Backend    │    │ Database │
│   App    │    │   Services   │    │  Server  │
└──────────┘    └──────────────┘    └──────────┘
   :3000             :9090/:9115         :3306
```

**Config**:
```bash
# Use IP addresses or hostnames
PROMETHEUS_URL=http://10.0.1.10:9090
DB_HOST=10.0.1.20
```

### 3. Cloud/Kubernetes (Enterprise)
```
┌──────────────┐    ┌──────────────┐
│ Load Balancer│───→│  Web Apps    │
│              │    │  (3 replicas)│
└──────────────┘    └───────┬──────┘
                            │
                    ┌───────┴──────┐
                    │   Services   │
                    │   Cluster    │
                    └───────┬──────┘
                            │
                    ┌───────┴──────┐
                    │  Managed DB  │
                    └──────────────┘
```

**Config**:
```bash
# Use Kubernetes service DNS
PROMETHEUS_URL=http://backend.monitoring.svc.cluster.local:9090
DB_HOST=mysql-service.database.svc.cluster.local
```

---

## 🔧 Performance Tuning

### Light Usage (< 20 monitors)
```bash
DEFAULT_CHECK_INTERVAL=60
CONCURRENT_CHECKS=5
DB_CONNECTION_LIMIT=5
PROMETHEUS_QUERY_TIMEOUT=30
```

### Medium Usage (20-100 monitors)
```bash
DEFAULT_CHECK_INTERVAL=30
CONCURRENT_CHECKS=10
DB_CONNECTION_LIMIT=10
PROMETHEUS_QUERY_TIMEOUT=45
```

### Heavy Usage (100+ monitors)
```bash
DEFAULT_CHECK_INTERVAL=60
CONCURRENT_CHECKS=20
DB_CONNECTION_LIMIT=20
PROMETHEUS_QUERY_TIMEOUT=60
```

### Ultra Scale (500+ monitors)
```bash
DEFAULT_CHECK_INTERVAL=120
CONCURRENT_CHECKS=50
DB_CONNECTION_LIMIT=50
PROMETHEUS_QUERY_TIMEOUT=90

# Deploy multiple web instances
# Use load balancer
# Implement caching
```

---

## 🔐 Security Best Practices

### 1. Secrets Management
```bash
# Use secret management tools
# AWS Secrets Manager
SESSION_SECRET=$(aws secretsmanager get-secret-value --secret-id session-secret --query SecretString --output text)

# HashiCorp Vault
SESSION_SECRET=$(vault kv get -field=secret secret/monitoring/session)

# Kubernetes Secrets
SESSION_SECRET=$(kubectl get secret monitoring-secrets -o jsonpath='{.data.session}' | base64 -d)
```

### 2. Network Security
```bash
# Restrict backend access
# Use private networks
PROMETHEUS_URL=http://10.0.1.10:9090  # Private IP
DB_HOST=10.0.2.10                     # Private IP

# Use VPN or service mesh
# Implement network policies
```

### 3. Authentication
```bash
# Enable backend authentication
PROMETHEUS_AUTH_USERNAME=monitoring-app
PROMETHEUS_AUTH_PASSWORD=complex_password

# Use strong passwords
# Rotate credentials regularly
```

---

## 📈 Monitoring the Monitor

### Health Checks
```bash
# Application health
curl http://localhost:3000/

# Check logs
docker-compose logs -f web

# Resource usage
docker stats
```

### Metrics to Monitor
- Response times
- Error rates
- Database connections
- Memory usage
- CPU usage
- Check queue length
- Alert delivery rate

---

## 🆘 Troubleshooting

### Connection Issues
```bash
# Test backend connectivity
curl -I http://your-backend:9090

# Test from container
docker exec web curl -I http://prometheus:9090

# Check DNS resolution
docker exec web nslookup prometheus
```

### Configuration Issues
```bash
# Verify environment variables
docker exec web env | grep PROMETHEUS

# Check config loading
docker-compose config

# Review logs
docker-compose logs web | grep -i error
```

### Performance Issues
```bash
# Increase timeouts
PROMETHEUS_QUERY_TIMEOUT=60
DEFAULT_HTTP_TIMEOUT=20

# Reduce load
DEFAULT_CHECK_INTERVAL=120
CONCURRENT_CHECKS=5

# Scale horizontally
# Deploy multiple instances
```

---

## 📚 Additional Resources

- **env.template** - Complete variable reference
- **DEPLOYMENT_GUIDE.md** - Deployment strategies
- **ENV_SETUP_GUIDE.md** - Configuration details
- **README.md** - Project overview

---

## ✅ Pre-Deployment Checklist

- [ ] Environment variables configured
- [ ] Backend services accessible
- [ ] Database connection tested
- [ ] Strong SESSION_SECRET set
- [ ] Default passwords changed
- [ ] Telegram configured (if using)
- [ ] Logging configured
- [ ] Performance tuned for load
- [ ] Security hardened
- [ ] Backups configured
- [ ] Monitoring setup
- [ ] Documentation updated

---

**Watcher** is now ready to scale from a single server to enterprise deployment! 🚀

Choose your deployment architecture, configure your environment variables, and you're good to go!
