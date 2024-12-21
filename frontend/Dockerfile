# Etapa 1: Construcción del proyecto
FROM node:18 AS builder

WORKDIR /app

# Copia los archivos necesarios
COPY package.json package-lock.json ./
RUN npm install

COPY . .

# Construye el proyecto
RUN npm run build

# Etapa 2: Servir los archivos estáticos con Nginx
FROM nginx:alpine

# Copia los archivos estáticos generados al servidor web
COPY --from=builder /app/dist /usr/share/nginx/html

# Copia la configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
