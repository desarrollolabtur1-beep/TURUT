# TURUT

Aplicación móvil y backend para descubrimiento y reserva de experiencias turísticas.

## Stack Tecnológico

- **Backend:** Express + TypeScript + Mongoose (MongoDB) + JWT
- **Frontend:** React Native + @react-navigation (Native Stack + Bottom Tabs) + Context / Hooks
- **Data actual de UI:** `data/destinations.ts` y `data/events.ts` (mock local)
- **API Base:** Dev: `http://localhost:5000/api` | Prod: `https://api.turut.online/api`

## Estructura Real

- `backend/src/server.ts`: Punto de entrada y verificación de salud (`/api/health`)
- `backend/src/routes/`: Rutas modulares (`auth`, `experience`, `booking`)
- `backend/src/models/`: Modelos Mongoose (`User`, `Experience`, `Booking`)
- `frontend/src/navigation/AppNavigator.tsx`: Flujo Splash → Login → MainTabs → Landing
- `frontend/src/navigation/MainTabs.tsx`: Tabs principales (Imperdibles, Tu Ruta, Radar)

## Endpoints Reales

| Método | Endpoint | Estado de Auth |
|---|---|---|
| `GET` | `/api/health` | Público |
| `POST` | `/api/auth/register` | Público |
| `POST` | `/api/auth/login` | Público |
| `GET` | `/api/auth/me` | Privado (JWT) |
| `GET` | `/api/experiences` | Público |
| `GET` | `/api/experiences/featured` | Público |
| `GET` | `/api/experiences/my-experiences` | Privado (JWT) |
| `POST` | `/api/experiences` | Privado (JWT) |
| `GET` | `/api/experiences/:id` | Privado (JWT) |
| `PUT` | `/api/experiences/:id` | Privado (JWT) |
| `DELETE` | `/api/experiences/:id` | Privado (JWT) |

> *Nota: Existen adicionalmente 5 endpoints de reservas en `backend/src/routes/booking.routes.ts` (GET/POST `/api/bookings`, GET/PUT/DELETE `/api/bookings/:id`), todos bajo autenticación JWT obligatoria.*

## Variables de Entorno (Backend)

Documentadas en `.env.example`:
- `NODE_ENV`: Entorno de ejecución (`development`, `production`).
- `PORT`: Puerto de escucha del servidor HTTP.
- `MONGODB_URI`: Cadena de conexión para MongoDB vía Mongoose.
- `JWT_SECRET`: Secreto criptográfico para firma y verificación de tokens JWT.
- `CORS_ORIGIN`: Origen o dominios autorizados para solicitudes CORS.

> *Nota: `JWT_EXPIRES_IN` está cargada pero no se usa; el token firma 7d fijo.*

## Setup

### Backend
```bash
cd backend && npm install && npm run dev
```
*(Requiere Mongo corriendo + .env)*

### Frontend
```bash
cd frontend && npm install && npm run [start|android|ios]
```

## Estado actual y deuda conocida

- **UI viva desacoplada:** La UI viva (Home/Discover/Radar) usa data mock (`data/destinations.ts` y `data/events.ts`), no la API.
- **Pantallas huérfanas:** `LoginScreen`, `RegisterScreen`, `ProfileScreen`, `BookingsScreen`, `ExperienceDetailScreen`, `MainLayout`, `NeonText`.
- **Middleware inactivo:** `authorize` definido pero no montado.
- **Tipado desfasado:** `types/navigation.ts` desactualizado vs rutas reales.
