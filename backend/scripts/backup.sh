#!/bin/bash
BACKUP_DIR="./backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/backup_$DATE.sql"

mkdir -p $BACKUP_DIR

echo "📦 Creando backup de la base de datos..."
mysqldump -h $DB_HOST -u $DB_USER -p$DB_PASSWORD $DB_NAME > $BACKUP_FILE

if [ $? -eq 0 ]; then
    echo "✅ Backup creado exitosamente: $BACKUP_FILE"
    
    # Mantener solo los últimos 7 backups
    ls -t $BACKUP_DIR/backup_*.sql | tail -n +8 | xargs rm -f
    echo "🧹 Backups antiguos eliminados (manteniendo últimos 7)"
else
    echo "❌ Error creando backup"
    exit 1
fi