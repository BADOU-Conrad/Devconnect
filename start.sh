#!/bin/bash

# Couleurs pour l'affichage
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Démarrage de DevConnect...${NC}\n"

# Fonction pour arrêter les processus en cas d'interruption
cleanup() {
    echo -e "\n${GREEN}🛑 Arrêt des serveurs...${NC}"
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit
}

trap cleanup SIGINT SIGTERM

# Démarrer le backend
echo -e "${BLUE}📡 Démarrage du backend (port 3000)...${NC}"
cd devconnect-backend
npm start &
BACKEND_PID=$!

# Attendre que le backend démarre
sleep 3

# Démarrer le frontend
echo -e "${BLUE}🎨 Démarrage du frontend (port 8080)...${NC}"
cd ../devconnect-frontend
npm run dev &
FRONTEND_PID=$!

echo -e "\n${GREEN}✅ DevConnect est prêt !${NC}"
echo -e "${BLUE}   Frontend: ${NC}http://localhost:8080"
echo -e "${BLUE}   Backend:  ${NC}http://localhost:3000"
echo -e "\n${GREEN}Appuyez sur Ctrl+C pour arrêter les serveurs${NC}\n"

# Attendre que l'utilisateur arrête les serveurs
wait
