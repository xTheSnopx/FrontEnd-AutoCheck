// Abstracción de storage — soporta localStorage y sessionStorage
const AUTH_KEY     = 'authToken';
const REFRESH_KEY  = 'refreshToken';
const USER_KEY     = 'user';

const getStorage = () =>
  localStorage.getItem(AUTH_KEY) ? localStorage : sessionStorage;

export const storage = {
  // Token de acceso
  getToken:    () => localStorage.getItem(AUTH_KEY) || sessionStorage.getItem(AUTH_KEY),
  setToken:    (token, persist = false) =>
    (persist ? localStorage : sessionStorage).setItem(AUTH_KEY, token),

  // Refresh token
  getRefreshToken: () =>
    localStorage.getItem(REFRESH_KEY) || sessionStorage.getItem(REFRESH_KEY),
  setRefreshToken: (token, persist = false) =>
    (persist ? localStorage : sessionStorage).setItem(REFRESH_KEY, token),

  // Usuario
  getUser: () => {
    try {
      const raw = getStorage().getItem(USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  },
  setUser: (user, persist = false) =>
    (persist ? localStorage : sessionStorage).setItem(USER_KEY, JSON.stringify(user)),

  // Guardar sesión completa
  saveSession: (data, persist = false) => {
    const s = persist ? localStorage : sessionStorage;
    s.setItem(AUTH_KEY, data.token);
    s.setItem(REFRESH_KEY, data.refreshToken || '');
    s.setItem(USER_KEY, JSON.stringify({
      id:          data.id,
      username:    data.username,
      email:       data.email,
      fullName:    data.fullName,
      roles:       data.roles    || [],
      permissions: data.permissions || [],
    }));
  },

  // Limpiar sesión
  clearSession: () => {
    [localStorage, sessionStorage].forEach(s => {
      s.removeItem(AUTH_KEY);
      s.removeItem(REFRESH_KEY);
      s.removeItem(USER_KEY);
    });
  },
};
