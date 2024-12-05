# Etapa de construcción
FROM node:16-alpine AS build

# Configurar un mirror alternativo para evitar problemas con `apk`
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.ustc.edu.cn/' /etc/apk/repositories && \
    apk update && \
    apk add --no-cache bash curl

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package.json package-lock.json ./

# Instalar dependencias y limpiar caché
RUN npm install && npm cache clean --force

# Copiar el código fuente
COPY . .

# Construir la aplicación para producción
RUN npm run build

# Etapa para servir la aplicación con nginx
FROM nginx:1.21-alpine

# Copiar los archivos del frontend construidos
COPY --from=build /app/build /usr/share/nginx/html

# Copiar los certificados SSL al contenedors
COPY ./ssl/backend.crt /etc/ssl/certs/backend.crt
COPY ./ssl/backend.key /etc/ssl/certs/backend.key

# Exponer los puertos
EXPOSE 80
EXPOSE 443

# Copiar la configuración de nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Comando por defecto para ejecutar nginx
CMD ["nginx", "-g", "daemon off;"]
