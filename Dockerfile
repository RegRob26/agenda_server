FROM node:20-alpine as builder
ENV NODE_ENV=build

WORKDIR /api
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build
    && npm prune --production

FROM node:20-alpine
ENV NODE_ENV=production
WORKDIR /api
COPY --from=builder /api/package*.json ./
COPY --from=builder /api/node_modules ./node_modules
COPY --from=builder /api/dist ./dist

CMD ["node", "dist/main.js"]