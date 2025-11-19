# ✅ Monitoring System - Complete with All Features!

## 🎉 What's Been Built

A complete, enterprise-grade URL monitoring platform with:

### 1. 🔐 User Authentication
- Secure login system with session management
- Protected dashboard (requires login)
- **Default credentials:** `admin` / `admin123`

### 2. 📊 Live Status Visualization  
- Real-time metrics from Prometheus
- Beautiful charts and graphs showing:
  - Online/Offline status (🟢/🔴)
  - Response times
  - HTTP status codes
  - SSL certificate expiry
  - 24-hour uptime percentage
- Auto-refreshes every 30 seconds

### 3. 📱 Telegram Notifications
- Get instant alerts when websites go down/up
- SSL certificate expiration warnings
- Easy setup with step-by-step instructions in the app
- Test message feature to verify configuration

### 4. 🚀 Complete Monitoring Stack
- **Next.js Web App** - Modern UI for managing everything
- **Prometheus** - Metrics storage and querying
- **Blackbox Exporter** - HTTP/HTTPS probing
- **Grafana** - Advanced visualization (optional)

## 🎯 Quick Start

### 1. Start All Services
```bash
docker-compose up -d --build
```

Wait 2-3 minutes for initial build...

### 2. Access the Dashboard
Open: **http://localhost:3000**

Login with: `admin` / `admin123`

### 3. Navigate the Tabs

**Live Status** 🟢
- See real-time status of all your websites
- View response times, uptime, SSL status
- Beautiful visual dashboard

**Manage URLs** ⚙️
- Add/remove websites to monitor
- Set custom check intervals
- Download Prometheus configs

**Notifications** 📱
- Configure Telegram bot
- Get instant alerts
- Test your setup

**How It Works** 📚
- System architecture diagram
- What metrics are collected
- Component explanations

**Setup Guide** 📖
- Step-by-step instructions
- Useful commands
- Prometheus query examples

## 🔔 Setting Up Telegram Notifications

1. Go to **Notifications** tab in the app
2. Follow the instructions:
   - Message @BotFather to create a bot
   - Get your bot token
   - Message @userinfobot to get your chat ID
   - Enter both in the app
   - Click "Send Test Message" to verify

## 📊 What Gets Monitored

- ✅ Website Up/Down status
- ⚡ Response time
- 🔢 HTTP status codes
- 🔒 SSL certificate expiration
- 📈 24-hour uptime percentage
- 🌐 DNS lookup time

## 🔗 Access URLs

| Service | URL | Credentials |
|---------|-----|-------------|
| **Web Dashboard** | http://localhost:3000 | admin / admin123 |
| **Prometheus** | http://localhost:9090 | - |
| **Blackbox Exporter** | http://localhost:9115 | - |
| **Grafana** | http://localhost:3001 | admin / admin |

## 🛠️ Useful Commands

```bash
# View all running containers
docker-compose ps

# View logs
docker-compose logs -f web
docker-compose logs -f prometheus

# Restart a service
docker-compose restart prometheus

# Stop everything
docker-compose down

# Rebuild after changes
docker-compose up -d --build
```

## 📈 Example Prometheus Queries

Visit http://localhost:9090/graph and try these:

```promql
# Check which sites are up (1=up, 0=down)
probe_success

# Average response time
avg(probe_duration_seconds)

# Uptime percentage over last 24 hours  
avg_over_time(probe_success[24h]) * 100

# SSL certificate days until expiry
(probe_ssl_earliest_cert_expiry - time()) / 86400

# Sites that are currently down
probe_success == 0
```

## 🎨 Features Included

✅ User Authentication with Sessions  
✅ Live Status Dashboard with Real-time Metrics  
✅ Beautiful Visual Charts and Graphs  
✅ Telegram Bot Integration  
✅ Instant Down/Up Notifications  
✅ SSL Certificate Monitoring  
✅ Response Time Tracking  
✅ Uptime Percentage Calculations  
✅ Auto-refresh Every 30 Seconds  
✅ Mobile-Responsive Design  
✅ Docker Containerized  
✅ Automatic Config Generation  
✅ Prometheus + Blackbox Integration  
✅ Grafana Visualization (Optional)  

## 🔒 Security Notes

- Change the default password in production
- Update `lib/auth.ts` to add more users or integrate with your auth system
- Use HTTPS in production
- Keep your Telegram bot token secret

## 📝 Notes

- The app automatically generates Prometheus configs when you add/remove URLs
- After adding URLs, restart Prometheus: `docker-compose restart prometheus`
- Metrics start appearing after the first check interval (30s by default)
- Telegram notifications only sent when status changes (down→up or up→down)

## 🎉 You're All Set!

Your monitoring platform is ready! Add some URLs and watch them being monitored in real-time! 🚀

