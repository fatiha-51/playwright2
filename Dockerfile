FROM mcr.microsoft.com/playwright:v1.44.0

WORKDIR /app

ENV PLAYWRIGHT_BROWSERS_PATH=0

COPY package*.json ./
RUN npm ci

COPY index.js ./

EXPOSE 3000

CMD ["node", "index.js"]
