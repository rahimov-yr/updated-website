# Deployment Guide - Railway

## Prerequisites

1. Create a GitHub account (if you don't have one)
2. Create a Railway account at [railway.app](https://railway.app) (free tier available)
3. Install Git on your computer

## Step 1: Push to GitHub

First, create a new repository on GitHub, then push your code:

```bash
# Navigate to your project root
cd "c:\Users\YR\Desktop\Rust+vite.js"

# Initialize git if not already
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Water Conference 2026"

# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/water-conference-2026.git

# Push to GitHub
git push -u origin main
```

## Step 2: Build Frontend Locally (Before Deploying)

The backend serves the frontend build, so build it first:

```bash
cd frontend
npm install
npm run build
```

This creates the `frontend/dist` folder that the backend serves.

## Step 3: Deploy to Railway

### Option A: Via Railway Dashboard (Easiest)

1. Go to [railway.app](https://railway.app)
2. Click "Start a New Project"
3. Select "Deploy from GitHub repo"
4. Connect your GitHub account and select your repository
5. Railway will auto-detect Rust and start building

### Option B: Via Railway CLI

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Initialize project (run from backend folder)
cd backend
railway init

# Deploy
railway up
```

## Step 4: Configure Environment Variables

In Railway dashboard, go to your project → Variables tab and add:

```
SERVER_ADDR=0.0.0.0:$PORT
DATABASE_URL=sqlite:./data/conference.db?mode=rwc
RUST_LOG=info
ENVIRONMENT=production
JWT_SECRET=generate-a-secure-random-string-here
```

**Important:** Generate a secure JWT_SECRET using:
```bash
openssl rand -hex 32
```

## Step 5: Set Up Persistent Storage (For SQLite)

Railway's file system is ephemeral. For persistent SQLite database:

1. In Railway dashboard, go to your project
2. Click "New" → "Database" → "Volume"
3. Mount the volume at `/app/data`
4. Update DATABASE_URL to: `sqlite:/app/data/conference.db?mode=rwc`

## Step 6: Custom Domain (Optional)

1. In Railway dashboard → Settings → Domains
2. Click "Generate Domain" for a free `.railway.app` domain
3. Or add your custom domain and configure DNS

## Project Structure for Railway

```
Rust+vite.js/
├── backend/
│   ├── Cargo.toml
│   ├── railway.toml        ← Railway config
│   ├── nixpacks.toml       ← Build config
│   ├── src/
│   ├── migrations/
│   └── data/               ← SQLite database
├── frontend/
│   ├── package.json
│   ├── dist/               ← Built frontend (served by backend)
│   └── src/
└── DEPLOY.md
```

## Deployment Commands Summary

```bash
# 1. Build frontend
cd frontend && npm run build && cd ..

# 2. Commit changes
git add .
git commit -m "Build for deployment"
git push origin main

# Railway auto-deploys on push if connected
```

## Troubleshooting

### Build fails
- Check Railway logs in dashboard
- Ensure `Cargo.toml` has correct dependencies
- Verify frontend is built (`frontend/dist` exists)

### Database not persisting
- Attach a Railway volume to `/app/data`
- Update `DATABASE_URL` environment variable

### API not working
- Check if PORT environment variable is set
- Verify health endpoint: `https://your-app.railway.app/api/health`

### Admin login not working
- Default credentials: `admin` / `admin123`
- Check JWT_SECRET is set in environment variables

## Local Development

```bash
# Terminal 1 - Backend
cd backend
cargo run

# Terminal 2 - Frontend dev server
cd frontend
npm run dev
```

Visit `http://localhost:5173` for frontend with hot reload.

## Moving to VPS (Production)

After testing on Railway, you can migrate to your own VPS server.

**See: [DEPLOY-VPS.md](./DEPLOY-VPS.md)** for complete VPS deployment instructions.

### Quick Migration Steps:
1. Export database from Railway: `railway run cat ./data/conference.db > backup.db`
2. Set up VPS following DEPLOY-VPS.md
3. Upload backup.db to VPS
4. Your website with all data is now on VPS!

## Alternative: Deploy Backend & Frontend Separately

If you want to host frontend on Vercel/Netlify:

1. Deploy backend to Railway
2. Get your Railway URL (e.g., `https://water-api.railway.app`)
3. Set `VITE_API_URL=https://water-api.railway.app` in frontend
4. Deploy frontend to Vercel/Netlify
