# Imagen base de Node.js
FROM node:16-alpine

# Configurar un mirror alternativo para evitar problemas con `apk`
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.ustc.edu.cn/' /etc/apk/repositories && \
    apk update && \
    apk add --no-cache bash curl

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package.json package-lock.json ./

# Instalar dependencias
RUN npm install

# Copiar todo el código fuente
COPY . .

# Descargar y configurar wait-for-it
ADD https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh /usr/bin/wait-for-it
RUN chmod +x /usr/bin/wait-for-it

# HEALTHCHECK
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s CMD curl --fail http://localhost:3000/health || exit 1

# Exponer el puerto
EXPOSE 3000

# Comando para ejecutar el backend
CMD ["sh", "-c", "wait-for-it database:5432 -- wait-for-it redis:6379 -- node dist/server.js"]
