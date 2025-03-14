# Étape de build
FROM node:20-alpine AS builder

# Définition du répertoire de travail
WORKDIR /app

# Copie des fichiers de dépendances
COPY package*.json ./

# Installation des dépendances
RUN npm ci

# Copie du reste des fichiers sources
COPY . .

# Build de l'application
RUN npm run build

# Étape de production
FROM node:20-alpine AS runner

WORKDIR /app

# Définition des variables d'environnement
ENV NODE_ENV=production
# Les variables d'environnement sensibles seront injectées via docker-compose
# ou via les variables d'environnement du conteneur

# Copie des fichiers nécessaires depuis l'étape de build
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
# Ne pas copier les fichiers .env.* car ils contiennent des informations sensibles
# Les variables d'environnement seront injectées via docker-compose

# Exposition du port
EXPOSE 3000

# Commande de démarrage
CMD ["npm", "start"]