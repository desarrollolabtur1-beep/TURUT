# TURUT

Landing page para experiencias turísticas y reservas.

## Estructura del Proyecto

```
Landing-APP/
├── assets/                 # Imágenes y recursos estáticos
├── backend/                # API REST (Express + TypeScript)
│   └── src/
│       ├── controllers/     # auth, booking, experience
│       ├── middleware/      # auth, error
│       ├── config/          # database, env
│       ├── types/           # Definiciones TypeScript
│       └── server.ts        # Punto de entrada
├── frontend/               # Aplicación frontend
│   └── src/
│       ├── services/        # API service
│       ├── store/           # Estado global
│       ├── theme/           # Colores, tipografía, espaciado
│       └── types/           # Definiciones TypeScript
└── .stitch/                # Diseños HTML/CSS
```

## Backend

- **Framework:** Express.js + TypeScript
- **Autenticación:** JWT
- **Controladores:** Auth, Booking, Experience
- **Puerto:** Configurable via `.env`

## Frontend

- **Framework:** React
- **Estado:** Zustand (store local)
- **API:** Servicio de comunicación con backend
- **Tema:** Sistema de diseño con colores, tipografía y espaciado

## Primeros Pasos

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Repositorio

https://github.com/desarrollolabtur1-beep/TURUT
