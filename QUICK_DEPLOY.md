# Quick Deployment Reference

## 🚀 Fast Deployment (Using Script)

```bash
# 1. Update deploy.sh with your VPS info
nano deploy.sh
# Set: VPS_USER, VPS_HOST, VPS_PATH

# 2. Make executable and run
chmod +x deploy.sh
./deploy.sh

# Done! ✓
```

## 📋 What Gets Deployed

✅ **Frontend**: All static files (HTML, CSS, JS)
✅ **Backend**: Compiled Rust binary
✅ **Database**: Migrations + Speaker data updates
✅ **Assets**: Uploaded files, images

## 🗄️ Database Updates Included

- **Migration 010**: New speaker detail columns
  - Biography (bio_ru, bio_en, bio_tj)
  - Organization, Country, Email
  - Expertise, Achievements, Publications
  - Session information

- **Data Updates**:
  - Speaker 1 (Emomali Rahmon) - Full profile
  - Speaker 2 (Li Junhua) - Full profile

## 🔍 Quick Verification Commands

```bash
# Check service status
ssh user@vps 'sudo systemctl status water-conference'

# View logs
ssh user@vps 'sudo journalctl -u water-conference -f'

# Test API
curl http://your-domain.com/api/speakers/1?lang=en
curl http://your-domain.com/api/speakers/2?lang=en

# Check database
ssh user@vps 'sqlite3 /app/data/conference.db "SELECT id, name_en FROM speakers;"'
```

## 🆘 Emergency Commands

```bash
# Restart service
ssh user@vps 'sudo systemctl restart water-conference'

# Stop service
ssh user@vps 'sudo systemctl stop water-conference'

# View recent errors
ssh user@vps 'sudo journalctl -u water-conference -n 50 --no-pager'

# Rollback database
ssh user@vps 'cp /app/data/conference_backup_*.db /app/data/conference.db'
```

## 📍 Important URLs After Deployment

- **Homepage**: `http://your-domain.com`
- **Admin Panel**: `http://your-domain.com/admin`
- **Speakers Page**: `http://your-domain.com/speakers`
- **Speaker 1 Detail**: `http://your-domain.com/speaker/1`
- **Speaker 2 Detail**: `http://your-domain.com/speaker/2`
- **API Health**: `http://your-domain.com/api/health`

## 🔐 First Time Setup Only

```bash
# 1. Create systemd service
sudo nano /etc/systemd/system/water-conference.service

# 2. Enable service
sudo systemctl daemon-reload
sudo systemctl enable water-conference
sudo systemctl start water-conference

# 3. Setup Nginx
sudo nano /etc/nginx/sites-available/water-conference
sudo ln -s /etc/nginx/sites-available/water-conference /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# 4. Get SSL certificate
sudo certbot --nginx -d your-domain.com
```

## 📊 What's New in This Deployment

### New Features
- ✨ Individual speaker detail pages
- 📱 Responsive speaker profile layout
- 🎨 Beautiful speaker information cards
- 🔗 Clickable speaker cards in hero section
- 📝 Rich speaker biographies with HTML formatting
- 🏆 Expertise tags, achievements, publications
- 📅 Conference session information

### API Endpoints
- `GET /api/speakers/:id` - Get detailed speaker information
- Supports language query parameter: `?lang=en|ru|tj`

### Database Schema
- New table columns for speaker details
- JSON arrays for expertise, achievements, publications
- Multi-language support for all fields

## 💾 Backup Important!

```bash
# Backup before deployment
ssh user@vps 'cp /app/data/conference.db /app/data/conference_backup_$(date +%Y%m%d).db'

# Auto-backup script (run daily)
ssh user@vps 'cat > /app/backup.sh << EOF
#!/bin/bash
cp /app/data/conference.db /app/backups/conference_\$(date +%Y%m%d_%H%M%S).db
ls -t /app/backups/conference_*.db | tail -n +31 | xargs -r rm
EOF'

ssh user@vps 'chmod +x /app/backup.sh'

# Add to crontab
ssh user@vps 'crontab -e'
# Add: 0 2 * * * /app/backup.sh >> /app/backup.log 2>&1
```

## 🎯 Success Criteria

After deployment, verify:
- [ ] Service running without errors
- [ ] Website loads in browser
- [ ] Speaker cards are clickable
- [ ] Speaker detail pages load (ID 1 and 2)
- [ ] All speaker information displays correctly
- [ ] Biography, expertise, achievements visible
- [ ] Session information shows up
- [ ] Language switching works
- [ ] Back button works
- [ ] Images load properly
- [ ] Admin panel accessible

## 📞 Support Checklist

If something doesn't work:

1. **Check Service**
   ```bash
   ssh user@vps 'sudo systemctl status water-conference'
   ```

2. **Check Logs**
   ```bash
   ssh user@vps 'sudo journalctl -u water-conference -n 100'
   ```

3. **Check Database**
   ```bash
   ssh user@vps 'sqlite3 /app/data/conference.db ".schema speakers"'
   ```

4. **Check Files**
   ```bash
   ssh user@vps 'ls -la /app/'
   ```

5. **Test API Directly**
   ```bash
   ssh user@vps 'curl http://localhost:3000/api/speakers/1'
   ```

## 🎉 That's It!

Your water conference website should now be fully deployed with:
- ✅ Speaker detail pages
- ✅ Updated database with rich speaker information
- ✅ All latest features and improvements

For detailed information, see:
- [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) - Complete deployment guide
- [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) - Step-by-step checklist
