# GuardianEye - Environment Configuration Guide

## 🚀 Quick Setup

### 1. Create Environment File
```bash
# Copy template
cp env.template .env

# Edit with your settings
nano .env
```

### 2. Configure Essential Variables

```bash
# Application
NODE_ENV=production
APP_PORT=3000

# Database
DB_HOST=mysql
DB_NAME=monitoring
DB_USER=monitoring
DB_PASSWORD=secure_password_here

# Authentication
SESSION_SECRET=generate_random_string_32_chars_min
DEFAULT_ADMIN_USERNAME=admin
DEFAULT_ADMIN_PASSWORD=change_this_password
```

### 3. Start Application
```bash
# With Docker
docker-compose up -d

# Or locally
npm run build
npm start
```

---

## 📋 Configuration Variables

### Application Settings

```bash
# Environment (development, production, staging)
NODE_ENV=production

# Port for web server
APP_PORT=3000

# Public URL for callbacks
NEXT_PUBLIC_APP_URL=https://monitoring.yourdomain.com
```

### Backend Service URLs

```bash
# Internal monitoring service addresses
# Default for Docker Compose (use internal DNS):
PROMETHEUS_URL=http://prometheus:9090
BLACKBOX_EXPORTER_URL=http://blackbox:9115

# For external services:
PROMETHEUS_URL=http://10.0.1.100:9090
BLACKBOX_EXPORTER_URL=http://10.0.1.101:9115

# Query timeout (seconds)
PROMETHEUS_QUERY_TIMEOUT=30

# Authentication (if required)
PROMETHEUS_AUTH_USERNAME=
PROMETHEUS_AUTH_PASSWORD=
```

### Database Configuration

```bash
# MySQL/MariaDB connection
DB_HOST=mysql              # Container name or IP
DB_PORT=3306              # Default MySQL port
DB_NAME=monitoring        # Database name
DB_USER=monitoring        # Database user
DB_PASSWORD=secure_pass   # Secure password

# Connection pool settings (optional)
DB_CONNECTION_LIMIT=10
```

### Authentication & Security

```bash
# Session secret (IMPORTANT: Use a strong random string)
SESSION_SECRET=your_very_long_and_random_secret_key_here

# Default admin credentials (change after first login!)
DEFAULT_ADMIN_USERNAME=admin
DEFAULT_ADMIN_PASSWORD=admin123

# Session expiration (hours)
SESSION_EXPIRATION=24
```

### Notification Settings

```bash
# Telegram Bot (optional but recommended)
TELEGRAM_BOT_TOKEN=your_bot_token_from_botfather
TELEGRAM_CHAT_ID=your_chat_id

# Email notifications (future feature)
# SMTP_HOST=
# SMTP_PORT=
# SMTP_USER=
# SMTP_PASSWORD=
```

### Monitoring Configuration

```bash
# Default check interval (seconds)
DEFAULT_CHECK_INTERVAL=30

# HTTP request timeout (seconds)
DEFAULT_HTTP_TIMEOUT=10

# Maximum concurrent checks
CONCURRENT_CHECKS=10

# Retry attempts on failure
MAX_RETRY_ATTEMPTS=3

# Alert cooldown period (minutes)
ALERT_COOLDOWN=5
```

### Feature Toggles

```bash
# Enable/disable features
FEATURE_CRON_MONITORING=true
FEATURE_PUSHGATEWAY=true
FEATURE_STATUS_PAGES=true
FEATURE_TELEGRAM_ALERTS=true
FEATURE_EMAIL_ALERTS=false
```

### Logging

```bash
# Log level (error, warn, info, debug)
LOG_LEVEL=info

# Log format (json, pretty)
LOG_FORMAT=json

# Enable request logging
LOG_REQUESTS=true
```

---

## 🔐 Security Best Practices

### Session Secret
```bash
# Generate a secure random string
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Or use
openssl rand -hex 32
```

### Password Requirements
- Minimum 8 characters
- Mix of uppercase, lowercase, numbers
- Special characters recommended
- Change default passwords immediately

### Database Security
- Use strong passwords
- Limit database access to specific IPs
- Use separate user for application
- Regular backups

---

## 🌍 Deployment Scenarios

### Local Development
```bash
NODE_ENV=development
APP_PORT=3000
DB_HOST=localhost
PROMETHEUS_URL=http://localhost:9090
BLACKBOX_EXPORTER_URL=http://localhost:9115
```

### Docker Compose
```bash
NODE_ENV=production
APP_PORT=3000
DB_HOST=mysql                    # Use service name
PROMETHEUS_URL=http://prometheus:9090
BLACKBOX_EXPORTER_URL=http://blackbox:9115
```

### Cloud Deployment
```bash
NODE_ENV=production
APP_PORT=3000
NEXT_PUBLIC_APP_URL=https://monitoring.yourdomain.com
DB_HOST=database-server.internal
PROMETHEUS_URL=http://monitoring-backend:9090
```

### High Availability
```bash
NODE_ENV=production
DB_HOST=db-cluster.internal
PROMETHEUS_URL=http://prom-lb.internal:9090
SESSION_EXPIRATION=48
CONCURRENT_CHECKS=20
```

---

## 📊 Performance Tuning

### Light Usage (< 20 monitors)
```bash
DEFAULT_CHECK_INTERVAL=60
DEFAULT_HTTP_TIMEOUT=10
CONCURRENT_CHECKS=5
DB_CONNECTION_LIMIT=5
```

### Medium Usage (20-100 monitors)
```bash
DEFAULT_CHECK_INTERVAL=30
DEFAULT_HTTP_TIMEOUT=15
CONCURRENT_CHECKS=10
DB_CONNECTION_LIMIT=10
```

### Heavy Usage (100+ monitors)
```bash
DEFAULT_CHECK_INTERVAL=60
DEFAULT_HTTP_TIMEOUT=20
CONCURRENT_CHECKS=20
DB_CONNECTION_LIMIT=20
PROMETHEUS_QUERY_TIMEOUT=60
```

---

## 🔍 Troubleshooting

### Environment Not Loading

**Check file location**:
```bash
# .env file should be in project root
ls -la .env

# Or use .env.local for Next.js
ls -la .env.local
```

**Check file format**:
- No spaces around `=`
- No quotes needed unless value has spaces
- No comments on same line as variable

### Connection Issues

**Test backend connectivity**:
```bash
# Test from container
docker exec guardianeye-web curl -I http://prometheus:9090

# Test from host
curl -I http://localhost:9090
```

**Check database connection**:
```bash
docker exec guardianeye-web nc -zv mysql 3306
```

### Variable Not Working

**Check variable name** - Must match exactly (case-sensitive)

**Restart services** after changing .env:
```bash
docker-compose down
docker-compose up -d
```

**Verify in container**:
```bash
docker exec guardianeye-web env | grep PROMETHEUS
```

---

## 📝 Environment File Template

See `env.template` for a complete template with all available variables and descriptions.

```bash
# Copy and customize
cp env.template .env
nano .env
```

---

## ✅ Validation Checklist

Before deploying:

- [ ] All required variables are set
- [ ] Strong SESSION_SECRET generated
- [ ] Default admin password changed
- [ ] Database credentials configured
- [ ] Backend service URLs correct
- [ ] Feature flags set appropriately
- [ ] Telegram bot configured (if using)
- [ ] Logging level appropriate
- [ ] Timeout values reasonable
- [ ] File permissions secure (chmod 600 .env)

---

## 🔄 Updating Configuration

### Without Downtime
Most variables can be changed and applied with:
```bash
docker-compose up -d
```

### Requiring Restart
Some critical variables require full restart:
- DB_HOST, DB_PORT, DB_NAME
- SESSION_SECRET
- NODE_ENV

```bash
docker-compose down
docker-compose up -d
```

---

**Pro Tip**: Keep your `.env` file secure and never commit it to version control! Add it to `.gitignore`.
