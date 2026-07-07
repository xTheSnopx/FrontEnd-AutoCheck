import { useState, useEffect } from 'react';
import { vehicleTypesApi } from '../api/vehicleTypes.api';
import { useToast } from '../contexts/ToastContext';

export default function VehicleTypesManager({ onBack }) {
  const { showToast } = useToast();
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedVt, setSelectedVt] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', displayOrder: 0 });

  useEffect(() => {
    loadVehicleTypes();
  }, []);

  const loadVehicleTypes = async () => {
    try {
      const data = await vehicleTypesApi.getAll();
      setVehicleTypes(data || []);
    } catch (err) {
      showToast('Error cargando tipos de vehículo', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setModalMode('create');
    setSelectedVt(null);
    setFormData({ name: '', description: '', displayOrder: vehicleTypes.length + 1 });
    setShowModal(true);
  };

  const handleOpenEdit = (vt) => {
    setModalMode('edit');
    setSelectedVt(vt);
    setFormData({ name: vt.name, description: vt.description || '', displayOrder: vt.displayOrder || 0 });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (modalMode === 'create') {
        await vehicleTypesApi.create(formData);
        showToast('Tipo de vehículo creado', 'success');
      } else {
        await vehicleTypesApi.update(selectedVt.id, { ...formData, isActive: true });
        showToast('Tipo de vehículo actualizado', 'success');
      }
      setShowModal(false);
      loadVehicleTypes();
    } catch (err) {
      showToast('Error: ' + (err.message || ''), 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Desactivar este tipo de vehículo?')) return;
    try {
      await vehicleTypesApi.delete(id);
      showToast('Tipo desactivado', 'success');
      loadVehicleTypes();
    } catch (err) {
      showToast('Error desactivando', 'error');
    }
  };

  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>Cargando...</div>;

  return (
    <div className="vehicle-types-manager">
      <div className="vt-header">
        <h2>Gestionar Tipos de Vehículo</h2>
        <p className="subtitle">Estos tipos aparecerán en el selector "Tipo de Vehículo" del formulario de inspección.</p>
      </div>

      <div className="vt-actions">
        <button className="btn-new-inspection-dark" onClick={handleOpenCreate}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Nuevo Tipo
        </button>
        <button className="btn-back" onClick={onBack}>Volver</button>
      </div>

      <div className="vt-list">
        {vehicleTypes.map((vt) => (
          <div key={vt.id} className="vt-card">
            <div className="vt-info">
              <strong>{vt.name}</strong>
              <span className="vt-desc">{vt.description || 'Sin descripción'}</span>
            </div>
            <div className="vt-actions-row">
              <button className="btn-action-edit" onClick={() => handleOpenEdit(vt)} title="Editar">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
              </button>
              <button className="btn-action-view" style={{ color: '#ef4444' }} onClick={() => handleDelete(vt.id)} title="Desactivar">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
              </button>
            </div>
          </div>
        ))}
        {vehicleTypes.length === 0 && (
          <div className="no-fields-msg">No hay tipos de vehículo configurados. Agregue uno nuevo.</div>
        )}
      </div>

      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '450px' }}>
            <div className="modal-header">
              <h3>{modalMode === 'create' ? 'Nuevo Tipo de Vehículo' : 'Editar Tipo'}</h3>
              <button className="modal-close-btn" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body">
                <div className="modal-form-group">
                  <label>Nombre *</label>
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                </div>
                <div className="modal-form-group">
                  <label>Descripción</label>
                  <input type="text" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                </div>
                <div className="modal-form-group">
                  <label>Orden de visualización</label>
                  <input type="number" value={formData.displayOrder} onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-modal-cancel" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className="btn-modal-submit">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
