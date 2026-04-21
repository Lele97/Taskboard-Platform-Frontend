FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build --configuration=production

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist/taskboard-frontend ./dist/taskboard-frontend
EXPOSE 4000
ENV PORT=4000
CMD ["node", "dist/taskboard-frontend/server/server.mjs"]
