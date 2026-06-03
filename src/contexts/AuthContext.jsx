import { createContext, useReducer, useEffect, useCallback } from 'react';
import { storage } from '../utils/storage';
import { authApi } from '../api/auth.api';

// ===== State shape =====
const initialState = {
  user:         null,   // { id, username, email, fullName, roles, permissions }
  token:        null,
  isLoading:    true,   // true mientras inicializa desde storage
  isAuthenticated: false,
};

// ===== Actions =====
const AUTH_ACTIONS = {
  INIT:          'INIT',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGOUT:        'LOGOUT',
  UPDATE_USER:   'UPDATE_USER',
};

// ===== Reducer =====
function authReducer(state, action) {
  switch (action.type) {
    case AUTH_ACTIONS.INIT:
      return {
        ...state,
        user:            action.payload.user,
        token:           action.payload.token,
        isAuthenticated: !!action.payload.token,
        isLoading:       false,
      };
    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        user:            action.payload.user,
        token:           action.payload.token,
        isAuthenticated: true,
        isLoading:       false,
      };
    case AUTH_ACTIONS.LOGOUT:
      return { ...initialState, isLoading: false };
    case AUTH_ACTIONS.UPDATE_USER:
      return { ...state, user: { ...state.user, ...action.payload } };
    default:
      return state;
  }
}

// ===== Context =====
export const AuthContext = createContext(null);

// ===== Provider =====
export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Inicializar desde storage al montar
  useEffect(() => {
    const token = storage.getToken();
    const user  = storage.getUser();
    dispatch({ type: AUTH_ACTIONS.INIT, payload: { token, user } });
  }, []);

  const login = useCallback(async (credentials, rememberMe = false) => {
    const data = await authApi.login(credentials);
    storage.saveSession(data, rememberMe);
    dispatch({
      type: AUTH_ACTIONS.LOGIN_SUCCESS,
      payload: {
        token: data.token,
        user: {
          id:          data.id,
          username:    data.username,
          email:       data.email,
          fullName:    data.fullName,
          roles:       data.roles    || [],
          permissions: data.permissions || [],
        },
      },
    });
    return data;
  }, []);

  const logout = useCallback(async () => {
    await authApi.logout();
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
  }, []);

  const updateUser = useCallback((updates) => {
    dispatch({ type: AUTH_ACTIONS.UPDATE_USER, payload: updates });
  }, []);

  const hasRole = useCallback((roles = []) =>
    state.user?.roles?.some(r => roles.includes(r)) ?? false,
  [state.user]);

  const hasPermission = useCallback((perm) =>
    state.user?.permissions?.includes(perm) ?? false,
  [state.user]);

  const value = {
    ...state,
    login,
    logout,
    updateUser,
    hasRole,
    hasPermission,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
