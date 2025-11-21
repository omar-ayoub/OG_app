# Configuration
$VPS_USER = "root"
$VPS_HOST = "46.202.189.243"
$VPS_PATH = "/home/omar/organizer_app"
$COMPOSE_FILE = "organizer-docker-compose.yml"

# Create directory on VPS if it doesn't exist
ssh ${VPS_USER}@${VPS_HOST} "mkdir -p ${VPS_PATH}"

# Copy docker-compose file
Write-Host "  → Copying docker-compose file..." -ForegroundColor Gray
scp $COMPOSE_FILE ${VPS_USER}@${VPS_HOST}:${VPS_PATH}/docker-compose.yml

# Copy backend directory
Write-Host "  → Copying backend..." -ForegroundColor Gray
scp -r backend ${VPS_USER}@${VPS_HOST}:${VPS_PATH}/

# Copy frontend files
Write-Host "  → Copying frontend files..." -ForegroundColor Gray
scp -r src ${VPS_USER}@${VPS_HOST}:${VPS_PATH}/
scp -r public ${VPS_USER}@${VPS_HOST}:${VPS_PATH}/
scp package*.json ${VPS_USER}@${VPS_HOST}:${VPS_PATH}/
scp vite.config.ts ${VPS_USER}@${VPS_HOST}:${VPS_PATH}/
scp "tsconfig*.json" ${VPS_USER}@${VPS_HOST}:${VPS_PATH}/
scp index.html ${VPS_USER}@${VPS_HOST}:${VPS_PATH}/
scp tailwind.config.js ${VPS_USER}@${VPS_HOST}:${VPS_PATH}/
scp postcss.config.js ${VPS_USER}@${VPS_HOST}:${VPS_PATH}/
scp Dockerfile ${VPS_USER}@${VPS_HOST}:${VPS_PATH}/
scp nginx.conf ${VPS_USER}@${VPS_HOST}:${VPS_PATH}/
scp .dockerignore ${VPS_USER}@${VPS_HOST}:${VPS_PATH}/ 2>$null

Write-Host "✅ Files copied successfully!" -ForegroundColor Green

Write-Host "🐳 Step 2: Deploying with Docker Compose on VPS..." -ForegroundColor Yellow

# Deploy on VPS
$deployCommands = @"
cd /home/omar/organizer_app
echo '  → Stopping existing containers (if any)...'
docker-compose down 2>/dev/null || true
echo '  → Building and starting services...'
docker-compose up -d --build
echo '  → Waiting for services to start...'
sleep 10
echo '  → Checking service status...'
docker-compose ps
echo '  → Initializing database...'
docker exec organizer_backend node scripts/init-database.js || echo 'Database may already be initialized'
echo '  → Testing backend health...'
curl -f http://localhost:3000/health || echo 'Backend health check failed'
"@

ssh ${VPS_USER}@${VPS_HOST} $deployCommands

Write-Host "✅ Deployment complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Access your app:" -ForegroundColor Cyan
Write-Host "   Frontend: http://46.202.189.243:8080" -ForegroundColor White
Write-Host "   Backend API: http://46.202.189.243:3000" -ForegroundColor White
Write-Host "   Database: 46.202.189.243:5435" -ForegroundColor White
Write-Host ""
Write-Host "🔍 To check logs:" -ForegroundColor Cyan
Write-Host "   ssh ${VPS_USER}@${VPS_HOST}" -ForegroundColor White
Write-Host "   cd ${VPS_PATH}" -ForegroundColor White
Write-Host "   docker-compose logs -f" -ForegroundColor White
Write-Host ""
