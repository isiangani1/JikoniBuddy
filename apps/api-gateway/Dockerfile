FROM node:20-alpine AS base
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build:gateway

EXPOSE 4000
CMD ["node", "apps/api-gateway/dist/main.js"]
