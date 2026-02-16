# VPS Deployment Guide

This guide explains how to deploy the Water Conference website to your VPS server using GitHub and Docker.

## 🎯 Overview

- **Code Repository**: GitHub
- **Server**: Your VPS
- **Deployment Method**: Git pull + Docker Compose
- **Database**: SQLite (stored on VPS filesystem)

## ⚠️ Database Safety

**IMPORTANT**: Your production database and uploads are stored in `vps-data/` on the VPS. This directory is:
- ✅ **NOT in Git** (protected by .gitignore)
- ✅ **Persists across deployments**
- ✅ **Safe from being overwritten**

When you deploy code updates, the database and uploads will NOT be affected!

---

## 📋 First-Time Setup (One Time Only)

### Step 1: Prepare Your VPS

SSH into your VPS and run the setup script:

```bash
# Download the setup script
wget https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/setup-vps.sh

# Make it executable
chmod +x setup-vps.sh

# Run it (requires sudo)
sudo ./setup-vps.sh
```

This will install:
- Docker & Docker Compose
- Git
- Firewall configuration

### Step 2: Clone Your Repository

```bash
cd /opt/water-conference
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git .
```

### Step 3: Configure Environment

```bash
# Copy the example env file
cp .env.example .env

# Edit it and add a secure JWT secret
nano .env
```

Generate a secure JWT secret:
```bash
openssl rand -base64 32
```

### Step 4: First Deployment

```bash
# Make deployment script executable
chmod +x deploy-to-vps.sh

# Run deployment
./deploy-to-vps.sh
```

---

## 🚀 Regular Deployments (Every Time You Update Code)

When you push new code to GitHub, deploy it to your VPS:

### On Your VPS:

```bash
cd /opt/water-conference

# Pull latest code from GitHub
git pull origin main

# Run deployment script
./deploy-to-vps.sh
```

That's it! The script will:
1. ✅ Build the frontend
2. ✅ Copy static files
3. ✅ Rebuild Docker containers
4. ✅ Restart the application
5. ✅ **PRESERVE your database and uploads** (they're in `vps-data/`)

---

## 📂 Directory Structure on VPS

```
/opt/water-conference/
├── backend/           # Rust backend code
├── frontend/          # React frontend code
├── vps-data/          # ⚠️ PRODUCTION DATA (never in Git)
│   ├── database/      # SQLite database files
│   └── uploads/       # User uploaded files
├── .env               # Environment variables (never in Git)
├── docker-compose.yml # Docker configuration
└── deploy-to-vps.sh   # Deployment script
```

---

## 🔧 Useful Commands

### View Application Logs
```bash
docker-compose logs -f
```

### Check Container Status
```bash
docker-compose ps
```

### Restart Application
```bash
docker-compose restart
```

### Stop Application
```bash
docker-compose down
```

### Start Application
```bash
docker-compose up -d
```

### Access Database (for debugging)
```bash
docker-compose exec app sh
cd data
sqlite3 conference.db
```

---

## 💾 Backup Your Data

**CRITICAL**: Regularly backup your production data!

```bash
# Create backup directory
mkdir -p ~/backups

# Backup database and uploads
tar -czf ~/backups/water-conference-$(date +%Y%m%d).tar.gz vps-data/

# Or use a cron job for automatic backups
```

Example cron job (backup daily at 2 AM):
```bash
crontab -e

# Add this line:
0 2 * * * cd /opt/water-conference && tar -czf ~/backups/water-conference-$(date +\%Y\%m\%d).tar.gz vps-data/
```

---

## 🌐 Setting Up a Domain (Optional)

If you want to use a custom domain (e.g., waterconference.com):

1. Point your domain's A record to your VPS IP
2. Install Nginx as reverse proxy:

```bash
sudo apt-get install nginx

# Create nginx config
sudo nano /etc/nginx/sites-available/waterconference
```

Nginx configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable and restart:
```bash
sudo ln -s /etc/nginx/sites-available/waterconference /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

3. Install SSL with Let's Encrypt (free HTTPS):
```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

## 🆘 Troubleshooting

### Issue: Container won't start
```bash
# Check logs
docker-compose logs

# Rebuild from scratch
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Issue: Permission denied on vps-data
```bash
sudo chown -R $USER:$USER vps-data/
```

### Issue: Port 3000 already in use
```bash
# Find what's using the port
sudo lsof -i :3000

# Kill it or change the port in docker-compose.yml
```

---

## 📝 Development Workflow

1. **Local Development**: Make changes on your computer
2. **Test Locally**: Run and test your changes
3. **Commit to Git**: `git add .` → `git commit -m "message"` → `git push`
4. **Deploy to VPS**: SSH to VPS → `git pull` → `./deploy-to-vps.sh`

**Remember**: The database on your local machine is separate from the VPS database. They won't affect each other!

---

## ✅ Checklist

- [ ] VPS has Docker and Docker Compose installed
- [ ] Repository cloned to `/opt/water-conference`
- [ ] `.env` file created with secure JWT_SECRET
- [ ] Firewall configured (ports 3000, 80, 443, SSH open)
- [ ] First deployment successful
- [ ] Application accessible via VPS IP
- [ ] Backup system configured
- [ ] (Optional) Domain and SSL configured

---

## 🎉 That's It!

Your application is now:
- ✅ Running on your VPS
- ✅ Deployed via Git
- ✅ Database is safe and persistent
- ✅ Easy to update with new code

Questions? Check the logs: `docker-compose logs -f`
