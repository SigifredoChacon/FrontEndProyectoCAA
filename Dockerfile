# Etapa de construcción
FROM node:18-alpine AS build

# Crear un directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar los archivos package.json y package-lock.json e instalar dependencias
COPY package*.json ./
RUN npm install

# Copiar el resto del código del proyecto
COPY . .

# Construir la aplicación
RUN npm run build

# Etapa para servir la aplicación
FROM nginx:alpine

# Copiar los archivos de la aplicación construida a la carpeta de Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Exponer el puerto 80 para el contenedor
EXPOSE 80

# Comando para correr Nginx
CMD ["nginx", "-g", "daemon off;"]
