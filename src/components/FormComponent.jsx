import { useState } from 'react';
import '../styles/FormComponent.css';

const FormComponent = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    empresa: '',
    asunto: '',
    mensaje: '',
    fecha: new Date().toISOString().split('T')[0],
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    if (!formData.telefono.trim()) {
      newErrors.telefono = 'El teléfono es requerido';
    } else if (!/^\d{7,}$/.test(formData.telefono.replace(/\D/g, ''))) {
      newErrors.telefono = 'Teléfono inválido';
    }
    if (!formData.empresa.trim()) {
      newErrors.empresa = 'La empresa es requerida';
    }
    if (!formData.asunto.trim()) {
      newErrors.asunto = 'El asunto es requerido';
    }
    if (!formData.mensaje.trim()) {
      newErrors.mensaje = 'El mensaje es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(formData);
      setFormData({
        nombre: '',
        email: '',
        telefono: '',
        empresa: '',
        asunto: '',
        mensaje: '',
        fecha: new Date().toISOString().split('T')[0],
      });
      alert('Formulario enviado correctamente');
    }
  };

  return (
    <div className="form-container">
      <div className="form-wrapper">
        <h2>Formulario de Contacto</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nombre">Nombre Completo *</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Juan Pérez"
              className={errors.nombre ? 'input-error' : ''}
            />
            {errors.nombre && <span className="error-message">{errors.nombre}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="correo@ejemplo.com"
              className={errors.email ? 'input-error' : ''}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="telefono">Teléfono *</label>
            <input
              type="tel"
              id="telefono"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              placeholder="+1 (555) 123-4567"
              className={errors.telefono ? 'input-error' : ''}
            />
            {errors.telefono && <span className="error-message">{errors.telefono}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="empresa">Empresa *</label>
            <input
              type="text"
              id="empresa"
              name="empresa"
              value={formData.empresa}
              onChange={handleChange}
              placeholder="Mi Empresa"
              className={errors.empresa ? 'input-error' : ''}
            />
            {errors.empresa && <span className="error-message">{errors.empresa}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="asunto">Asunto *</label>
            <input
              type="text"
              id="asunto"
              name="asunto"
              value={formData.asunto}
              onChange={handleChange}
              placeholder="Descripción breve del asunto"
              className={errors.asunto ? 'input-error' : ''}
            />
            {errors.asunto && <span className="error-message">{errors.asunto}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="mensaje">Mensaje *</label>
            <textarea
              id="mensaje"
              name="mensaje"
              value={formData.mensaje}
              onChange={handleChange}
              placeholder="Escribe tu mensaje aquí..."
              rows="5"
              className={errors.mensaje ? 'input-error' : ''}
            ></textarea>
            {errors.mensaje && <span className="error-message">{errors.mensaje}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="fecha">Fecha de Registro</label>
            <input
              type="date"
              id="fecha"
              name="fecha"
              value={formData.fecha}
              onChange={handleChange}
              disabled
            />
          </div>

          <button type="submit" className="submit-btn">
            Enviar Formulario
          </button>
        </form>
      </div>
    </div>
  );
};

export default FormComponent;
