FROM node:22-alpine AS builder
# Install necessary build tools
RUN apk add --no-cache openssl1.1-compat build-base python3

WORKDIR /app

COPY package.json package-lock.json* ./
# Install all dependencies including devDependencies for build steps
RUN npm ci

COPY . .
# Build frontend and backend
RUN npm run build

FROM node:22-alpine AS runner
# Install runtime deps
RUN apk add --no-cache openssl

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

COPY --from=builder /app/package.json ./
# Only install production dependencies
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

EXPOSE 3000

# Start script as defined in package.json (node dist/server.cjs)
CMD ["npm", "start"]
