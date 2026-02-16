# VPS Deployment Guide

This guide helps you migrate from Railway (testing) to a VPS (production).

## Prerequisites

- Ubuntu 22.04+ VPS (DigitalOcean, Hetzner, Linode, etc.)
- Domain name (optional but recommended)
- SSH access to your VPS

## Step 1: Export Database from Railway

Before moving to VPS, download your database from Railway:

### Option A: Using Railway CLI
```bash
# Install Railway CLI if not installed
npm install -g @railway/cli

# Login
railway login

# Link to your project
railway link

# Download database
railway run cat ./data/conference.db > conference_backup.db
```

### Option B: Using Railway Dashboard
1. Go to Railway Dashboard → Your Project
2. Open the shell (if available)
3. Run: `cat ./data/conference.db | base64`
4. Copy the output and decode locally:
   ```bash
   echo "BASE64_OUTPUT" | base64 -d > conference_backup.db
   ```

## Step 2: Prepare VPS Server

SSH into your VPS:
```bash
ssh root@your-server-ip
```

### Install Dependencies
```bash
# Update system
apt update && apt upgrade -y

# Install required packages
apt install -y nginx certbot python3-certbot-nginx git curl build-essential pkg-config libssl-dev sqlite3

# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env

# Install Node.js (for building frontend)
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
```

## Step 3: Deploy Application

### Create App Directory
```bash
mkdir -p /var/www/water-conference
cd /var/www/water-conference
```

### Clone Repository
```bash
git clone https://github.com/YOUR_USERNAME/water-conference-2026.git .
```

### Build Frontend
```bash
cd frontend
npm install
npm run build
cd ..
```

### Build Backend
```bash
cd backend
cargo build --release
cd ..
```

### Create Data Directory & Restore Database
```bash
mkdir -p backend/data
mkdir -p backend/uploads

# Copy your backup file to server first, then:
cp /path/to/conference_backup.db backend/data/conference.db

# Set permissions
chown -R www-data:www-data backend/data
chown -R www-data:www-data backend/uploads
chmod 755 backend/data
chmod 644 backend/data/conference.db
```

## Step 4: Create Environment File

```bash
cat > backend/.env << 'EOF'
SERVER_ADDR=127.0.0.1:3000
DATABASE_URL=sqlite:./data/conference.db?mode=rwc
RUST_LOG=info
ENVIRONMENT=production
JWT_SECRET=GENERATE_A_SECURE_SECRET_HERE
EOF

# Generate secure JWT secret
JWT_SECRET=$(openssl rand -hex 32)
sed -i "s/GENERATE_A_SECURE_SECRET_HERE/$JWT_SECRET/" backend/.env
```

## Step 5: Create Systemd Service

```bash
cat > /etc/systemd/system/water-conference.service << 'EOF'
[Unit]
Description=Water Conference API
After=network.target

[Service]
Type=simple
User=www-data
Group=www-data
WorkingDirectory=/var/www/water-conference/backend
EnvironmentFile=/var/www/water-conference/backend/.env
ExecStart=/var/www/water-conference/backend/target/release/water-conference-api
Restart=always
RestartSec=5

# Security settings
NoNewPrivileges=true
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=/var/www/water-conference/backend/data
ReadWritePaths=/var/www/water-conference/backend/uploads

[Install]
WantedBy=multi-user.target
EOF

# Reload systemd
systemctl daemon-reload
systemctl enable water-conference
systemctl start water-conference

# Check status
systemctl status water-conference
```

## Step 6: Configure Nginx

```bash
cat > /etc/nginx/sites-available/water-conference << 'EOF'
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Frontend static files
    location / {
        root /var/www/water-conference/frontend/dist;
        try_files $uri $uri/ /index.html;

        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # API proxy
    location /api {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Uploads
    location /uploads {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;

        # Allow large file uploads
        client_max_body_size 50M;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
EOF

# Enable site
ln -sf /etc/nginx/sites-available/water-conference /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test and restart Nginx
nginx -t
systemctl restart nginx
```

## Step 7: Add SSL Certificate (HTTPS)

```bash
# Replace with your domain
certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal is set up automatically
```

## Step 8: Configure Firewall

```bash
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
ufw enable
```

## Updating Your Website

When you need to update the code:

```bash
cd /var/www/water-conference

# Pull latest changes
git pull origin main

# Rebuild frontend (if changed)
cd frontend && npm run build && cd ..

# Rebuild backend (if changed)
cd backend && cargo build --release && cd ..

# Restart service
systemctl restart water-conference
```

## Database Backup on VPS

Set up automatic daily backups:

```bash
# Create backup script
cat > /var/www/water-conference/backup-db.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/var/www/water-conference/backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
mkdir -p $BACKUP_DIR
sqlite3 /var/www/water-conference/backend/data/conference.db ".backup '$BACKUP_DIR/conference_$TIMESTAMP.db'"
# Keep only last 7 days of backups
find $BACKUP_DIR -name "*.db" -mtime +7 -delete
EOF

chmod +x /var/www/water-conference/backup-db.sh

# Add to crontab (runs daily at 2 AM)
(crontab -l 2>/dev/null; echo "0 2 * * * /var/www/water-conference/backup-db.sh") | crontab -
```

## Troubleshooting

### Check logs
```bash
# Application logs
journalctl -u water-conference -f

# Nginx logs
tail -f /var/log/nginx/error.log
tail -f /var/log/nginx/access.log
```

### Restart services
```bash
systemctl restart water-conference
systemctl restart nginx
```

### Database issues
```bash
# Check database integrity
sqlite3 /var/www/water-conference/backend/data/conference.db "PRAGMA integrity_check;"
```

## Migration Workflow Summary

```
┌─────────────────────────────────────────────────────────────┐
│                    YOUR WORKFLOW                             │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. RAILWAY (Testing)                                        │
│     └─ Test website & admin panel                            │
│     └─ Add all your content (news, speakers, etc.)          │
│     └─ Make sure everything works                           │
│                                                              │
│  2. EXPORT DATABASE                                          │
│     └─ railway run cat ./data/conference.db > backup.db     │
│                                                              │
│  3. VPS (Production)                                         │
│     └─ Follow this guide to set up VPS                      │
│     └─ Upload backup.db to VPS                              │
│     └─ Restore: cp backup.db backend/data/conference.db     │
│     └─ Your data is now on VPS!                             │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Quick Commands Reference

| Task | Command |
|------|---------|
| Start service | `systemctl start water-conference` |
| Stop service | `systemctl stop water-conference` |
| Restart service | `systemctl restart water-conference` |
| View logs | `journalctl -u water-conference -f` |
| Check status | `systemctl status water-conference` |
| Backup database | `/var/www/water-conference/backup-db.sh` |
| Update code | `cd /var/www/water-conference && git pull` |
