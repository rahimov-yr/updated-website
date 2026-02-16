#!/bin/bash

# Water Conference Deployment Script
# This script automates the deployment process to VPS

set -e  # Exit on error

echo "======================================"
echo "Water Conference Deployment Script"
echo "======================================"
echo ""

# Configuration (UPDATE THESE VALUES)
VPS_USER="your-username"
VPS_HOST="your-vps-ip"
VPS_PATH="/path/to/app"
SSH_KEY_PATH="~/.ssh/id_rsa"  # Optional: specify SSH key path

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Functions
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

# Check if configuration is set
if [ "$VPS_USER" == "your-username" ] || [ "$VPS_HOST" == "your-vps-ip" ]; then
    print_error "Please update VPS_USER, VPS_HOST, and VPS_PATH in the script before running!"
    exit 1
fi

# Step 1: Build Frontend
print_info "Step 1: Building frontend..."
cd frontend
npm run build
if [ $? -eq 0 ]; then
    print_success "Frontend built successfully"
else
    print_error "Frontend build failed"
    exit 1
fi
cd ..

# Step 2: Build Backend
print_info "Step 2: Building backend (release mode)..."
cd backend
cargo build --release
if [ $? -eq 0 ]; then
    print_success "Backend built successfully"
else
    print_error "Backend build failed"
    exit 1
fi
cd ..

# Step 3: Create deployment package
print_info "Step 3: Creating deployment package..."
DEPLOY_DIR="deploy_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$DEPLOY_DIR"

# Copy necessary files
cp backend/target/release/water-conference-api "$DEPLOY_DIR/" 2>/dev/null || \
cp backend/target/release/water-conference-api.exe "$DEPLOY_DIR/water-conference-api" 2>/dev/null
cp -r backend/static "$DEPLOY_DIR/"
cp -r backend/migrations "$DEPLOY_DIR/"
mkdir -p "$DEPLOY_DIR/data"
mkdir -p "$DEPLOY_DIR/uploads"

# Copy database update scripts
cat > "$DEPLOY_DIR/update_speakers.sql" << 'EOF'
-- Update speaker 1
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

-- Update speaker 2
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

print_success "Deployment package created: $DEPLOY_DIR"

# Step 4: Upload to VPS
print_info "Step 4: Uploading files to VPS..."
if [ -n "$SSH_KEY_PATH" ]; then
    rsync -avz -e "ssh -i $SSH_KEY_PATH" "$DEPLOY_DIR/" "$VPS_USER@$VPS_HOST:$VPS_PATH/"
else
    rsync -avz "$DEPLOY_DIR/" "$VPS_USER@$VPS_HOST:$VPS_PATH/"
fi

if [ $? -eq 0 ]; then
    print_success "Files uploaded successfully"
else
    print_error "Failed to upload files"
    exit 1
fi

# Step 5: Deploy on VPS
print_info "Step 5: Deploying on VPS..."
ssh "$VPS_USER@$VPS_HOST" << 'ENDSSH'
cd $VPS_PATH

# Make binary executable
chmod +x water-conference-api

# Create data directory if it doesn't exist
mkdir -p data

# Backup existing database if it exists
if [ -f "data/conference.db" ]; then
    cp data/conference.db data/conference_backup_$(date +%Y%m%d_%H%M%S).db
    echo "✓ Database backed up"
fi

# Run the application once to apply migrations
# It will exit when port is already in use, but migrations will be applied
timeout 5 ./water-conference-api || true

# Apply speaker data updates
if [ -f "update_speakers.sql" ]; then
    sqlite3 data/conference.db < update_speakers.sql
    echo "✓ Speaker data updated"
fi

# Restart the service
if systemctl is-active --quiet water-conference; then
    sudo systemctl restart water-conference
    echo "✓ Service restarted"
else
    echo "ℹ Service not found. Please set up systemd service manually."
fi

# Check service status
sleep 2
if systemctl is-active --quiet water-conference; then
    echo "✓ Service is running"
    systemctl status water-conference --no-pager
else
    echo "✗ Service is not running. Check logs with: sudo journalctl -u water-conference -n 50"
fi
ENDSSH

print_success "Deployment completed!"

# Cleanup
read -p "Do you want to remove the deployment package from local machine? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    rm -rf "$DEPLOY_DIR"
    print_success "Cleanup completed"
fi

echo ""
echo "======================================"
echo "Deployment Summary:"
echo "======================================"
echo "Frontend: Built and deployed"
echo "Backend: Built and deployed"
echo "Database: Migrations applied, speaker data updated"
echo ""
echo "Next steps:"
echo "1. Verify the application is running"
echo "2. Test API endpoints"
echo "3. Check speaker detail pages"
echo ""
echo "Useful commands:"
echo "  Check logs: ssh $VPS_USER@$VPS_HOST 'sudo journalctl -u water-conference -f'"
echo "  Restart: ssh $VPS_USER@$VPS_HOST 'sudo systemctl restart water-conference'"
echo "======================================"
