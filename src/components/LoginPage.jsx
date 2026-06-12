import { useState } from 'react';
import '../styles/Login.css';

// ===== ICONS (inline SVG para no depender de librerías) =====
const IconWrench = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
  </svg>
);

const IconUser = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
  </svg>
);

const IconLock = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

const IconEye = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const IconEyeOff = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

const IconArrowRight = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);

const IconCheckShield = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const IconMonitor = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
    <line x1="8" y1="21" x2="16" y2="21"/>
    <line x1="12" y1="17" x2="12" y2="21"/>
  </svg>
);

const IconHeadset = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 18v-6a9 9 0 0 1 18 0v6"/>
    <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z"/>
    <path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>
  </svg>
);

const IconAlertCircle = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

// ===== SPINNER =====
const Spinner = () => <div className="spinner" aria-label="Cargando..." />;

// ===== LOGIN PAGE =====
export default function LoginPage({ onLoginSuccess }) {
  const [formData, setFormData] = useState({ username: '', password: '', rememberMe: false });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    // Limpiar error del campo al escribir
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    if (globalError) setGlobalError('');
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = 'El ID Operador o Email es requerido';
    if (!formData.password) newErrors.password = 'La clave de seguridad es requerida';
    else if (formData.password.length < 6) newErrors.password = 'Mínimo 6 caracteres';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    setGlobalError('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setGlobalError(data.message || 'Credenciales inválidas. Intente nuevamente.');
        return;
      }

      // Guardar token y datos del usuario
      const storage = formData.rememberMe ? localStorage : sessionStorage;
      storage.setItem('authToken', data.token);
      storage.setItem('refreshToken', data.refreshToken || '');
      storage.setItem('user', JSON.stringify({
        id: data.id,
        username: data.username,
        email: data.email,
        fullName: data.fullName,
        roles: data.roles || [],
        permissions: data.permissions || [],
      }));

      if (onLoginSuccess) onLoginSuccess(data);

    } catch {
      setGlobalError('Error de conexión. Verifique su red e intente nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* ===== CARD ===== */}
      <div className="login-card" role="main">

        {/* LOGO */}
        <div className="login-logo">
          <IconWrench />
          <span className="login-logo-text">AutoCheckAML</span>
        </div>

        {/* HEADER */}
        <div className="login-header">
          <h1 className="login-title">Iniciar Sesión</h1>
          <p className="login-subtitle">
            Ingrese sus credenciales para gestionar las inspecciones activas.
          </p>
        </div>

        {/* GLOBAL ERROR */}
        {globalError && (
          <div className="alert alert-error" role="alert" style={{ marginBottom: '20px' }}>
            <IconAlertCircle />
            <span>{globalError}</span>
          </div>
        )}

        {/* FORM */}
        <form className="login-form" onSubmit={handleSubmit} noValidate>

          {/* Usuario */}
          <div className="form-group">
            <label className="form-label" htmlFor="username">ID Operador / Email <span aria-hidden="true">*</span></label>
            <div className="input-wrapper">
              <span className="input-icon"><IconUser /></span>
              <input
                id="username"
                name="username"
                type="text"
                className={`form-input${errors.username ? ' has-error' : ''}`}
                placeholder="ej. OP-8829"
                value={formData.username}
                onChange={handleChange}
                autoComplete="username"
                autoFocus
                disabled={isLoading}
              />
            </div>
            {errors.username && (
              <span className="form-error"><IconAlertCircle />{errors.username}</span>
            )}
          </div>

          {/* Contraseña */}
          <div className="form-group">
            <div className="login-field-row">
              <label className="form-label" htmlFor="password">Clave de Seguridad <span aria-hidden="true">*</span></label>
              <button
                type="button"
                className="login-forgot-link"
                onClick={() => alert('Funcionalidad de recuperación próximamente.')}
              >
                ¿Olvidó su clave?
              </button>
            </div>
            <div className="input-wrapper">
              <span className="input-icon"><IconLock /></span>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                className={`form-input${errors.password ? ' has-error' : ''}`}
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
                style={{ paddingRight: '46px' }}
                disabled={isLoading}
              />
              <button
                type="button"
                className="input-icon-right"
                onClick={() => setShowPassword(v => !v)}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? <IconEyeOff /> : <IconEye />}
              </button>
            </div>
            {errors.password && (
              <span className="form-error"><IconAlertCircle />{errors.password}</span>
            )}
          </div>

          {/* Recordar sesión */}
          <label className="checkbox-wrapper">
            <input
              type="checkbox"
              name="rememberMe"
              id="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              disabled={isLoading}
            />
            <span className="checkbox-label">Mantener sesión iniciada por 12 horas</span>
          </label>

          {/* Botón */}
          <button
            id="btn-login"
            type="submit"
            className="btn-primary"
            disabled={isLoading}
          >
            {isLoading
              ? <><Spinner /><span>Verificando...</span></>
              : <><span>Iniciar Sesión</span><IconArrowRight /></>
            }
          </button>
        </form>


      </div>

      {/* FLOATING SUPPORT BUTTON */}
      <button
        type="button"
        className="support-fab"
        id="btn-support"
        onClick={() => alert('Canal de soporte técnico: soporte@autocheckaml.com')}
        aria-label="Contactar Soporte"
      >
        <IconHeadset />
        <span>Contactar Soporte</span>
      </button>
    </div>
  );
}
