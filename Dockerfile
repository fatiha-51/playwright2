# Utilise l'image officielle Playwright avec Node.js
FROM mcr.microsoft.com/playwright:v1.44.0

# Définit le répertoire de travail
WORKDIR /app

# Variables d'environnement critiques
ENV CI=true
ENV NODE_ENV=production
ENV PLAYWRIGHT_BROWSERS_PATH=0
ENV DEBCONF_NOWARNINGS=yes

# Installation des dépendances système nécessaires
RUN apt-get update && apt-get install -y \
    fonts-liberation \
    libasound2 \
    libgbm1 \
    libnss3 \
    libxv1 \
    && rm -rf /var/lib/apt/lists/*

# Copie les fichiers de dépendances
COPY package*.json ./
COPY npm-shrinkwrap.json* ./

# Installation des dépendances Node.js
RUN npm ci --omit=dev --ignore-scripts && \
    npx playwright install --with-deps

# Copie le code source de l'application
COPY . .

# Configuration des permissions pour les environnements restreints
RUN chmod -R o+rwx /usr/bin/google-chrome-stable && \
    chmod -R o+rwx /ms-playwright

# Exposition du port et commande de démarrage
EXPOSE 3000

# Healthcheck pour la surveillance
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/health || exit 1

# Commande d'exécution
CMD ["node", "index.js"]
