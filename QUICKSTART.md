# GuardianEye - Quick Start Guide

Get your monitoring system up and running in 5 minutes!

## Step 1: Start with Docker (Recommended)

```bash
# Clone and start all services
docker-compose up -d
```

This will start:
- Web Dashboard on http://localhost:3000
- All backend services (automatic configuration)

**OR** for development:

```bash
npm install
npm run dev
# In another terminal: docker-compose up -d
```

## Step 2: Login

1. Open [http://localhost:3000](http://localhost:3000)
2. Login with default credentials:
   - **Username**: `admin`
   - **Password**: `admin123`

> **Important**: Change these credentials in production!

## Step 3: Add Your First Monitor

1. Navigate to the **Monitors** tab
2. Click **"+ Add New Monitor"** button
3. Fill in the form:
   - **Website URL**: `https://google.com`
   - **Display Name**: `Google Homepage`
   - **Monitor Type**: `HTTPS`
   - **Check Interval**: `30s`
   - **SSL Monitoring**: ✓ Enabled
4. Click **"Add Monitor"**

## Step 4: View Live Status

Your monitor will start checking immediately! You'll see:
- ✅ **Up** - Service is responding
- ❌ **Down** - Service is not responding
- ⏱️ **Response Time** - How fast it responds
- 🔒 **SSL Days** - Certificate expiration countdown

## Step 5: Set Up Alerts (Optional)

### Telegram Notifications

1. Go to the **Settings** tab
2. Enter your Telegram Bot Token
3. Enter your Chat ID
4. Click **"Test Connection"**
5. Save configuration

Now you'll get instant alerts when services go down!

## Additional Features

### Cron Job Monitoring

1. Navigate to the **Cron Jobs** tab
2. Click **"Add New Check"**
3. Configure your schedule or grace period
4. Copy the ping URL
5. Add to your cron job: `curl -X POST [ping-url]`

### Metrics Gateway

1. Navigate to the **Metrics Gateway** tab
2. Click **"Show Usage Guide"**
3. Follow examples to push custom metrics from your scripts

### Status Pages

1. Navigate to the **Status Page** tab
2. Create a public status page
3. Select monitors to display
4. Share the public URL with your team/customers

## Troubleshooting

**Problem: Can't login**
- Check default credentials: admin/admin123
- View logs: `docker-compose logs web`

**Problem: Monitors showing as "Unknown"**
- Wait 30-60 seconds for first check
- Refresh the page
- Check if backend services are running: `docker-compose ps`

**Problem: No alerts received**
- Verify Telegram bot token and chat ID
- Use "Test Connection" button in Settings
- Check Telegram bot permissions

**Problem: Services not starting**
- Check if ports are available: `lsof -i :3000`
- View all logs: `docker-compose logs`
- Rebuild containers: `docker-compose build --no-cache`

## Next Steps

- ✅ Add more monitors for your services
- 📊 Create incident response procedures
- 🌍 Set up public status pages
- ⏰ Monitor your cron jobs and batch processes
- 📤 Push custom metrics from your applications
- 🔔 Configure Telegram alerts for your team

## Monitor Types

Choose the right monitor type for your use case:

- **HTTP/HTTPS** - Web services, APIs, websites
- **Ping** - Basic connectivity check for servers
- **Port** - Specific TCP port monitoring (databases, services)
- **Keyword** - Check if specific text appears on a page

## Architecture

```
┌─────────────────────┐
│   Web Dashboard     │ ← You manage everything here
│   (GuardianEye UI)  │
└──────────┬──────────┘
           │
           ↓
┌─────────────────────┐
│   Backend Services  │ ← Automatic monitoring
│   (Containerized)   │
└──────────┬──────────┘
           │ monitors
           ↓
     ┌────────────┐
     │  Your      │
     │  Services  │
     └────────────┘
```

## Pro Tips

💡 **Use different check intervals**: Critical services every 30s, less critical every 5m
💡 **Enable SSL monitoring**: Get alerts before certificates expire
💡 **Keyword monitoring**: Ensure specific content is loading correctly
💡 **Public status pages**: Keep customers informed proactively
💡 **Cron monitoring**: Catch silent failures in scheduled tasks

Enjoy monitoring! 🚀
