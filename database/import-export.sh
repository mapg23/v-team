#!/bin/bash
set -e

DB_NAME=${MARIADB_DATABASE:-app_db}
DB_USER=${MARIADB_USER:-root}
DB_PASS=${MARIADB_PASSWORD:-root}
DUMP_FILE="/dumps/init.sql"

# --- IMPORT ---
# Wait for MariaDB to accept connections before import
function wait_for_db() {
  echo "Waiting for MariaDB to be ready..."
  until mysqladmin ping -u"$DB_USER" -p"$DB_PASS" --silent; do
    sleep 2
  done
}

function import_db() {
  if [ -s "$DUMP_FILE" ]; then
    echo "Importing database from $DUMP_FILE..."
    mysql -u"$DB_USER" -p"$DB_PASS" "$DB_NAME" < "$DUMP_FILE" \
      && echo "Import complete." \
      || echo "Import skipped or failed (database may already exist)."
  else
    echo "No dump file found at $DUMP_FILE — skipping import."
  fi
}

# --- EXPORT ---
function export_db() {
  echo "Exporting database to $DUMP_FILE..."
  mysqldump -u"$DB_USER" -p"$DB_PASS" "$DB_NAME" > "$DUMP_FILE" \
    && echo "Database exported." \
    || echo "Export failed."
  exit 0
}

trap export_db SIGTERM SIGINT

# --- RUN ORIGINAL ENTRYPOINT ---
echo "Starting MariaDB..."
/usr/local/bin/docker-entrypoint.sh mariadbd &

# Wait and import after MariaDB starts
wait_for_db
import_db

# Keep container alive until stopped
wait
