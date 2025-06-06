# Dockerfile per Next.js 15 + Supabase Template
FROM node:18-alpine AS base

# Installa le dipendenze solo quando necessario
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Installa le dipendenze in base al package manager disponibile
COPY package.json pnpm-lock.yaml* ./
RUN \
  if [ -f pnpm-lock.yaml ]; then \
    corepack enable pnpm && pnpm i --frozen-lockfile; \
  else \
    echo "pnpm-lock.yaml non trovato." && exit 1; \
  fi

# Rebuild del codice sorgente solo quando necessario
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build dell'applicazione
RUN \
  if [ -f pnpm-lock.yaml ]; then \
    corepack enable pnpm && pnpm run build; \
  else \
    echo "pnpm-lock.yaml non trovato." && exit 1; \
  fi

# Immagine di produzione, copia tutti i file e avvia Next.js
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
# Disabilita la telemetria durante il runtime
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Imposta i permessi corretti per le cache pre-renderizzate
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Copia automaticamente i file di output leveraging Docker layered caching
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Health check endpoint
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

CMD ["node", "server.js"] 