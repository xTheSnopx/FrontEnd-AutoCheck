import { useState, useRef, useEffect } from 'react';
import { formsApi } from '../api/forms.api';
import { vehicleTypesApi } from '../api/vehicleTypes.api';
import { useToast } from '../contexts/ToastContext';
import logger from '../utils/logger';
import '../styles/FormComponent.css';

const FormComponent = ({ onSubmit }) => {
  const { showToast } = useToast();
  const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
  let userRoles = [];
  let userFullName = '';
  if (userStr) {
    try {
      const parsed = JSON.parse(userStr);
      userRoles = parsed.roles || [];
      userFullName = parsed.fullName || parsed.username || '';
    } catch (e) {
      logger.error('Error parsing user data:', e);
    }
  }

  const isHsq = userRoles.includes('SUPERVISOR_HSEQ');
  const isCuadrilla = userRoles.includes('CUADRILLA');
  const isReadOnly = false;

  const getInitials = (name) => {
    if (!name) return 'U';
    const clean = name.replace(/[^a-zA-Z0-9 ]/g, '').trim();
    const parts = clean.split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return clean.slice(0, 2).toUpperCase();
  };

  const FALLBACK_FIELDS = [
    { id: 1, label: "Placa del Vehículo", fieldType: "Text", displayOrder: 0, defaultValue: "", options: "", category: "doc" },
    { id: 2, label: "Tipo de Vehículo", fieldType: "Select", displayOrder: 1, defaultValue: "Camioneta", options: '["Camioneta","Camión","Volqueta","Automóvil","Moto","Maquinaria Pesada"]', category: "doc" },
    { id: 3, label: "Permiso de Circulación al Día", fieldType: "Select", displayOrder: 2, defaultValue: "SI", options: '["SI","NO"]', category: "doc" },
    { id: 4, label: "Revisión Tecnomecánica al Día", fieldType: "Select", displayOrder: 3, defaultValue: "SI", options: '["SI","NO"]', category: "doc" },
    { id: 5, label: "SOAT Vigente", fieldType: "Select", displayOrder: 4, defaultValue: "SI", options: '["SI","NO"]', category: "doc" },
    { id: 6, label: "Licencia Municipal", fieldType: "Select", displayOrder: 5, defaultValue: "SI", options: '["SI","NO"]', category: "op" },
    { id: 7, label: "Curso de Operador", fieldType: "Select", displayOrder: 6, defaultValue: "SI", options: '["SI","NO"]', category: "op" },
    { id: 8, label: "Licencia Interna", fieldType: "Select", displayOrder: 7, defaultValue: "SI", options: '["SI","NO"]', category: "op" },
    { id: 9, label: "Altas / Bajas", fieldType: "Select", displayOrder: 8, defaultValue: "OK", options: '["OK","FALLO"]', category: "veh" },
    { id: 10, label: "Retroceso / Emergencia", fieldType: "Select", displayOrder: 9, defaultValue: "OK", options: '["OK","FALLO"]', category: "veh" },
    { id: 11, label: "Laterales (Delante/Trasera)", fieldType: "Select", displayOrder: 10, defaultValue: "OK", options: '["OK","FALLO"]', category: "veh" },
    { id: 12, label: "Freno / Estacionamiento", fieldType: "Select", displayOrder: 11, defaultValue: "OK", options: '["OK","FALLO"]', category: "veh" },
    { id: 13, label: "Cabina Interior", fieldType: "Select", displayOrder: 12, defaultValue: "OK", options: '["OK","FALLO"]', category: "veh" },
    { id: 14, label: "DEL. IZQUIERDO", fieldType: "Select", displayOrder: 13, defaultValue: "OK", options: '["OK","FALLO"]', category: "veh" },
    { id: 15, label: "DEL. DERECHO", fieldType: "Select", displayOrder: 14, defaultValue: "OK", options: '["OK","FALLO"]', category: "veh" },
    { id: 16, label: "TRAS. INTERNOS", fieldType: "Select", displayOrder: 15, defaultValue: "OK", options: '["OK","FALLO"]', category: "veh" },
    { id: 17, label: "TRAS. EXTERNOS", fieldType: "Select", displayOrder: 16, defaultValue: "OK", options: '["OK","FALLO"]', category: "veh" },
    { id: 18, label: "REPUESTOS", fieldType: "Select", displayOrder: 17, defaultValue: "OK", options: '["OK","FALLO"]', category: "veh" },
    { id: 19, label: "Extintor/Botiquín", fieldType: "Select", displayOrder: 18, defaultValue: "SI", options: '["SI","NO"]', category: "veh" },
    { id: 20, label: "Conos/Bocina", fieldType: "Select", displayOrder: 19, defaultValue: "SI", options: '["SI","NO"]', category: "veh" },
    { id: 21, label: "Sirena/Licuadora", fieldType: "Select", displayOrder: 20, defaultValue: "SI", options: '["SI","NO"]', category: "veh" },
    { id: 22, label: "Evaluador Cop.", fieldType: "Select", displayOrder: 21, defaultValue: "SI", options: '["SI","NO"]', category: "veh" },
    { id: 23, label: "Cortacorrientes / Sist. Comunicación", fieldType: "Select", displayOrder: 22, defaultValue: "OK", options: '["OK","FALLO"]', category: "veh" },
    { id: 24, label: "PARABRISAS", fieldType: "Select", displayOrder: 23, defaultValue: "OK", options: '["OK","FALLO"]', category: "veh" },
    { id: 25, label: "ESQUIERDO/DER.", fieldType: "Select", displayOrder: 24, defaultValue: "OK", options: '["OK","FALLO"]', category: "veh" },
    { id: 26, label: "LATERALES", fieldType: "Select", displayOrder: 25, defaultValue: "OK", options: '["OK","FALLO"]', category: "veh" },
    { id: 27, label: "CABINA", fieldType: "Select", displayOrder: 26, defaultValue: "OK", options: '["OK","FALLO"]', category: "veh" },
    { id: 28, label: "Delant. Izq/Der", fieldType: "Select", displayOrder: 27, defaultValue: "OK", options: '["OK","FALLO"]', category: "veh" },
    { id: 29, label: "Tras. Izq/Der", fieldType: "Select", displayOrder: 28, defaultValue: "OK", options: '["OK","FALLO"]', category: "veh" }
  ];

  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [templateId, setTemplateId] = useState(1);
  const [observations, setObservations] = useState('');
  const [photos, setPhotos] = useState([]); // Array de { id, base64, preview }
  const [activeSection, setActiveSection] = useState('doc');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      let activeTemplate;
      try {
        activeTemplate = await formsApi.getActiveTemplate();
        setTemplateId(activeTemplate.id);
        if (activeTemplate.formFields && activeTemplate.formFields.length > 0) {
          const list = activeTemplate.formFields.filter(f => f.isActive);
          setFields(list);
          initAnswers(list);
          return;
        }
      } catch (e) {
        logger.warn('No active template, falling back to fields endpoint');
      }

      const fetched = await formsApi.getTemplateFields(templateId);
      const activeFields = fetched.filter(f => f.isActive);
      const list = activeFields.length > 0 ? activeFields : FALLBACK_FIELDS;
      setFields(list);
      initAnswers(list);
    } catch (err) {
      logger.error('Error loading dynamic fields:', err);
      setFields(FALLBACK_FIELDS);
      initAnswers(FALLBACK_FIELDS);
    } finally {
      setLoading(false);
    }
  };

  const initAnswers = (list) => {
    const initial = {};
    list.forEach(f => {
      let parsedOpts = [];
      try { if (f.options) parsedOpts = JSON.parse(f.options); } catch (e) {}
      if (f.label.toLowerCase().includes('placa')) {
        initial[f.id ?? f.label] = '';
      } else if (f.label.toLowerCase().includes('tipo de vehículo')) {
        initial[f.id ?? f.label] = f.defaultValue || (parsedOpts[0] ?? '');
      } else {
        initial[f.id ?? f.label] = f.defaultValue || (parsedOpts[0] ?? '');
      }
    });
    setAnswers(initial);
  };

  useEffect(() => {
    vehicleTypesApi.getAll().then(data => {
      if (data && data.length > 0) setVehicleTypes(data);
    }).catch(() => {});
  }, []);

  const sectionRefs = { doc: useRef(null), op: useRef(null), veh: useRef(null), ev: useRef(null) };
  const canvasRef = useRef(null);
  const isDrawing = useRef(false);
  const [hasSignature, setHasSignature] = useState(false);

  useEffect(() => {
    if (loading) return; // Esperar a que el formulario cargue primero
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = '#0B2C5C';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const getCoordinates = (e) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return { x: clientX - rect.left, y: clientY - rect.top };
    };
    const start = (e) => { e.preventDefault(); isDrawing.current = true; setHasSignature(true); const c = getCoordinates(e); ctx.beginPath(); ctx.moveTo(c.x, c.y); };
    const draw = (e) => { if (!isDrawing.current) return; e.preventDefault(); const c = getCoordinates(e); ctx.lineTo(c.x, c.y); ctx.stroke(); };
    const stop = () => { isDrawing.current = false; };

    canvas.addEventListener('mousedown', start);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stop);
    canvas.addEventListener('mouseleave', stop);
    canvas.addEventListener('touchstart', start, { passive: false });
    canvas.addEventListener('touchmove', draw, { passive: false });
    canvas.addEventListener('touchend', stop);
    return () => {
      canvas.removeEventListener('mousedown', start);
      canvas.removeEventListener('mousemove', draw);
      canvas.removeEventListener('mouseup', stop);
      canvas.removeEventListener('mouseleave', stop);
      canvas.removeEventListener('touchstart', start);
      canvas.removeEventListener('touchmove', draw);
      canvas.removeEventListener('touchend', stop);
    };
  }, [loading]);


  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (canvas) canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  const scrollToSection = (key) => {
    setActiveSection(key);
    const ref = sectionRefs[key].current;
    if (ref) ref.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleToggle = (fieldId, value) => {
    if (isReadOnly) return;
    setAnswers(prev => ({ ...prev, [fieldId]: value }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotos(prev => [...prev, { id: Date.now() + Math.random(), base64: reader.result, preview: reader.result }]);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const removePhoto = (id) => {
    setPhotos(prev => prev.filter(p => p.id !== id));
  };

  const getPlacaFieldId = () => {
    const f = fields.find(fld => fld.label.toLowerCase().includes('placa'));
    return f ? (f.id ?? f.label) : 1;
  };

  const getTipoFieldId = () => {
    const f = fields.find(fld => fld.label.toLowerCase().includes('tipo de vehículo'));
    return f ? (f.id ?? f.label) : 2;
  };

  const isPlacaField = (f) => f.label && f.label.toLowerCase().includes('placa');
  const isTipoField = (f) => f.label && f.label.toLowerCase().includes('tipo de vehículo');

  const otherFields = fields.filter(f => !isPlacaField(f) && !isTipoField(f));
  const docFields = otherFields.filter(f => (f.category || 'doc') === 'doc');
  const opFields = otherFields.filter(f => (f.category) === 'op');
  const vehFields = otherFields.filter(f => (f.category || 'veh') === 'veh');
  const evFields = otherFields.filter(f => f.category === 'ev');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const placaKey = getPlacaFieldId();
    const placa = answers[placaKey];
    if (!placa || !placa.trim()) {
      showToast('Por favor, ingrese la placa del vehículo antes de enviar.', 'warning');
      return;
    }
    if (placa.replace(/\s/g, '').length !== 6) {
      showToast('La placa debe tener exactamente 6 caracteres alfanuméricos (ej. MHX882).', 'warning');
      return;
    }

    if (!hasSignature) {
      showToast('Por favor, realice la firma digital del operador.', 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      const answersPayload = Object.keys(answers).map(key => {
        const num = parseInt(key, 10);
        return {
          formFieldId: Number.isNaN(num) ? 0 : num,
          fieldValue: answers[key],
          notes: ''
        };
      }).filter(a => a.formFieldId > 0);

      const allPhotos = photos.map(p => p.base64);
      try {
        const canvas = canvasRef.current;
        if (canvas) {
          const signatureData = canvas.toDataURL('image/png');
          if (signatureData) allPhotos.push(signatureData);
        }
      } catch (err) { logger.warn('Error capturing signature', err); }

      const payload = {
        formTemplateId: templateId,
        assignedToCrewId: null,
        activityLocation: 'Inspección Móvil',
        activityDate: new Date().toISOString(),
        observationsByRespondent: observations,
        photos: allPhotos,
        answers: answersPayload,
      };

      await formsApi.create(payload);
      showToast('Inspección guardada exitosamente.', 'success');
      if (onSubmit) onSubmit(payload);
    } catch (error) {
      logger.error('Error submitting form:', error);
      showToast('Error al enviar. Guardando en modo local.', 'warning');
      if (onSubmit) onSubmit({ observationsByRespondent: observations, answers, localOnly: true });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (f) => {
    const key = f.id ?? f.label;
    let parsedOpts = [];
    try { if (f.options) parsedOpts = JSON.parse(f.options); } catch (e) {}
    const isTwo = parsedOpts.length === 2;
    const isYesNo = isTwo && parsedOpts.includes('SI') && parsedOpts.includes('NO');
    const isOkFallo = isTwo && parsedOpts.includes('OK') && parsedOpts.includes('FALLO');

    if (isYesNo) {
      return (
        <div className="form-item" key={key}>
          <span className="item-label">{f.label}</span>
          <div className="toggle-group two-states">
            <button type="button" className={`toggle-btn btn-yes ${answers[key] === 'SI' ? 'selected' : ''}`} onClick={() => handleToggle(key, 'SI')}>SÍ</button>
            <button type="button" className={`toggle-btn btn-no ${answers[key] === 'NO' ? 'selected' : ''}`} onClick={() => handleToggle(key, 'NO')}>NO</button>
          </div>
        </div>
      );
    }
    if (isOkFallo) {
      return (
        <div className="form-item" key={key}>
          <span className="item-label">{f.label}</span>
          <div className="toggle-group ok-fallo">
            <button type="button" className={`toggle-btn btn-ok ${answers[key] === 'OK' ? 'selected' : ''}`} onClick={() => handleToggle(key, 'OK')}>OK</button>
            <button type="button" className={`toggle-btn btn-fail ${answers[key] === 'FALLO' ? 'selected' : ''}`} onClick={() => handleToggle(key, 'FALLO')}>FALLO</button>
          </div>
        </div>
      );
    }
    if (f.fieldType === 'Select') {
      return (
        <div className="form-item" key={key}>
          <span className="item-label">{f.label}</span>
          <select className="form-input" style={{ width: '100%', padding: '13px 14px', border: '1.5px solid var(--color-border)', borderRadius: 'var(--radius-md)', fontSize: 'var(--font-size-md)', marginTop: '6px', backgroundColor: '#fff', height: '48px' }} value={answers[key] || ''} onChange={(e) => handleToggle(key, e.target.value)}>
            {parsedOpts.map((opt, idx) => <option key={idx} value={opt}>{opt}</option>)}
          </select>
        </div>
      );
    }
    return (
      <div className="form-item" key={key}>
        <span className="item-label">{f.label}</span>
        <input type="text" className="form-input" style={{ width: '100%', padding: '13px 14px', border: '1.5px solid var(--color-border)', borderRadius: 'var(--radius-md)', fontSize: 'var(--font-size-md)', marginTop: '6px' }} value={answers[key] || ''} onChange={(e) => handleToggle(key, e.target.value)} />
      </div>
    );
  };

  const placaKey = getPlacaFieldId();
  const tipoKey = getTipoFieldId();

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', color: 'var(--color-primary)' }}>
        <div style={{ width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid var(--color-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '16px' }}></div>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        <span>Cargando formulario de inspección...</span>
      </div>
    );
  }

  return (
    <div className="form-component-mobile">
      <header className="form-mobile-header" style={isHsq ? { background: '#d35400' } : isCuadrilla ? { background: '#2c3e50' } : {}}>
        <button type="button" className="menu-btn" onClick={() => setSidebarOpen(true)}>
          <svg className="menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          <span className="menu-text">menú</span>
        </button>
        <h1 className="header-brand">AutoCheckAML</h1>
        <div className="header-right" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div className="user-details-block" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', lineHeight: '1.2' }}>
            <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#fff' }}>{userFullName}</span>
            <span style={{ fontSize: '9px', color: 'rgba(255, 255, 255, 0.75)' }}>{userRoles.join(', ')}</span>
          </div>
          <div className="avatar-circle">{getInitials(userFullName)}</div>
        </div>
      </header>

      <aside className={`form-sidebar ${sidebarOpen ? 'open' : ''}`} style={{ position: 'fixed', top: 0, left: 0, width: '280px', height: '100vh', backgroundColor: '#0F172A', color: '#fff', zIndex: 1000, padding: '24px 20px', display: 'flex', flexDirection: 'column', boxShadow: '4px 0 20px rgba(0,0,0,0.3)', transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)', transition: 'transform 0.3s ease-in-out' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h2 style={{ fontSize: '18px', margin: 0, fontWeight: 'bold', color: '#fff' }}>Menú</h2>
          <button type="button" onClick={() => setSidebarOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '24px', color: '#fff', padding: '4px' }}>&times;</button>
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
          <button type="button" className="sidebar-back-btn" onClick={() => { setSidebarOpen(false); if (onSubmit) onSubmit({ action: 'go_panel' }); }} style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: '14px', padding: '12px', color: '#cbd5e1', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px', width: '100%', transition: 'background 0.2s' }}>
            {isCuadrilla ? '🏠 Volver al Inicio' : '📊 Volver al Panel'}
          </button>
        </nav>
        <div style={{ marginTop: 'auto', borderTop: '1px solid #334155', paddingTop: '15px' }}>
          <button type="button" onClick={() => { localStorage.clear(); sessionStorage.clear(); window.location.reload(); }} style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', cursor: 'pointer', textAlign: 'center', fontSize: '14px', padding: '12px', color: '#ef4444', borderRadius: '8px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%', transition: 'all 0.2s' }}>
            🚪 Cerrar Sesión
          </button>
        </div>
      </aside>
      {sidebarOpen && <div onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 999 }} />}

      {isCuadrilla && (
        <div style={{ background: '#0984e3', color: '#fff', padding: '12px 16px', textAlign: 'center', fontWeight: 'bold', fontSize: '14px', borderBottom: '3px solid #076bba', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
          <span>👮</span> Modo Diligenciamiento de Cuadrilla
        </div>
      )}
      {isHsq && (
        <div style={{ background: '#e67e22', color: '#fff', padding: '12px 16px', textAlign: 'center', fontWeight: 'bold', fontSize: '14px', borderBottom: '3px solid #d35400', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
          <span>🛡️</span> Vista de Cumplimiento de Seguridad (HSQ)
        </div>
      )}

      <div className="category-scroll-nav">
        <button type="button" className={`nav-tab ${activeSection === 'doc' ? 'active' : ''}`} onClick={() => scrollToSection('doc')}>1. DOCUMENTOS</button>
        <button type="button" className={`nav-tab ${activeSection === 'op' ? 'active' : ''}`} onClick={() => scrollToSection('op')}>2. OPERADOR</button>
        <button type="button" className={`nav-tab ${activeSection === 'veh' ? 'active' : ''}`} onClick={() => scrollToSection('veh')}>{isHsq ? '3. SEGURIDAD' : '3. VEHÍCULO'}</button>
        <button type="button" className={`nav-tab ${activeSection === 'ev' ? 'active' : ''}`} onClick={() => scrollToSection('ev')}>4. EVIDENCIA</button>
      </div>

      <form onSubmit={handleSubmit} className="inspection-form">
        <div className="section-card" ref={sectionRefs.doc}>
          <h2 className="section-title">1. DOCUMENTOS</h2>
          <div className="form-row-flex" style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
            <div className="form-item" style={{ flex: 1, marginBottom: 0 }}>
              <span className="item-label" style={{ fontWeight: 'bold', color: 'var(--color-primary)' }}>Placa del Vehículo *</span>
              <input type="text" placeholder="ej. MHX882" className="form-input" style={{ width: '100%', padding: '13px 14px', border: '1.5px solid var(--color-border)', borderRadius: 'var(--radius-md)', fontSize: 'var(--font-size-md)', marginTop: '6px', textTransform: 'uppercase' }} value={answers[placaKey] || ''} onChange={(e) => { if (isReadOnly) return; const filtered = e.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 6); setAnswers(prev => ({ ...prev, [placaKey]: filtered })); }} disabled={isReadOnly} maxLength={6} />
            </div>
            {fields.some(f => (f.label || '').toLowerCase().includes('tipo de vehículo')) && (
              <div className="form-item" style={{ flex: 1, marginBottom: 0 }}>
                <span className="item-label" style={{ fontWeight: 'bold', color: 'var(--color-primary)' }}>Tipo de Vehículo *</span>
                <select className="form-input" style={{ width: '100%', padding: '13px 14px', border: '1.5px solid var(--color-border)', borderRadius: 'var(--radius-md)', fontSize: 'var(--font-size-md)', marginTop: '6px', backgroundColor: '#fff', height: '48px' }} value={answers[tipoKey] || ''} onChange={(e) => { if (isReadOnly) return; setAnswers(prev => ({ ...prev, [tipoKey]: e.target.value })); }} disabled={isReadOnly}>
                  {vehicleTypes.length > 0 ? vehicleTypes.map((vt, idx) => <option key={idx} value={vt.name}>{vt.name}</option>) : (() => { const f = fields.find(fl => fl.label.toLowerCase().includes('tipo de vehículo')); let opts = ["Camioneta","Camión","Volqueta","Automóvil","Moto","Maquinaria Pesada"]; try { if (f && f.options) opts = JSON.parse(f.options); } catch(e){} return opts.map((o, idx) => <option key={idx} value={o}>{o}</option>); })()}
                </select>
              </div>
            )}
          </div>
          {docFields.map(f => renderField(f))}
        </div>

        <div className="section-card" ref={sectionRefs.op}>
          <h2 className="section-title">2. OPERADOR</h2>
          {opFields.map(f => renderField(f))}
        </div>

        <div className="section-card" ref={sectionRefs.veh} style={isHsq ? { borderLeft: '4px solid #e67e22' } : {}}>
          <h2 className="section-title">{isHsq ? '3. ACCESORIOS Y SEGURIDAD' : '3. SISTEMAS DEL VEHÍCULO'}</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {vehFields.map(f => renderField(f))}
          </div>
          <div className="form-item-observations">
            <span className="observations-label">Observaciones Técnicas</span>
            <textarea className="observations-textarea" placeholder="Detalle cualquier hallazgo o alerta..." value={observations} onChange={(e) => setObservations(e.target.value)} rows="4" />
          </div>
        </div>

        <div className="section-card" ref={sectionRefs.ev}>
          <h2 className="section-title">4. EVIDENCIA</h2>
          {evFields.map(f => renderField(f))}
          <div className="photos-section">
            <p className="photos-label">Fotos de Evidencia</p>
            <div className="photos-grid">
              {photos.map(p => (
                <div key={p.id} className="photo-thumb-wrapper">
                  <img src={p.preview} alt="evidencia" className="photo-thumb" />
                  <button type="button" className="photo-remove-btn" onClick={() => removePhoto(p.id)}>&times;</button>
                </div>
              ))}
              <label className="photo-add-box">
                <input type="file" accept="image/*" capture="environment" onChange={handlePhotoUpload} className="hidden-file-input" />
                <div className="photo-add-placeholder">
                  <span className="camera-icon">📷</span>
                  <span className="add-photo-text">AÑADIR FOTO</span>
                </div>
              </label>
            </div>
          </div>

          <div className="signature-container">
            <div className="signature-title">
              <span className="signature-icon">✍️</span>
              <span>FIRMA DIGITAL DEL OPERADOR *</span>
            </div>
            <div className={`canvas-wrapper ${hasSignature ? 'has-signature' : ''}`}>
              <canvas ref={canvasRef} width={360} height={160} className="signature-canvas" style={{ touchAction: 'none' }} />
              <div className="canvas-controls">
                <button type="button" onClick={clearSignature} className="clear-sig-btn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
                  LIMPIAR FIRMA
                </button>
              </div>
              {!hasSignature && (
                <div className="canvas-placeholder-text">Toque aquí para firmar</div>
              )}
              {hasSignature && (
                <div className="signature-status">
                  <span className="check-icon">✓</span>
                  Firma registrada
                </div>
              )}
            </div>
          </div>
        </div>

        <button type="submit" className="submit-inspection-btn" style={isCuadrilla ? { background: '#0984e3' } : {}} disabled={isSubmitting}>
          {isSubmitting ? 'ENVIANDO...' : isCuadrilla ? 'CONFIRMAR Y VERIFICAR INSPECCIÓN' : 'FINALIZAR Y ENVIAR INSPECCIÓN'}
        </button>
      </form>
    </div>
  );
};

export default FormComponent;
