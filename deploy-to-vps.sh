#!/bin/bash

# VPS Deployment Script for Water Conference Website
# This script handles safe deployment without affecting production data
# Data in ./vps-data/ (database + uploads) persists across redeployments

set -e  # Exit on any error

echo "Starting deployment..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get the project root directory
PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$PROJECT_DIR"

# Step 0: Ensure .env exists with JWT_SECRET
if [ ! -f .env ]; then
  echo -e "${YELLOW}Creating .env file with secure JWT_SECRET...${NC}"
  JWT=$(openssl rand -base64 32 2>/dev/null || head -c 32 /dev/urandom | base64)
  echo "JWT_SECRET=$JWT" > .env
  echo -e "${GREEN}.env file created${NC}"
fi

# Step 1: Create data directories (won't overwrite existing data)
echo -e "${BLUE}Ensuring data directories exist...${NC}"
mkdir -p vps-data/database
mkdir -p vps-data/uploads

# Step 2: Backup existing database before redeployment
if [ -f vps-data/database/conference.db ]; then
  BACKUP_NAME="conference_backup_$(date +%Y%m%d_%H%M%S).db"
  echo -e "${BLUE}Backing up database to vps-data/database/$BACKUP_NAME...${NC}"
  cp vps-data/database/conference.db "vps-data/database/$BACKUP_NAME"
  # Keep only the 5 most recent backups
  ls -t vps-data/database/conference_backup_*.db 2>/dev/null | tail -n +6 | xargs -r rm -f
  echo -e "${GREEN}Database backed up${NC}"
fi

# Step 3: Build frontend
echo -e "${BLUE}Building frontend...${NC}"
cd frontend
npm install
npm run build
cd "$PROJECT_DIR"

# Step 4: Copy built files to backend/static
echo -e "${BLUE}Copying frontend build to backend/static...${NC}"
mkdir -p backend/static
rm -rf backend/static/*
cp -r frontend/dist/* backend/static/

# Step 5: Build and restart containers
echo -e "${BLUE}Building and restarting Docker containers...${NC}"
docker compose down 2>/dev/null || docker-compose down
docker compose build --no-cache 2>/dev/null || docker-compose build --no-cache
docker compose up -d 2>/dev/null || docker-compose up -d

# Step 6: Wait for container to be healthy
echo -e "${BLUE}Waiting for application to start...${NC}"
sleep 3

# Step 7: Show status
echo ""
echo -e "${GREEN}Deployment complete!${NC}"
echo ""
echo "Container status:"
docker compose ps 2>/dev/null || docker-compose ps

echo ""
echo -e "${GREEN}Your application is now running!${NC}"
echo "  Site:     http://$(hostname -I 2>/dev/null | awk '{print $1}' || echo 'your-vps-ip'):3000"
echo "  Admin:    http://$(hostname -I 2>/dev/null | awk '{print $1}' || echo 'your-vps-ip'):3000/admin"
echo ""
echo "View logs:"
echo "  docker compose logs -f"
echo ""
echo "Data locations (persist across redeployments):"
echo "  Database: ./vps-data/database/conference.db"
echo "  Uploads:  ./vps-data/uploads/"
echo ""
echo "To redeploy after code changes:"
echo "  git pull && ./deploy-to-vps.sh"
