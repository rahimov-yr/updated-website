# Water Conference 2026 - Backend API

A Rust backend API built with Axum for the Water Conference 2026 website.

## Prerequisites

- Rust (install from https://rustup.rs)
- SQLite

## Installation

1. Install Rust:
   ```bash 
   # Windows: Download and run rustup-init.exe from https://rustup.rs
   # Or use PowerShell:
   winget install Rustlang.Rustup
   ```

2. Clone and setup:
   ```bash
   cd backend
   cp .env.example .env
   mkdir data
   ```

3. Build and run:
   ```bash
   cargo run
   ```

The server will start at `http://localhost:3000`

## API Endpoints

### Health Check
- `GET /api/health` - Server health status

### News
- `GET /api/news` - List all news (supports `?limit=10&offset=0&category=conference`)
- `GET /api/news/:id` - Get single news by ID or slug

### Program
- `GET /api/program` - Get full program with all days and events
- `GET /api/program/days` - Get list of program days
- `GET /api/program/day/:day` - Get events for specific day

### Registration
- `POST /api/registration` - Register for the conference
- `GET /api/registration/:uuid` - Get registration by UUID

## Development

```bash
# Run with hot reload (install cargo-watch first)
cargo install cargo-watch
cargo watch -x run

# Run tests
cargo test

# Build for production
cargo build --release
```

## Project Structure

```
backend/
├── Cargo.toml           # Dependencies
├── .env                 # Environment variables
├── migrations/          # Database migrations
│   ├── 001_initial.sql
│   └── 002_seed_data.sql
└── src/
    ├── main.rs          # Application entry point
    ├── error.rs         # Error handling
    ├── routes/          # API route handlers
    │   ├── mod.rs
    │   ├── health.rs
    │   ├── news.rs
    │   ├── program.rs
    │   └── registration.rs
    ├── models/          # Data models
    └── db/              # Database utilities
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| SERVER_ADDR | Server bind address | 0.0.0.0:3000 |
| DATABASE_URL | SQLite database path | sqlite:./data/conference.db |
| RUST_LOG | Log level | info,tower_http=debug |
