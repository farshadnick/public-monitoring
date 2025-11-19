# Deployment & Scaling Guide

## 🚀 Environment Configuration

### Quick Setup

1. **Copy the environment template**:
```bash
cp env.template .env.local
```

2. **Configure Prometheus address**:
```bash
# Edit .env.local
PROMETHEUS_URL=http://your-prometheus-server:9090
BLACKBOX_EXPORTER_URL=http://your-blackbox-exporter:9115
```

3. **Start the application**:
```bash
npm run dev
# or for production:
npm run build && npm start
```

---

## 📋 Environment Variables

### Critical Configuration

#### Prometheus Settings
```bash
# Required: Prometheus server address
PROMETHEUS_URL=http://prometheus:9090

# Optional: Query timeout (seconds)
PROMETHEUS_QUERY_TIMEOUT=30

# Optional: Basic authentication
PROMETHEUS_AUTH_USERNAME=admin
PROMETHEUS_AUTH_PASSWORD=secret
```

#### Blackbox Exporter
```bash
# Required: Blackbox Exporter address
BLACKBOX_EXPORTER_URL=http://blackbox-exporter:9115
```

---

## 🏗️ Deployment Scenarios

### Scenario 1: Local Development

```bash
# .env.local
PROMETHEUS_URL=http://localhost:9090
BLACKBOX_EXPORTER_URL=http://localhost:9115
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Docker Compose**:
```bash
docker-compose up -d
```

---

### Scenario 2: Production (Single Server)

```bash
# .env.production
NODE_ENV=production
PROMETHEUS_URL=http://prometheus:9090
BLACKBOX_EXPORTER_URL=http://blackbox-exporter:9115
NEXT_PUBLIC_APP_URL=https://monitor.yourdomain.com

# Security
SESSION_SECRET=your-secure-random-string-here
DEFAULT_ADMIN_PASSWORD=change-this-immediately

# Database
DB_HOST=mysql
DB_NAME=monitoring
DB_USER=monitoring_user
DB_PASSWORD=secure-password
```

**Docker Compose** (Production):
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - PROMETHEUS_URL=http://prometheus:9090
      - BLACKBOX_EXPORTER_URL=http://blackbox-exporter:9115
      - DB_HOST=mysql
    depends_on:
      - prometheus
      - blackbox-exporter
      - mysql
    restart: unless-stopped

  prometheus:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus-config:/etc/prometheus
      - prometheus-data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
    restart: unless-stopped

  blackbox-exporter:
    image: prom/blackbox-exporter:latest
    ports:
      - "9115:9115"
    volumes:
      - ./prometheus-config/blackbox.yml:/etc/blackbox/blackbox.yml
    restart: unless-stopped

  mysql:
    image: mysql:8
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: monitoring
      MYSQL_USER: monitoring_user
      MYSQL_PASSWORD: secure-password
    volumes:
      - mysql-data:/var/lib/mysql
    restart: unless-stopped

volumes:
  prometheus-data:
  mysql-data:
```

---

### Scenario 3: Kubernetes / Cloud

#### Environment Variables via ConfigMap
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: monitoring-config
data:
  PROMETHEUS_URL: "http://prometheus-service:9090"
  BLACKBOX_EXPORTER_URL: "http://blackbox-service:9115"
  NEXT_PUBLIC_APP_URL: "https://monitoring.example.com"
```

#### Secrets
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: monitoring-secrets
type: Opaque
stringData:
  SESSION_SECRET: "your-secure-random-string"
  DB_PASSWORD: "your-db-password"
  PROMETHEUS_AUTH_USERNAME: "admin"
  PROMETHEUS_AUTH_PASSWORD: "password"
```

#### Deployment
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: monitoring-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: monitoring
  template:
    metadata:
      labels:
        app: monitoring
    spec:
      containers:
      - name: app
        image: monitoring-app:latest
        ports:
        - containerPort: 3000
        envFrom:
        - configMapRef:
            name: monitoring-config
        - secretRef:
            name: monitoring-secrets
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
```

---

### Scenario 4: Distributed / Multi-Region

```bash
# Region 1 - US East
PROMETHEUS_URL=http://prometheus-us-east.internal:9090
BLACKBOX_EXPORTER_URL=http://blackbox-us-east.internal:9115

# Region 2 - EU West  
PROMETHEUS_URL=http://prometheus-eu-west.internal:9090
BLACKBOX_EXPORTER_URL=http://blackbox-eu-west.internal:9115

# Use Prometheus federation or remote write for aggregation
```

---

## 🔐 Security Best Practices

### 1. Change Default Credentials
```bash
# NEVER use these in production:
DEFAULT_ADMIN_USERNAME=admin
DEFAULT_ADMIN_PASSWORD=admin123

# Change to:
DEFAULT_ADMIN_USERNAME=your-custom-admin
DEFAULT_ADMIN_PASSWORD=very-secure-password-here
```

### 2. Secure Session Secret
```bash
# Generate a secure random string:
openssl rand -base64 32

# Set in .env:
SESSION_SECRET=generated-random-string
```

### 3. Prometheus Authentication
If your Prometheus is exposed:
```bash
PROMETHEUS_AUTH_USERNAME=prometheus-user
PROMETHEUS_AUTH_PASSWORD=secure-prometheus-password
```

### 4. Database Security
```bash
DB_PASSWORD=use-strong-password-here
# Don't use root in production
DB_USER=monitoring_app_user
```

---

## 📊 Scaling Strategies

### Horizontal Scaling

#### Load Balancer Configuration
```nginx
upstream monitoring_app {
    server app1:3000;
    server app2:3000;
    server app3:3000;
}

server {
    listen 80;
    server_name monitor.example.com;

    location / {
        proxy_pass http://monitoring_app;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

#### Shared Prometheus
All app instances should point to the same Prometheus:
```bash
PROMETHEUS_URL=http://prometheus-shared.internal:9090
```

### Vertical Scaling

Increase resources in docker-compose.yml:
```yaml
services:
  prometheus:
    deploy:
      resources:
        limits:
          cpus: '2.0'
          memory: 4G
        reservations:
          cpus: '1.0'
          memory: 2G
```

---

## 🔍 Monitoring the Monitor

### Health Check Endpoint
```bash
curl http://localhost:3000/api/health
```

### Prometheus Metrics
The app exposes its own metrics at:
```bash
curl http://localhost:3000/api/metrics
```

### Configuration Validation
Check if configuration is valid:
```bash
npm run validate-config
```

---

## 🛠️ Troubleshooting

### Problem: Cannot connect to Prometheus

**Check 1**: Verify Prometheus URL
```bash
curl $PROMETHEUS_URL/api/v1/status/config
```

**Check 2**: Check authentication
```bash
curl -u username:password $PROMETHEUS_URL/api/v1/query?query=up
```

**Check 3**: Network connectivity
```bash
docker-compose exec app ping prometheus
```

### Problem: Slow queries

**Solution**: Increase timeout
```bash
PROMETHEUS_QUERY_TIMEOUT=60
```

### Problem: Too many monitors

**Solution**: Increase concurrent check limit
```bash
CONCURRENT_CHECKS=20
MAX_MONITORS_PER_USER=200
```

---

## 📈 Performance Tuning

### Prometheus Configuration
```yaml
# prometheus.yml
global:
  scrape_interval: 30s  # Match DEFAULT_CHECK_INTERVAL
  evaluation_interval: 30s

# Enable compression
storage:
  tsdb:
    compression: true
```

### Application Tuning
```bash
# Cache status queries
STATUS_CACHE_TTL=30

# Limit concurrent checks
CONCURRENT_CHECKS=10

# Reduce metrics retention
METRICS_RETENTION_DAYS=30
```

---

## 🔄 High Availability Setup

### Database Replication
```yaml
services:
  mysql-primary:
    image: mysql:8
    environment:
      MYSQL_REPLICATION_MODE: master
    
  mysql-replica:
    image: mysql:8
    environment:
      MYSQL_REPLICATION_MODE: slave
      MYSQL_MASTER_HOST: mysql-primary
```

### Prometheus High Availability
```yaml
services:
  prometheus-1:
    image: prom/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--web.enable-lifecycle'

  prometheus-2:
    image: prom/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--web.enable-lifecycle'
```

Use load balancer to distribute queries:
```bash
PROMETHEUS_URL=http://prometheus-lb:9090
```

---

## 📦 Backup & Recovery

### Database Backup
```bash
# Automated backup
AUTO_BACKUP_ENABLED=true
BACKUP_INTERVAL_HOURS=24
BACKUP_RETENTION_DAYS=30
BACKUP_PATH=/backups

# Manual backup
docker-compose exec mysql mysqldump -u root -p monitoring > backup.sql
```

### Prometheus Data Backup
```bash
# Backup Prometheus data
docker-compose exec prometheus promtool tsdb snapshot /prometheus
```

---

## 🌐 Network Configuration

### Firewall Rules
```bash
# Application
allow 3000/tcp

# Prometheus
allow 9090/tcp from app_subnet

# Blackbox Exporter
allow 9115/tcp from app_subnet
```

### Internal Network
```yaml
networks:
  monitoring:
    internal: true
  frontend:
    internal: false
```

---

## 📝 Configuration Examples

### Small Setup (< 50 monitors)
```bash
PROMETHEUS_URL=http://localhost:9090
CONCURRENT_CHECKS=5
MAX_MONITORS_PER_USER=50
METRICS_RETENTION_DAYS=30
```

### Medium Setup (50-200 monitors)
```bash
PROMETHEUS_URL=http://prometheus:9090
CONCURRENT_CHECKS=10
MAX_MONITORS_PER_USER=200
METRICS_RETENTION_DAYS=60
```

### Large Setup (200+ monitors)
```bash
PROMETHEUS_URL=http://prometheus-cluster:9090
CONCURRENT_CHECKS=20
MAX_MONITORS_PER_USER=1000
METRICS_RETENTION_DAYS=90
# Consider horizontal scaling
```

---

## 🚨 Alerts Configuration

### Telegram Setup
```bash
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
TELEGRAM_CHAT_ID=123456789
ALERTS_ENABLED=true
ALERT_COOLDOWN_MINUTES=5
```

### Multiple Channels
```bash
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...
PAGERDUTY_INTEGRATION_KEY=your-key-here
```

---

## 📞 Support

### Configuration Validation
Run startup validation:
```bash
npm run start 2>&1 | grep -i "config"
```

### Debug Mode
```bash
LOG_LEVEL=debug
VERBOSE_LOGGING=true
```

### Get Current Configuration
```bash
curl http://localhost:3000/api/config/debug
```

---

**Last Updated**: November 19, 2025
**Version**: 1.0.0

