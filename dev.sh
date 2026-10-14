#!/bin/bash
echo "Demarrage de SmartAgriMarket..."

# Backend
echo "[1/2] Demarrage du backend (port 8080)..."
cd backend
JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64 mvn spring-boot:run &
BACKEND_PID=$!
cd ..

# Frontend
echo "[2/2] Demarrage du frontend (port 4200)..."
cd frontend
npm start &
FRONTEND_PID=$!
cd ..

echo ""
echo "=== SmartAgriMarket demarre ==="
echo "  Frontend : http://localhost:4200"
echo "  Backend  : http://localhost:8080"
echo ""
echo "Appuyez sur Ctrl+C pour arreter les deux services"
echo ""

# Arreter les deux services proprement
trap "echo 'Arret...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT TERM

wait
