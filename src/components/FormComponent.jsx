import { useState, useRef, useEffect } from 'react';
import { formsApi } from '../api/forms.api';
import '../styles/FormComponent.css';

const FormComponent = ({ onSubmit }) => {
  // Estado para los campos del formulario
  // Mapeamos los campos a IDs (1 a 27) que coinciden con las semillas de la base de datos
  const [answers, setAnswers] = useState({
    // 1. Documentos
    1: 'SI', // Permiso de Circulación
    2: 'SI', // Revisión Tecnomecánica
    3: 'SI', // SOAT
    // 2. Operador
    4: 'SI', // Licencia Municipal
    5: 'SI', // Curso de Operador
    6: 'SI', // Licencia Interna
    // 3. Sistemas - Luces
    7: 'OK', // Altas/Bajas
    8: 'OK', // Retroceso/Emergencia
    9: 'OK', // Laterales
    10: 'OK', // Freno/Estacionamiento
    11: 'OK', // Cabina Interior
    // 3. Sistemas - Neumáticos
    12: 'OK', // DEL. IZQUIERDO
    13: 'OK', // DEL. DERECHO
    14: 'OK', // TRAS. INTERNOS
    15: 'OK', // TRAS. EXTERNOS
    16: 'OK', // REPUESTOS
    // 3. Sistemas - Accesorios
    17: 'SI', // Extintor/Botiquín
    18: 'SI', // Conos/Bocina
    19: 'SI', // Sirena/Licuadora
    20: 'SI', // Evaluador Cop.
    21: 'OK', // Cortacorrientes/Sist. Comunicación
    // 3. Sistemas - Vidrios
    22: 'OK', // PARABRISAS
    23: 'OK', // ESQUIERDO/DER.
    // 3. Sistemas - Espejos
    24: 'OK', // LATERALES
    25: 'OK', // CABINA
    // 3. Estabilizadores
    26: 'OK', // Delant. Izq/Der
    27: 'OK', // Tras. Izq/Der
  });

  const [observations, setObservations] = useState('');
  const [photo, setPhoto] = useState(null);
  const [activeSection, setActiveSection] = useState('doc');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Referencias para las secciones de scroll
  const sectionRefs = {
    doc: useRef(null),
    op: useRef(null),
    veh: useRef(null),
    ev: useRef(null),
  };

  // Referencia para el Canvas de Firma
  const canvasRef = useRef(null);
  const isDrawing = useRef(false);

  // Inicializar dibujado en canvas
  useEffect(() => {
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
      return {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
    };

    const startDrawing = (e) => {
      e.preventDefault();
      isDrawing.current = true;
      const coords = getCoordinates(e);
      ctx.beginPath();
      ctx.moveTo(coords.x, coords.y);
    };

    const draw = (e) => {
      if (!isDrawing.current) return;
      e.preventDefault();
      const coords = getCoordinates(e);
      ctx.lineTo(coords.x, coords.y);
      ctx.stroke();
    };

    const stopDrawing = () => {
      isDrawing.current = false;
    };

    // Mouse events
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseleave', stopDrawing);

    // Touch events for mobile
    canvas.addEventListener('touchstart', startDrawing, { passive: false });
    canvas.addEventListener('touchmove', draw, { passive: false });
    canvas.addEventListener('touchend', stopDrawing);

    return () => {
      canvas.removeEventListener('mousedown', startDrawing);
      canvas.removeEventListener('mousemove', draw);
      canvas.removeEventListener('mouseup', stopDrawing);
      canvas.removeEventListener('mouseleave', stopDrawing);
      canvas.removeEventListener('touchstart', startDrawing);
      canvas.removeEventListener('touchmove', draw);
      canvas.removeEventListener('touchend', stopDrawing);
    };
  }, []);

  // Limpiar panel de firma
  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  // Función para hacer scroll rápido a una sección
  const scrollToSection = (sectionKey) => {
    setActiveSection(sectionKey);
    const targetRef = sectionRefs[sectionKey].current;
    if (targetRef) {
      targetRef.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Actualizar respuestas
  const handleToggle = (fieldId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  // Simulación de carga de fotos
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Manejo de envío de formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Formatear respuestas para la API
      const answersPayload = Object.keys(answers).map((id) => ({
        formFieldId: parseInt(id),
        fieldValue: answers[id],
        notes: '',
      }));

      const payload = {
        formTemplateId: 1, // ID del template creado en la base de datos
        assignedToCrewId: null,
        activityLocation: 'Inspección Móvil',
        activityDate: new Date().toISOString(),
        observationsByRespondent: observations,
        answers: answersPayload,
      };

      // Enviar a la API de base de datos
      await formsApi.create(payload);

      alert('Inspección guardada y sincronizada en el BackEnd exitosamente.');
      
      // Callback local de React
      if (onSubmit) {
        onSubmit(payload);
      }
    } catch (error) {
      console.error(error);
      alert('Error al enviar la inspección al servidor. Guardando en modo local.');
      // Fallback local
      if (onSubmit) {
        onSubmit({
          observationsByRespondent: observations,
          answers,
          localOnly: true
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-component-mobile">
      {/* ===== MOBILE HEADER ===== */}
      <header className="form-mobile-header">
        <button type="button" className="menu-btn">
          <svg className="menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          <span className="menu-text">menu</span>
        </button>
        <h1 className="header-brand">AutoCheckAML</h1>
        <div className="header-right">
          <div className="avatar-circle">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </div>
          <button type="button" className="logout-btn" onClick={() => { localStorage.clear(); sessionStorage.clear(); window.location.reload(); }}>logout</button>
        </div>
      </header>

      {/* ===== HEADER DE NAVEGACIÓN DE CATEGORÍAS (SCROLL RÁPIDO) ===== */}
      <div className="category-scroll-nav">
        <button
          type="button"
          className={`nav-tab ${activeSection === 'doc' ? 'active' : ''}`}
          onClick={() => scrollToSection('doc')}
        >
          1. DOCUMENTOS
        </button>
        <button
          type="button"
          className={`nav-tab ${activeSection === 'op' ? 'active' : ''}`}
          onClick={() => scrollToSection('op')}
        >
          2. OPERADOR
        </button>
        <button
          type="button"
          className={`nav-tab ${activeSection === 'veh' ? 'active' : ''}`}
          onClick={() => scrollToSection('veh')}
        >
          3. VEHÍCULO
        </button>
        <button
          type="button"
          className={`nav-tab ${activeSection === 'ev' ? 'active' : ''}`}
          onClick={() => scrollToSection('ev')}
        >
          4. EVIDENCIA
        </button>
      </div>

      <form onSubmit={handleSubmit} className="inspection-form">
        {/* ==================== SECCIÓN 1: DOCUMENTOS ==================== */}
        <div className="section-card" ref={sectionRefs.doc}>
          <h2 className="section-title">1. DOCUMENTOS</h2>

          {/* Permiso de Circulación */}
          <div className="form-item">
            <span className="item-label">Permiso de Circulación al Día</span>
            <div className="toggle-group three-states">
              <button
                type="button"
                className={`toggle-btn btn-yes ${answers[1] === 'SI' ? 'selected' : ''}`}
                onClick={() => handleToggle(1, 'SI')}
              >
                SÍ
              </button>
              <button
                type="button"
                className={`toggle-btn btn-no ${answers[1] === 'NO' ? 'selected' : ''}`}
                onClick={() => handleToggle(1, 'NO')}
              >
                NO
              </button>
              <button
                type="button"
                className={`toggle-btn btn-na ${answers[1] === 'NA' ? 'selected' : ''}`}
                onClick={() => handleToggle(1, 'NA')}
              >
                NA
              </button>
            </div>
          </div>

          {/* Revisión Tecnomecánica */}
          <div className="form-item">
            <span className="item-label">Revisión Tecnomecánica al Día</span>
            <div className="toggle-group three-states">
              <button
                type="button"
                className={`toggle-btn btn-yes ${answers[2] === 'SI' ? 'selected' : ''}`}
                onClick={() => handleToggle(2, 'SI')}
              >
                SÍ
              </button>
              <button
                type="button"
                className={`toggle-btn btn-no ${answers[2] === 'NO' ? 'selected' : ''}`}
                onClick={() => handleToggle(2, 'NO')}
              >
                NO
              </button>
              <button
                type="button"
                className={`toggle-btn btn-na ${answers[2] === 'NA' ? 'selected' : ''}`}
                onClick={() => handleToggle(2, 'NA')}
              >
                NA
              </button>
            </div>
          </div>

          {/* SOAT */}
          <div className="form-item">
            <span className="item-label">SOAT Vigente</span>
            <div className="toggle-group three-states">
              <button
                type="button"
                className={`toggle-btn btn-yes ${answers[3] === 'SI' ? 'selected' : ''}`}
                onClick={() => handleToggle(3, 'SI')}
              >
                SÍ
              </button>
              <button
                type="button"
                className={`toggle-btn btn-no ${answers[3] === 'NO' ? 'selected' : ''}`}
                onClick={() => handleToggle(3, 'NO')}
              >
                NO
              </button>
              <button
                type="button"
                className={`toggle-btn btn-na ${answers[3] === 'NA' ? 'selected' : ''}`}
                onClick={() => handleToggle(3, 'NA')}
              >
                NA
              </button>
            </div>
          </div>
        </div>

        {/* ==================== SECCIÓN 2: OPERADOR ==================== */}
        <div className="section-card" ref={sectionRefs.op}>
          <h2 className="section-title">2. OPERADOR</h2>

          {/* Licencia Municipal */}
          <div className="form-item">
            <span className="item-label">Licencia Municipal</span>
            <div className="toggle-group two-states">
              <button
                type="button"
                className={`toggle-btn btn-yes ${answers[4] === 'SI' ? 'selected' : ''}`}
                onClick={() => handleToggle(4, 'SI')}
              >
                SÍ
              </button>
              <button
                type="button"
                className={`toggle-btn btn-no ${answers[4] === 'NO' ? 'selected' : ''}`}
                onClick={() => handleToggle(4, 'NO')}
              >
                NO
              </button>
            </div>
          </div>

          {/* Curso de Operador */}
          <div className="form-item">
            <span className="item-label">Curso de Operador</span>
            <div className="toggle-group two-states">
              <button
                type="button"
                className={`toggle-btn btn-yes ${answers[5] === 'SI' ? 'selected' : ''}`}
                onClick={() => handleToggle(5, 'SI')}
              >
                SÍ
              </button>
              <button
                type="button"
                className={`toggle-btn btn-no ${answers[5] === 'NO' ? 'selected' : ''}`}
                onClick={() => handleToggle(5, 'NO')}
              >
                NO
              </button>
            </div>
          </div>

          {/* Licencia Interna */}
          <div className="form-item">
            <span className="item-label">Licencia Interna</span>
            <div className="toggle-group two-states">
              <button
                type="button"
                className={`toggle-btn btn-yes ${answers[6] === 'SI' ? 'selected' : ''}`}
                onClick={() => handleToggle(6, 'SI')}
              >
                SÍ
              </button>
              <button
                type="button"
                className={`toggle-btn btn-no ${answers[6] === 'NO' ? 'selected' : ''}`}
                onClick={() => handleToggle(6, 'NO')}
              >
                NO
              </button>
            </div>
          </div>
        </div>

        {/* ==================== SECCIÓN 3: VEHÍCULO ==================== */}
        <div className="section-card" ref={sectionRefs.veh}>
          <h2 className="section-title">3. SISTEMAS DEL VEHÍCULO</h2>

          {/* Subsección: LUCES */}
          <div className="subsection-header">
            <span className="sub-icon">💡</span>
            <span className="sub-title">LUCES</span>
          </div>

          <div className="form-item">
            <span className="item-label">Altas / Bajas</span>
            <div className="toggle-group ok-fallo">
              <button
                type="button"
                className={`toggle-btn btn-ok ${answers[7] === 'OK' ? 'selected' : ''}`}
                onClick={() => handleToggle(7, 'OK')}
              >
                OK
              </button>
              <button
                type="button"
                className={`toggle-btn btn-fail ${answers[7] === 'FALLO' ? 'selected' : ''}`}
                onClick={() => handleToggle(7, 'FALLO')}
              >
                FALLO
              </button>
            </div>
          </div>

          <div className="form-item">
            <span className="item-label">Retroceso / Emergencia</span>
            <div className="toggle-group ok-fallo">
              <button
                type="button"
                className={`toggle-btn btn-ok ${answers[8] === 'OK' ? 'selected' : ''}`}
                onClick={() => handleToggle(8, 'OK')}
              >
                OK
              </button>
              <button
                type="button"
                className={`toggle-btn btn-fail ${answers[8] === 'FALLO' ? 'selected' : ''}`}
                onClick={() => handleToggle(8, 'FALLO')}
              >
                FALLO
              </button>
            </div>
          </div>

          <div className="form-item">
            <span className="item-label">Laterales (Delante/Trasera)</span>
            <div className="toggle-group ok-fallo">
              <button
                type="button"
                className={`toggle-btn btn-ok ${answers[9] === 'OK' ? 'selected' : ''}`}
                onClick={() => handleToggle(9, 'OK')}
              >
                OK
              </button>
              <button
                type="button"
                className={`toggle-btn btn-fail ${answers[9] === 'FALLO' ? 'selected' : ''}`}
                onClick={() => handleToggle(9, 'FALLO')}
              >
                FALLO
              </button>
            </div>
          </div>

          <div className="form-item">
            <span className="item-label">Freno / Estacionamiento</span>
            <div className="toggle-group ok-fallo">
              <button
                type="button"
                className={`toggle-btn btn-ok ${answers[10] === 'OK' ? 'selected' : ''}`}
                onClick={() => handleToggle(10, 'OK')}
              >
                OK
              </button>
              <button
                type="button"
                className={`toggle-btn btn-fail ${answers[10] === 'FALLO' ? 'selected' : ''}`}
                onClick={() => handleToggle(10, 'FALLO')}
              >
                FALLO
              </button>
            </div>
          </div>

          <div className="form-item">
            <span className="item-label">Cabina Interior</span>
            <div className="toggle-group ok-fallo">
              <button
                type="button"
                className={`toggle-btn btn-ok ${answers[11] === 'OK' ? 'selected' : ''}`}
                onClick={() => handleToggle(11, 'OK')}
              >
                OK
              </button>
              <button
                type="button"
                className={`toggle-btn btn-fail ${answers[11] === 'FALLO' ? 'selected' : ''}`}
                onClick={() => handleToggle(11, 'FALLO')}
              >
                FALLO
              </button>
            </div>
          </div>

          {/* Subsección: NEUMÁTICOS */}
          <div className="subsection-header">
            <span className="sub-icon">🚗</span>
            <span className="sub-title">NEUMÁTICOS</span>
          </div>

          <div className="grid-2x2">
            <div className="form-item card-grid">
              <span className="item-label-mini">DEL. IZQUIERDO</span>
              <div className="toggle-group ok-fallo">
                <button
                  type="button"
                  className={`toggle-btn btn-ok ${answers[12] === 'OK' ? 'selected' : ''}`}
                  onClick={() => handleToggle(12, 'OK')}
                >
                  OK
                </button>
                <button
                  type="button"
                  className={`toggle-btn btn-fail ${answers[12] === 'FALLO' ? 'selected' : ''}`}
                  onClick={() => handleToggle(12, 'FALLO')}
                >
                  FALLO
                </button>
              </div>
            </div>

            <div className="form-item card-grid">
              <span className="item-label-mini">DEL. DERECHO</span>
              <div className="toggle-group ok-fallo">
                <button
                  type="button"
                  className={`toggle-btn btn-ok ${answers[13] === 'OK' ? 'selected' : ''}`}
                  onClick={() => handleToggle(13, 'OK')}
                >
                  OK
                </button>
                <button
                  type="button"
                  className={`toggle-btn btn-fail ${answers[13] === 'FALLO' ? 'selected' : ''}`}
                  onClick={() => handleToggle(13, 'FALLO')}
                >
                  FALLO
                </button>
              </div>
            </div>

            <div className="form-item card-grid">
              <span className="item-label-mini">TRAS. INTERNOS</span>
              <div className="toggle-group ok-fallo">
                <button
                  type="button"
                  className={`toggle-btn btn-ok ${answers[14] === 'OK' ? 'selected' : ''}`}
                  onClick={() => handleToggle(14, 'OK')}
                >
                  OK
                </button>
                <button
                  type="button"
                  className={`toggle-btn btn-fail ${answers[14] === 'FALLO' ? 'selected' : ''}`}
                  onClick={() => handleToggle(14, 'FALLO')}
                >
                  FALLO
                </button>
              </div>
            </div>

            <div className="form-item card-grid">
              <span className="item-label-mini">TRAS. EXTERNOS</span>
              <div className="toggle-group ok-fallo">
                <button
                  type="button"
                  className={`toggle-btn btn-ok ${answers[15] === 'OK' ? 'selected' : ''}`}
                  onClick={() => handleToggle(15, 'OK')}
                >
                  OK
                </button>
                <button
                  type="button"
                  className={`toggle-btn btn-fail ${answers[15] === 'FALLO' ? 'selected' : ''}`}
                  onClick={() => handleToggle(15, 'FALLO')}
                >
                  FALLO
                </button>
              </div>
            </div>
          </div>

          <div className="form-item full-width-item">
            <span className="item-label">REPUESTOS</span>
            <div className="toggle-group ok-fallo">
              <button
                type="button"
                className={`toggle-btn btn-ok ${answers[16] === 'OK' ? 'selected' : ''}`}
                onClick={() => handleToggle(16, 'OK')}
              >
                OK
              </button>
              <button
                type="button"
                className={`toggle-btn btn-fail ${answers[16] === 'FALLO' ? 'selected' : ''}`}
                onClick={() => handleToggle(16, 'FALLO')}
              >
                FALLO
              </button>
            </div>
          </div>

          {/* Subsección: ACCESORIOS Y SEGURIDAD */}
          <div className="subsection-header">
            <span className="sub-icon">🛡️</span>
            <span className="sub-title">ACCESORIOS Y SEGURIDAD</span>
          </div>

          <div className="grid-2x2">
            <div className="form-item card-grid">
              <span className="item-label-mini">Extintor/Botiquín</span>
              <div className="toggle-group two-states">
                <button
                  type="button"
                  className={`toggle-btn btn-yes ${answers[17] === 'SI' ? 'selected' : ''}`}
                  onClick={() => handleToggle(17, 'SI')}
                >
                  SÍ
                </button>
                <button
                  type="button"
                  className={`toggle-btn btn-no ${answers[17] === 'NO' ? 'selected' : ''}`}
                  onClick={() => handleToggle(17, 'NO')}
                >
                  NO
                </button>
              </div>
            </div>

            <div className="form-item card-grid">
              <span className="item-label-mini">Conos/Bocina</span>
              <div className="toggle-group two-states">
                <button
                  type="button"
                  className={`toggle-btn btn-yes ${answers[18] === 'SI' ? 'selected' : ''}`}
                  onClick={() => handleToggle(18, 'SI')}
                >
                  SÍ
                </button>
                <button
                  type="button"
                  className={`toggle-btn btn-no ${answers[18] === 'NO' ? 'selected' : ''}`}
                  onClick={() => handleToggle(18, 'NO')}
                >
                  NO
                </button>
              </div>
            </div>

            <div className="form-item card-grid">
              <span className="item-label-mini">Sirena/Licuadora</span>
              <div className="toggle-group two-states">
                <button
                  type="button"
                  className={`toggle-btn btn-yes ${answers[19] === 'SI' ? 'selected' : ''}`}
                  onClick={() => handleToggle(19, 'SI')}
                >
                  SÍ
                </button>
                <button
                  type="button"
                  className={`toggle-btn btn-no ${answers[19] === 'NO' ? 'selected' : ''}`}
                  onClick={() => handleToggle(19, 'NO')}
                >
                  NO
                </button>
              </div>
            </div>

            <div className="form-item card-grid">
              <span className="item-label-mini">Evaluador Cop.</span>
              <div className="toggle-group two-states">
                <button
                  type="button"
                  className={`toggle-btn btn-yes ${answers[20] === 'SI' ? 'selected' : ''}`}
                  onClick={() => handleToggle(20, 'SI')}
                >
                  SÍ
                </button>
                <button
                  type="button"
                  className={`toggle-btn btn-no ${answers[20] === 'NO' ? 'selected' : ''}`}
                  onClick={() => handleToggle(20, 'NO')}
                >
                  NO
                </button>
              </div>
            </div>
          </div>

          <div className="form-item full-width-item">
            <span className="item-label font-small">Cortacorrientes / Sist. Comunicación</span>
            <div className="toggle-group ok-fallo">
              <button
                type="button"
                className={`toggle-btn btn-ok ${answers[21] === 'OK' ? 'selected' : ''}`}
                onClick={() => handleToggle(21, 'OK')}
              >
                OK
              </button>
              <button
                type="button"
                className={`toggle-btn btn-fail ${answers[21] === 'FALLO' ? 'selected' : ''}`}
                onClick={() => handleToggle(21, 'FALLO')}
              >
                FALLO
              </button>
            </div>
          </div>

          {/* Subsección: VIDRIOS */}
          <div className="subsection-header">
            <span className="sub-icon">🪟</span>
            <span className="sub-title">VIDRIOS</span>
          </div>

          <div className="grid-2x1">
            <div className="form-item card-grid">
              <span className="item-label-mini">PARABRISAS</span>
              <div className="toggle-group ok-fallo">
                <button
                  type="button"
                  className={`toggle-btn btn-ok ${answers[22] === 'OK' ? 'selected' : ''}`}
                  onClick={() => handleToggle(22, 'OK')}
                >
                  OK
                </button>
                <button
                  type="button"
                  className={`toggle-btn btn-fail ${answers[22] === 'FALLO' ? 'selected' : ''}`}
                  onClick={() => handleToggle(22, 'FALLO')}
                >
                  FALLO
                </button>
              </div>
            </div>

            <div className="form-item card-grid">
              <span className="item-label-mini">IZQUIERDO/DER.</span>
              <div className="toggle-group ok-fallo">
                <button
                  type="button"
                  className={`toggle-btn btn-ok ${answers[23] === 'OK' ? 'selected' : ''}`}
                  onClick={() => handleToggle(23, 'OK')}
                >
                  OK
                </button>
                <button
                  type="button"
                  className={`toggle-btn btn-fail ${answers[23] === 'FALLO' ? 'selected' : ''}`}
                  onClick={() => handleToggle(23, 'FALLO')}
                >
                  FALLO
                </button>
              </div>
            </div>
          </div>

          {/* Subsección: ESPEJOS */}
          <div className="subsection-header">
            <span className="sub-icon">🪞</span>
            <span className="sub-title">ESPEJOS</span>
          </div>

          <div className="grid-2x1">
            <div className="form-item card-grid">
              <span className="item-label-mini">LATERALES</span>
              <div className="toggle-group ok-fallo">
                <button
                  type="button"
                  className={`toggle-btn btn-ok ${answers[24] === 'OK' ? 'selected' : ''}`}
                  onClick={() => handleToggle(24, 'OK')}
                >
                  OK
                </button>
                <button
                  type="button"
                  className={`toggle-btn btn-fail ${answers[24] === 'FALLO' ? 'selected' : ''}`}
                  onClick={() => handleToggle(24, 'FALLO')}
                >
                  FALLO
                </button>
              </div>
            </div>

            <div className="form-item card-grid">
              <span className="item-label-mini">CABINA</span>
              <div className="toggle-group ok-fallo">
                <button
                  type="button"
                  className={`toggle-btn btn-ok ${answers[25] === 'OK' ? 'selected' : ''}`}
                  onClick={() => handleToggle(25, 'OK')}
                >
                  OK
                </button>
                <button
                  type="button"
                  className={`toggle-btn btn-fail ${answers[25] === 'FALLO' ? 'selected' : ''}`}
                  onClick={() => handleToggle(25, 'FALLO')}
                >
                  FALLO
                </button>
              </div>
            </div>
          </div>

          {/* Subsección: ESTABILIZADORES */}
          <div className="subsection-header">
            <span className="sub-icon">🔩</span>
            <span className="sub-title">ESTABILIZADORES</span>
          </div>

          <div className="grid-2x1">
            <div className="form-item card-grid">
              <span className="item-label-mini">Delant. Izq/Der</span>
              <div className="toggle-group ok-fallo">
                <button
                  type="button"
                  className={`toggle-btn btn-ok ${answers[26] === 'OK' ? 'selected' : ''}`}
                  onClick={() => handleToggle(26, 'OK')}
                >
                  OK
                </button>
                <button
                  type="button"
                  className={`toggle-btn btn-fail ${answers[26] === 'FALLO' ? 'selected' : ''}`}
                  onClick={() => handleToggle(26, 'FALLO')}
                >
                  FALLO
                </button>
              </div>
            </div>

            <div className="form-item card-grid">
              <span className="item-label-mini">Tras. Izq/Der</span>
              <div className="toggle-group ok-fallo">
                <button
                  type="button"
                  className={`toggle-btn btn-ok ${answers[27] === 'OK' ? 'selected' : ''}`}
                  onClick={() => handleToggle(27, 'OK')}
                >
                  OK
                </button>
                <button
                  type="button"
                  className={`toggle-btn btn-fail ${answers[27] === 'FALLO' ? 'selected' : ''}`}
                  onClick={() => handleToggle(27, 'FALLO')}
                >
                  FALLO
                </button>
              </div>
            </div>
          </div>

          {/* Observaciones Técnicas */}
          <div className="form-item-observations">
            <span className="observations-label">Observaciones Técnicas</span>
            <textarea
              className="observations-textarea"
              placeholder="Detalle cualquier hallazgo o alerta menos..."
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              rows="4"
            />
          </div>
        </div>

        {/* ==================== SECCIÓN 4: EVIDENCIA ==================== */}
        <div className="section-card" ref={sectionRefs.ev}>
          <h2 className="section-title">4. EVIDENCIA</h2>

          {/* Subida de Foto */}
          <div className="photo-upload-container">
            <label className="photo-upload-box">
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden-file-input"
              />
              {photo ? (
                <img src={photo} alt="Vista frontal" className="photo-preview" />
              ) : (
                <div className="upload-placeholder">
                  <span className="camera-icon">📷</span>
                  <span className="upload-text">VISTA FRONTAL</span>
                  <span className="add-photo-label">add_a_photo</span>
                </div>
              )}
            </label>
          </div>

          {/* Firma Digital */}
          <div className="signature-container">
            <span className="signature-label">FIRMA DIGITAL DEL OPERADOR</span>
            <div className="canvas-wrapper">
              <canvas
                ref={canvasRef}
                width={330}
                height={150}
                className="signature-canvas"
              />
              <button
                type="button"
                onClick={clearSignature}
                className="clear-sig-btn"
              >
                Limpiar Firma
              </button>
              <div className="canvas-placeholder-text">Toque aquí para firmar</div>
            </div>
          </div>
        </div>

        {/* Botón de Enviar */}
        <button
          type="submit"
          className="submit-inspection-btn"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'ENVIANDO...' : 'FINALIZAR Y ENVIAR INSPECCIÓN'}
        </button>
      </form>

      {/* ===== BOTTOM NAVIGATION BAR ===== */}
      <div className="bottom-navigation-bar">
        <button
          type="button"
          className="nav-item-btn"
          onClick={() => {
            // Ir al panel
            if (onSubmit) {
              onSubmit({ action: 'go_panel' });
            }
          }}
        >
          <span className="nav-icon">📊</span>
          <span className="nav-text">PANEL</span>
        </button>
        <button type="button" className="nav-item-btn active">
          <span className="nav-icon">📋</span>
          <span className="nav-text">NUEVA INSPECCIÓN</span>
        </button>
      </div>
    </div>
  );
};

export default FormComponent;
