# ---- Stage 1: build the static assets ----
FROM node:22-alpine AS build
WORKDIR /app

# Copy lockfile first so this layer is cached unless deps change
COPY package*.json ./
RUN npm ci

# Copy source and produce the optimized /app/dist bundle
COPY . .
RUN npm run build

# ---- Stage 2: serve the static files with nginx ----
FROM nginx:1.29-alpine AS production
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]