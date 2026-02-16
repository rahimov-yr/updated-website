#!/bin/bash

# First-time VPS Setup Script
# Run this ONCE on your VPS server: sudo bash setup-vps.sh

set -e

echo "Setting up VPS for Water Conference Website..."

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check if running as root or with sudo
if [ "$EUID" -ne 0 ]; then
    echo -e "${YELLOW}Please run with sudo: sudo bash setup-vps.sh${NC}"
    exit 1
fi

# Update system
echo -e "${BLUE}Updating system packages...${NC}"
apt-get update
apt-get upgrade -y

# Install Docker (includes docker compose plugin v2)
if ! command -v docker &> /dev/null; then
    echo -e "${BLUE}Installing Docker...${NC}"
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh

    # Add current user to docker group (if not root)
    if [ -n "$SUDO_USER" ]; then
        usermod -aG docker $SUDO_USER
        echo -e "${YELLOW}You may need to log out and back in for Docker permissions${NC}"
    fi
else
    echo -e "${GREEN}Docker already installed${NC}"
fi

# Install Node.js (needed to build frontend on VPS)
if ! command -v node &> /dev/null; then
    echo -e "${BLUE}Installing Node.js...${NC}"
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
else
    echo -e "${GREEN}Node.js already installed ($(node -v))${NC}"
fi

# Install Git (if not present)
if ! command -v git &> /dev/null; then
    echo -e "${BLUE}Installing Git...${NC}"
    apt-get install -y git
else
    echo -e "${GREEN}Git already installed${NC}"
fi

# Setup firewall (UFW)
echo -e "${BLUE}Configuring firewall...${NC}"
apt-get install -y ufw
ufw --force enable
ufw allow ssh
ufw allow 3000/tcp  # Application port
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS

# Create application directory
echo -e "${BLUE}Creating application directory...${NC}"
mkdir -p /opt/water-conference
chown -R ${SUDO_USER:-$USER}:${SUDO_USER:-$USER} /opt/water-conference

echo ""
echo -e "${GREEN}VPS setup complete!${NC}"
echo ""
echo "Next steps:"
echo ""
echo "1. Clone your repository:"
echo "   cd /opt/water-conference"
echo "   git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git ."
echo ""
echo "2. Run deployment:"
echo "   chmod +x deploy-to-vps.sh"
echo "   ./deploy-to-vps.sh"
echo ""
echo "   (The deploy script auto-generates .env with JWT_SECRET)"
echo ""
echo "For redeployments after code changes:"
echo "   cd /opt/water-conference && git pull && ./deploy-to-vps.sh"
