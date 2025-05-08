FROM mcr.microsoft.com/playwright:v1.44.0

WORKDIR /app

COPY package.json ./
RUN npm install

COPY index.js ./

EXPOSE 3000

CMD ["node", "index.js"]
