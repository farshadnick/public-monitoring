# GuardianEye - Professional Monitoring Service

A modern web application for monitoring website and service availability with real-time alerts and comprehensive metrics.

## Features

- 🌐 Monitor websites, APIs, and servers
- 📊 Beautiful, modern UI with real-time updates
- ⚡ Multiple monitoring types (HTTP, HTTPS, Ping, Port, Keyword)
- 🔐 SSL certificate monitoring and expiration alerts
- 📈 Response time tracking and performance metrics
- ⏱️ Customizable check intervals
- 🚨 Incident management and tracking
- 📱 Telegram notifications
- ⏰ Cron job monitoring with ping URLs
- 📤 Metrics gateway for custom metrics
- 🌍 Public status pages
- 🐳 Docker Compose setup for easy deployment

## Quick Start

### Option 1: Run Everything with Docker (Recommended for Production)

**One command to start everything:**

```bash
docker-compose up -d
```

This will start all services:
- **Web Dashboard** on http://localhost:3000
- **Backend Services** (automatic configuration)

**That's it!** Open http://localhost:3000 and start adding URLs to monitor.

### Option 2: Run Web App Locally (For Development)

If you want to develop or run the web app locally:

```bash
# Install dependencies
npm install

# Start the web application
npm run dev

# In another terminal, start backend services
docker-compose up -d
```

### Usage

1. Open [http://localhost:3000](http://localhost:3000) in your browser
2. Login with your credentials (default: admin/admin123)
3. Navigate to the **Monitors** tab
4. Click "Add New Monitor" button
5. Enter the website/service details:
   - URL or hostname
   - Display name
   - Monitor type (HTTP, HTTPS, Ping, Port, Keyword)
   - Check interval
   - Optional: Keyword to check for
   - Optional: SSL monitoring
6. Click "Add Monitor"
7. View real-time status updates in the dashboard

### Additional Features

- **Cron Job Monitoring**: Get unique ping URLs to monitor scheduled tasks
- **Metrics Gateway**: Push custom metrics from batch jobs
- **Incidents**: Automatically track downtime events
- **Status Pages**: Create public status pages for your services
- **Telegram Notifications**: Configure alerts via Telegram

## Project Structure

```
.
├── app/
│   ├── api/
│   │   ├── urls/           # URL management endpoints
│   │   └── config/         # Configuration download endpoints
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx            # Main UI
├── lib/
│   ├── storage.ts          # URL storage management
│   └── prometheus.ts       # Config generation
├── types/
│   └── index.ts            # TypeScript types
├── data/                   # URL storage (auto-generated)
├── prometheus-config/      # Generated configs (auto-generated)
├── docker-compose.yml
└── package.json
```

## API Endpoints

### URL Management
- `GET /api/urls` - Get all monitored URLs
- `POST /api/urls` - Add a new URL
- `DELETE /api/urls/[id]` - Delete a URL
- `PATCH /api/urls/[id]` - Update a URL

### Monitoring
- `GET /api/metrics` - Get current metrics for all monitors
- `GET /api/history/[url]` - Get historical data for a specific URL

### Cron Jobs
- `POST /api/ping/[checkId]` - Ping endpoint for cron job checks

### Metrics Gateway
- `POST /api/pushgateway/metrics/job/[job]` - Push custom metrics

### Configuration
- `GET /api/telegram/config` - Get Telegram configuration
- `POST /api/telegram/config` - Update Telegram configuration
- `POST /api/telegram/test` - Test Telegram notifications

## Configuration

### Environment Variables

Create a `.env` file in the root directory to configure the application:

```bash
# Application
NODE_ENV=production
APP_PORT=3000

# Database
DB_HOST=mysql
DB_PORT=3306
DB_NAME=monitoring
DB_USER=monitoring
DB_PASSWORD=your_secure_password

# Authentication
SESSION_SECRET=your_secret_key
DEFAULT_ADMIN_USERNAME=admin
DEFAULT_ADMIN_PASSWORD=your_admin_password

# Telegram (Optional)
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHAT_ID=your_chat_id

# Monitoring Settings
DEFAULT_CHECK_INTERVAL=30
DEFAULT_HTTP_TIMEOUT=10
```

See `env.template` for a complete list of available options.

## Customization

### Change Check Intervals

Edit the URL in the web interface or modify the `interval` field when adding URLs:
- `15s` - Every 15 seconds
- `30s` - Every 30 seconds
- `1m` - Every minute
- `5m` - Every 5 minutes
- `15m` - Every 15 minutes

### Monitor Types

Choose from different monitor types based on your needs:
- **HTTP/HTTPS** - Monitor web services and APIs
- **Ping** - Check if servers are reachable
- **Port** - Monitor specific TCP ports
- **Keyword** - Check if specific content exists on a page

## Troubleshooting

### Monitors not updating

1. Make sure you've added monitors in the web interface (http://localhost:3000)
2. Check if backend services are running: `docker-compose ps`
3. Restart services if needed: `docker-compose restart`

### Can't connect to the Web Dashboard

1. Check if containers are running: `docker-compose ps`
2. View logs: `docker-compose logs web`
3. Ensure port 3000 is not in use: `lsof -i :3000`

### Backend service issues

1. Check if containers are running: `docker-compose ps`
2. View logs: `docker-compose logs`
3. Ensure required ports are not in use by another service

### Build errors

If you get build errors:
```bash
# Clean everything and rebuild
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

## Production Deployment

For production use:

1. **Change Default Credentials**: Update admin password in `.env` file
2. **Set Strong Session Secret**: Generate a secure random string for `SESSION_SECRET`
3. **Configure Database**: Use a secure password for database access
4. **Persistent Storage**: The docker-compose file already includes volumes for data persistence
5. **Reverse Proxy**: Consider using Nginx or Traefik in front of the services
6. **SSL/TLS**: Enable HTTPS for the web interface
7. **Telegram Alerts**: Configure Telegram bot for notifications
8. **Backup**: Regularly backup the database and configuration files

See `DEPLOYMENT_GUIDE.md` for detailed deployment instructions.

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Modern styling
- **MySQL** - Database
- **Docker & Docker Compose** - Containerization

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

