### 1. Inventario
145 `.md` en el repo (sin `docs/`). ~108 están en `.agent/skills_disabled/` (pack genérico de marketing/SEO/CRO; **no cargan**).

| Archivo | Tipo | Líneas | Estado |
|---|---|---|---|
| `README.md` | README | ~61 | ⚠️ dudoso |
| `frontend/README.md` | otro (upstream TS) | ~51 | ❌ obsoleto |
| `frontend/SECURITY.md` | otro (MSRC Microsoft) | ~40 | ❌ obsoleto |
| `.agents/product-marketing-context.md` | arquitectura/producto | ~163 | ✅ vigente (marca) |
| `.agent/workflows/github-commit.md` | guía | ~35 | ⚠️ dudoso |
| `.agent/skills/*/SKILL.md` (13) | skills | 38–368 | ✅ vigentes (agente) |
| 18 `.md` auxiliares en skills activas (README, workflows, examples) | skills | varía | ✅ / plantillas |
| `.agent/skills_disabled/**` (~37 `SKILL.md` + refs) | skills (apagadas) | cientos c/u | ⚠️ no usadas |

Irrelevantes salvo inventario: `frontend/README.md`, `frontend/SECURITY.md`, casi todo `skills_disabled/`.

---

### 2. Resumen por archivo
- **README.md** — Landing turística + reservas (Express/JWT + React/Zustand).
  - • Árbol `Landing-APP/`; controladores auth/booking/experience.
  - • Setup: `npm install` + `npm run dev` en backend/frontend. Sin env, tests ni deploy.
- **.agents/product-marketing-context.md** — Posicionamiento **Wohin** (Ibagué, swipe, cronómetro de descuento).
  - • 4 módulos: Destacados, Descubre, oferta+timer, Eventos.
  - • Voz, CRO, popups; NotebookLM (skill notebooklm está **disabled**).
- **.agent/workflows/github-commit.md** — Flujo `status` → `git add .` → commit → push `main`.
  - • Agresivo (`add .`); asume git/remoto (workspace reportado sin git).
- **frontend/README.md / SECURITY.md** — Docs de TypeScript/Microsoft, no de TURUT.

Skills activas (propósito = YAML `description`; detalles en §3). Auxiliares Stitch = plantillas `DESIGN.md`/`SITE.md`/keywords, no el producto.

---

### 3. Skills detectadas
Formato: carpeta `.agent/skills/<nombre>/SKILL.md` (YAML + instrucciones). Apagadas: `.agent/skills_disabled/`.

| Skill | Ubicación | Qué hace | Entradas | Salidas | Doc. |
|---|---|---|---|---|---|
| creado-habilidades | skills/ | Crea skills nuevas | pedido de skill | `SKILL.md` (+scripts) | ✅; path **Landing-APP** viejo |
| product-marketing-context | skills/ | Mantiene contexto de marca | repo/entrevista | `.agents/product-marketing-context.md` | ✅ + doc generado |
| stitch-design | skills/ | Hub Stitch MCP (prompt, DESIGN, pantallas) | intent + MCP | `.stitch/designs`, DESIGN.md | ✅ + workflows |
| design-md | skills/ | Sintetiza sistema visual Stitch | proyecto Stitch | `DESIGN.md` | ✅ |
| enhance-prompt | skills/ | Prompt Stitch pulido | idea vaga | prompt estructurado | ✅ + KEYWORDS |
| stitch-loop | skills/ | Loop autónomo de páginas | baton, DESIGN, SITE | página + next-prompt | ✅; **falta `.stitch/` real** |
| stitch-ui-design | skills/ | Guía de prompts Stitch | pedido UI | prompts | ✅ (solapa con enhance/stitch-design) |
| frontend-design | skills/ | UI “premium”, anti-slop | pedido UI | código/estilo | ✅ |
| ui-ux-pro-max | skills/ | Paletas/estilos/stacks (DB+Python) | pedido UI | recs de diseño | ✅ |
| visual-hierarchy | skills/ | Jerarquía visual | UI | reglas | ✅ corto |
| responsive-design | skills/ | Mobile-first / breakpoints | layout | CSS/layout | ✅ |
| ux-writing | skills/ | Microcopy/CTA | contexto/tono | copy | ✅; cita `CONNECTORS.md` **inexistente** |
| suggest-lucide-icons | skills/ | Iconos Lucide | concepto/screenshot | nombres kebab | ✅ |

**Solo mencionadas / disabled (no operativas):** notebooklm, copywriting, page-cro, popup-cro, ab-test-setup, react-components, shadcn-ui, seo-*, paid-ads, etc. El contexto de producto las asume (CRO, NotebookLM).

Deps típicas Stitch: MCP Stitch (+ Chrome opcional). `ui-ux-pro-max`: Python.

---

### 4. Lo que TENGO
- Intención de producto: landing/reservas (README) vs app Wohin swipe/descuentos (contexto).
- Stack declarado: Express+TS+JWT, React+Zustand, tema.
- Setup mínimo frontend/backend.
- 13 skills de diseño/Stitch/marca activas; pack marketing aparcado.
- `.env.example` en backend (no documentado en README).

---

### 5. Lo que NO TENGO / falta
- `docs/`, API, env vars, tests, CI/CD, deploy, modelo de datos, auth real.
- Diseño persistido: no hay `.stitch/*.md` en repo (skills lo exigen).
- Alineación de nombres: TURUT / Wohin / Landing-APP / GitHub TURUT.
- Docs frontend copiados de Microsoft; `creado-habilidades` con ruta de otra máquina.
- Skills marketing que el brief CRO necesita están disabled.
- Git local vs workflow de commit/push.

---

### 6. Próximos 3 pasos sugeridos
1. Recorrer `backend/` y `frontend/` vs README y el brief Wohin; anotar qué está implementado.
2. Reescribir `README.md` (nombre, env, scripts, cómo correr); borrar o ignorar `frontend/README.md` y `SECURITY.md` ajenos.
3. Decidir skills: dejar el set Stitch+marca, o reactivar las de CRO/NotebookLM que el contexto ya usa; crear `.stitch/DESIGN.md` si vas a generar UI.
