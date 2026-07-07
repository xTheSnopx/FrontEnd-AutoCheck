import apiClient from './client';

export const formsApi = {
  getAll: (filter = {}) =>
    apiClient.get('/formsubmissions', { params: filter }).then(r => r.data),

  getById: (id) =>
    apiClient.get(`/formsubmissions/${id}`).then(r => r.data),

  create: (payload) =>
    apiClient.post('/formsubmissions', payload).then(r => r.data),

  updateStatus: (id, payload) =>
    apiClient.put(`/formsubmissions/${id}/status`, payload).then(r => r.data),

  verify: (id, payload) =>
    apiClient.put(`/formsubmissions/${id}/verify`, payload).then(r => r.data),

  delete: (id) =>
    apiClient.delete(`/formsubmissions/${id}`).then(r => r.data),

  // Templates
  getTemplates: () =>
    apiClient.get('/formtemplates').then(r => r.data),

  getActiveTemplate: () =>
    apiClient.get('/formtemplates/active').then(r => r.data),

  getTemplate: (templateId) =>
    apiClient.get(`/formtemplates/${templateId}`).then(r => r.data),

  getTemplateFields: (templateId) =>
    apiClient.get(`/formtemplates/${templateId}/fields`).then(r => r.data),

  updateTemplateFields: (templateId, fields) =>
    apiClient.put(`/formtemplates/${templateId}/fields`, fields).then(r => r.data),

  updateTemplateFieldsBulk: (templateId, fields) =>
    apiClient.put(`/formtemplates/${templateId}/fields/bulk`, fields).then(r => r.data),

  createTemplate: (payload) =>
    apiClient.post('/formtemplates', payload).then(r => r.data),

  updateTemplate: (templateId, payload) =>
    apiClient.put(`/formtemplates/${templateId}`, payload).then(r => r.data),

  exportExcel: (filter = {}) =>
    apiClient.get('/formsubmissions/export/excel', {
      params: filter,
      responseType: 'blob',
    }).then(r => r.data),
};
