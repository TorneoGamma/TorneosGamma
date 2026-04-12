# 🏆 TorneosGamma — Sistema de Torneos Automatizados

Sistema para gestionar torneos de cualquier disciplina (fútbol, videojuegos, ajedrez) con generación automática de brackets y avance de rondas.

**Autores:** Christipher · Juan Angel · Salazar

---

## Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | React + Vite, Tailwind CSS, TanStack Query, Zustand, Axios, React Router |
| Backend | PHP 8.2 + Laravel 12, Sanctum |
| Base de datos | PostgreSQL |

---

## Requisitos previos

- PHP 8.2+
- Composer 2+
- Node.js 18+
- PostgreSQL 14+

---

## Instalación y configuración

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/torneos-gamma.git
cd torneos-gamma
```

### 2. Backend (Laravel)

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
```

Editar `.env` con tus credenciales de PostgreSQL:

```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=torneos_gamma
DB_USERNAME=postgres
DB_PASSWORD=tu_password
```

Ejecutar migraciones y seeders:

```bash
php artisan migrate --seed
```

Iniciar servidor:

```bash
php artisan serve
```

El backend estará en `http://localhost:8000`

### 3. Frontend (React)

```bash
cd frontend
npm install
npm run dev
```

El frontend estará en `http://localhost:5173`

---

## Usuarios de prueba (seeder)

| Rol | Email | Contraseña |
|-----|-------|-----------|
| Admin | admin@torneos.com | password |
| Usuario | user@torneos.com | password |

---

## Endpoints principales de la API

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| POST | /api/register | Registro de usuario | — |
| POST | /api/login | Inicio de sesión | — |
| GET | /api/tournaments | Listar torneos | — |
| GET | /api/tournaments/:id | Ver torneo + bracket | — |
| POST | /api/tournaments | Crear torneo | Admin |
| POST | /api/tournaments/:id/bracket/generate | Generar bracket | Admin |
| POST | /api/matches/:id/result | Registrar resultado | Admin |
| POST | /api/tournaments/:id/teams | Inscribir equipo | Auth |
| GET | /api/reports/general | Reporte general | — |
| GET | /api/reports/tournament/:id | Reporte de torneo | — |

---

## Despliegue

### Backend en Render
1. Crear un Web Service apuntando a `/backend`
2. Build command: `composer install --no-dev && php artisan migrate --seed`
3. Start command: `php artisan serve --host=0.0.0.0 --port=$PORT`
4. Agregar variables de entorno del `.env`

### Frontend en Vercel
1. Importar el directorio `/frontend`
2. Framework: Vite
3. Agregar variable: `VITE_API_URL=https://tu-backend.onrender.com`

---

## Estructura del proyecto

```
torneos-gamma/
├── backend/
│   ├── app/
│   │   ├── Http/Controllers/   # AuthController, TournamentController, BracketController...
│   │   ├── Models/             # User, Tournament, Team, Round, TournamentMatch, TournamentRegistration
│   │   └── Http/Middleware/    # AdminMiddleware
│   ├── database/
│   │   ├── migrations/         # 6 tablas con integridad referencial
│   │   └── seeders/
│   └── routes/api.php
└── frontend/
    └── src/
        ├── components/         # Navbar, BracketView, MatchCard, TournamentCard
        ├── pages/              # TournamentsPage, TournamentDetailPage, AdminPage, ReportsPage
        ├── hooks/              # useTournaments, useAuth
        ├── store/              # authStore (Zustand)
        └── lib/                # axios configurado
```
