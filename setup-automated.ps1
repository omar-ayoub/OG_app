# Complete Automated GitHub Actions CI/CD Setup
# This script does EVERYTHING from the terminal, including adding secrets

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "🚀 GitHub Actions Complete Automation" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# Configuration
$REPO_OWNER = "omar-ayoub"
$REPO_NAME = "OG_app"
$REPO_FULL = "$REPO_OWNER/$REPO_NAME"

# Step 1: Check if GitHub CLI is installed
Write-Host "📦 Step 1: Checking GitHub CLI..." -ForegroundColor Yellow

$ghInstalled = Get-Command gh -ErrorAction SilentlyContinue
if (-not $ghInstalled) {
    Write-Host "❌ GitHub CLI not found. Installing..." -ForegroundColor Red
    Write-Host "Installing via winget..." -ForegroundColor Cyan
    winget install --id GitHub.cli -e
    
    Write-Host ""
    Write-Host "⚠️  Please close and reopen PowerShell, then run this script again." -ForegroundColor Yellow
    Write-Host "Press any key to exit..." -ForegroundColor Gray
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    exit
}

Write-Host "✅ GitHub CLI is installed!" -ForegroundColor Green
Write-Host ""

# Step 2: Authenticate with GitHub
Write-Host "🔐 Step 2: Authenticating with GitHub..." -ForegroundColor Yellow

$authStatus = gh auth status 2>&1
if ($authStatus -match "not logged") {
    Write-Host "Please login to GitHub..." -ForegroundColor Cyan
    gh auth login
}
else {
    Write-Host "✅ Already authenticated!" -ForegroundColor Green
}

Write-Host ""

# Step 3: Set up Git
Write-Host "📝 Step 3: Setting up Git..." -ForegroundColor Yellow

# Initialize git if needed
if (-not (Test-Path ".git")) {
    git init
    git branch -M main
    Write-Host "✅ Git initialized!" -ForegroundColor Green
}
else {
    Write-Host "✅ Git already initialized" -ForegroundColor Green
}

# Add remote if not exists
$remotes = git remote 2>&1
if ($remotes -notcontains "origin") {
    git remote add origin "https://github.com/$REPO_FULL.git"
    Write-Host "✅ Remote added: https://github.com/$REPO_FULL.git" -ForegroundColor Green
}
else {
    Write-Host "✅ Remote already exists" -ForegroundColor Green
}

Write-Host ""

# Step 4: Read secrets from local system
Write-Host "🔑 Step 4: Gathering secrets..." -ForegroundColor Yellow

# Read SSH private key
$SSH_PRIVATE_KEY = Get-Content "C:\Users\omar\.ssh\id_ed25519" -Raw

# Get known hosts
$KNOWN_HOSTS_CONTENT = Get-Content "C:\Users\omar\.ssh\known_hosts" | Select-String -Pattern "46.202.189.243"
$KNOWN_HOSTS = $KNOWN_HOSTS_CONTENT -join "`n"

$VPS_HOST = "46.202.189.243"
$VPS_USER = "root"

Write-Host "✅ Secrets gathered!" -ForegroundColor Green
Write-Host ""

# Step 5: Add secrets to GitHub
Write-Host "🔐 Step 5: Adding secrets to GitHub repository..." -ForegroundColor Yellow

try {
    Write-Host "  → Adding VPS_HOST..." -ForegroundColor Gray
    $VPS_HOST | gh secret set VPS_HOST -R $REPO_FULL

    Write-Host "  → Adding VPS_USER..." -ForegroundColor Gray
    $VPS_USER | gh secret set VPS_USER -R $REPO_FULL

    Write-Host "  → Adding SSH_PRIVATE_KEY..." -ForegroundColor Gray
    $SSH_PRIVATE_KEY | gh secret set SSH_PRIVATE_KEY -R $REPO_FULL

    Write-Host "  → Adding KNOWN_HOSTS..." -ForegroundColor Gray
    $KNOWN_HOSTS | gh secret set KNOWN_HOSTS -R $REPO_FULL

    Write-Host "✅ All secrets added to GitHub!" -ForegroundColor Green
}
catch {
    Write-Host "⚠️  Error adding secrets: $_" -ForegroundColor Red
    Write-Host "You may need to add them manually via GitHub web interface" -ForegroundColor Yellow
}

Write-Host ""

# Step 6: Commit and push workflow file
Write-Host "📤 Step 6: Pushing code to GitHub..." -ForegroundColor Yellow

# Add all files
git add .

# Check if there are changes to commit
$status = git status --porcelain
if ($status) {
    git commit -m "Add GitHub Actions CI/CD workflow"
    Write-Host "✅ Changes committed!" -ForegroundColor Green
    
    # Push to GitHub
    git push -u origin main 2>&1
    Write-Host "✅ Code pushed to GitHub!" -ForegroundColor Green
}
else {
    Write-Host "ℹ️  No changes to commit" -ForegroundColor Cyan
    
    # Still push to ensure everything is up to date
    git push -u origin main 2>&1
    Write-Host "✅ Repository synchronized!" -ForegroundColor Green
}

Write-Host ""

# Step 7: Verify secrets
Write-Host "✅ Step 7: Verifying secrets..." -ForegroundColor Yellow
gh secret list -R $REPO_FULL

Write-Host ""
Write-Host "======================================" -ForegroundColor Green
Write-Host "✨ Setup Complete!" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Green
Write-Host ""
Write-Host "🎉 You're all set! Here's what was done:" -ForegroundColor Cyan
Write-Host ""
Write-Host "✓ GitHub CLI authenticated" -ForegroundColor Green
Write-Host "✓ Git repository initialized" -ForegroundColor Green
Write-Host "✓ Remote connected to: https://github.com/$REPO_FULL" -ForegroundColor Green
Write-Host "✓ All 4 secrets added to GitHub" -ForegroundColor Green
Write-Host "✓ Workflow file pushed to repository" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 Next Steps:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Make a change to your code" -ForegroundColor White
Write-Host "2. Run:" -ForegroundColor White
Write Host "   git add ." -ForegroundColor Cyan
Write-Host "   git commit -m 'Your message'" -ForegroundColor Cyan
Write-Host "   git push" -ForegroundColor Cyan
Write-Host ""
Write-Host "3. Watch the deployment:" -ForegroundColor White
Write-Host "   https://github.com/$REPO_FULL/actions" -ForegroundColor Cyan
Write-Host ""
Write-Host "✨ From now on, every 'git push' auto-deploys to your server!" -ForegroundColor Green
Write-Host ""

# Ask if user wants to trigger a test deployment
Write-Host "Would you like to trigger a test deployment right now? (y/n): " -ForegroundColor Yellow -NoNewline
$response = Read-Host

if ($response -eq 'y' -or $response -eq 'Y') {
    Write-Host ""
    Write-Host "🧪 Triggering test deployment..." -ForegroundColor Cyan
    
    # Create a test commit
    $testFile = "deployment-test.txt"
    Get-Date | Out-File $testFile
    git add $testFile
    git commit -m "Test deployment - $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
    git push
    
    Write-Host ""
    Write-Host "✅ Test deployment triggered!" -ForegroundColor Green
    Write-Host "Watch it here: https://github.com/$REPO_FULL/actions" -ForegroundColor Cyan
    Write-Host ""
    
    # Open in browser
    Start-Process "https://github.com/$REPO_FULL/actions"
}

Write-Host ""
Write-Host "Press any key to finish..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
