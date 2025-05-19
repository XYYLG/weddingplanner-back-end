# Build stage
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . ./
RUN npx prisma generate # Prisma Client generatie
RUN npm run build

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

# Alleen de node_modules voor productie
COPY package*.json ./
RUN npm ci --only=production

COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json

EXPOSE 8081

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main.js"]
