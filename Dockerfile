# ===========================================
# Dockerfile - FrontEnd (Vite + React)
# Servido con Nginx para producción
# ===========================================

# --- Etapa 1: Build ---
FROM node:20 AS build
WORKDIR /app

# Copiar dependencias
COPY package*.json ./
RUN npm install

# Copiar código fuente y construir
COPY . .
ARG VITE_API_URL=http://backend:5000/api
ENV VITE_API_URL=${VITE_API_URL}
RUN npm run build

# --- Etapa 2: Nginx ---
FROM nginx:stable
WORKDIR /usr/share/nginx/html

# Limpiar default y copiar build
RUN rm -rf ./*
COPY --from=build /app/dist .

# Copiar configuración nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

ENTRYPOINT ["nginx", "-g", "daemon off;"]
