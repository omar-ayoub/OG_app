#!/bin/bash

# Deployment Script for Organizer App to VPS
# This script deploys the organizer app to your VPS at 46.202.189.243

set -e  # Exit on error

echo "🚀 Starting Organizer App Deployment..."

# Configuration
VPS_HOST="46.202.189.243"
VPS_USER="root"
VPS_PATH="/home/omar/organizer_app"
COMPOSE_FILE="organizer-docker-compose.yml"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}📦 Step 1: Building Docker images locally (optional test)...${NC}"
# Uncomment to test build locally before deploying
# docker-compose -f $COMPOSE_FILE build

echo -e "${YELLOW}📤 Step 2: Copying files to VPS...${NC}"

# Create directory on VPS if it doesn't exist
ssh ${VPS_USER}@${VPS_HOST} "mkdir -p ${VPS_PATH}"

# Copy docker-compose file
echo "  → Copying docker-compose file..."
scp $COMPOSE_FILE ${VPS_USER}@${VPS_HOST}:${VPS_PATH}/docker-compose.yml

# Copy backend directory
echo "  → Copying backend..."
scp -r backend ${VPS_USER}@${VPS_HOST}:${VPS_PATH}/

# Copy frontend files
echo "  → Copying frontend files..."
scp -r src ${VPS_USER}@${VPS_HOST}:${VPS_PATH}/
scp -r public ${VPS_USER}@${VPS_HOST}:${VPS_PATH}/
scp package.json package-lock.json tsconfig.json tsconfig.node.json tsconfig.app.json vite.config.ts index.html nginx.conf .env.production tailwind.config.js postcss.config.js eslint.config.js ${VPS_USER}@${VPS_HOST}:${VPS_PATH}/
scp Dockerfile ${VPS_USER}@${VPS_HOST}:${VPS_PATH}/
scp .dockerignore ${VPS_USER}@${VPS_HOST}:${VPS_PATH}/ 2>/dev/null || true

echo -e "${GREEN}✅ Files copied successfully!${NC}"

echo -e "${YELLOW}🐳 Step 3: Deploying with Docker Compose on VPS...${NC}"

ssh ${VPS_USER}@${VPS_HOST} << 'ENDSSH'
cd /home/omar/organizer_app

echo "  → Stopping existing containers (if any)..."
docker-compose down 2>/dev/null || true

echo "  → Building and starting services..."
docker-compose up -d --build

echo "  → Waiting for services to start..."
sleep 10

echo "  → Checking service status..."
docker-compose ps

echo "  → Initializing database..."
docker exec organizer_backend node scripts/init-database.js || echo "Database may already be initialized"

echo "  → Testing backend health..."
curl -f http://localhost:3000/health || echo "Backend health check failed"

ENDSSH

echo -e "${GREEN}✅ Deployment complete!${NC}"
echo ""
echo "📋 Access your app:"
echo "   Frontend: http://46.202.189.243:8080"
echo "   Backend API: http://46.202.189.243:3000"
echo "   Database: 46.202.189.243:5435"
echo ""
echo "🔍 To check logs:"
echo "   ssh ${VPS_USER}@${VPS_HOST}"
echo "   cd ${VPS_PATH}"
echo "   docker-compose logs -f"
echo ""
