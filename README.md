# SecureGallery

Aplicación web segura para gestión pública de imágenes con detección de esteganografía, cuarentena de archivos sospechosos y control de acceso basado en roles.

Proyecto desarrollado para la materia:

**Desarrollo de Software Seguro**  
Universidad de las Fuerzas Armadas ESPE

---
Integrantes: Asmal Kevin //  Tipan Fernando

# Tecnologías Utilizadas

## Frontend
- React
- Axios
- React Router DOM

## Backend
- Node.js
- Express.js
- PostgreSQL
- JWT
- Helmet
- Multer
- Sharp

---

# Características de Seguridad

- Autenticación segura con JWT
- Hashing seguro de contraseñas con bcrypt
- Rate limiting
- RBAC (Role Based Access Control)
- Validación MIME real
- Protección XSS
- Helmet CSP
- X-Content-Type-Options: nosniff
- Detección de esteganografía
- Cuarentena de imágenes sospechosas

---

# Estructura del Proyecto

```bash
frontend/
backend/
uploads/
quarantine/
```

---

# Instalación del Proyecto

## 1. Clonar repositorio

```bash
git clone https://github.com/frtipan/Proyecto_DesarrolloSeguroSoftware.git
```

---

# Backend

## Entrar a backend

```bash
cd backend
```

---

## Instalar dependencias

```bash
npm install
```

---

## Dependencias principales

```bash
npm install express cors helmet multer sharp jsonwebtoken bcryptjs pg express-rate-limit file-type dotenv
```

---

# Variables de entorno

Crear archivo:

```bash
backend/.env
```

Contenido:

```env
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=12345
DB_NAME=secureframe

JWT_SECRET=secureframe_secret
```

---

# Ejecutar backend

```bash
npm start
```

Servidor:

```bash
http://localhost:3000
```

---

# Frontend

## Entrar a frontend

```bash
cd frontend
```

---

## Instalar dependencias

```bash
npm install
```

---

## Ejecutar frontend

```bash
npm run dev
```

Frontend:

```bash
http://localhost:5173
```

---

# Base de Datos PostgreSQL

Crear base de datos:

```sql
CREATE DATABASE secureframe;
```

---

# Configuración de Base de Datos

Ejecutar el archivo:

```bash
database.sql
```

para crear automáticamente las tablas necesarias del sistema.

---

# Tablas Principales

El sistema utiliza las siguientes tablas:

- users
- albums
- images
  
---

# Credenciales de Prueba

## Usuario Demo

```text
Usuario: userdemo
Contraseña: UserDemo123@
```

---

## Supervisor Demo

```text
Usuario: supervisor
Contraseña: Supervisor123@
```

---

# Flujo del Sistema

1. Usuario inicia sesión.
2. Usuario sube imagen.
3. Sistema valida:
   - MIME real.
   - Magic Numbers.
   - Estructura del archivo.
   - Posible esteganografía.
4. Si es sospechosa:
   - Se envía a cuarentena.
5. Supervisor revisa:
   - Aprobar.
   - Rechazar.

---

# Justificación Técnica de la Detección de Esteganografía

El sistema implementa un análisis automatizado basado en múltiples técnicas para identificar posibles manipulaciones ocultas dentro de imágenes.

## Métodos implementados

### 1. Validación MIME Real

Se utiliza la librería:

```text
file-type
```

para verificar el tipo real del archivo mediante Magic Numbers, evitando confiar únicamente en la extensión del archivo.

---

### 2. Análisis LSB (Least Significant Bit)

Se realiza análisis estadístico de bits menos significativos para detectar alteraciones anómalas típicas de herramientas de esteganografía.

---

### 3. Detección EOF Payload

El sistema analiza información sospechosa al final del archivo (EOF attacks), buscando firmas como:

- ZIP
- RAR
- EXE
- Scripts ocultos

---

### 4. Análisis de Entropía

Se evalúa la distribución estadística de bits y ruido dentro de la imagen para detectar patrones anómalos compatibles con ocultamiento de información.

---



# Seguridad Implementada

## OWASP

La solución implementa controles alineados con:

- OWASP ASVS Nivel 2
- OWASP Top 10

---

## Seguridad SDLC

Se aplicaron medidas de seguridad en:

- Requisitos
- Diseño
- Desarrollo
- Pruebas
- Despliegue

---

# Cabeceras HTTP Seguras

Implementadas mediante Helmet:

- Content Security Policy (CSP)
- X-Content-Type-Options: nosniff

---

# Seguridad de Contraseñas

Las contraseñas son protegidas mediante hashing seguro utilizando:

```text
bcrypt
```

con salt automático para evitar almacenamiento de credenciales en texto plano.

---

# Detección de Amenazas

El sistema detecta:

- Payloads ocultos
- XSS
- MIME Sniffing
- Upload Bypass
- Esteganografía básica
- EOF attacks

---

# Archivos Ignorados

El proyecto utiliza `.gitignore` para evitar subir:

```text
node_modules
.env
uploads
quarantine
```

---

# Seguridad Implementada en Uploads

Antes de almacenar una imagen, el sistema realiza:

- Validación MIME real.
- Validación Magic Numbers.
- Revisión estructural.
- Detección LSB.
- Detección EOF payload.
- Sanitización de metadatos.
- Cuarentena automática.

---

# Autores

Fernando Tipán, Kevin Asmal

Universidad de las Fuerzas Armadas ESPE
