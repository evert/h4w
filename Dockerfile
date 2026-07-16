FROM node:24-slim

WORKDIR /app

# Install dependencies first (better caching)
COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

ENV NODE_ENV=production
ENV PORT=3111

EXPOSE 3111

CMD ["node", "server/index.ts"]
