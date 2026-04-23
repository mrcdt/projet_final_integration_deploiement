# ---- Étape 1 : Build & tests ----
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm test

# ---- Étape 2 : Image de production (légère) ----
FROM node:18-alpine AS production
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY src/ ./src/
EXPOSE 3000
CMD ["node", "src/index.js"]