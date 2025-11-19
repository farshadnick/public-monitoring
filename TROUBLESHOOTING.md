# GuardianEye - Troubleshooting Guide

## ⚠️ NODE_ENV Warning

### Issue
You're seeing this warning:
```
⚠ You are using a non-standard "NODE_ENV" value in your environment.
```

### Cause
Next.js only accepts **three standard values** for `NODE_ENV`:
- ✅ `development`
- ✅ `production`
- ✅ `test`

❌ **DO NOT USE**: `staging`, `local`, `qa`, `preprod`, or any custom values

### Solution

#### 1. Check Your Environment Variables

**Option A: Using npm/development**
```bash
# Make sure you're not setting NODE_ENV
npm run dev
# This automatically sets NODE_ENV=development
```

**Option B: Using Docker**
```bash
# Check your .env file
cat .env

# Make sure it says:
NODE_ENV=production
# NOT: NODE_ENV=staging or any other value
```

**Option C: Check docker-compose.yml**
```bash
# Line 39 should read:
- NODE_ENV=${NODE_ENV:-production}
```

#### 2. Fix the .env File

If you have a `.env`, `.env.local`, or `.env.production` file, edit it:

```bash
# Open the file
nano .env

# Change this line to one of the standard values:
NODE_ENV=development   # for local development
# OR
NODE_ENV=production    # for production deployment
```

#### 3. Restart the Application

```bash
# If using Docker:
docker-compose down
docker-compose up -d

# If using npm:
# Stop the server (Ctrl+C) and restart
npm run dev
```

#### 4. Verify the Fix

The warning should disappear and you should see:
```
▲ Next.js 14.0.4
- Local:        http://localhost:3000
- Ready in X.Xs
```

---

## Common Environment Issues

### Issue: Environment Variables Not Loading

**Symptoms:**
- Configuration not working
- Database connection fails
- Backend services unreachable

**Solutions:**

1. **Check file location:**
   ```bash
   # .env file must be in project root
   ls -la .env
   ```

2. **Check file format:**
   - No spaces around `=`
   - No quotes needed (usually)
   - One variable per line
   ```bash
   # ✅ CORRECT
   NODE_ENV=production
   DB_HOST=localhost
   
   # ❌ WRONG
   NODE_ENV = production
   DB_HOST= "localhost"
   ```

3. **Restart after changes:**
   ```bash
   docker-compose restart
   ```

---

### Issue: Database Connection Failed

**Symptoms:**
- Cannot connect to database
- Timeout errors
- Connection refused

**Solutions:**

1. **Check database is running:**
   ```bash
   docker-compose ps mysql
   # Should show "Up"
   ```

2. **Check database credentials:**
   ```bash
   # In .env file
   DB_HOST=mysql          # Use container name in Docker
   DB_PORT=3306
   DB_USER=monitoring
   DB_PASSWORD=your_password
   ```

3. **Test connectivity:**
   ```bash
   # From web container
   docker exec guardianeye-web nc -zv mysql 3306
   ```

4. **Check logs:**
   ```bash
   docker-compose logs mysql
   ```

---

### Issue: Backend Services Unreachable

**Symptoms:**
- No metrics displayed
- "Unknown" status for monitors
- Timeout errors

**Solutions:**

1. **Check service URLs:**
   ```bash
   # In .env file
   PROMETHEUS_URL=http://prometheus:9090
   BLACKBOX_EXPORTER_URL=http://blackbox:9115
   ```

2. **Test connectivity:**
   ```bash
   # From web container
   docker exec guardianeye-web curl -I http://prometheus:9090
   ```

3. **Check services are running:**
   ```bash
   docker-compose ps
   # All services should show "Up"
   ```

4. **Restart services:**
   ```bash
   docker-compose restart
   ```

---

### Issue: Port Already in Use

**Symptoms:**
- `bind: address already in use`
- Cannot start services

**Solutions:**

1. **Find what's using the port:**
   ```bash
   # Check port 3000 (web app)
   lsof -i :3000
   
   # Check port 9090 (prometheus)
   lsof -i :9090
   ```

2. **Stop the conflicting service:**
   ```bash
   # Kill by PID
   kill -9 [PID]
   ```

3. **Change port in docker-compose.yml:**
   ```yaml
   ports:
     - "3001:3000"  # Use 3001 instead of 3000
   ```

---

### Issue: Telegram Notifications Not Working

**Symptoms:**
- Test message fails
- No alerts received
- Invalid token error

**Solutions:**

1. **Verify bot token:**
   - Token format: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`
   - Get from [@BotFather](https://t.me/BotFather)

2. **Verify chat ID:**
   - Numeric ID (can be negative for groups)
   - Get from [@userinfobot](https://t.me/userinfobot)

3. **Test manually:**
   ```bash
   curl -X POST "https://api.telegram.org/bot[BOT_TOKEN]/sendMessage" \
     -d "chat_id=[CHAT_ID]&text=Test"
   ```

4. **Check bot permissions:**
   - Bot must be able to send messages
   - For groups: add bot as member first

---

### Issue: Monitors Showing "Unknown" Status

**Symptoms:**
- All monitors show gray/unknown
- No metrics data
- First time setup

**Solutions:**

1. **Wait for first check:**
   - Default interval is 30 seconds
   - Wait 1-2 minutes for data

2. **Check backend connectivity:**
   ```bash
   docker-compose logs web | grep -i error
   ```

3. **Verify monitor configuration:**
   - Check URL is accessible
   - Check intervals are set correctly

4. **Restart monitoring services:**
   ```bash
   docker-compose restart prometheus blackbox
   docker-compose restart web
   ```

---

### Issue: Docker Build Fails

**Symptoms:**
- Build errors
- Cannot find dependencies
- Module not found

**Solutions:**

1. **Clean rebuild:**
   ```bash
   docker-compose down -v
   docker-compose build --no-cache
   docker-compose up -d
   ```

2. **Check Dockerfile:**
   - Verify Node.js version
   - Check package.json exists

3. **Clear Docker cache:**
   ```bash
   docker system prune -a
   docker volume prune
   ```

---

### Issue: High Memory/CPU Usage

**Symptoms:**
- Slow performance
- Container crashes
- Out of memory errors

**Solutions:**

1. **Reduce check frequency:**
   ```bash
   # In monitor settings or .env
   DEFAULT_CHECK_INTERVAL=60  # Increase from 30
   ```

2. **Limit concurrent checks:**
   ```bash
   # In .env
   CONCURRENT_CHECKS=5  # Reduce from 10
   ```

3. **Increase Docker resources:**
   - Docker Desktop → Settings → Resources
   - Increase memory limit

4. **Check for memory leaks:**
   ```bash
   docker stats
   ```

---

## Need More Help?

### Check Logs
```bash
# All services
docker-compose logs

# Specific service
docker-compose logs web
docker-compose logs mysql

# Follow logs (live)
docker-compose logs -f
```

### Check Service Status
```bash
# List all containers
docker-compose ps

# Check health
docker inspect [container_name] | grep Health
```

### Verify Configuration
```bash
# Show resolved docker-compose config
docker-compose config

# Show environment variables
docker exec guardianeye-web env
```

---

## Quick Fixes Checklist

When something goes wrong, try these in order:

1. ✅ Check logs: `docker-compose logs`
2. ✅ Restart services: `docker-compose restart`
3. ✅ Check .env file has correct values
4. ✅ Verify NODE_ENV is standard (development/production/test)
5. ✅ Check all services are running: `docker-compose ps`
6. ✅ Test connectivity between services
7. ✅ Clean rebuild: `docker-compose down && docker-compose up -d --build`
8. ✅ Check firewall/security settings
9. ✅ Verify port availability
10. ✅ Check system resources (memory, CPU, disk)

---

**Still having issues?** Check the documentation:
- `README.md` - Project overview
- `QUICKSTART.md` - Basic setup
- `DEPLOYMENT_GUIDE.md` - Production deployment
- `ENV_SETUP_GUIDE.md` - Environment configuration

