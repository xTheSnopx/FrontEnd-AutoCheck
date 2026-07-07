import { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { formsApi } from '../api/forms.api';
import { vehicleTypesApi } from '../api/vehicleTypes.api';
import { useToast } from '../contexts/ToastContext';

const SortableField = ({ field, index, onChange, onRemove }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: field.id || `new-${index}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="template-field-row">
      <div className="drag-handle" {...attributes} {...listeners} title="Arrastrar para reordenar">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="6" r="1.5"/><circle cx="9" cy="12" r="1.5"/><circle cx="9" cy="18" r="1.5"/><circle cx="15" cy="6" r="1.5"/><circle cx="15" cy="12" r="1.5"/><circle cx="15" cy="18" r="1.5"/></svg>
      </div>
      <div className="field-index">{index + 1}</div>
      <div className="field-inputs">
        <input
          type="text"
          className="field-label-input"
          placeholder="Etiqueta del campo *"
          value={field.label || ''}
          onChange={(e) => onChange(index, 'label', e.target.value)}
        />
        <select
          className="field-type-select"
          value={field.fieldType || 'Select'}
          onChange={(e) => onChange(index, 'fieldType', e.target.value)}
        >
          <option value="Select">Selector (Select)</option>
          <option value="Text">Texto</option>
          <option value="Number">Número</option>
          <option value="Date">Fecha</option>
          <option value="TextArea">Área de texto</option>
          <option value="Checkbox">Casilla</option>
          <option value="Radio">Opción única (Radio)</option>
          <option value="File">Archivo</option>
        </select>
        <select
          className="field-category-select"
          value={field.category || 'doc'}
          onChange={(e) => onChange(index, 'category', e.target.value)}
          title="Sección del formulario"
        >
          <option value="doc">Documentos</option>
          <option value="op">Operador</option>
          <option value="veh">Vehículo</option>
          <option value="ev">Evidencia</option>
        </select>
        <input
          type="text"
          className="field-options-input"
          placeholder='Opciones JSON: ["SI","NO"]'
          value={field.options || ''}
          onChange={(e) => onChange(index, 'options', e.target.value)}
          title="Para Select/Radio: array JSON de opciones"
        />
        <label className="field-required-toggle">
          <input
            type="checkbox"
            checked={field.isRequired !== false}
            onChange={(e) => onChange(index, 'isRequired', e.target.checked)}
          />
          Obligatorio
        </label>
      </div>
      <button className="field-remove-btn" onClick={() => onRemove(index)} title="Eliminar campo">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
  );
};

export default function FormTemplateEditor({ onBack }) {
  const { showToast } = useToast();
  const [template, setTemplate] = useState(null);
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } })
  );

  useEffect(() => {
    loadTemplate();
  }, []);

  const loadTemplate = async () => {
    try {
      const active = await formsApi.getActiveTemplate();
      setTemplate(active);
      const fetchedFields = await formsApi.getTemplateFields(active.id);
      setFields(fetchedFields.map(f => ({ ...f, id: f.id || Date.now() + Math.random() })));
    } catch (err) {
      showToast('Error cargando plantilla: ' + (err.message || 'desconocido'), 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddField = () => {
    setFields([...fields, {
      id: `new-${Date.now()}`,
      label: '',
      fieldType: 'Select',
      isRequired: true,
      displayOrder: fields.length + 1,
      options: '["SI", "NO"]',
      validationRules: '',
      defaultValue: '',
      isActive: true,
    }]);
  };

  const handleChangeField = (index, key, value) => {
    const updated = [...fields];
    updated[index] = { ...updated[index], [key]: value };
    setFields(updated);
  };

  const handleRemoveField = (index) => {
    if (!window.confirm('Eliminar este campo?')) return;
    setFields(fields.filter((_, i) => i !== index));
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = fields.findIndex(f => (f.id || `new-${fields.indexOf(f)}`) === active.id);
      const newIndex = fields.findIndex(f => (f.id || `new-${fields.indexOf(f)}`) === over.id);
      setFields(arrayMove(fields, oldIndex, newIndex));
    }
  };

  const handleSave = async () => {
    if (!template) return;
    const invalid = fields.find(f => !f.label?.trim());
    if (invalid) { showToast('Todos los campos deben tener una etiqueta', 'warning'); return; }

    setSaving(true);
    try {
      const payload = fields.map((f, idx) => ({
        id: typeof f.id === 'number' && f.id > 0 ? f.id : 0,
        label: f.label.trim(),
        description: f.description || '',
        fieldType: f.fieldType,
        isRequired: f.isRequired,
        displayOrder: idx + 1,
        options: f.options || '',
        validationRules: f.validationRules || '',
        defaultValue: f.defaultValue || '',
        isActive: f.isActive !== false,
        category: f.category || 'doc',
      }));

      await formsApi.updateTemplateFieldsBulk(template.id, payload);
      showToast('Plantilla guardada exitosamente', 'success');
      loadTemplate();
    } catch (err) {
      showToast('Error guardando: ' + (err.message || 'desconocido'), 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>Cargando editor...</div>;

  return (
    <div className="template-editor-container">
      <div className="template-editor-header">
        <h2>Editor de Formulario: {template?.name}</h2>
        <p className="subtitle">Arrastre los campos para reordenar. Edite, agregue o elimine campos según necesite.</p>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={fields.map((f, i) => f.id || `new-${i}`)}
          strategy={verticalListSortingStrategy}
        >
          <div className="template-fields-list">
            {fields.map((field, index) => (
              <SortableField
                key={field.id || `new-${index}`}
                field={field}
                index={index}
                onChange={handleChangeField}
                onRemove={handleRemoveField}
              />
            ))}
            {fields.length === 0 && (
              <div className="no-fields-msg">No hay campos en esta plantilla. Agregue uno nuevo.</div>
            )}
          </div>
        </SortableContext>
      </DndContext>

      <div className="template-editor-actions">
        <button className="btn-add-field" onClick={handleAddField}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Agregar Campo
        </button>
        <div style={{ flex: 1 }} />
        <button className="btn-back" onClick={onBack}>Volver</button>
        <button className="btn-save" onClick={handleSave} disabled={saving}>
          {saving ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </div>
    </div>
  );
}
