# Setting Up Custom Domain for GuardianEye

## Issue: App Not Responding to Custom Domain

If your app doesn't respond when accessed via a custom domain (like `guardianeye.adlas.cloud`), follow this guide.

---

## Quick Fix

### Step 1: Set Environment Variable

Create or edit your `.env` file in the project root:

```bash
# Create .env file
cat > .env << EOF
# Your custom domain
NEXT_PUBLIC_APP_URL=https://guardianeye.adlas.cloud

# Other settings
NODE_ENV=production
APP_PORT=3000
# ... (other variables from env.template)
EOF
```

### Step 2: Rebuild and Restart

```bash
# Stop containers
docker-compose down

# Rebuild with new configuration
docker-compose build --no-cache web

# Start services
docker-compose up -d

# Verify it's running
docker-compose ps
docker-compose logs web
```

### Step 3: Test

```bash
# Test with curl
curl -H "Host: guardianeye.adlas.cloud" http://localhost:3000

# Or access via browser
# https://guardianeye.adlas.cloud
```

---

## Proper Setup with Reverse Proxy

### Using Nginx (Recommended)

Create an Nginx configuration:

```nginx
# /etc/nginx/sites-available/guardianeye

server {
    listen 80;
    server_name guardianeye.adlas.cloud;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name guardianeye.adlas.cloud;
    
    # SSL Configuration (using Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/guardianeye.adlas.cloud/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/guardianeye.adlas.cloud/privkey.pem;
    
    # SSL Security Settings
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    
    # Logging
    access_log /var/log/nginx/guardianeye-access.log;
    error_log /var/log/nginx/guardianeye-error.log;
    
    # Proxy Settings
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        
        # Important: Pass correct headers
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Forwarded-Port $server_port;
        
        # WebSocket support (if needed)
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    
    # Max upload size (for metrics/logs)
    client_max_body_size 10M;
}
```

**Enable the site:**

```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/guardianeye /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

### Using Caddy (Easier, Auto-SSL)

Create a `Caddyfile`:

```caddyfile
guardianeye.adlas.cloud {
    reverse_proxy localhost:3000
    
    header {
        X-Frame-Options "SAMEORIGIN"
        X-Content-Type-Options "nosniff"
        X-XSS-Protection "1; mode=block"
    }
    
    log {
        output file /var/log/caddy/guardianeye.log
    }
}
```

**Start Caddy:**

```bash
# Install Caddy
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update
sudo apt install caddy

# Start Caddy
sudo caddy start
```

### Using Traefik (Docker)

Add to your `docker-compose.yml`:

```yaml
services:
  web:
    # ... existing configuration ...
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.guardianeye.rule=Host(`guardianeye.adlas.cloud`)"
      - "traefik.http.routers.guardianeye.entrypoints=websecure"
      - "traefik.http.routers.guardianeye.tls=true"
      - "traefik.http.routers.guardianeye.tls.certresolver=letsencrypt"
      - "traefik.http.services.guardianeye.loadbalancer.server.port=3000"
  
  traefik:
    image: traefik:v2.10
    command:
      - "--api.dashboard=true"
      - "--providers.docker=true"
      - "--entrypoints.web.address=:80"
      - "--entrypoints.websecure.address=:443"
      - "--certificatesresolvers.letsencrypt.acme.email=your@email.com"
      - "--certificatesresolvers.letsencrypt.acme.storage=/acme.json"
      - "--certificatesresolvers.letsencrypt.acme.httpchallenge.entrypoint=web"
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - ./acme.json:/acme.json
    networks:
      - monitoring
```

---

## SSL/TLS Certificate Setup

### Using Let's Encrypt (Free SSL)

```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate (with Nginx)
sudo certbot --nginx -d guardianeye.adlas.cloud

# Or standalone (if Nginx not running)
sudo certbot certonly --standalone -d guardianeye.adlas.cloud

# Auto-renewal (already configured by certbot)
sudo certbot renew --dry-run
```

---

## DNS Configuration

Make sure your DNS is configured correctly:

### A Record
```
Type: A
Name: guardianeye (or @)
Value: YOUR_SERVER_IP
TTL: 3600
```

### CNAME (if using subdomain)
```
Type: CNAME
Name: guardianeye
Value: adlas.cloud
TTL: 3600
```

**Verify DNS:**

```bash
# Check DNS resolution
dig guardianeye.adlas.cloud

# Or
nslookup guardianeye.adlas.cloud

# Expected output should show your server IP
```

---

## Firewall Configuration

Open necessary ports:

```bash
# Allow HTTP
sudo ufw allow 80/tcp

# Allow HTTPS
sudo ufw allow 443/tcp

# Check firewall status
sudo ufw status
```

---

## Environment Configuration

Your `.env` file should look like this:

```bash
# ==============================================
# GuardianEye Production Configuration
# ==============================================

# Application
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://guardianeye.adlas.cloud
APP_PORT=3000

# Database
DB_HOST=mysql
DB_PORT=3306
DB_NAME=monitoring
DB_USER=monitoring
DB_PASSWORD=YOUR_SECURE_PASSWORD

# Authentication
SESSION_SECRET=YOUR_32_CHAR_RANDOM_STRING
DEFAULT_ADMIN_USERNAME=admin
DEFAULT_ADMIN_PASSWORD=CHANGE_THIS

# Backend Services
PROMETHEUS_URL=http://prometheus:9090
BLACKBOX_EXPORTER_URL=http://blackbox:9115

# Telegram (optional)
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=

# Features
FEATURE_CRON_MONITORING=true
FEATURE_PUSHGATEWAY=true
FEATURE_STATUS_PAGES=true
```

---

## Troubleshooting

### App still not responding?

1. **Check if app is running:**
   ```bash
   docker-compose ps
   curl http://localhost:3000
   ```

2. **Check logs:**
   ```bash
   docker-compose logs web
   ```

3. **Test with Host header:**
   ```bash
   curl -H "Host: guardianeye.adlas.cloud" http://localhost:3000
   ```

4. **Verify environment variables loaded:**
   ```bash
   docker exec monitoring-web-app env | grep NEXT_PUBLIC_APP_URL
   ```

5. **Rebuild completely:**
   ```bash
   docker-compose down -v
   docker-compose build --no-cache
   docker-compose up -d
   ```

### Nginx/Proxy issues?

1. **Check Nginx configuration:**
   ```bash
   sudo nginx -t
   ```

2. **Check Nginx logs:**
   ```bash
   sudo tail -f /var/log/nginx/error.log
   sudo tail -f /var/log/nginx/guardianeye-error.log
   ```

3. **Verify proxy headers:**
   ```bash
   curl -I https://guardianeye.adlas.cloud
   ```

### SSL Certificate issues?

1. **Check certificate:**
   ```bash
   sudo certbot certificates
   ```

2. **Renew certificate:**
   ```bash
   sudo certbot renew
   ```

3. **Test SSL:**
   ```bash
   openssl s_client -connect guardianeye.adlas.cloud:443
   ```

---

## Security Checklist

- [ ] SSL/TLS certificate installed and working
- [ ] Firewall configured (only 80/443 open)
- [ ] Strong passwords in `.env`
- [ ] SESSION_SECRET is random 32+ characters
- [ ] Default admin password changed
- [ ] Nginx/proxy security headers enabled
- [ ] Rate limiting configured (optional)
- [ ] Backup strategy in place
- [ ] Monitoring for the monitor (optional)

---

## Complete Deployment Commands

```bash
# 1. Set up environment
cat > .env << EOF
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://guardianeye.adlas.cloud
# ... other variables
EOF

# 2. Start services
docker-compose up -d

# 3. Set up Nginx
sudo nano /etc/nginx/sites-available/guardianeye
# (paste configuration from above)
sudo ln -s /etc/nginx/sites-available/guardianeye /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# 4. Get SSL certificate
sudo certbot --nginx -d guardianeye.adlas.cloud

# 5. Test
curl -I https://guardianeye.adlas.cloud

# 6. Access in browser
# https://guardianeye.adlas.cloud
```

---

**Your GuardianEye instance should now be accessible at:**
### 🌐 https://guardianeye.adlas.cloud

---

**Need help?** Check:
- `TROUBLESHOOTING.md` for common issues
- `DEPLOYMENT_GUIDE.md` for deployment strategies
- Docker logs: `docker-compose logs -f`

