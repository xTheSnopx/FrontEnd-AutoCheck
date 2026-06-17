// Mapa de roles del sistema (deben coincidir con los del backend)
export const ROLES = {
  DEV:               'DEV',
  SOFTWARE:          'SOFTWARE',
  INGENIERO_MECANICO:'INGENIERO_MECANICO',
  SUPERVISOR_HSEQ:   'SUPERVISOR_HSEQ',
  JEFE_MTTO:         'JEFE_MTTO',
  CUADRILLA:         'CUADRILLA',
};

// Qué roles pueden acceder a cada ruta
export const ROUTE_ROLES = {
  FORMS:   [ROLES.DEV, ROLES.SOFTWARE, ROLES.INGENIERO_MECANICO, ROLES.SUPERVISOR_HSEQ, ROLES.JEFE_MTTO, ROLES.CUADRILLA],
  USERS:   [ROLES.DEV, ROLES.SOFTWARE],
  CREWS:   [ROLES.DEV, ROLES.SOFTWARE],
  ROLES:   [ROLES.DEV],
};

// Helper: ¿tiene el usuario alguno de los roles requeridos?
export const hasRole = (userRoles = [], requiredRoles = []) =>
  requiredRoles.length === 0 || userRoles.some(r => requiredRoles.includes(r));

// Mapa de traducciones y descripciones de permisos en español
export const PERMISSION_MAP = {
  'CREATE_USER': { name: 'Crear Usuarios', desc: 'Permite registrar nuevos usuarios en el sistema.' },
  'EDIT_USER': { name: 'Editar Usuarios', desc: 'Permite modificar los datos de usuarios existentes.' },
  'DELETE_USER': { name: 'Eliminar Usuarios', desc: 'Permite desactivar o eliminar cuentas de usuario.' },
  'VIEW_USER': { name: 'Ver Usuarios', desc: 'Permite visualizar el listado y detalles de los usuarios.' },
  'CREATE_CREW': { name: 'Crear Cuadrillas', desc: 'Permite crear nuevos grupos de trabajo o cuadrillas.' },
  'EDIT_CREW': { name: 'Editar Cuadrillas', desc: 'Permite modificar información y miembros de las cuadrillas.' },
  'DELETE_CREW': { name: 'Eliminar Cuadrillas', desc: 'Permite disolver y eliminar grupos de trabajo.' },
  'VIEW_CREW': { name: 'Ver Cuadrillas', desc: 'Permite visualizar las cuadrillas y sus integrantes.' },
  'CREATE_FORM': { name: 'Crear Formularios', desc: 'Permite diseñar nuevos formatos e inspecciones.' },
  'EDIT_FORM': { name: 'Editar Formularios', desc: 'Permite modificar la estructura de formatos existentes.' },
  'SUBMIT_FORM': { name: 'Diligenciar Inspecciones', desc: 'Permite rellenar y enviar reportes preoperacionales.' },
  'VERIFY_FORM': { name: 'Revisar / Rectificar', desc: 'Permite verificar, firmar y cambiar estado de las inspecciones.' },
  'VIEW_FORM': { name: 'Ver Formularios', desc: 'Permite visualizar plantillas de formularios.' },
  'EXPORT_EXCEL': { name: 'Exportar a Excel', desc: 'Permite descargar reportes históricos en formato .xlsx.' },
  'EXPORT_PDF': { name: 'Exportar a PDF', desc: 'Permite generar y descargar reportes individuales en PDF.' },
  'VIEW_REPORTS': { name: 'Visualizar Reportes', desc: 'Permite ver estadísticas y dashboards de rendimiento.' },
  'VIEW_AUDIT_LOG': { name: 'Ver Auditoría', desc: 'Permite auditar la bitácora de eventos y logs del sistema.' },
  'MANAGE_ROLES': { name: 'Administrar Seguridad', desc: 'Permite configurar la matriz de roles y permisos generales.' },
  'VIEW_EXPORT_HISTORY': { name: 'Historial de Exportación', desc: 'Permite ver qué datos han sido descargados del sistema.' },
};

// Mapa de traducción de categorías
export const CATEGORY_MAP = {
  'User Management': 'Gestión de Usuarios',
  'Crew Management': 'Gestión de Cuadrillas',
  'Form Management': 'Gestión de Inspecciones',
  'Reports & Export': 'Reportes y Descargas',
  'Audit & Security': 'Auditoría y Seguridad',
};

