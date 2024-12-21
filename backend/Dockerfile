# Usar la imagen oficial de Node.js como base
FROM node:16

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copiar los archivos package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias del proyecto
RUN npm install

# Copiar todo el código fuente del backend al contenedor
COPY . .

# Exponer el puerto en el que correrá el servidor (5000)
EXPOSE 5000

# Comando para ejecutar el servidor backend
CMD ["npm", "run", "dev"]
