# Complete Deployment Guide for VPS Server

This guide will help you deploy the complete water conference application with all the latest features including speaker detail pages and updated database.

## Pre-Deployment Checklist

- [x] Speaker detail pages implemented
- [x] Database migrations ready (010_speaker_details.sql)
- [x] Sample speaker data prepared
- [x] Frontend built with all new features
- [x] Backend compiled with new API endpoints

## Deployment Steps

### 1. Prepare the Deployment Package

On your local machine, build the production-ready application:

```bash
# Build frontend for production
cd frontend
npm run build

# Build backend for production (release mode)
cd ../backend
cargo build --release
```

### 2. VPS Server Preparation

SSH into your VPS server:

```bash
ssh your-username@your-vps-ip
```

### 3. Upload Files to VPS

There are several methods to upload files:

#### Option A: Using SCP (Recommended)

From your local machine:

```bash
# Upload the entire project
scp -r c:\Users\YR\Desktop\Rust+vite.js your-username@your-vps-ip:/path/to/deployment/

# OR upload specific directories
scp -r c:\Users\YR\Desktop\Rust+vite.js\backend\target\release\water-conference-api your-username@your-vps-ip:/path/to/app/
scp -r c:\Users\YR\Desktop\Rust+vite.js\backend\migrations your-username@your-vps-ip:/path/to/app/
scp -r c:\Users\YR\Desktop\Rust+vite.js\backend\static your-username@your-vps-ip:/path/to/app/
```

#### Option B: Using Git (Recommended for Railway/Cloud Platforms)

```bash
# On your local machine
cd c:\Users\YR\Desktop\Rust+vite.js
git add .
git commit -m "Deploy with speaker detail pages and updated database"
git push origin main

# On VPS server
cd /path/to/app
git pull origin main
cd backend && cargo build --release
cd ../frontend && npm install && npm run build
```

### 4. Database Migration and Data Update

On your VPS server:

```bash
cd /path/to/app/backend

# The migrations will run automatically when you start the server
# But if you want to verify, you can check:
ls migrations/

# You should see:
# 001_initial.sql
# 002_seed_data.sql
# ...
# 010_speaker_details.sql

# Update speaker data using the Python script
python3 update_db.py
python3 update_speaker_2.py
```

If Python scripts don't work on VPS, create a SQL file and run it:

```bash
# Create update script
cat > update_speakers.sql << 'EOF'
-- Update speaker 1 (Emomali Rahmon)
UPDATE speakers SET
    bio_ru = '<p>Президент Республики Таджикистан с 1994 года. Эмомали Рахмон является одним из ведущих международных лидеров в области водной дипломатии и устойчивого развития.</p><p>Под его руководством Таджикистан стал ключевым игроком в глобальных водных инициативах, включая инициирование Международного десятилетия действий «Вода для устойчивого развития, 2018-2028 годы».</p>',
    bio_en = '<p>President of the Republic of Tajikistan since 1994. Emomali Rahmon is one of the leading international figures in water diplomacy and sustainable development.</p><p>Under his leadership, Tajikistan has become a key player in global water initiatives, including initiating the International Decade for Action "Water for Sustainable Development, 2018-2028".</p>',
    bio_tj = '<p>Президенти Ҷумҳурии Тоҷикистон аз соли 1994. Эмомалӣ Раҳмон яке аз пешвоёни байналмилалии пешбар дар соҳаи дипломатияи обӣ ва рушди устувор мебошад.</p><p>Зери роҳбарии ӯ Тоҷикистон ба бозигари калидӣ дар ташаббусҳои ҷаҳонии обӣ табдил ёфт.</p>',
    organization_ru = 'Правительство Республики Таджикистан',
    organization_en = 'Government of the Republic of Tajikistan',
    organization_tj = 'Ҳукумати Ҷумҳурии Тоҷикистон',
    country_ru = 'Таджикистан',
    country_en = 'Tajikistan',
    country_tj = 'Тоҷикистон',
    email = 'president@gov.tj',
    expertise = '["Водная дипломатия", "Устойчивое развитие", "Международное сотрудничество", "Управление водными ресурсами"]',
    achievements = '["Инициатор Международного десятилетия действий «Вода для устойчивого развития, 2018-2028»", "Организатор четырех международных конференций высокого уровня по воде", "Лауреат премии ООН «Чемпион Земли» (2021)", "Почетный доктор более 20 международных университетов"]',
    publications = '["Таджики в зеркале истории (2010)", "Водная дипломатия и устойчивое развитие (2018)", "Вода — источник жизни и развития (2020)"]',
    session_title_ru = 'Открытие конференции: Итоги Водного десятилетия и перспективы',
    session_title_en = 'Conference Opening: Outcomes of the Water Decade and Prospects',
    session_title_tj = 'Кушодани конфронс: Натиҷаҳои Даҳсолаи Об ва чашмандозҳо',
    session_time_ru = '25 мая 2026, 09:30 - 10:00',
    session_time_en = 'May 25, 2026, 09:30 - 10:00',
    session_time_tj = '25 май 2026, 09:30 - 10:00',
    session_description_ru = 'Приветственное слово и ключевое выступление об итогах реализации Международного десятилетия действий «Вода для устойчивого развития, 2018-2028 годы» и планах дальнейшего международного сотрудничества в водном секторе.',
    session_description_en = 'Welcome address and keynote speech on the outcomes of the International Decade for Action "Water for Sustainable Development, 2018-2028" and plans for further international cooperation in the water sector.',
    session_description_tj = 'Суханони хуш омадгӯӣ ва нутқи калидӣ дар бораи натиҷаҳои татбиқи Даҳсолаи байналмилалии амал "Об барои рушди устувор, 2018-2028" ва нақшаҳои ҳамкории минбаъдаи байналмилалӣ дар бахши обӣ.'
WHERE id = 1;

-- Update speaker 2 (Li Junhua)
UPDATE speakers SET
    bio_ru = '<p>Заместитель Генерального секретаря Организации Объединенных Наций по экономическим и социальным вопросам с 2021 года. Ли Цзюньхуа является ведущим экспертом в области устойчивого развития и международного экономического сотрудничества.</p><p>До своего назначения на нынешнюю должность занимал пост Генерального директора Организации Объединенных Наций по промышленному развитию (ЮНИДО). Имеет более 30 лет опыта работы в системе ООН и китайских правительственных учреждениях.</p><p>Играет ключевую роль в продвижении Целей устойчивого развития, особенно в области водных ресурсов, чистой энергии и промышленного развития.</p>',
    bio_en = '<p>United Nations Under-Secretary-General for Economic and Social Affairs since 2021. Li Junhua is a leading expert in sustainable development and international economic cooperation.</p><p>Before his current appointment, he served as Director General of the United Nations Industrial Development Organization (UNIDO). He has over 30 years of experience working in the UN system and Chinese government institutions.</p><p>He plays a key role in advancing the Sustainable Development Goals, particularly in the areas of water resources, clean energy, and industrial development.</p>',
    bio_tj = '<p>Муовини Котиби Кулли Созмони Милали Муттаҳид оид ба масоили иқтисодӣ ва иҷтимоӣ аз соли 2021. Ли Цзюньхуа як мутахассиси пешбар дар соҳаи рушди устувор ва ҳамкории байналмилалии иқтисодӣ мебошад.</p><p>Пеш аз таъинот ба вазифаи ҳозира, ӯ Директори Генералии Ташкилоти Милали Муттаҳид оид ба рушди саноатӣ (ЮНИДО) буд. Ӯ зиёда аз 30 сол таҷрибаи кор дар низоми СММ ва муассисаҳои давлатии Чин дорад.</p>',
    organization_ru = 'Организация Объединенных Наций',
    organization_en = 'United Nations',
    organization_tj = 'Созмони Милали Муттаҳид',
    country_ru = 'Китай',
    country_en = 'China',
    country_tj = 'Чин',
    email = 'li.junhua@un.org',
    expertise = '["Устойчивое развитие", "Международное экономическое сотрудничество", "Промышленное развитие", "Водные ресурсы", "Чистая энергия", "Цели устойчивого развития"]',
    achievements = '["Заместитель Генерального секретаря ООН по экономическим и социальным вопросам (с 2021)", "Генеральный директор ЮНИДО (2013-2021)", "Руководство крупнейшими инициативами ООН в области устойчивого развития", "Содействие в реализации Повестки дня в области устойчивого развития на период до 2030 года", "Координация международных усилий по достижению ЦУР 6 (чистая вода и санитария)"]',
    publications = '["Промышленное развитие для устойчивого будущего (UN-IDES, 2020)", "Водные ресурсы и устойчивое развитие: глобальные вызовы и решения (2019)", "Зеленая экономика и промышленная трансформация (UNIDO, 2018)", "Партнерство для устойчивого развития: роль ООН (2022)"]',
    session_title_ru = 'Роль ООН в достижении глобальных водных целей',
    session_title_en = 'The Role of the UN in Achieving Global Water Goals',
    session_title_tj = 'Нақши СММ дар ноил гардидан ба ҳадафҳои ҷаҳонии обӣ',
    session_time_ru = '25 мая 2026, 10:30 - 11:00',
    session_time_en = 'May 25, 2026, 10:30 - 11:00',
    session_time_tj = '25 май 2026, 10:30 - 11:00',
    session_description_ru = 'Выступление о роли Организации Объединенных Наций в координации международных усилий по достижению ЦУР 6 и обеспечению всеобщего доступа к чистой воде и санитарии. Обсуждение механизмов международного сотрудничества и финансирования водных проектов.',
    session_description_en = 'Speech on the role of the United Nations in coordinating international efforts to achieve SDG 6 and ensure universal access to clean water and sanitation. Discussion of mechanisms for international cooperation and financing of water projects.',
    session_description_tj = 'Суханронӣ дар бораи нақши Созмони Милали Муттаҳид дар ҳамоҳангсозии кӯшишҳои байналмилалӣ барои ноил гардидан ба ҲРУ 6 ва таъмини дастрасии умумӣ ба оби тоза ва коммуналӣ.'
WHERE id = 2;
EOF

# Apply the SQL updates
sqlite3 data/conference.db < update_speakers.sql
```

### 5. Environment Configuration

Create or update the `.env` file on your VPS:

```bash
cd /path/to/app/backend
cat > .env << 'EOF'
DATABASE_URL=sqlite:./data/conference.db?mode=rwc
RUST_LOG=info,tower_http=debug
SERVER_ADDR=0.0.0.0:3000
PORT=3000
EOF
```

### 6. Set Up Systemd Service (Recommended)

Create a systemd service file for automatic startup and management:

```bash
sudo nano /etc/systemd/system/water-conference.service
```

Add the following content:

```ini
[Unit]
Description=Water Conference API Server
After=network.target

[Service]
Type=simple
User=your-username
WorkingDirectory=/path/to/app/backend
ExecStart=/path/to/app/backend/target/release/water-conference-api
Restart=always
RestartSec=10
Environment="DATABASE_URL=sqlite:./data/conference.db?mode=rwc"
Environment="RUST_LOG=info"

[Install]
WantedBy=multi-user.target
```

Enable and start the service:

```bash
sudo systemctl daemon-reload
sudo systemctl enable water-conference
sudo systemctl start water-conference
sudo systemctl status water-conference
```

### 7. Set Up Nginx Reverse Proxy

Install Nginx if not already installed:

```bash
sudo apt update
sudo apt install nginx
```

Create Nginx configuration:

```bash
sudo nano /etc/nginx/sites-available/water-conference
```

Add the following:

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # Frontend static files
    location / {
        root /path/to/app/backend/static;
        try_files $uri $uri/ /index.html;

        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # API endpoints
    location /api/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Uploaded files
    location /uploads/ {
        alias /path/to/app/backend/uploads/;
        expires 1y;
        add_header Cache-Control "public";
    }

    # Admin routes
    location /admin/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable the site and restart Nginx:

```bash
sudo ln -s /etc/nginx/sites-available/water-conference /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 8. SSL Certificate (Optional but Recommended)

Install Certbot and get SSL certificate:

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

### 9. Verify Deployment

Check if everything is working:

```bash
# Check backend service
sudo systemctl status water-conference

# Check logs
sudo journalctl -u water-conference -f

# Test API endpoints
curl http://localhost:3000/api/health
curl http://localhost:3000/api/speakers/1?lang=en
curl http://localhost:3000/api/speakers/2?lang=en

# Test from outside
curl http://your-domain.com/api/speakers/1?lang=en
```

### 10. Database Backup (Important!)

Set up automatic database backups:

```bash
# Create backup script
cat > /path/to/app/backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/path/to/backups"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

# Backup database
cp /path/to/app/backend/data/conference.db $BACKUP_DIR/conference_$DATE.db

# Keep only last 30 backups
ls -t $BACKUP_DIR/conference_*.db | tail -n +31 | xargs -r rm

echo "Backup completed: conference_$DATE.db"
EOF

chmod +x /path/to/app/backup.sh

# Add to crontab for daily backups
crontab -e
# Add this line:
# 0 2 * * * /path/to/app/backup.sh >> /path/to/app/backup.log 2>&1
```

## Troubleshooting

### Database Issues

If migrations don't apply automatically:

```bash
cd /path/to/app/backend
# Manually check migrations
ls migrations/

# Check database schema
sqlite3 data/conference.db ".schema speakers"
```

### Service Won't Start

```bash
# Check logs
sudo journalctl -u water-conference -n 50

# Check permissions
ls -la /path/to/app/backend/target/release/water-conference-api
chmod +x /path/to/app/backend/target/release/water-conference-api

# Check database permissions
ls -la /path/to/app/backend/data/
chmod 755 /path/to/app/backend/data/
chmod 644 /path/to/app/backend/data/conference.db
```

### Port Already in Use

```bash
# Find what's using port 3000
sudo lsof -i :3000
# Kill the process if needed
sudo kill -9 <PID>
```

## Post-Deployment Checklist

- [ ] Backend service running
- [ ] Nginx configured and running
- [ ] SSL certificate installed (if using HTTPS)
- [ ] Database migrations applied
- [ ] Speaker data updated
- [ ] API endpoints responding correctly
- [ ] Frontend accessible via domain
- [ ] Speaker detail pages working
- [ ] Admin panel accessible
- [ ] Backup script configured
- [ ] Firewall configured (allow ports 80, 443)

## Quick Deployment Commands Summary

```bash
# On local machine - build everything
cd frontend && npm run build
cd ../backend && cargo build --release

# Upload to VPS (example)
scp -r backend/target/release/water-conference-api user@vps:/app/
scp -r backend/static user@vps:/app/
scp -r backend/migrations user@vps:/app/
scp backend/update_speakers.sql user@vps:/app/

# On VPS - deploy
cd /app
sqlite3 data/conference.db < update_speakers.sql
sudo systemctl restart water-conference
sudo systemctl status water-conference
```

## Support

If you encounter any issues during deployment, check:
1. Service logs: `sudo journalctl -u water-conference -f`
2. Nginx logs: `sudo tail -f /var/log/nginx/error.log`
3. Database integrity: `sqlite3 data/conference.db "PRAGMA integrity_check;"`
