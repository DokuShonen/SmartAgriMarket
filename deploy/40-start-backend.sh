#!/bin/sh
# Exécuté par l'entrypoint officiel de l'image nginx avant le démarrage de nginx.
# Démarre le backend Spring Boot en arrière-plan (image unique Render : nginx + JVM).
set -eu

# Render fournit DATABASE_URL au format postgres://user:pass@host:port/db.
# Spring/JDBC attend jdbc:postgresql://host:port/db + user/mot de passe séparés.
if [ -n "${DATABASE_URL:-}" ] && [ -z "${SPRING_DATASOURCE_URL:-}" ]; then
  if [ -n "${PGHOST:-}" ]; then
    # Variables PG* fournies par Render (ou compatible : Neon, Aiven, ...)
    export SPRING_DATASOURCE_URL="jdbc:postgresql://${PGHOST}:${PGPORT:-5432}/${PGDATABASE}"
    export SPRING_DATASOURCE_USERNAME="${PGUSER}"
    export SPRING_DATASOURCE_PASSWORD="${PGPASSWORD}"
  else
    # Repli : extraction depuis DATABASE_URL seul
    creds="$(printf '%s' "$DATABASE_URL" | sed -n 's|^[a-zA-Z0-9]*://\([^/]*\)@.*|\1|p')"
    rest="$(printf '%s' "$DATABASE_URL" | sed 's|^[a-zA-Z0-9]*://[^/]*@||')"
    export SPRING_DATASOURCE_URL="jdbc:postgresql://${rest}"
    export SPRING_DATASOURCE_USERNAME="${SPRING_DATASOURCE_USERNAME:-${creds%%:*}}"
    export SPRING_DATASOURCE_PASSWORD="${SPRING_DATASOURCE_PASSWORD:-${creds#*:}}"
  fi
  echo "[render] datasource JDBC dérivée de DATABASE_URL"
fi

export SERVER_PORT="${BACKEND_PORT:-8081}"
cd /app
java ${JAVA_OPTS:-} -jar /app/app.jar &
echo "[render] backend démarré sur le port ${SERVER_PORT}, attente de /api/health..."

i=0
until wget -q -O /dev/null "http://127.0.0.1:${SERVER_PORT}/api/health" 2>/dev/null; do
  i=$((i + 1))
  if [ "$i" -gt 90 ]; then
    echo "[render] backend indisponible après 180s d'attente"
    exit 1
  fi
  sleep 2
done
echo "[render] backend opérationnel"
