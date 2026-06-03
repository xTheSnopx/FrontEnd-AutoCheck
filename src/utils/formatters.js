// Formatters — utilidades de presentación de datos

/** Fecha: "24 Oct, 08:45 AM" */
export const formatDateTime = (date) => {
  if (!date) return '—';
  return new Date(date).toLocaleString('es-MX', {
    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
  });
};

/** Fecha corta: "24/10/2026" */
export const formatDate = (date) => {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('es-MX', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  });
};

/** Capitaliza la primera letra */
export const capitalize = (str) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : '';

/** Nombre corto: "Juan García" → "J. García" */
export const shortName = (fullName = '') => {
  const parts = fullName.trim().split(' ');
  if (parts.length < 2) return fullName;
  return `${parts[0][0]}. ${parts.slice(-1)[0]}`;
};

/** Iniciales del nombre: "Juan García" → "JG" */
export const initials = (fullName = '') =>
  fullName.trim().split(' ').slice(0, 2).map(w => w[0]?.toUpperCase()).join('');

/** Status → color class */
export const statusColor = (status) => ({
  'Pendiente':    'badge-warning',
  'En Proceso':   'badge-info',
  'Verificado':   'badge-primary',
  'Completado':   'badge-success',
  'Rechazado':    'badge-error',
  'OPERATIVO':    'badge-success',
  'EN REVISION':  'badge-warning',
  'INACTIVO':     'badge-muted',
}[status] || 'badge-muted');
