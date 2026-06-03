import { useState } from 'react';
import { exportToExcel } from '../utils/ExcelUtils';
import '../styles/AdminPanel.css';

const AdminPanel = ({ data }) => {
  const [filterEmail, setFilterEmail] = useState('');
  const [sortBy, setSortBy] = useState('fecha');
  const [sortOrder, setSortOrder] = useState('desc');

  const filteredData = data.filter((item) =>
    item.email.toLowerCase().includes(filterEmail.toLowerCase()) ||
    item.nombre.toLowerCase().includes(filterEmail.toLowerCase()) ||
    item.empresa.toLowerCase().includes(filterEmail.toLowerCase())
  );

  const sortedData = [...filteredData].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];

    if (sortBy === 'fecha') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    } else if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
    } else {
      return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
    }
  });

  const handleExportToExcel = () => {
    if (sortedData.length === 0) {
      alert('No hay datos para exportar');
      return;
    }
    exportToExcel(sortedData, 'formularios-datos');
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h2>Panel de Administración</h2>
        <p>Total de registros: <strong>{data.length}</strong></p>
      </div>

      <div className="admin-controls">
        <div className="filter-section">
          <input
            type="text"
            placeholder="Buscar por nombre, email o empresa..."
            value={filterEmail}
            onChange={(e) => setFilterEmail(e.target.value)}
            className="filter-input"
          />
          <span className="filter-results">
            Resultados: {sortedData.length} de {data.length}
          </span>
        </div>

        <button className="export-btn" onClick={handleExportToExcel}>
          📥 Exportar a Excel
        </button>
      </div>

      {sortedData.length === 0 ? (
        <div className="no-data">
          <p>No hay datos para mostrar</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('nombre')} className="sortable">
                  Nombre {sortBy === 'nombre' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('email')} className="sortable">
                  Email {sortBy === 'email' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('telefono')} className="sortable">
                  Teléfono {sortBy === 'telefono' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('empresa')} className="sortable">
                  Empresa {sortBy === 'empresa' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('asunto')} className="sortable">
                  Asunto {sortBy === 'asunto' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th>Mensaje</th>
                <th onClick={() => handleSort('fecha')} className="sortable">
                  Fecha {sortBy === 'fecha' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedData.map((item, index) => (
                <tr key={index}>
                  <td>{item.nombre}</td>
                  <td>{item.email}</td>
                  <td>{item.telefono}</td>
                  <td>{item.empresa}</td>
                  <td>{item.asunto}</td>
                  <td className="message-cell">
                    <div className="message-preview">{item.mensaje}</div>
                  </td>
                  <td>{new Date(item.fecha).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
