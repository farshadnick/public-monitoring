# Watcher - Deployment & Scaling Guide

## 🚀 Quick Deploy with Docker

### 1. Clone Repository
```bash
git clone <your-repo-url>
cd watcher
```

### 2. Configure Environment
```bash
# Copy environment template
cp env.template .env

# Edit configuration
nano .env
```

### 3. Start Services
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f
```

### 4. Access Dashboard
Open http://your-server-ip:3000

---

## 📋 Environment Configuration

### Essential Settings

```bash
# Application
# ⚠️ NODE_ENV must be: development, production, or test (Next.js standard)
NODE_ENV=production
APP_PORT=3000
NEXT_PUBLIC_APP_URL=https://your-domain.com

# Database
DB_HOST=mysql
DB_PORT=3306
DB_NAME=monitoring
DB_USER=monitoring
DB_PASSWORD=your_secure_password

# Authentication
SESSION_SECRET=generate_a_long_random_string_here
DEFAULT_ADMIN_USERNAME=admin
DEFAULT_ADMIN_PASSWORD=change_this_password

# Telegram Notifications (Optional)
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHAT_ID=your_chat_id
```

### Security Recommendations

1. **Change Default Credentials**: Always change admin password
2. **Strong Session Secret**: Use a cryptographically random string (32+ characters)
3. **Database Password**: Use a strong, unique password
4. **HTTPS**: Enable SSL/TLS in production
5. **Firewall**: Restrict access to backend services

---

## 🏗️ Deployment Options

### Option 1: Single Server (Recommended for Small Teams)

```bash
# Use docker-compose.yml
docker-compose up -d
```

**Pros**: Simple, everything in one place
**Cons**: Single point of failure
**Best for**: Up to 100 monitors, small teams

### Option 2: Distributed (For Large Scale)

Deploy components separately:

```bash
# Web application server
docker run -d -p 3000:3000 \
  -e DB_HOST=db-server \
  -e NODE_ENV=production \
  guardianeye-web

# Database server (separate machine)
docker run -d -p 3306:3306 \
  -e MYSQL_ROOT_PASSWORD=secure_password \
  mysql:8

# Backend monitoring services (separate machines)
# See Environment Variables section
```

**Pros**: Scalable, fault-tolerant
**Cons**: More complex setup
**Best for**: 100+ monitors, high availability requirements

### Option 3: Kubernetes

```yaml
# Example deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: guardianeye
spec:
  replicas: 3
  selector:
    matchLabels:
      app: guardianeye
  template:
    metadata:
      labels:
        app: guardianeye
    spec:
      containers:
      - name: web
        image: guardianeye:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        - name: DB_HOST
          value: "mysql-service"
        # Add more environment variables
```

---

## 🔧 Production Checklist

### Before Deployment

- [ ] Change default admin password
- [ ] Set strong SESSION_SECRET
- [ ] Configure secure database credentials
- [ ] Set up HTTPS/SSL certificates
- [ ] Configure backup strategy
- [ ] Set up monitoring alerts (Telegram)
- [ ] Test failover scenarios
- [ ] Document access procedures

### Security Hardening

- [ ] Enable firewall rules
- [ ] Use strong passwords
- [ ] Limit database access
- [ ] Enable HTTPS only
- [ ] Regular security updates
- [ ] Implement rate limiting
- [ ] Set up intrusion detection

### Performance Tuning

- [ ] Adjust check intervals based on needs
- [ ] Configure timeout values appropriately
- [ ] Set concurrent check limits
- [ ] Enable caching where appropriate
- [ ] Monitor resource usage
- [ ] Scale horizontally if needed

---

## 📊 Scaling Guidelines

### Vertical Scaling (Increase Resources)

**When to use**: Simple, works for most cases

```bash
# Increase Docker memory limits
docker-compose down
# Edit docker-compose.yml
services:
  web:
    mem_limit: 2g
    cpus: 2
docker-compose up -d
```

### Horizontal Scaling (Multiple Instances)

**When to use**: High availability, load distribution

1. Deploy multiple web instances
2. Use load balancer (Nginx, HAProxy, etc.)
3. Share database and backend services
4. Configure session persistence

### Database Scaling

**For heavy usage**:
- Use read replicas
- Implement connection pooling
- Optimize queries
- Archive old data regularly

---

## 🔄 Backup & Recovery

### Database Backup

```bash
# Backup database
docker exec mysql mysqldump -u root -p monitoring > backup.sql

# Restore database
docker exec -i mysql mysql -u root -p monitoring < backup.sql
```

### Configuration Backup

```bash
# Backup configuration
tar -czf backup-$(date +%Y%m%d).tar.gz \
  .env \
  data/ \
  prometheus-config/

# Restore
tar -xzf backup-YYYYMMDD.tar.gz
```

### Automated Backups

```bash
# Add to crontab
0 2 * * * /path/to/backup-script.sh
```

---

## 🌐 Reverse Proxy Configuration

### Nginx Example

```nginx
server {
    listen 80;
    server_name monitoring.yourdomain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### SSL/TLS with Let's Encrypt

```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d monitoring.yourdomain.com

# Auto-renewal (already configured by certbot)
```

---

## 📈 Monitoring the Monitor

### Health Checks

```bash
# Application health
curl http://localhost:3000/api/health

# Database connection
docker exec mysql mysqladmin ping -h localhost

# Services status
docker-compose ps
```

### Resource Monitoring

```bash
# Container stats
docker stats

# Disk usage
df -h

# Memory usage
free -m
```

---

## 🆘 Troubleshooting

### Common Issues

**Application won't start**
```bash
# Check logs
docker-compose logs web

# Check environment variables
docker-compose config

# Rebuild
docker-compose build --no-cache
```

**Database connection errors**
```bash
# Check database status
docker-compose ps mysql

# Check database logs
docker-compose logs mysql

# Test connection
docker exec web nc -zv mysql 3306
```

**Slow performance**
```bash
# Check resource usage
docker stats

# Check check intervals
# Reduce frequency for non-critical monitors

# Scale up resources
# Increase memory/CPU limits
```

---

## 📚 Additional Resources

- See `README.md` for feature overview
- See `QUICKSTART.md` for basic usage
- See `env.template` for all configuration options

---

## 🤝 Support

For issues or questions:
1. Check troubleshooting section above
2. Review logs for error messages
3. Verify configuration settings
4. Check system resources

---

**Remember**: Security is paramount. Never expose sensitive services to the internet without proper authentication and encryption!
