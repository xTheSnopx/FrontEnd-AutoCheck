import apiClient from './client';

export const usersApi = {
  getAll:  ()    => apiClient.get('/users').then(r => r.data),
  getById: (id)  => apiClient.get(`/users/${id}`).then(r => r.data),
  getMe:   ()    => apiClient.get('/users/me').then(r => r.data),
  create:  (p)   => apiClient.post('/users', p).then(r => r.data),
  update:  (id, p) => apiClient.put(`/users/${id}`, p).then(r => r.data),
  delete:  (id)  => apiClient.delete(`/users/${id}`).then(r => r.data),
  assignRole: (id, roleId) => apiClient.post(`/users/${id}/roles/${roleId}`).then(r => r.data),
  revokeRole: (id, roleId) => apiClient.delete(`/users/${id}/roles/${roleId}`).then(r => r.data),
};

export const crewsApi = {
  getAll:       ()         => apiClient.get('/crews').then(r => r.data),
  getById:      (id)       => apiClient.get(`/crews/${id}`).then(r => r.data),
  getMembers:   (id)       => apiClient.get(`/crews/${id}/members`).then(r => r.data),
  create:       (p)        => apiClient.post('/crews', p).then(r => r.data),
  update:       (id, p)    => apiClient.put(`/crews/${id}`, p).then(r => r.data),
  delete:       (id)       => apiClient.delete(`/crews/${id}`).then(r => r.data),
  addMember:    (id, uid)  => apiClient.post(`/crews/${id}/members/${uid}`).then(r => r.data),
  removeMember: (id, uid)  => apiClient.delete(`/crews/${id}/members/${uid}`).then(r => r.data),
};

export const rolesApi = {
  getAll:          ()        => apiClient.get('/roles').then(r => r.data),
  getById:         (id)      => apiClient.get(`/roles/${id}`).then(r => r.data),
  getPermissions:  ()        => apiClient.get('/roles/permissions').then(r => r.data),
  assignPermission:(rid, pid)=> apiClient.post(`/roles/${rid}/permissions/${pid}`).then(r => r.data),
  revokePermission:(rid, pid)=> apiClient.delete(`/roles/${rid}/permissions/${pid}`).then(r => r.data),
};
