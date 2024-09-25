# Usa una imagen de Node.js como base
FROM node:14 AS build

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Copia el package.json y package-lock.json al contenedor
COPY package*.json ./

# Instala las dependencias de la aplicación
RUN npm install

# Copia el resto de la aplicación al contenedor
COPY . .

# Compila la aplicación (esto genera una carpeta 'dist' con Vite)
RUN npm run build

# Usa una imagen ligera de Nginx para servir el frontend
FROM nginx:alpine

# Copia los archivos estáticos compilados de Vite al directorio de Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Expone el puerto en el que Nginx servirá la aplicación
EXPOSE 80

# Comando para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
