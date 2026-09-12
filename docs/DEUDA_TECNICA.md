# Deuda Técnica — TURUT

Última auditoría: 2026-09-12
Origen: PROJECT_MAP.json
Filosofía: nada de esto se arregla "de paso". Cada DT se ataca en su propio sprint con tests.

## Índice
- [DT-001](#dt-001-detalle-de-experiencia-autenticado-y-pantalla-fuera-del-navigator)
- [DT-002](#dt-002-tipos-de-navegación-desfasados-respecto-al-runtime)
- [DT-003](#dt-003-jwt_expires_in-cargado-e-ignorado-al-firmar)

---

### DT-001: Detalle de experiencia autenticado y pantalla fuera del navigator
- **Severidad**: Alta — un usuario autenticado no puede abrir el detalle vía API pública de listado, y la pantalla de detalle/reserva no es alcanzable en la app.
- **Archivos implicados**:
  - `backend/src/routes/experience.routes.ts:20` (`router.use(protect)`)
  - `backend/src/routes/experience.routes.ts:30` (`GET /:id` **después** de `protect`)
  - `backend/src/controllers/experience.controller.ts` (`getExperienceById`)
  - `frontend/src/services/api.service.ts:104` (`experienceService.getById`)
  - `frontend/src/services/api.service.ts:31-49` (interceptor JWT)
  - `frontend/src/screens/experience/ExperienceDetailScreen.tsx:22` (import del service)
  - `frontend/src/screens/experience/ExperienceDetailScreen.tsx:108` (`getById(experienceId)`)
  - `frontend/src/navigation/AppNavigator.tsx:26-37` (`RootStackParamList` sin `ExperienceDetail`)
  - `frontend/src/navigation/AppNavigator.tsx:87-132` (screens montadas; no incluye detalle)
- **Síntoma observable**: Home/Discover muestran destinos locales, no navegan a `ExperienceDetailScreen`. Si se invocara `GET /api/experiences/:id` sin Bearer, el backend responde 401. `getById` **sí existe** en `api.service.ts` (el hallazgo de PROJECT_MAP sobre “método inexistente” quedó desactualizado).
- **Impacto si no se arregla**: no hay flujo de ficha+reserva conectado al API; listado público (`GET /` y `/featured`) no sirve para abrir detalle; reservas en esa pantalla (`bookingService.create`) nunca se ejercitan en runtime.
- **Causa raíz probable**: `protect` se aplicó al router entero para CRUD y `GET /:id` quedó debajo del corte en lugar de junto a las rutas públicas.
- **Criterio de aceptación para cerrarla**:
  - Decisión explícita: o `GET /api/experiences/:id` es público (moverlo **antes** de `router.use(protect)`), o el cliente solo lo llama con sesión y la UI no ofrece detalle anónimo.
  - `ExperienceDetail` (o equivalente) aparece como `<Stack.Screen>` en `AppNavigator.tsx` y en `RootStackParamList`.
  - Test o curl: `GET /api/experiences/:id` se comporta según la decisión (200 sin token si público; 401 sin token si privado).
  - Navegación E2E: desde Imperdibles o Tu Ruta se abre la ficha y `getById` recibe un id real.

---

### DT-002: Tipos de navegación desfasados respecto al runtime
- **Severidad**: Media — TypeScript no impide (o no refleja) las pantallas reales; se puede navegar a nombres muertos o dejar screens huérfanas sin error de tipos.
- **Archivos implicados**:
  - `PROJECT_MAP.json` (snapshot: `types/navigation.ts` declaraba Home / Register / Profile / Bookings)
  - `frontend/src/types/navigation.ts:6-24` (hoy reexporta helpers solo para Splash / Login / MainTabs / Landing)
  - `frontend/src/navigation/AppNavigator.tsx:26-37` (`RootStackParamList`: MainTabs, Splash, Login, Onboarding, TermsConditions, ForgotPassword, Landing, AdminDashboard, Experiments)
  - `frontend/src/navigation/AppNavigator.tsx:78-131` (montaje real de screens)
  - `frontend/src/navigation/MainTabs.tsx` (tabs; Profile sí está montado aquí)
  - `frontend/src/screens/experience/ExperienceDetailScreen.tsx:85` (pantalla viva, **no** registrada en el stack)
  - `frontend/src/screens/auth/LoginScreen.tsx` / `RegisterScreen.tsx` (legado; Login real es `LoginStepper`)
- **Síntoma observable**: el compilador trata `RootStackParamList` de `AppNavigator` como fuente, pero hay screens (detalle, login/register viejos) que no están en esa lista, y hay claves en la lista (`Onboarding`, `ForgotPassword`, `AdminDashboard`, …) sin helpers en `types/navigation.ts`. PROJECT_MAP documentó el desfase Home/Register/Profile/Bookings vs Splash/Login/MainTabs/Landing; parte de eso se movió, no se cerró del todo.
- **Impacto si no se arregla**: refactors de navegación silenciosos; `navigate('X')` a rutas muertas o pantallas inalcanzables; onboarding/admin/forgot sin tipos de props consistentes.
- **Causa raíz probable**: el stack creció (auth, admin, onboarding) y `types/navigation.ts` / screens legacy no se actualizaron en el mismo cambio.
- **Criterio de aceptación para cerrarla**:
  - Una sola `RootStackParamList` (la de `AppNavigator.tsx`); `types/navigation.ts` solo reexporta helpers para **todas** las keys de esa lista.
  - Cada `Stack.Screen` / `Tab.Screen` tiene entrada en los tipos; no queda screen de producto (`ExperienceDetail`, login de producción) fuera del navigator.
  - `npx tsc --noEmit` en `frontend/` falla si se navega a un nombre que no existe.
  - Grep: cero `navigate('Home'|'Register'|'Bookings'|'ExperienceDetail')` hacia rutas no registradas.

---

### DT-003: `JWT_EXPIRES_IN` cargado e ignorado al firmar
- **Severidad**: Media — caducidad de sesión no es configurable; un `.env` con otro valor da falsa seguridad. (`authorize` ya **no** es zombi: está en `admin.routes.ts:9`.)
- **Archivos implicados**:
  - `backend/src/config/env.ts:29` (`JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? '7d'`)
  - `backend/src/controllers/auth.controller.ts:122-126` (`generateToken`: `expiresInSeconds = 7 * 24 * 60 * 60`, no usa `env.JWT_EXPIRES_IN`)
  - `backend/.env.example` (no declara `JWT_EXPIRES_IN`)
  - `backend/src/middleware/auth.middleware.ts:77` (`authorize` — residual de la auditoría; uso actual: `backend/src/routes/admin.routes.ts:8-9`)
- **Síntoma observable**: cambiar `JWT_EXPIRES_IN` en el entorno no altera el JWT; el token sigue durando 7 días fijos. `authorize` sí restringe `/api/admin/*` a rol `admin`.
- **Impacto si no se arregla**: no se puede acortar sesiones en producción sin tocar código; auditorías de secretos/env quedan inconsistentes; alguien “arregla” el `.env` y cree que ya rotó la política de expiry.
- **Causa raíz probable**: `expiresIn` se pasó a segundos numéricos por tipos de `jsonwebtoken` y se dejó de leer la env.
- **Criterio de aceptación para cerrarla**:
  - `generateToken` usa `env.JWT_EXPIRES_IN` (string ms/`7d` o segundos derivados de esa var; un solo sitio).
  - `JWT_EXPIRES_IN` aparece en `backend/.env.example` con comentario.
  - Test: con `JWT_EXPIRES_IN=1h` (o mock de `jwt.sign`) el payload/`expiresIn` coincide; el default sigue siendo 7d si la var falta.
  - `rg JWT_EXPIRES_IN backend/` muestra lectura en `env.ts` **y** uso en firma; cero `7 * 24 * 60 * 60` suelto en `auth.controller.ts`.

---

## Historial
| Fecha | Cambio | Por |
|---|---|---|
| 2026-09-12 | Creación inicial tras auditoría (PROJECT_MAP). Líneas re-verificadas en código; se corrige que `getById` sí existe y que `authorize` ya monta admin. | agente |
