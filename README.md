# API educativa de Free Fire

Node.js + PostgreSQL. Catalogo propio de personajes con datos ficticios de practica; no conecta con Garena. Solo expone consultas GET. Se usa SQL parametrizado para consultar por ID.

## 1. Local (PowerShell)

Instala Node.js 22 o superior con npm y abre Docker Desktop en modo contenedores Linux. Ejecuta desde esta carpeta:

```powershell
Copy-Item .env.example .env
npm install
docker compose up -d --wait
npm run db:init
npm start
```

Si cambias la clave de ejemplo, actualiza POSTGRES_PASSWORD y DATABASE_URL en .env con el mismo valor. No subas .env al repositorio. El puerto local de PostgreSQL es 5433 para reducir conflictos con otras instalaciones.

Abre http://localhost:3000/api/personajes/1 y http://localhost:3000/health. En otra terminal:

```powershell
Invoke-RestMethod http://localhost:3000/api/personajes
Invoke-RestMethod http://localhost:3000/api/personajes/1
docker compose ps
docker image ls postgres
docker volume ls --filter name=practica-freefire
```

La imagen es postgres:17; el contenedor ejecuta PostgreSQL; el volumen practica-freefire_postgres_data conserva la base al detener el contenedor. `docker compose stop` detiene la base sin borrar datos. No elimines el volumen si quieres conservarlos. Las variables de usuario y clave solo inicializan un volumen nuevo; cambiarlas despues no cambia las credenciales existentes.

## 2. GitHub

Crea un repositorio vacio llamado api-free-fire en tu cuenta. Desde esta carpeta:

```powershell
git init -b main
git add .
git commit -m "Crear API de personajes con PostgreSQL"
git remote add origin https://github.com/TU_USUARIO/api-free-fire.git
git push -u origin main
```

Sustituye TU_USUARIO por tu cuenta. Autentica GitHub mediante el navegador cuando Git lo solicite. No pegues tokens ni contrasenas en el chat. Antes de publicar, `git status` debe mostrar que .env no esta incluido. package-lock.json, cuando npm lo genere, si debe incluirse.

## 3. Render

La API desplegada no puede usar localhost de tu computadora. El Blueprint render.yaml crea una base Render Postgres y un servicio Node con DATABASE_URL vinculada. En Render: New > Blueprint, conecta GitHub y selecciona el repositorio. Revisa el plan y las condiciones vigentes antes de crearlo. No hay despliegue ni recursos remotos creados por estos archivos.

El build ejecuta npm install; al iniciar, db:init crea la tabla y agrega registros que falten sin sobrescribir los existentes. Node escucha en PORT y 0.0.0.0. Prueba /health, /api/personajes y /api/personajes/1 en la URL que Render asigne. El plan gratuito puede tener limites y expiracion de la base: verifica las condiciones en Render.

## 4. n8n

En un nodo HTTP Request: Method GET, Authentication None, URL https://TU_SERVICIO.onrender.com/api/personajes/1. No requiere Body ni Headers. Ejecuta y revisa id, nombre, habilidad, tipo y descripcion.

Para replicar el flujo de Sheets, usa encabezados id, nombre, habilidad, tipo, descripcion, consultado. Lee filas, filtra consultado igual a NO y consulta con URL en modo Expression:

```text
https://TU_SERVICIO.onrender.com/api/personajes/{{ $json.id }}
```

En Update Row, busca por id y asigna cada columna desde $json.id, $json.nombre, $json.habilidad, $json.tipo y $json.descripcion. Marca consultado con SI fijo. En Aggregate usa All Item Data, campo personajes. En Gmail cuenta con {{ $json.personajes.length }}.

## Comprobaciones

GET /api/personajes debe devolver 50 registros iniciales, con IDs del 1 al 50 y nombres distintos. /api/personajes/1 devuelve uno, /api/personajes/50 devuelve Orion, /api/personajes/999 devuelve 404, /api/personajes/abc devuelve 400. Si /health devuelve 503, revisa que PostgreSQL este disponible. Si /health funciona pero los personajes dan 503, ejecuta db:init.

El catalogo usa nombres de personajes y habilidades simplificadas de practica, no estadisticas oficiales actualizadas. Al actualizar desde la version de cinco registros, db:init agrega los IDs faltantes sin borrar ni sobrescribir los existentes. Para actualizar localmente: npm.cmd run db:init. En Render se ejecuta automaticamente al iniciar el servicio.
