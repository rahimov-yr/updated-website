# Stage 1: Build frontend
FROM node:20-slim AS frontend-builder

WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# Stage 2: Build Rust backend
FROM rust:1.85-slim-bookworm AS backend-builder

RUN apt-get update && apt-get install -y \
    pkg-config \
    libssl-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY backend/Cargo.toml backend/Cargo.lock ./
COPY backend/src ./src
COPY backend/migrations ./migrations
RUN cargo build --release --locked

# Stage 3: Runtime
FROM debian:bookworm-slim

RUN apt-get update && apt-get install -y \
    ca-certificates \
    libssl3 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY --from=backend-builder /app/target/release/water-conference-api ./
COPY --from=backend-builder /app/migrations ./migrations
COPY --from=frontend-builder /app/backend/static ./static

RUN mkdir -p ./data ./uploads

EXPOSE 3000

ENV RUST_LOG=info
ENV DATABASE_URL=sqlite:./data/conference.db?mode=rwc

CMD ["./water-conference-api"]
