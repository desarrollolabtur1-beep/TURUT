/**
 * TURUT Experiments — Configuración del sandbox
 *
 * ┌─────────────────────────────────────────────────────────┐
 * │  ÚNICO PUNTO DE CONTROL para activar el sandbox         │
 * │  Cambiar EXPERIMENTS_ENABLED a `false` antes de         │
 * │  desplegar a producción.                                │
 * └─────────────────────────────────────────────────────────┘
 */

/** Activa o desactiva el acceso al sandbox desde el navigator */
export const EXPERIMENTS_ENABLED = false;

/** Pantalla inicial del sandbox (debe coincidir con un nombre en ExperimentsNavigator) */
export const EXPERIMENTS_INITIAL_SCREEN = 'ExperimentsMenu' as const;
