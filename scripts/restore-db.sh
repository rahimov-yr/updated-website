#!/bin/bash
# Database Restore Script
# Usage: ./scripts/restore-db.sh <backup-file>

if [ -z "$1" ]; then
    echo "Usage: ./scripts/restore-db.sh <backup-file>"
    echo "Example: ./scripts/restore-db.sh ./backups/conference_backup_20260127.db"
    exit 1
fi

BACKUP_FILE="$1"
DB_DIR="./backend/data"
DB_FILE="$DB_DIR/conference.db"

# Check if backup file exists
if [ ! -f "$BACKUP_FILE" ]; then
    echo "Error: Backup file not found: $BACKUP_FILE"
    exit 1
fi

# Create data directory if it doesn't exist
mkdir -p "$DB_DIR"

# Backup existing database if it exists
if [ -f "$DB_FILE" ]; then
    TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
    echo "Backing up existing database to ${DB_FILE}.old_$TIMESTAMP"
    mv "$DB_FILE" "${DB_FILE}.old_$TIMESTAMP"
fi

# Restore from backup
cp "$BACKUP_FILE" "$DB_FILE"

if [ $? -eq 0 ]; then
    echo "Database restored successfully from: $BACKUP_FILE"
    echo "Database location: $DB_FILE"
else
    echo "Error: Restore failed"
    exit 1
fi
