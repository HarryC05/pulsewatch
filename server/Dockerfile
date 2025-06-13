# ─── Stage 1: install & generate ─────────────────────────────
FROM node:22-alpine AS deps
WORKDIR /app

# 1) copy package files
COPY server/package.json server/package-lock.json ./

# 2) install everything (including devDeps for prisma)
RUN npm ci

# 3) copy source + prisma schema + shared
COPY server ./
COPY shared ./shared

# 4) generate the prisma client (pulls both engines)
RUN npx prisma generate

# 5) prune devDependencies to keep only prod
RUN npm prune --production

# ─── Stage 2: runtime image ────────────────────────────────────
FROM node:22-alpine AS runner
WORKDIR /app

# copy just prod node_modules + built sources
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app ./

# runtime environment
ENV NODE_ENV=production
ENV PORT=4000

EXPOSE 4000
CMD ["node", "index.js"]
