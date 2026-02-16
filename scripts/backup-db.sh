#!/bin/bash
# Database Backup Script
# Usage: ./scripts/backup-db.sh [output-filename]

BACKUP_DIR="./backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
OUTPUT_FILE="${1:-$BACKUP_DIR/conference_backup_$TIMESTAMP.db}"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Check if database exists
if [ ! -f "./backend/data/conference.db" ]; then
    echo "Error: Database not found at ./backend/data/conference.db"
    exit 1
fi

# Create backup using SQLite's backup command (safer than copying)
sqlite3 ./backend/data/conference.db ".backup '$OUTPUT_FILE'"

if [ $? -eq 0 ]; then
    echo "Backup created successfully: $OUTPUT_FILE"
    echo "Size: $(du -h "$OUTPUT_FILE" | cut -f1)"
else
    echo "Error: Backup failed"
    exit 1
fi
