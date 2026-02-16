# Deployment Checklist

## Pre-Deployment (On Local Machine)

- [ ] All code changes committed to git
- [ ] Frontend builds successfully (`cd frontend && npm run build`)
- [ ] Backend builds successfully (`cd backend && cargo build --release`)
- [ ] Test speaker detail pages locally
- [ ] Test database migrations locally
- [ ] Review DEPLOYMENT_GUIDE.md

## VPS Configuration (Before First Deployment)

- [ ] Update `deploy.sh` with your VPS credentials:
  - VPS_USER
  - VPS_HOST
  - VPS_PATH
- [ ] SSH access to VPS configured
- [ ] Create application directory on VPS
- [ ] Install required dependencies on VPS:
  - [ ] Rust (if building on VPS)
  - [ ] SQLite3
  - [ ] Nginx
  - [ ] Certbot (for SSL)
- [ ] Set up systemd service (see DEPLOYMENT_GUIDE.md)
- [ ] Configure Nginx reverse proxy
- [ ] Set up SSL certificate
- [ ] Configure firewall (allow ports 80, 443)

## Deployment Steps

### Option 1: Using Automated Script (Recommended)

- [ ] Make script executable: `chmod +x deploy.sh`
- [ ] Run deployment script: `./deploy.sh`
- [ ] Verify deployment was successful
- [ ] Test the application

### Option 2: Manual Deployment

- [ ] Build frontend: `cd frontend && npm run build`
- [ ] Build backend: `cd backend && cargo build --release`
- [ ] Upload files to VPS:
  ```bash
  scp -r backend/target/release/water-conference-api user@vps:/app/
  scp -r backend/static user@vps:/app/
  scp -r backend/migrations user@vps:/app/
  scp backend/update_speakers.sql user@vps:/app/
  ```
- [ ] SSH into VPS: `ssh user@vps`
- [ ] Stop the service: `sudo systemctl stop water-conference`
- [ ] Backup database: `cp /app/data/conference.db /app/data/conference_backup_$(date +%Y%m%d).db`
- [ ] Make binary executable: `chmod +x /app/water-conference-api`
- [ ] Apply migrations (automatic on startup)
- [ ] Update speaker data: `sqlite3 /app/data/conference.db < /app/update_speakers.sql`
- [ ] Start the service: `sudo systemctl start water-conference`
- [ ] Check service status: `sudo systemctl status water-conference`

## Post-Deployment Verification

- [ ] Service is running: `sudo systemctl status water-conference`
- [ ] Check logs for errors: `sudo journalctl -u water-conference -n 50`
- [ ] Test API health endpoint: `curl http://localhost:3000/api/health`
- [ ] Test speaker list endpoint: `curl http://localhost:3000/api/speakers?lang=en`
- [ ] Test speaker detail endpoint: `curl http://localhost:3000/api/speakers/1?lang=en`
- [ ] Test speaker detail endpoint: `curl http://localhost:3000/api/speakers/2?lang=en`
- [ ] Visit website in browser
- [ ] Test speaker detail pages:
  - [ ] http://your-domain.com/speaker/1
  - [ ] http://your-domain.com/speaker/2
- [ ] Test language switching on speaker pages
- [ ] Test navigation from hero section to speaker details
- [ ] Test navigation from speakers list to speaker details
- [ ] Verify all speaker data displays correctly:
  - [ ] Biography
  - [ ] Organization
  - [ ] Country
  - [ ] Email
  - [ ] Areas of expertise
  - [ ] Achievements
  - [ ] Publications
  - [ ] Session information
- [ ] Check Nginx is serving files correctly
- [ ] Verify SSL certificate (if applicable)
- [ ] Test admin panel access
- [ ] Test file uploads (if applicable)

## Database Verification

- [ ] SSH into VPS
- [ ] Check database exists: `ls -la /app/data/conference.db`
- [ ] Verify speaker data:
  ```bash
  sqlite3 /app/data/conference.db "SELECT id, name_en, organization_en FROM speakers WHERE id IN (1,2);"
  ```
- [ ] Check bio data exists:
  ```bash
  sqlite3 /app/data/conference.db "SELECT id, LENGTH(bio_en) as bio_length FROM speakers WHERE id IN (1,2);"
  ```
- [ ] Verify JSON fields:
  ```bash
  sqlite3 /app/data/conference.db "SELECT expertise FROM speakers WHERE id=1;"
  ```

## Rollback Plan (If Something Goes Wrong)

- [ ] Stop the service: `sudo systemctl stop water-conference`
- [ ] Restore database from backup:
  ```bash
  cp /app/data/conference_backup_YYYYMMDD.db /app/data/conference.db
  ```
- [ ] Restore previous binary (if you kept it)
- [ ] Start the service: `sudo systemctl start water-conference`

## Monitoring & Maintenance

- [ ] Set up log rotation
- [ ] Configure database backups (daily recommended)
- [ ] Set up monitoring/alerting (optional)
- [ ] Document any custom configurations
- [ ] Test backup restoration procedure

## Common Issues & Solutions

### Service won't start
```bash
# Check logs
sudo journalctl -u water-conference -n 100 --no-pager

# Check permissions
ls -la /app/water-conference-api
chmod +x /app/water-conference-api

# Check database permissions
ls -la /app/data/conference.db
```

### Database migration errors
```bash
# Check if migration files exist
ls -la /app/migrations/

# Manually check database schema
sqlite3 /app/data/conference.db ".schema speakers"

# If needed, manually apply migration
sqlite3 /app/data/conference.db < /app/migrations/010_speaker_details.sql
```

### Speaker data not showing
```bash
# Verify data in database
sqlite3 /app/data/conference.db "SELECT id, name_en, bio_en FROM speakers LIMIT 2;"

# Re-apply update script
sqlite3 /app/data/conference.db < /app/update_speakers.sql
```

### Port already in use
```bash
# Find process using port
sudo lsof -i :3000

# Kill the process
sudo kill -9 <PID>

# Or restart the service
sudo systemctl restart water-conference
```

## Contact & Support

- Check logs: `sudo journalctl -u water-conference -f`
- Check Nginx logs: `sudo tail -f /var/log/nginx/error.log`
- Check application logs on VPS
- Review DEPLOYMENT_GUIDE.md for detailed instructions

## Notes

- Always backup database before deployment
- Test in staging environment if available
- Keep previous version backup for quick rollback
- Monitor logs after deployment for any errors
- Update this checklist with any new steps or issues encountered
