import apiClient from './client';

export const vehicleTypesApi = {
  getAll: () =>
    apiClient.get('/vehicletypes').then(r => r.data),

  create: (payload) =>
    apiClient.post('/vehicletypes', payload).then(r => r.data),

  update: (id, payload) =>
    apiClient.put(`/vehicletypes/${id}`, payload).then(r => r.data),

  delete: (id) =>
    apiClient.delete(`/vehicletypes/${id}`).then(r => r.data),
};
