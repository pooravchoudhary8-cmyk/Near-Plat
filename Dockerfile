FROM node:18-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

FROM node:18-alpine AS backend-builder
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install --production
COPY backend/ ./

FROM node:18-alpine
WORKDIR /app
COPY --from=backend-builder /app/backend ./backend
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

WORKDIR /app/backend
ENV NODE_ENV=production
ENV PORT=5000

EXPOSE 5000
CMD ["npm", "start"]
