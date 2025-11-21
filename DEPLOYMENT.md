# Organizer App Deployment Guide

Complete guide for deploying the Organizer App to your VPS using Docker.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Quick Deployment](#quick-deployment)
- [Manual Deployment](#manual-deployment)
- [Database Management](#database-management)
- [Monitoring \u0026 Logs](#monitoring--logs)
- [Troubleshooting](#troubleshooting)
- [Updating the App](#updating-the-app)

---

## 🎯 Prerequisites

### On Your Local Machine (Windows)
- SSH client configured (OpenSSH)
- SSH key authentication to VPS (configured)
- SCP available for file transfer

### On Your VPS (46.202.189.243)
- Docker installed
- Docker Compose installed
- Ports available: 8080 (frontend), 3000 (backend), 5435 (database)

---

## 🚀 Quick Deployment

### Option 1: PowerShell Script (Recommended for Windows)

```powershell
# From the project root directory
cd c:\apps\OG_app
.\deploy.ps1
```

### Option 2: Manual Commands

See [Manual Deployment](#manual-deployment) section below.

---

## 📖 Manual Deployment

### Step 1: Copy Files to VPS

```powershell
# Create directory on VPS
ssh root@46.202.189.243 "mkdir -p /home/omar/organizer_app"

# Copy docker-compose file
scp organizer-docker-compose.yml root@46.202.189.243:/home/omar/organizer_app/docker-compose.yml

# Copy backend
scp -r backend root@46.202.189.243:/home/omar/organizer_app/

# Copy frontend source files
scp -r src root@46.202.189.243:/home/omar/organizer_app/
scp -r public root@46.202.189.243:/home/omar/organizer_app/
scp package*.json root@46.202.189.243:/home/omar/organizer_app/
scp index.html root@46.202.189.243:/home/omar/organizer_app/
scp vite.config.ts root@46.202.189.243:/home/omar/organizer_app/
scp tsconfig*.json root@46.202.189.243:/home/omar/organizer_app/
scp tailwind.config.js root@46.202.189.243:/home/omar/organizer_app/
scp postcss.config.js root@46.202.189.243:/home/omar/organizer_app/
scp Dockerfile root@46.202.189.243:/home/omar/organizer_app/
scp nginx.conf root@46.202.189.243:/home/omar/organizer_app/
scp .dockerignore root@46.202.189.243:/home/omar/organizer_app/
```

### Step 2: SSH into VPS

```bash
ssh root@46.202.189.243
```

### Step 3: Navigate to App Directory

```bash
cd /home/omar/organizer_app
```

### Step 4: Deploy with Docker Compose

```bash
# Stop any existing containers
docker-compose down

# Build and start all services
docker-compose up -d --build

# Wait for services to start
sleep 10

# Check status
docker-compose ps
```

### Step 5: Initialize Database

```bash
# Initialize the database schema
docker exec organizer_backend node scripts/init-database.js
```

### Step 6: Verify Deployment

```bash
# Check backend health
curl http://localhost:3000/health

# Check all containers are running
docker-compose ps

# Should show:
# organizer_postgres   - Up (healthy)
# organizer_backend    - Up (healthy)
# organizer_frontend   - Up
```

---

## 🗄️ Database Management

### Access PostgreSQL

```bash
# Access PostgreSQL CLI
docker exec -it organizer_postgres psql -U organizer_user -d organizer

# List tables
\dt

# Exit PostgreSQL
\q
```

### Backup Database

```bash
# Create a backup
docker exec organizer_postgres pg_dump -U organizer_user organizer > backup_$(date +%Y%m%d).sql

# Or use pg_dumpall for everything
docker exec organizer_postgres pg_dumpall -U organizer_user > full_backup_$(date +%Y%m%d).sql
```

### Restore Database

```bash
# Restore from backup
cat backup_20251121.sql | docker exec -i organizer_postgres psql -U organizer_user -d organizer
```

### Reset Database

```bash
# Drop and recreate database (WARNING: Deletes all data!)
docker exec organizer_postgres psql -U organizer_user -c "DROP DATABASE IF EXISTS organizer;"
docker exec organizer_postgres psql -U organizer_user -c "CREATE DATABASE organizer;"

# Re-initialize schema
docker exec organizer_backend node scripts/init-database.js
```

---

## 📊 Monitoring \u0026 Logs

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f organizer_backend
docker-compose logs -f organizer_frontend
docker-compose logs -f organizer_postgres

# Last 100 lines
docker-compose logs --tail=100
```

### Check Service Status

```bash
# All containers
docker-compose ps

# Detailed stats
docker stats organizer_backend organizer_frontend organizer_postgres
```

### Health Checks

```bash
# Backend health
curl http://localhost:3000/health
# or from external
curl http://46.202.189.243:3000/health

# Database connection
docker exec organizer_postgres pg_isready -U organizer_user -d organizer

# Frontend
curl -I http://localhost:8080
# or from external
curl -I http://46.202.189.243:8080
```

---

## 🐛 Troubleshooting

### Services Won't Start

```bash
# Check logs for errors
docker-compose logs

# Rebuild from scratch
docker-compose down -v
docker-compose up -d --build
```

### Database Connection Issues

```bash
# Check if postgres is healthy
docker-compose ps organizer_postgres

# Check backend logs
docker-compose logs organizer_backend

# Verify database credentials
docker exec organizer_postgres psql -U organizer_user -d organizer -c "SELECT 1;"
```

### Port Conflicts

```bash
# Check if ports are in use
sudo netstat -tulpn | grep -E ':(8080|3000|5435)'

# Kill process using the port (if needed)
sudo kill -9 $(sudo lsof -t -i:8080)
```

### Frontend Can't Connect to Backend

1. Check nginx configuration in the container:
   ```bash
   docker exec organizer_frontend cat /etc/nginx/conf.d/default.conf
   ```

2. Test backend from frontend container:
   ```bash
   docker exec organizer_frontend wget -O- http://organizer_backend:3000/health
   ```

3. Check network connectivity:
   ```bash
   docker network inspect organizer_app_organizer_network
   ```

### Container Keeps Restarting

```bash
# Check logs for the crashing container
docker-compose logs organizer_backend

# Check if it's a health check failure
docker inspect organizer_backend | grep -A 20 Health
```

---

## 🔄 Updating the App

### Update Code Only (No Schema Changes)

```bash
# On your local machine, run the deployment script again
.\deploy.ps1

# Or manually:
# 1. Copy updated files to VPS
# 2. SSH into VPS
# 3. Rebuild and restart
cd /home/omar/organizer_app
docker-compose up -d --build
```

### Update with Database Schema Changes

```bash
# 1. Backup the database first!
docker exec organizer_postgres pg_dump -U organizer_user organizer > backup_before_update.sql

# 2. Deploy new code
.\deploy.ps1

# 3. Run migration or reinitialize database
docker exec organizer_backend node scripts/init-database.js
```

### Rollback to Previous Version

```bash
# Stop current version
docker-compose down

# Restore database from backup
cat backup_before_update.sql | docker exec -i organizer_postgres psql -U organizer_user -d organizer

# Deploy previous version code (copy old files back)
# Then restart
docker-compose up -d
```

- The organizer app runs **completely separate** from your production docker-compose stack (n8n, WordPress, etc.)
- Database data is persisted in Docker volume `organizer_db_data`
- All services are in an isolated network `organizer_network`
- No Traefik integration - direct port access only
- Frontend automatically proxies `/api` requests to the backend

---

## 🆘 Support

If you encounter issues:

1. Check the logs: `docker-compose logs -f`
2. Verify all services are healthy: `docker-compose ps`
3. Check the troubleshooting section above
4. Ensure ports 8080, 3000, and 5435 are not blocked by firewall

---

**Last Updated**: November 21, 2025
