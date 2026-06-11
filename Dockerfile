FROM node:22-alpine AS builder
# Install necessary build tools for Prisma and native dependencies
RUN apk add --no-cache openssl1.1-compat build-base python3

WORKDIR /app

COPY package.json package-lock.json* ./
# Install all dependencies including devDependencies for build steps
RUN npm ci

COPY . .
# Generate prisma client
RUN npx prisma generate
# Build frontend and backend
RUN npm run build

FROM node:22-alpine AS runner
# Install sqlite or openssl if required by prisma in runtime
RUN apk add --no-cache openssl

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

COPY --from=builder /app/package.json ./
# Only install production dependencies
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

# Start script as defined in package.json (node dist/server.cjs)
CMD ["npm", "start"]
