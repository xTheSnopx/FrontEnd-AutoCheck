import '../styles/Dashboard.css';

/* ===== ICONS ===== */
const IconMenu = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
);

const IconExit = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 15l-4-4 4-4"/><path d="M19 12H3"/><path d="M10 19l4-4"/><path d="M14 5l-4 4"/></svg>
);

const IconClipboardCheck = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="2"/><path d="M9 14l2 2 4-4"/></svg>
);

const IconArrowRight = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
);

const IconShieldCheck = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="20 6 9 17 4 12"/></svg>
);

const IconZap = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
);

const IconClock = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
);

const IconCalendarCheck = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><polyline points="9 16 11 18 15 14"/></svg>
);

const IconBus = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="6" width="18" height="12" rx="2"/><path d="M6 18v2"/><path d="M18 18v2"/><circle cx="7" cy="12" r="1"/><circle cx="17" cy="12" r="1"/><path d="M3 10h18"/></svg>
);

const IconBarChart = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="18" y="4" width="4" height="16" rx="1"/><rect x="10" y="10" width="4" height="10" rx="1"/><rect x="2" y="14" width="4" height="6" rx="1"/></svg>
);

const IconPlus = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
);

export default function Dashboard({ onNewInspection }) {
  return (
    <div className="dashboard">
      {/* ===== HEADER ===== */}
      <header className="dash-header">
        <button className="dash-icon-btn" aria-label="Menu"><IconMenu /></button>
        <h1 className="dash-brand">AutoCheckAML</h1>
        <button className="dash-icon-btn" aria-label="Salir"><IconExit /></button>
      </header>

      {/* ===== MAIN CONTENT ===== */}
      <main className="dash-content">
        {/* HERO CARD */}
        <div className="dash-hero-card">
          <div className="dash-hero-icon">
            <IconClipboardCheck />
          </div>
          <h2 className="dash-hero-title">Inspección de Flota Diaria</h2>
          <p className="dash-hero-desc">
            Asegure la operatividad y cumplimiento de seguridad completando el registro técnico del vehículo asignado para su jornada.
          </p>
          <button className="dash-hero-btn" onClick={onNewInspection}>
            <span>Contestar Formulario De Vehículo</span>
            <IconArrowRight />
          </button>

          <div className="dash-features">
            <div className="dash-feature"><IconShieldCheck /><span>Cumplimiento ISO</span></div>
            <div className="dash-feature"><IconZap /><span>Sincronización en tiempo real</span></div>
            <div className="dash-feature"><IconClock /><span>Registro Histórico</span></div>
          </div>
        </div>

        {/* SUMMARY CARDS */}
        <div className="dash-summary">
          <div className="dash-summary-card">
            <div className="dash-summary-icon"><IconCalendarCheck /></div>
            <div className="dash-summary-info">
              <span className="dash-summary-label">Última Inspección</span>
              <span className="dash-summary-value">24 Oct, 08:45 AM</span>
            </div>
          </div>

          <div className="dash-summary-card">
            <div className="dash-summary-icon"><IconBus /></div>
            <div className="dash-summary-info">
              <span className="dash-summary-label">Estado de Flota</span>
              <span className="dash-summary-badge">OPERATIVO</span>
            </div>
          </div>
        </div>
      </main>

      {/* ===== BOTTOM NAVIGATION ===== */}
      <nav className="dash-bottom-nav">
        <button className="dash-nav-item active">
          <IconBarChart />
          <span>Panel</span>
        </button>
        <button className="dash-nav-item" onClick={onNewInspection}>
          <IconPlus />
          <span>Nueva Inspección</span>
        </button>
      </nav>
    </div>
  );
}
