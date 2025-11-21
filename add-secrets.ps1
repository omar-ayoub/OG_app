# Quick GitHub Secrets Setup
# Adds secrets to your existing GitHub repository

Write-Host "🔐 Adding secrets to omar-ayoub/OG_app..." -ForegroundColor Cyan
Write-Host ""

$gh = "C:\Program Files\GitHub CLI\gh.exe"
$REPO = "omar-ayoub/OG_app"

# Step 1: Authenticate
Write-Host "Step 1: Authenticating with GitHub..." -ForegroundColor Yellow
& $gh auth login

Write-Host ""

# Step 2: Gather secrets  
Write-Host "Step 2: Gathering secrets from your PC..." -ForegroundColor Yellow

$SSH_KEY = Get-Content "C:\Users\omar\.ssh\id_ed25519" -Raw
$KNOWN_HOSTS_CONTENT = Get-Content "C:\Users\omar\.ssh\known_hosts" | Select-String -Pattern "46.202.189.243"
$KNOWN_HOSTS = $KNOWN_HOSTS_CONTENT -join "`n"
$VPS_HOST = "46.202.189.243"
$VPS_USER = "root"

Write-Host "✅ Secrets gathered!" -ForegroundColor Green
Write-Host ""

# Step 3: Add secrets
Write-Host "Step 3: Adding secrets to GitHub..." -ForegroundColor Yellow

try {
    Write-Host "  → VPS_HOST" -ForegroundColor Gray
    $VPS_HOST | & $gh secret set VPS_HOST -R $REPO
    
    Write-Host "  → VPS_USER" -ForegroundColor Gray
    $VPS_USER | & $gh secret set VPS_USER -R $REPO
    
    Write-Host "  → SSH_PRIVATE_KEY" -ForegroundColor Gray
    $SSH_KEY | & $gh secret set SSH_PRIVATE_KEY -R $REPO
    
    Write-Host "  → KNOWN_HOSTS" -ForegroundColor Gray
    $KNOWN_HOSTS | & $gh secret set KNOWN_HOSTS -R $REPO
    
    Write-Host "✅ All secrets added successfully!" -ForegroundColor Green
}
catch {
    Write-Host "❌ Error: $_" -ForegroundColor Red
}

Write-Host ""

# Step 4: Verify
Write-Host "Step 4: Verifying secrets..." -ForegroundColor Yellow
& $gh secret list -R $REPO

Write-Host ""
Write-Host "✅ Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next: Push your code to trigger deployment:" -ForegroundColor Cyan
Write-Host "  git push" -ForegroundColor White
