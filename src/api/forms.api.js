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

  exportExcel: (filter = {}) =>
    apiClient.get('/formsubmissions/export/excel', {
      params: filter,
      responseType: 'blob',
    }).then(r => r.data),
};
