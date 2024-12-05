# Proyecto 4: Sistema automatizado de autorización segura para aplicaciones web en contenedores
## Introducción
En el contexto actual de la transformación digital, las aplicaciones web han adquirido un papel central en las operaciones de organizaciones de todos los tamaños. La adopción de contenedores ha facilitado la portabilidad y escalabilidad de estas aplicaciones, permitiendo despliegues más eficientes y consistentes. Sin embargo, con el aumento de la complejidad y la interconexión de sistemas, la seguridad y la gestión de autorizaciones se convierten en aspectos críticos que deben abordarse con rigor.

El proyecto: sistema automatizado de autorización segura para aplicaciones web en contenedores tiene como objetivo desarrollar una plataforma que integre la automatización del despliegue y la gestión de aplicaciones web en contenedores, con un enfoque robusto en la autorización y seguridad. Utilizando tecnologías modernas como JavaScript, TypeScript, Docker, Kubernetes y algoritmos de cifrado avanzados, se busca crear un sistema que no solo facilite la gestión eficiente de recursos en la nube, sino que también garantice la protección de la información sensible y las comunicaciones.

# Entregable 2: Implementación de seguridad avanzada y despliegue mejorado

## Objetivo: Incorporar características avanzadas de seguridad, optimizar el rendimiento mediante caché, implementar monitorización básica y mejorar el despliegue de la aplicación utilizando herramientas de contenerización avanzadas.
El pproyecto usa la logica cliente-servidor, al hacer un correcto manejo de rutas para Administradores y Operadores mediante RBAC logramos entender mejor la funcionalidad de los metodos de autenticacion, usando JWT  bcrypt para una  maor seguridad en el uso de cntraseñas, aporta bastante tambien el uso de HTTPS ya que proporciona una capa de seugirdad en nuestro alicativo web, mediante ceritificados SSL, podemos tener un aplicativo que gracias a herramientas como crypto, helmet.js y mas logra la seguirdad requerida para el correcto flujo de datos.
# Estructura del proyecto completo
```bash
Proyecto-Final/
├── sistema-autorizacion/
│   ├── backend/
│   │   ├── dist/                  
│   │   ├── node_modules/           
│   │   ├── logs/                   
│   │   ├── src/                    
│   │   │   ├── __test__/           
│   │   │   │   └── sample.test.ts  
│   │   │   ├── controllers/        
│   │   │   │   ├── authController.ts
│   │   │   │   ├── resourceController.ts
│   │   │   │   └── userController.ts
│   │   │   ├── middlewares/        
│   │   │   │   ├── authMiddleware.ts
│   │   │   │   ├── checkRole.ts
│   │   │   │   ├── errorHandler.ts
│   │   │   │   ├── logMiddleware.ts
│   │   │   │   └── validationMiddleware.ts
│   │   │   ├── models/             
│   │   │   │   ├── logModel.ts
│   │   │   │   ├── resourceModel.ts
│   │   │   │   ├── testLog.ts
│   │   │   │   └── userModel.ts
│   │   │   ├── routes/             
│   │   │   │   ├── authRoutes.ts
│   │   │   │   ├── logRoutes.ts
│   │   │   │   ├── resourceRoutes.ts
│   │   │   │   └── userRoutes.ts
│   │   │   ├── tests/             
│   │   │   │   └── testConnection.ts
│   │   │   ├── types/              
│   │   │   │   └── express/index.d.ts
│   │   │   ├── utils/              
│   │   │   │   ├── hashUtil.ts
│   │   │   │   ├── jsonSanitizer.ts
│   │   │   │   ├── encyption.ts
│   │   │   │   ├── jwtUtil.ts
│   │   │   │   ├── redis.ts
│   │   │   │   └── logger.ts
│   │   │   ├── config.ts           
│   │   │   ├── init-db.ts          
│   │   │   └── server.ts                      
│   │   ├── .env.local              
│   │   ├── Dockerfile              
│   │   ├── package-lock.json       
│   │   ├── package.json            
│   │   ├── test-db.js              
│   │   └── tsconfig.json           
│   │
│   ├── frontend/
│   │   ├── build/                  
│   │   ├── node_modules/           
│   │   ├── public/                 
│   │   ├── src/                    
│   │   │   ├── components/         
│   │   │   │   ├── Auth/           
│   │   │   │   │   ├── Login.tsx
│   │   │   │   │   └── Register.tsx
│   │   │   │   ├── Layout/         
│   │   │   │   │   ├── Footer.tsx
│   │   │   │   │   └── Navbar.tsx
│   │   │   │   ├── Resources/      
│   │   │   │   │   ├── EditResourceForm.tsx
│   │   │   │   │   ├── ResourceForm.tsx
│   │   │   │   │   └── ResourceList.tsx
│   │   │   ├── hoc/
│   │   │   │   └── protectedRoute.ts
│   │   │   ├── pages/              
│   │   │   │   ├── AdminUser.tsx
│   │   │   │   ├── Dashboard.tsx
│   │   │   │   ├── Home.tsx
│   │   │   │   └── Profile.tsx
│   │   │   ├── services/           
│   │   │   │   └── apiService.ts
│   │   │   ├── store/
│   │   │   │   ├── slices/
│   │   │   │   │   └── authSlice.ts
│   │   │   │   ├── index.ts
│   │   │   ├── App.css             
│   │   │   ├── App.test.tsx        
│   │   │   ├── App.tsx             
│   │   │   ├── index.css           
│   │   │   ├── index.tsx           
│   │   │   ├── react-app-env.d.ts  
│   │   │   ├── reportWebVitals.ts 
│   │   │   └── setupTests.ts                   
│   │   ├── .env.local             
│   │   ├── Dockerfile              
│   │   ├── jest.config.ts         
│   │   ├── package-lock.json       
│   │   ├── package.json            
│   │   └── tsconfig.json           
│   │
│   ├── database/
│   │   └── init.sql                
│   │
│   ├── docker-compose.yml          
│
├── .gitignore                      
```

## Instalacion:
Instalar docker y docker-compose, en mi caso use el link de instalacion de Docker Desktop, para mi se me hizo mas intuitivo poder trabajar de manera grafica con Docker Desktop.
```bash
Link de instalación del docker(LINUX):
https://docs.docker.com/desktop/setup/install/linux/ubuntu/
Puedes instalarlo en tu terminal desde la carpeta de Descargas usando:
sudo apt-get install ./docker-desktop-amd64.deb
```

- Despues hacemos una clonacion en nuestro terinal de trabajo usando:
```bash
git clone
```
- Una vez que hayas establecido tu archivo de clonacion usa:
```bash
docker compose up --build
Para construir las imagenes de Docker para cada servicio (backend, frontend y base de datos) y levantar los contenedores interconectados.
Estos dockerfiles ya cargan las dependencias que necesitas para ejeuctar el programa.
```
Ojo: te recoiendo usar el siguiente comando apra tener permisos de superusuario
```bash
sudo usermod -aG docker $USER
```
Cuando termines de interactuar con el aplicativo web recuerda usar el siguiente comando para detener los contenedores despues de usar Ctrl + C:
```bash
docker compose down
```
# Conociendo el proyecto:
## Backend:
```bash
Navega al directorio backend:
cd backend
```
# 1. Configuración del Sistema
## Base de Datos: PostgreSQL
Se utiliza PostgreSQL por su fiabilidad y capacidad para manejar relaciones complejas entre datos. Las tablas creadas incluyen:
```bash
    Usuarios: Información básica y roles.
    Recursos de Infraestructura: Definición de recursos gestionados.
    Logs de Actividad: Historial de operaciones realizadas.
```

## Backend: Node.js y Express
El backend implementa APIs REST para manejar:
```bash
    Autenticación y Autorización: Uso de JWT y roles (RBAC).
    Gestión de Recursos y Usuarios: Creación, lectura, actualización y eliminación (CRUD).
    Logs de Actividad: Middleware que registra todas las operaciones importantes.
```

## Frontend: React
Se utiliza React con Redux para manejar el estado de la aplicación. El frontend incluye:
```bash
    Formularios de registro/login.
    Listado, creación y edición de recursos.
    Gestión de usuarios por roles.
```

# 2. Mejoras evaludas y configuradas
## 1. Helmet.js
### Porque lo usamos:
Helmet.js es una biblioteca de Node.js diseñada para mejorar la seguridad de las aplicaciones web configurando encabezados de seguridad HTTP. Estos encabezados protegen contra vulnerabilidades comunes como Cross-Site Scripting (XSS), Clickjacking, y ataques de fuerza bruta.

![imagen](https://github.com/user-attachments/assets/2517b714-28fe-4327-9048-279aef4d8975)

## 2. Crypto
### Porque lo usamos:
La biblioteca crypto de Node.js proporciona herramientas para realizar operaciones criptográficas como cifrado, creación de hashes, y generación de claves de manera segura.

![imagen](https://github.com/user-attachments/assets/4dbf96b3-955f-471f-8244-9785a69cc0c2)

## 3. Bcrypt.js
### Porque lo usamos:
Bcrypt es una biblioteca de hashing diseñada específicamente para manejar contraseñas de forma segura. A diferencia de los algoritmos de hashing genéricos, Bcrypt incluye mecanismos para dificultar los intentos de fuerza bruta.

## 4. Redis
### Porque lo usamos:
- Redis es una base de datos en memoria extremadamente rápida que se utiliza para gestionar caché y sesiones de usuario de manera eficiente.
- Cacheamos respuestas frecuentes del backend para reducir la carga del servidor.
- Gestionamos tokens JWT y sesiones de usuario, permitiendo validaciones rápidas sin consultas repetitivas a la base de datos.

![Imagen pegada (3)](https://github.com/user-attachments/assets/de49779b-51ac-4ca6-82ce-0f842ad07251)


## 5. HTTPS
### Porque lo usamos:
- HTTPS asegura la comunicación entre cliente y servidor, protegiendo los datos transmitidos mediante cifrado SSL/TLS. (Usamos certificados SSL autogenerados por OpenSSL)
- Todo el tráfico entre el frontend y backend se cifra utilizando HTTPS, protegiendo las credenciales de usuario, configuraciones de recursos, y otros datos sensibles.

![imagen](https://github.com/user-attachments/assets/dddc51bc-1aa5-4e34-bf97-15a9cf82ed10)

![imagen](https://github.com/user-attachments/assets/59c3b08d-619f-425f-8bab-d17a84d0e8a0)

# Parte 3: Mejora Futura
## 1. Monitorización con Prometheus y Grafana
Aunque aún no implementado, se planea integrar:
```bash
    Prometheus: Para recopilar métricas de los contenedores y servicios.
    Grafana: Para visualizar dashboards de rendimiento y alertas.
```
Podemos tener una idea mas detallada para recopilar mediante exporters para recopilar metricas del backend, PostgreSql y Redis, esto en Prometheus y en Grafana visualizar los datos de recursos como CPU, Memoria, etc.

### Dependencias principales (definidas en package.json):
- express: Framework web para manejar solicitudes HTTP.
- pg: Cliente de PostgreSQL para interactuar con la base de datos.
- jsonwebtoken: Manejo de tokens JWT para autenticación.
- bcrypt: Cifrado de contraseñas.
- dotenv: Manejo de variables de entorno.
- winston: Registro de logs.
- crypto: Libreria de seguridad de datos para evitar inyecciones SQL
- express-validator: para sanitizar entradas, y validacion de datos para un correcto formmato.
- cors: para la conexion segura entre backend y frontend
- https: para realizar conexiones https

### Dependencias de desarrollo:
- typescript: Tipado estático.
- ts-node-dev: Ejecución en desarrollo.
- jest: Pruebas unitarias.
- Tipos (@types): Aseguran compatibilidad con TypeScript.

Frontend:
```bash
    Navega al directorio frontend:

    cd frontend
```
### Dependencias principales (definidas en package.json):
- react y react-dom: Biblioteca principal de la interfaz.
- axios: Cliente HTTP para consumir la API.
- react-router-dom: Manejo de rutas en React.
- Dependencias de desarrollo:
- typescript: Tipado estático.
- jest: Pruebas unitarias.
- Tipos (@types): Compatibilidad con TypeScript.

## Base de Datos:
El script database/init.sql define la estructura inicial:
- Tablas: usuarios, recursos, logs.
- Índices: Optimización para consultas rápidas.
- Datos iniciales: Usuario administrador y logs.

## Redis:
Integramos Redis en el Backend para gestionar el caché, almacenar tokens JWT, almacenar en caché resultados de consultas que se realizan repetidamente gestionar sesiones de usuario de manera eficiente.

![imagen](https://github.com/user-attachments/assets/15e5dc9d-837b-4b2a-a200-f42cd7fe3009)

## Redux
Esta tecnología nos permite, a partir de una store global y un control del flujo de datos muy elevado, crear aplicaciones muy sólidas y que por la arquitectura que ofrecen escalables a nivel de datos y volumen de la aplicación.

Codigo en el frontend: src/stores/slices/authSlices.ts -> Realizamos para el manejo de la gestion de estados globalkes en el React. (Login y Register)
![imagen](https://github.com/user-attachments/assets/a1931a0a-1d31-4b92-bcb9-f9d6c1662307)

Codigo den el frontend: src/stores/index.ts -> guarda el estado de toda la aplicación en un único objeto, llamado store(index)
![imagen](https://github.com/user-attachments/assets/8cfee099-1e43-4f0b-9e4b-d9b066ce6c1d)


