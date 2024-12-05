# Proyecto 4: Sistema automatizado de autorización segura para aplicaciones web en contenedores
## Introducción
En el contexto actual de la transformación digital, las aplicaciones web han adquirido un papel central en las operaciones de organizaciones de todos los tamaños. La adopción de contenedores ha facilitado la portabilidad y escalabilidad de estas aplicaciones, permitiendo despliegues más eficientes y consistentes. Sin embargo, con el aumento de la complejidad y la interconexión de sistemas, la seguridad y la gestión de autorizaciones se convierten en aspectos críticos que deben abordarse con rigor.

El proyecto: sistema automatizado de autorización segura para aplicaciones web en contenedores tiene como objetivo desarrollar una plataforma que integre la automatización del despliegue y la gestión de aplicaciones web en contenedores, con un enfoque robusto en la autorización y seguridad. Utilizando tecnologías modernas como JavaScript, TypeScript, Docker, Kubernetes y algoritmos de cifrado avanzados, se busca crear un sistema que no solo facilite la gestión eficiente de recursos en la nube, sino que también garantice la protección de la información sensible y las comunicaciones.

# Entregable 2: Implementación de seguridad avanzada y despliegue mejorado

## Objetivo: Incorporar características avanzadas de seguridad, optimizar el rendimiento mediante caché, implementar monitorización básica y mejorar el despliegue de la aplicación utilizando herramientas de contenerización avanzadas.

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
