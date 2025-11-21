# Quick Start: GitHub Actions Setup
# Run this script to complete the setup quickly

Write-Host "🚀 GitHub Actions CI/CD Setup" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check if Git is initialized
if (-not (Test-Path ".git")) {
    Write-Host "📦 Step 1: Initializing Git repository..." -ForegroundColor Yellow
    git init
    git branch -M main
    Write-Host "✅ Git initialized!" -ForegroundColor Green
}
else {
    Write-Host "✅ Git already initialized" -ForegroundColor Green
}

Write-Host ""

# Step 2: Prompt for GitHub username
Write-Host "📝 Step 2: GitHub Repository Setup" -ForegroundColor Yellow
$githubUsername = Read-Host "Enter your GitHub username"

Write-Host ""
Write-Host "🌐 Please create a PRIVATE repository on GitHub:" -ForegroundColor Cyan
Write-Host "   1. Go to: https://github.com/new" -ForegroundColor White
Write-Host "   2. Repository name: OG_app" -ForegroundColor White
Write-Host "   3. Set to: PRIVATE ⚠️ (important!)" -ForegroundColor White
Write-Host "   4. Do NOT initialize with README" -ForegroundColor White
Write-Host "   5. Click 'Create repository'" -ForegroundColor White
Write-Host ""

$continue = Read-Host "Press ENTER when you've created the repository..."

# Step 3: Add remote
Write-Host ""
Write-Host "📡 Step 3: Connecting to GitHub..." -ForegroundColor Yellow

# Check if remote already exists
$remotes = git remote
if ($remotes -contains "origin") {
    Write-Host "⚠️  Remote 'origin' already exists. Removing old remote..." -ForegroundColor Yellow
    git remote remove origin
}

$repoUrl = "https://github.com/$githubUsername/OG_app.git"
git remote add origin $repoUrl
Write-Host "✅ Connected to: $repoUrl" -ForegroundColor Green

# Step 4: Create initial commit if needed
Write-Host ""
Write-Host "📝 Step 4: Creating initial commit..." -ForegroundColor Yellow

# Add all files
git add .

# Commit
$commitExists = git log --oneline 2>$null
if (-not $commitExists) {
    git commit -m "Initial commit - Organizer App with GitHub Actions"
    Write-Host "✅ Initial commit created!" -ForegroundColor Green
}
else {
    Write-Host "ℹ️  Commits already exist" -ForegroundColor Cyan
}

# Step 5: Push to GitHub
Write-Host ""
Write-Host "🚀 Step 5: Pushing to GitHub..." -ForegroundColor Yellow
Write-Host "You may need to enter your GitHub credentials:" -ForegroundColor Cyan
Write-Host "- Username: $githubUsername" -ForegroundColor White
Write-Host "- Password: Use a Personal Access Token (NOT your password)" -ForegroundColor White  
Write-Host "  Create token at: https://github.com/settings/tokens" -ForegroundColor White
Write-Host ""

try {
    git push -u origin main
    Write-Host "✅ Code pushed to GitHub!" -ForegroundColor Green
}
catch {
    Write-Host "⚠️  Push failed. You may need to configure authentication." -ForegroundColor Yellow
    Write-Host "Run: git push -u origin main" -ForegroundColor White
}

# Step 6: Instructions for GitHub Secrets
Write-Host ""
Write-Host "===================================" -ForegroundColor Cyan
Write-Host "🔑 NEXT STEP: Add GitHub Secrets" -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Open this file: GITHUB_SECRETS.txt" -ForegroundColor Yellow
Write-Host ""
Write-Host "2. Go to: https://github.com/$githubUsername/OG_app/settings/secrets/actions" -ForegroundColor Yellow
Write-Host ""
Write-Host "3. Click 'New repository secret' and add all 4 secrets from the file:" -ForegroundColor Yellow
Write-Host "   - VPS_HOST" -ForegroundColor White
Write-Host "   - VPS_USER" -ForegroundColor White
Write-Host "   - SSH_PRIVATE_KEY" -ForegroundColor White
Write-Host "   - KNOWN_HOSTS" -ForegroundColor White
Write-Host ""
Write-Host "4. After adding all secrets, test by pushing a change:" -ForegroundColor Yellow
Write-Host "   git add ." -ForegroundColor White
Write-Host "   git commit -m 'Test deployment'" -ForegroundColor White
Write-Host "   git push" -ForegroundColor White
Write-Host ""
Write-Host "5. Watch the deployment at: https://github.com/$githubUsername/OG_app/actions" -ForegroundColor Yellow
Write-Host ""
Write-Host "✨ Once complete, every 'git push' will auto-deploy to your server!" -ForegroundColor Green
Write-Host ""

# Open the secrets file
Write-Host "Opening GITHUB_SECRETS.txt for you..." -ForegroundColor Cyan
Start-Process notepad.exe "GITHUB_SECRETS.txt"
