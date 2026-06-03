// Mapa de roles del sistema (deben coincidir con los del backend)
export const ROLES = {
  DEV:               'DEV',
  SOFTWARE:          'SOFTWARE',
  INGENIERO_MECANICO:'INGENIERO_MECANICO',
  INGENIERO_HSQ:     'INGENIERO_HSQ',
  CUADRILLA:         'CUADRILLA',
};

// Qué roles pueden acceder a cada ruta
export const ROUTE_ROLES = {
  FORMS:   [ROLES.DEV, ROLES.SOFTWARE, ROLES.INGENIERO_MECANICO, ROLES.INGENIERO_HSQ, ROLES.CUADRILLA],
  USERS:   [ROLES.DEV, ROLES.SOFTWARE],
  CREWS:   [ROLES.DEV, ROLES.SOFTWARE],
  ROLES:   [ROLES.DEV],
};

// Helper: ¿tiene el usuario alguno de los roles requeridos?
export const hasRole = (userRoles = [], requiredRoles = []) =>
  requiredRoles.length === 0 || userRoles.some(r => requiredRoles.includes(r));
