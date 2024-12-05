-- ========================================
-- Script para inicializar la base de datos
-- ========================================

-- Crear tabla de usuarios con apiKey
CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    email VARCHAR(50) UNIQUE NOT NULL,
    contraseña VARCHAR(255) NOT NULL,
    rol VARCHAR(20) NOT NULL CHECK (rol IN ('Administrador', 'Operador')),
    fecha_registro TIMESTAMP DEFAULT NOW(),
    api_key VARCHAR(255) UNIQUE -- Nuevo campo para almacenar la clave de API
);

-- Crear tabla de recursos
CREATE TABLE IF NOT EXISTS recursos (
    id_recurso SERIAL PRIMARY KEY,
    tipo_recurso VARCHAR(50) NOT NULL,
    configuracion TEXT NOT NULL,
    estado VARCHAR(20) NOT NULL CHECK (estado IN ('Activo', 'Inactivo')),
    fecha_creacion TIMESTAMP DEFAULT NOW(),
    id_usuario INT REFERENCES usuarios(id_usuario) ON DELETE CASCADE
);

-- Crear tabla de logs
CREATE TABLE IF NOT EXISTS logs (
    id_log SERIAL PRIMARY KEY,
    id_usuario INT REFERENCES usuarios(id_usuario) ON DELETE SET NULL,
    accion TEXT NOT NULL,
    fecha_hora TIMESTAMP DEFAULT NOW(),
    ip_origen VARCHAR(50) NOT NULL
);

-- ========================================
-- Índices para optimizar consultas
-- ========================================

-- Índice único para correos electrónicos en usuarios
CREATE UNIQUE INDEX IF NOT EXISTS idx_email_usuario ON usuarios (email);

-- Índice para filtrar por estado en recursos
CREATE INDEX IF NOT EXISTS idx_estado_recurso ON recursos (estado);

-- Índice para buscar por tipo de recurso
CREATE INDEX IF NOT EXISTS idx_tipo_recurso ON recursos (tipo_recurso);

-- Índice para ordenar por fecha de creación en logs
CREATE INDEX IF NOT EXISTS idx_fecha_hora_logs ON logs (fecha_hora);

-- ========================================
-- Datos iniciales opcionales
-- ========================================

-- Crear usuarios por defecto (solo en desarrollo)
INSERT INTO usuarios (nombre, email, contraseña, rol, api_key)
VALUES
    ('JuanCarlos', 'juan.carlos@gmail.com', '123456789', 'Administrador', 'api-key-default-12345')
ON CONFLICT DO NOTHING;

-- Crear un recurso por defecto (solo en desarrollo)
INSERT INTO recursos (tipo_recurso, configuracion, estado, id_usuario)
VALUES
    ('Servidor', '8GB RAM, 256GB SSD', 'Activo', 1)
ON CONFLICT DO NOTHING;

-- ========================================
-- Logs iniciales opcionales
-- ========================================

-- Agregar un log inicial (solo en desarrollo)
INSERT INTO logs (id_usuario, accion, ip_origen)
VALUES
    (1, 'Sistema iniciado', '127.0.0.1')
ON CONFLICT DO NOTHING;

-- ========================================
-- Mensaje de finalización
-- ========================================
DO $$ BEGIN
    RAISE NOTICE 'Base de datos iniciada correctamente.';
END $$;
