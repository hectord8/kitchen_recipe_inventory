FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
RUN addgroup -S app && adduser -S app -G app
COPY --from=builder /app/.next .next
COPY --from=builder /app/package.json package.json
COPY --from=builder /app/public public
COPY --from=builder /app/next.config.mjs next.config.mjs
COPY --from=builder /app/node_modules node_modules
ENV NODE_ENV=production
USER app
EXPOSE 3000
CMD ["npm", "start"]
