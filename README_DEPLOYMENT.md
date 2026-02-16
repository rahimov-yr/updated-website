# Deployment Documentation

This directory contains everything you need to deploy the Water Conference website to your VPS server with the latest updates, including speaker detail pages and updated database.

## 📁 Deployment Files

### Main Files
- **[QUICK_DEPLOY.md](QUICK_DEPLOY.md)** - Quick reference for fast deployment
- **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** - Complete step-by-step deployment guide
- **[DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)** - Detailed checklist for deployment
- **[deploy.sh](deploy.sh)** - Automated deployment script

### Database Update Files
- **backend/migrations/010_speaker_details.sql** - Database schema update
- **backend/update_db.py** - Python script to update speaker 1 data
- **backend/update_speaker_2.py** - Python script to update speaker 2 data
- **backend/update_speakers.sql** - SQL script to update both speakers

## 🚀 Quick Start

### For First-Time Deployment

1. **Read the guides**
   - Start with [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
   - Follow the [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)

2. **Set up VPS infrastructure**
   - Install dependencies (Rust, Node.js, Nginx, SQLite)
   - Create systemd service
   - Configure Nginx reverse proxy
   - Set up SSL certificate

3. **Deploy**
   - Update `deploy.sh` with your VPS credentials
   - Run `./deploy.sh`

### For Updates to Existing Deployment

1. **Quick deployment**
   - See [QUICK_DEPLOY.md](QUICK_DEPLOY.md)
   - Run `./deploy.sh`

2. **Verify**
   - Check service status
   - Test speaker detail pages
   - Verify database updates

## 📋 What's Included in This Deployment

### Frontend Updates
- New SpeakerDetail page component
- Updated routing for `/speaker/:id`
- Updated SpeakerCard component (now clickable)
- New ArrowLeftIcon component
- Enhanced CSS for speaker detail pages

### Backend Updates
- New API endpoint: `GET /api/speakers/:id`
- Enhanced Speaker model with detailed fields
- Database migration for speaker details
- Support for biography, organization, expertise, etc.

### Database Updates
- Migration 010: Speaker detail columns
  - Biography fields (bio_ru, bio_en, bio_tj)
  - Organization fields (organization_ru, organization_en, organization_tj)
  - Country fields (country_ru, country_en, country_tj)
  - Email field
  - Expertise (JSON array)
  - Achievements (JSON array)
  - Publications (JSON array)
  - Session information fields

- Sample Data:
  - Speaker 1 (Emomali Rahmon) - Complete profile
  - Speaker 2 (Li Junhua) - Complete profile

## 🎯 New Features

### Speaker Detail Pages
- **Rich Biography**: Full HTML-formatted biography in 3 languages
- **Professional Information**: Organization, country, email
- **Expertise Tags**: Clickable tags showing areas of expertise
- **Achievements List**: Key accomplishments and awards
- **Publications List**: Selected publications and articles
- **Session Information**: Conference session details (title, time, description)
- **Responsive Design**: Works on all devices
- **Multi-language Support**: Russian, English, Tajik

### Navigation Improvements
- Click on speaker cards in hero section → Speaker detail page
- Click on speaker cards in speakers list → Speaker detail page
- Back button to return to previous page

## 🔧 Technical Details

### API Changes
```
GET /api/speakers/:id?lang=en
```

Response includes:
```json
{
  "id": 1,
  "name": "...",
  "title": "...",
  "bio": "...",
  "organization": "...",
  "country": "...",
  "email": "...",
  "expertise": ["...", "..."],
  "achievements": ["...", "..."],
  "publications": ["...", "..."],
  "session_title": "...",
  "session_time": "...",
  "session_description": "...",
  "image": "...",
  "flag_url": "...",
  "flag_alt": "..."
}
```

### Database Schema
New columns in `speakers` table:
- `bio_ru`, `bio_en`, `bio_tj` (TEXT)
- `organization_ru`, `organization_en`, `organization_tj` (TEXT)
- `country_ru`, `country_en`, `country_tj` (TEXT)
- `email` (TEXT)
- `expertise` (TEXT - JSON array)
- `achievements` (TEXT - JSON array)
- `publications` (TEXT - JSON array)
- `session_title_ru`, `session_title_en`, `session_title_tj` (TEXT)
- `session_time_ru`, `session_time_en`, `session_time_tj` (TEXT)
- `session_description_ru`, `session_description_en`, `session_description_tj` (TEXT)

## 📖 How to Use

### Automated Deployment (Recommended)

```bash
# 1. Configure deployment script
nano deploy.sh
# Update: VPS_USER, VPS_HOST, VPS_PATH

# 2. Make executable
chmod +x deploy.sh

# 3. Run deployment
./deploy.sh
```

### Manual Deployment

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed manual deployment steps.

## ✅ Verification

After deployment, verify:

1. **Service Running**
   ```bash
   ssh user@vps 'sudo systemctl status water-conference'
   ```

2. **API Working**
   ```bash
   curl http://your-domain.com/api/speakers/1?lang=en
   curl http://your-domain.com/api/speakers/2?lang=en
   ```

3. **Pages Accessible**
   - http://your-domain.com/speaker/1
   - http://your-domain.com/speaker/2

4. **Data Complete**
   - Biography displays
   - Expertise tags visible
   - Achievements listed
   - Publications shown
   - Session information present

## 🆘 Troubleshooting

### Service Issues
```bash
# View logs
ssh user@vps 'sudo journalctl -u water-conference -f'

# Restart service
ssh user@vps 'sudo systemctl restart water-conference'
```

### Database Issues
```bash
# Check database
ssh user@vps 'sqlite3 /app/data/conference.db "SELECT id, name_en FROM speakers;"'

# Verify speaker data
ssh user@vps 'sqlite3 /app/data/conference.db "SELECT id, LENGTH(bio_en) FROM speakers WHERE id IN (1,2);"'
```

### Missing Data
```bash
# Re-apply speaker updates
ssh user@vps 'sqlite3 /app/data/conference.db < /app/update_speakers.sql'
```

## 📞 Support

For issues during deployment:

1. Check the appropriate guide:
   - [QUICK_DEPLOY.md](QUICK_DEPLOY.md) - Quick reference
   - [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) - Detailed guide
   - [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) - Step-by-step checklist

2. Review logs:
   - Application logs: `sudo journalctl -u water-conference -n 100`
   - Nginx logs: `sudo tail -f /var/log/nginx/error.log`

3. Verify database:
   - Check schema: `sqlite3 data/conference.db ".schema speakers"`
   - Check data: `sqlite3 data/conference.db "SELECT * FROM speakers LIMIT 1;"`

## 🔒 Security Notes

- Always backup database before deployment
- Use SSL/TLS in production (HTTPS)
- Keep admin credentials secure
- Regular security updates for VPS
- Monitor logs for suspicious activity

## 📝 Important Notes

1. **Database Backup**: Always backup before deployment
2. **Migration Order**: Migrations run automatically on startup
3. **Speaker Data**: Update scripts must be run after migrations
4. **Service Restart**: Required for changes to take effect
5. **Cache**: Clear browser cache if changes don't appear

## 🎉 Success!

After successful deployment, you should have:
- ✅ Working speaker detail pages
- ✅ Rich speaker profiles with all information
- ✅ Multi-language support
- ✅ Responsive design
- ✅ Updated database with sample data
- ✅ All latest features deployed

Enjoy your updated Water Conference website! 💧
