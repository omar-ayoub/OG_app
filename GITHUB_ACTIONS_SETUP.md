# GitHub Actions CI/CD Setup Guide

Complete step-by-step guide to set up automated deployment to your VPS using GitHub Actions.

**Once set up, deployment is as simple as:**
```bash
git push
```

---

## 📋 Prerequisites

- GitHub account
- Git installed on your PC
- SSH access to your VPS (46.202.189.243)
- Your SSH private key file

---

## Step 1: Create a GitHub Repository

### Option A: Create New Repository on GitHub.com

1. Go to https://github.com/new
2. Repository name: `OG_app` (or any name you prefer)
3. **Important:** Keep it **Private** (your code contains sensitive info)
4. Do **NOT** initialize with README, .gitignore, or license
5. Click "Create repository"

### Option B: Use Existing Repository

If you already have a GitHub repository, skip to Step 2.

---

## Step 2: Push Your Code to GitHub

Open PowerShell in your project folder (`c:\apps\OG_app`) and run:

```powershell
# Initialize git (if not already done)
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit"

# Set default branch to main
git branch -M main

# Add your GitHub repository as remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/OG_app.git

# Push to GitHub
git push -u origin main
```

**Note:** If prompted for credentials, use:
- Username: Your GitHub username
- Password: A Personal Access Token (NOT your GitHub password)
  - Create one at: https://github.com/settings/tokens
  - Select scopes: `repo`, `workflow`

---

## Step 3: Get Your SSH Private Key Content

You need to add your SSH private key to GitHub Secrets. Here's how to get it:

```powershell
# Display your SSH private key
Get-Content C:\Users\omar\.ssh\id_ed25519
```

**Copy the entire output**, including:
- `-----BEGIN OPENSSH PRIVATE KEY-----`
- All the lines in between
- `-----END OPENSSH PRIVATE KEY-----`

---

## Step 4: Get Known Hosts

Run this command to get your server's known hosts entry:

```powershell
ssh-keyscan -H 46.202.189.243
```

**Copy the output** (it will be one or more lines starting with `46.202.189.243` or `|1|...`)

---

## Step 5: Add Secrets to GitHub

1. Go to your GitHub repository: `https://github.com/YOUR_USERNAME/OG_app`
2. Click **Settings** (top menu)
3. In the left sidebar, click **Secrets and variables** → **Actions**
4. Click **New repository secret**

Add these 4 secrets one by one:

### Secret 1: `VPS_HOST`
- Name: `VPS_HOST`
- Value: `46.202.189.243`
- Click **Add secret**

### Secret 2: `VPS_USER`
- Name: `VPS_USER`
- Value: `root`
- Click **Add secret**

### Secret 3: `SSH_PRIVATE_KEY`
- Name: `SSH_PRIVATE_KEY`
- Value: **Paste the entire SSH private key** (from Step 3)
- Click **Add secret**

### Secret 4: `KNOWN_HOSTS`
- Name: `KNOWN_HOSTS`
- Value: **Paste the output from ssh-keyscan** (from Step 4)
- Click **Add secret**

---

## Step 6: Verify the Workflow File

The GitHub Actions workflow file is already in your project at:
```
.github/workflows/deploy.yml
```

If you want to review it, open that file. It defines:
- **Trigger:** Runs on push to `main` branch
- **Jobs:** 
  1. Lint the code
  2. Deploy to VPS

---

## Step 7: Test the Deployment

### Make a Small Change

Edit any file (e.g., add a comment), then:

```powershell
git add .
git commit -m "Test automated deployment"
git push
```

### Watch the Deployment

1. Go to your GitHub repository
2. Click the **Actions** tab
3. You'll see your workflow running
4. Click on the workflow run to see detailed logs
5. Wait for both jobs (lint & deploy) to complete (green checkmarks)

---

## Step 8: Verify on Server

After the workflow completes successfully:

1. Visit: http://46.202.189.243:8080
2. Your changes should be live!

---

## 🎉 You're Done!

From now on, every time you want to deploy:

```powershell
# Make your changes in the code

# Commit and push
git add .
git commit -m "Your change description"
git push

# GitHub Actions will automatically:
# 1. Lint your code
# 2. Deploy to your VPS
# 3. Restart Docker containers
# All in about 1-2 minutes!
```

---

## 📊 Monitoring Deployments

### View Deployment History
- Go to: `https://github.com/YOUR_USERNAME/OG_app/actions`
- See all past deployments, their status, and logs

### Get Notified
- GitHub will email you if a deployment fails
- You can also enable notifications in your GitHub settings

---

## 🔧 Troubleshooting

### Workflow Fails with "Host key verification failed"
- **Solution:** Double-check the `KNOWN_HOSTS` secret. Re-run `ssh-keyscan -H 46.202.189.243` and update the secret.

### Workflow Fails with "Permission denied (publickey)"
- **Solution:** Your SSH private key might be wrong. Verify the `SSH_PRIVATE_KEY` secret contains the full private key.

### Workflow Succeeds but Changes Not Live
- **Solution:** SSH into your server and check Docker logs:
  ```bash
  ssh root@46.202.189.243
  cd /home/omar/organizer_app
  docker-compose logs -f
  ```

### Want to Deploy Without Pushing to Main?
- You can manually trigger the workflow:
  1. Go to **Actions** tab
  2. Click **Deploy to VPS** workflow
  3. Click **Run workflow**

---

## 🚀 Advanced: Deploy to Staging First

If you want to test changes before deploying to production:

1. Create a `staging` branch:
   ```bash
   git checkout -b staging
   ```

2. Modify `.github/workflows/deploy.yml`:
   ```yaml
   on:
     push:
       branches: [ main, staging ]
   ```

3. Push to staging to test:
   ```bash
   git push origin staging
   ```

4. When ready, merge to main:
   ```bash
   git checkout main
   git merge staging
   git push
   ```

---

## 📝 Notes

- **Security:** Your SSH private key is stored securely in GitHub Secrets (encrypted)
- **Build Time:** Deployments typically take 1-2 minutes
- **Rollback:** If something breaks, you can revert your commit and push again
- **Cost:** GitHub Actions is free for public repos, and private repos get 2,000 minutes/month free

---

**Last Updated:** November 21, 2025
