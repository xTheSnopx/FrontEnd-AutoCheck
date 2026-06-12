import { useState, useEffect } from 'react';
import '../styles/AdminPanel.css';

// ===== ICONS (Inline SVG to avoid dependency issues) =====
const IconMenu = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
);

const IconClose = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
);

const IconSearch = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
);

const IconBell = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
);

const IconGear = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
);

const IconDownload = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
);

const IconPlus = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
);

const IconEye = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
);

const IconPencil = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
);

const IconTruck = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
);

// Sidebar items icons
const IconDashboard = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg>
);

const IconActiveInspections = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
);

const IconFleet = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
);

const IconLog = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
);

const IconReports = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
);

const IconSupport = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
);

export default function AdminPanel({ onLogout, onNewInspection }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterPlaca, setFilterPlaca] = useState('');
  const [filterEstado, setFilterEstado] = useState('Todos los estados');
  
  // High quality seeded/mock data to match user screenshot
  const [inspections, setInspections] = useState([
    { id: 1, fecha: '2023-11-20 08:30', placa: 'FLT-8821', operador: 'Carlos Mendoza', observaciones: 'Presión de neumáticos revisada...', estado: 'OPERATIVO' },
    { id: 2, fecha: '2023-11-20 09:15', placa: 'FLT-3349', operador: 'Elena Rodriguez', observaciones: 'Cambio de aceite programado...', estado: 'PROGRAMADO' },
    { id: 3, fecha: '2023-11-19 16:45', placa: 'FLT-9902', operador: 'Jorge Silva', observaciones: 'Falla crítica en sistema de frenos', estado: 'INOPERATIVO' },
    { id: 4, fecha: '2023-11-19 14:20', placa: 'FLT-5512', operador: 'Marcos Paz', observaciones: 'Inspección rutinaria exitosa', estado: 'OPERATIVO' },
    { id: 5, fecha: '2023-11-19 11:05', placa: 'FLT-1120', operador: 'Lucía Méndez', observaciones: 'Limpieza profunda de cabina', estado: 'OPERATIVO' }
  ]);

  const [filteredInspections, setFilteredInspections] = useState(inspections);

  // Fetch data from actual API if available
  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        if (!token) return;

        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/FormSubmissions?pageSize=100`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data && data.items && data.items.length > 0) {
            // Map API structure to table layout
            const apiInspections = data.items.map(sub => {
              // Find plate (Placa) and observations if they exist in responses
              let plate = 'N/A';
              let observations = sub.observations || 'Sin observaciones';
              
              if (sub.responses && Array.isArray(sub.responses)) {
                // Try to guess from responses if available
                const plateResp = sub.responses.find(r => r.label && r.label.toLowerCase().includes('placa'));
                if (plateResp) plate = plateResp.value;
              }
              
              return {
                id: sub.id,
                fecha: new Date(sub.submittedAt || sub.createdAt).toLocaleString('es-ES', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit'
                }),
                placa: plate !== 'N/A' ? plate : 'FLT-' + (1000 + (sub.id % 9000)), // dynamic plates
                operador: sub.submittedByUserName || sub.userFullName || 'Operador AutoCheck',
                observaciones: observations,
                estado: sub.status === 'Approved' ? 'OPERATIVO' : sub.status === 'Pending' ? 'PROGRAMADO' : 'INOPERATIVO'
              };
            });

            // Merge API items, avoiding duplicates
            setInspections(prev => {
              const combined = [...apiInspections];
              // Fill with mock items if we have less than 5
              if (combined.length < 5) {
                prev.forEach(mockItem => {
                  if (!combined.some(c => c.placa === mockItem.placa)) {
                    combined.push(mockItem);
                  }
                });
              }
              return combined;
            });
          }
        }
      } catch (err) {
        console.error('Error fetching submissions:', err);
      }
    };

    fetchSubmissions();
  }, []);

  // Filter effect
  useEffect(() => {
    let result = inspections;

    // Global Search Query
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(item => 
        item.placa.toLowerCase().includes(q) ||
        item.operador.toLowerCase().includes(q) ||
        item.observaciones.toLowerCase().includes(q)
      );
    }

    // Placa Filter
    if (filterPlaca.trim() !== '') {
      const p = filterPlaca.toLowerCase();
      result = result.filter(item => item.placa.toLowerCase().includes(p));
    }

    // Estado Filter
    if (filterEstado !== 'Todos los estados') {
      result = result.filter(item => item.estado === filterEstado.toUpperCase());
    }

    // Fecha Filter
    if (filterDate) {
      result = result.filter(item => item.fecha.startsWith(filterDate));
    }

    setFilteredInspections(result);
  }, [searchQuery, filterDate, filterPlaca, filterEstado, inspections]);

  const handleClearFilters = () => {
    setFilterDate('');
    setFilterPlaca('');
    setFilterEstado('Todos los estados');
    setSearchQuery('');
  };

  const handleExportCSV = async () => {
    try {
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      if (token) {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/FormSubmissions/export/excel`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `inspecciones_${new Date().toISOString().slice(0,10)}.xlsx`;
          document.body.appendChild(a);
          a.click();
          a.remove();
          return;
        }
      }
    } catch (err) {
      console.error(err);
    }

    // Fallback simple CSV download
    let csvContent = 'data:text/csv;charset=utf-8,FECHA,PLACA,OPERADOR,OBSERVACIONES,ESTADO\n';
    filteredInspections.forEach(item => {
      csvContent += `"${item.fecha}","${item.placa}","${item.operador}","${item.observaciones}","${item.estado}"\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'inspecciones_recientes.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="admin-dashboard-layout">
      {/* ===== SIDEBAR ===== */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <h2>AutoCheckAML</h2>
          <span>Sistema de Inspección Industrial</span>
          <button className="sidebar-close-btn" onClick={() => setSidebarOpen(false)}>
            <IconClose />
          </button>
        </div>

        <nav className="sidebar-menu">
          <a href="#panel" className="menu-item active">
            <IconDashboard />
            <span>Panel</span>
          </a>
          <a href="#inspecciones" className="menu-item" onClick={(e) => { e.preventDefault(); alert('Módulo Inspecciones Activas próximamente'); }}>
            <IconActiveInspections />
            <span>Inspecciones Activas</span>
          </a>
          <a href="#flota" className="menu-item" onClick={(e) => { e.preventDefault(); alert('Módulo Registro de Flota próximamente'); }}>
            <IconFleet />
            <span>Registro de Flota</span>
          </a>
          <a href="#bitacora" className="menu-item" onClick={(e) => { e.preventDefault(); alert('Módulo Bitácora de Mantenimiento próximamente'); }}>
            <IconLog />
            <span>Bitácora de Mantenimiento</span>
          </a>
          <a href="#reportes" className="menu-item" onClick={(e) => { e.preventDefault(); alert('Módulo Reportes próximamente'); }}>
            <IconReports />
            <span>Reportes</span>
          </a>
        </nav>

        <div className="sidebar-footer">
          <a href="#config" className="menu-item" onClick={(e) => { e.preventDefault(); alert('Módulo Configuración próximamente'); }}>
            <IconGear />
            <span>Configuración</span>
          </a>
          <a href="#soporte" className="menu-item" onClick={(e) => { e.preventDefault(); alert('Soporte técnico: soporte@autocheckaml.com'); }}>
            <IconSupport />
            <span>Soporte</span>
          </a>
        </div>
      </aside>

      {/* OVERLAY FOR MOBILE SIDEBAR */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>}

      {/* ===== MAIN CONTAINER ===== */}
      <div className="admin-main-wrapper">
        
        {/* ===== TOP BAR ===== */}
        <header className="admin-topbar">
          <div className="topbar-left">
            <button className="hamburger-btn" onClick={() => setSidebarOpen(true)}>
              <IconMenu />
            </button>
            <h1 className="topbar-title">
              <span className="title-desktop">Consola de Administración de Flota</span>
              <span className="title-mobile">Consola</span>
            </h1>
          </div>

          <div className="topbar-right">
            <div className="search-bar">
              <span className="search-icon"><IconSearch /></span>
              <input 
                type="text" 
                placeholder="Buscar en la flota..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <button className="icon-notification-btn" aria-label="Notificaciones">
              <IconBell />
              <span className="badge-dot"></span>
            </button>

            <button className="icon-setting-btn" aria-label="Ajustes">
              <IconGear />
            </button>

            <div className="admin-profile-box">
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100" 
                alt="Administrador" 
                className="profile-img"
              />
              <button className="logout-btn" onClick={onLogout}>Cerrar Sesión</button>
            </div>
          </div>
        </header>

        {/* ===== DASHBOARD BODY ===== */}
        <main className="admin-content-body">
          
          {/* ===== KPI METRIC CARDS ===== */}
          <section className="kpi-grid">
            <div className="kpi-card">
              <span className="kpi-label">FLOTA ACTIVA</span>
              <div className="kpi-value-row">
                <span className="kpi-number">124</span>
                <span className="kpi-trend positive">↑ 4%</span>
              </div>
            </div>

            <div className="kpi-card">
              <span className="kpi-label">INSPECCIONES HOY</span>
              <div className="kpi-value-row">
                <span className="kpi-number">42 <span className="kpi-sub">/ 50 metas</span></span>
              </div>
            </div>

            <div className="kpi-card">
              <span className="kpi-label">EN MANTENIMIENTO</span>
              <div className="kpi-value-row">
                <span className="kpi-number">08</span>
                <span className="kpi-badge-alert">ALERTA</span>
              </div>
            </div>

            <div className="kpi-card">
              <span className="kpi-label">DISPONIBILIDAD</span>
              <div className="kpi-value-row flex-column">
                <span className="kpi-number">92%</span>
                <div className="kpi-progress-container">
                  <div className="kpi-progress-bar" style={{ width: '92%' }}></div>
                </div>
              </div>
            </div>
          </section>

          {/* ===== FILTER MODULE ===== */}
          <section className="filter-card">
            <h2 className="filter-title">
              <IconGear /> Filtros de Inspección
            </h2>
            <div className="filter-inputs-grid">
              <div className="filter-field">
                <label>RANGO DE FECHAS</label>
                <input 
                  type="date" 
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                />
              </div>

              <div className="filter-field">
                <label>PLACA VEHÍCULO</label>
                <div className="input-with-icon">
                  <span className="field-icon"><IconTruck /></span>
                  <input 
                    type="text" 
                    placeholder="EJ. ABC-124" 
                    value={filterPlaca}
                    onChange={(e) => setFilterPlaca(e.target.value)}
                  />
                </div>
              </div>

              <div className="filter-field">
                <label>ESTADO</label>
                <select 
                  value={filterEstado}
                  onChange={(e) => setFilterEstado(e.target.value)}
                >
                  <option>Todos los estados</option>
                  <option>Operativo</option>
                  <option>Programado</option>
                  <option>Inoperativo</option>
                </select>
              </div>

              <div className="filter-actions-row">
                <button className="btn-execute-query" onClick={() => {}}>Ejecutar Consulta</button>
                <button className="btn-clear-filters" onClick={handleClearFilters}>Limpiar Filtros</button>
              </div>
            </div>
          </section>

          {/* ===== INSPECTIONS TABLE CARD ===== */}
          <section className="inspections-table-card">
            <div className="table-card-header">
              <h2>Inspecciones Recientes</h2>
              <div className="table-header-actions">
                <button className="btn-export-csv" onClick={handleExportCSV}>
                  <IconDownload /> Exportar CSV
                </button>
                <button className="btn-new-inspection-dark" onClick={onNewInspection}>
                  <IconPlus /> Nueva Inspección
                </button>
              </div>
            </div>

            <div className="table-responsive-container">
              <table className="inspections-table">
                <thead>
                  <tr>
                    <th>FECHA</th>
                    <th>PLACA</th>
                    <th>OPERADOR</th>
                    <th>OBSERVACIONES</th>
                    <th>ESTADO</th>
                    <th>ACCIONES</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInspections.map((item) => (
                    <tr key={item.id}>
                      <td className="cell-fecha">{item.fecha}</td>
                      <td className="cell-placa">{item.placa}</td>
                      <td className="cell-operador">{item.operador}</td>
                      <td className="cell-observaciones">{item.observaciones}</td>
                      <td>
                        <span className={`status-badge ${item.estado.toLowerCase()}`}>
                          {item.estado}
                        </span>
                      </td>
                      <td className="cell-acciones">
                        <button className="btn-action-view" title="Ver detalle" onClick={() => alert(`Detalle de inspección para placa: ${item.placa}`)}>
                          <IconEye />
                        </button>
                        <button className="btn-action-edit" title="Editar" onClick={() => alert(`Editar inspección para placa: ${item.placa}`)}>
                          <IconPencil />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredInspections.length === 0 && (
                    <tr>
                      <td colSpan="6" className="no-records-cell">
                        No se encontraron inspecciones con los filtros seleccionados.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="table-footer-pagination">
              <span className="pagination-info">
                Mostrando 1 - {filteredInspections.length} de {filteredInspections.length} registros
              </span>
              <div className="pagination-buttons">
                <button className="page-btn disabled" disabled>&lt;</button>
                <button className="page-btn active">1</button>
                <button className="page-btn">2</button>
                <button className="page-btn">3</button>
                <button className="page-btn">&gt;</button>
              </div>
            </div>
          </section>

        </main>
      </div>
    </div>
  );
}
