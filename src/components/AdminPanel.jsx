import { useState, useEffect } from 'react';
import { useToast } from '../contexts/ToastContext';
import { PERMISSION_MAP, CATEGORY_MAP } from '../constants/permissions';
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

const IconKey = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>
);

const IconTruck = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
);

const IconUsers = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
);

const IconDashboard = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg>
);

const IconActiveInspections = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
);

const IconFleet = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
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

const IconExit = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
);

export default function AdminPanel({ onLogout, onNewInspection }) {
  const { showToast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterPlaca, setFilterPlaca] = useState('');
  const [filterEstado, setFilterEstado] = useState('Todos los estados');
  
  // Navigation tabs: 'panel' | 'users' | 'inspecciones' | 'flota' | 'bitacora' | 'reportes' | 'config'
  const [activeView, setActiveView] = useState('panel');
  const [currentUser, setCurrentUser] = useState(null);
  
  // User / Role / Permission lists
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  
  // User Modal states
  const [showUserModal, setShowUserModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit'
  const [selectedUser, setSelectedUser] = useState(null);
  const [userFormData, setUserFormData] = useState({
    username: '',
    email: '',
    fullName: '',
    password: '',
    roleId: ''
  });
  
  // Matrix Role selection
  const [selectedRoleId, setSelectedRoleId] = useState(1);

  const [inspections, setInspections] = useState([]);

  const [filteredInspections, setFilteredInspections] = useState(inspections);

  // Notifications state
  const [notifications, setNotifications] = useState([]);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Submissions state
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [submissionComments, setSubmissionComments] = useState('');
  const [rectifierObservations, setRectifierObservations] = useState('');
  const [requiresReview, setRequiresReview] = useState(false);

  // Crews State
  const [crews, setCrews] = useState([]);
  const [showCrewModal, setShowCrewModal] = useState(false);
  const [selectedCrew, setSelectedCrew] = useState(null);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [crewFormData, setCrewFormData] = useState({
    name: '',
    description: '',
    department: '',
    location: '',
    managedByUserId: ''
  });

  // Password Change State
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordChangeUser, setPasswordChangeUser] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Local Session Audit Timeline simulation
  const [auditLogs, setAuditLogs] = useState([]);

  const addAuditLog = (action, detail) => {
    const newLog = {
      id: Date.now(),
      action,
      detail,
      user: currentUser?.username || 'Admin',
      date: new Date().toLocaleString('es-ES', { hour12: false }).replace(',', '')
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const getApiUrl = (endpoint) => {
    const base = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${base}${cleanEndpoint}`;
  };

  const adminFetch = async (url, options = {}) => {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    if (!token) throw new Error('No token found');
    const headers = {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
    };
    const res = await fetch(url, {
      ...options,
      headers,
    });
    if (res.status === 401) {
      console.warn('Unauthorized request (401), logging out...');
      onLogout();
      throw new Error('Unauthorized');
    }
    return res;
  };

  const fetchUsers = async () => {
    try {
      const res = await adminFetch(getApiUrl('/Users'));
      if (res.ok) {
        const data = await res.json();
        setUsers(data || []);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const fetchRoles = async () => {
    try {
      const res = await adminFetch(getApiUrl('/Roles'));
      if (res.ok) {
        const data = await res.json();
        setRoles(data || []);
      }
    } catch (err) {
      console.error('Error fetching roles:', err);
    }
  };

  const fetchPermissions = async () => {
    try {
      const res = await adminFetch(getApiUrl('/Roles/permissions'));
      if (res.ok) {
        const data = await res.json();
        setPermissions(data || []);
      }
    } catch (err) {
      console.error('Error fetching permissions:', err);
    }
  };

  const fetchCrews = async () => {
    try {
      const res = await adminFetch(getApiUrl('/Crews'));
      if (res.ok) {
        const data = await res.json();
        setCrews(data || []);
      }
    } catch (err) {
      console.error('Error fetching crews:', err);
    }
  };

  const fetchSubmissionsData = async () => {
    try {
      const response = await adminFetch(getApiUrl('/FormSubmissions?pageSize=100'));

      if (response.ok) {
        const data = await response.json();
        if (data && data.items) {
          setSubmissions(data.items);
          
          const apiInspections = data.items.map(sub => {
            let plate = 'N/A';
            let observations = sub.observationsByRespondent || 'Sin observaciones';
            
            if (sub.answers && Array.isArray(sub.answers)) {
              const plateResp = sub.answers.find(r => r.formFieldLabel && r.formFieldLabel.toLowerCase().includes('placa'));
              if (plateResp) plate = plateResp.fieldValue;
            }
            
            return {
              id: sub.id,
              fecha: new Date(sub.createdAt).toLocaleString('es-ES', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
              }),
              placa: plate !== 'N/A' ? plate : 'FLT-' + (1000 + (sub.id % 9000)),
              operador: sub.submittedByUserName || 'Operador',
              observaciones: observations,
              estado: sub.status === 'Approved' ? 'OPERATIVO' : sub.status === 'Pending' ? 'PROGRAMADO' : 'INOPERATIVO',
              answers: sub.answers || []
            };
          });

          setInspections(apiInspections);

          // Sync notifications for new submissions
          const newNotifications = data.items.map(sub => {
            let plate = 'N/A';
            if (sub.answers && Array.isArray(sub.answers)) {
              const plateResp = sub.answers.find(r => r.formFieldLabel && r.formFieldLabel.toLowerCase().includes('placa'));
              if (plateResp) plate = plateResp.fieldValue;
            }
            return {
              id: sub.id,
              title: sub.status === 'Pending' ? 'Inspección Pendiente' : 'Nueva Inspección',
              message: `Vehículo: ${plate !== 'N/A' ? plate : 'FLT-' + (1000 + (sub.id % 9000))}. Diligenciado por ${sub.submittedByUserName || 'Operador'}.`,
              time: new Date(sub.createdAt).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
              read: false,
              submissionId: sub.id
            };
          });

          setNotifications(prev => {
            const updated = [...prev];
            newNotifications.forEach(newN => {
              if (!updated.some(x => x.id === newN.id)) {
                updated.unshift(newN);
              }
            });
            return updated;
          });
        }
      }
    } catch (err) {
      console.error('Error fetching submissions:', err);
    }
  };

  // Check user details
  useEffect(() => {
    const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (userStr) {
      try {
        setCurrentUser(JSON.parse(userStr));
      } catch (err) {
        console.error(err);
      }
    }
    fetchUsers();
    fetchRoles();
    fetchPermissions();
    fetchCrews();
    fetchSubmissionsData();
  }, [activeView]);

  // Filter effect
  useEffect(() => {
    let result = inspections;

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(item => 
        item.placa.toLowerCase().includes(q) ||
        item.operador.toLowerCase().includes(q) ||
        item.observaciones.toLowerCase().includes(q)
      );
    }

    if (filterPlaca.trim() !== '') {
      const p = filterPlaca.toLowerCase();
      result = result.filter(item => item.placa.toLowerCase().includes(p));
    }

    if (filterEstado !== 'Todos los estados') {
      result = result.filter(item => item.estado === filterEstado.toUpperCase());
    }

    if (filterDate) {
      result = result.filter(item => item.fecha.startsWith(filterDate));
    }

    setFilteredInspections(result);
  }, [searchQuery, filterDate, filterPlaca, filterEstado, inspections]);

  const hasPermission = (permissionName) => {
    if (!currentUser) return false;
    const userRoles = currentUser.roles || [];
    if (userRoles.includes('DEV') || userRoles.includes('SOFTWARE') || currentUser.username?.toLowerCase() === 'admin') {
      return true;
    }
    const perms = currentUser.permissions || [];
    return perms.includes(permissionName);
  };

  const hasRole = (roleName) => {
    if (!currentUser) return false;
    const userRoles = currentUser.roles || [];
    return userRoles.includes(roleName) || userRoles.includes('DEV') || userRoles.includes('SOFTWARE') || currentUser.username?.toLowerCase() === 'admin';
  };

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
          headers: { 'Authorization': `Bearer ${token}` }
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
          addAuditLog('EXPORT', 'Exportación de reporte de inspecciones a Excel');
          return;
        }
      }
    } catch (err) {
      console.error(err);
    }

    // Fallback simple CSV download - prefix with sep=, so Excel respects separators
    let csvContent = 'sep=,\nFECHA,PLACA,OPERADOR,OBSERVACIONES,ESTADO\n';
    filteredInspections.forEach(item => {
      csvContent += `"${item.fecha}","${item.placa}","${item.operador}","${item.observaciones}","${item.estado}"\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent));
    link.setAttribute('download', 'inspecciones_recientes.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
    addAuditLog('EXPORT', 'Exportación de reporte local a CSV');
  };
  
  // Users actions
  const handleOpenCreateModal = () => {
    setModalMode('create');
    setSelectedUser(null);
    setUserFormData({
      username: '',
      email: '',
      fullName: '',
      password: '',
      roleId: '3'
    });
    setShowUserModal(true);
  };

  const handleOpenEditModal = (user) => {
    setModalMode('edit');
    setSelectedUser(user);
    let userRoleId = '3';
    if (user.roles && user.roles.length > 0) {
      const currentRole = roles.find(r => r.name === user.roles[0]);
      if (currentRole) userRoleId = currentRole.id.toString();
    }
    setUserFormData({
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      password: '',
      roleId: userRoleId
    });
    setShowUserModal(true);
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      if (!token) return;
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      
      if (modalMode === 'create') {
        const createRes = await fetch(`${apiUrl}/Users`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            username: userFormData.username,
            email: userFormData.email,
            fullName: userFormData.fullName,
            password: userFormData.password
          })
        });
        
        if (createRes.ok) {
          const newUser = await createRes.json();
          if (userFormData.roleId) {
            await fetch(`${apiUrl}/Users/${newUser.id}/roles/${userFormData.roleId}`, {
              method: 'POST',
              headers: { 'Authorization': `Bearer ${token}` }
            });
          }
          showToast('Usuario creado exitosamente', 'success');
          addAuditLog('USER_CREATE', `Usuario creado: ${userFormData.username} (${userFormData.fullName})`);
          setShowUserModal(false);
          fetchUsers();
        } else {
          const errData = await createRes.json();
          showToast(errData.message || 'No se pudo crear el usuario', 'error');
        }
      } else {
        const editRes = await fetch(`${apiUrl}/Users/${selectedUser.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            username: userFormData.username,
            email: userFormData.email,
            fullName: userFormData.fullName,
            isActive: true
          })
        });
        
        if (editRes.ok) {
          if (userFormData.roleId) {
            if (selectedUser.roles && selectedUser.roles.length > 0) {
              for (const oldRoleName of selectedUser.roles) {
                const matchedRole = roles.find(r => r.name === oldRoleName);
                if (matchedRole && matchedRole.id !== parseInt(userFormData.roleId)) {
                  await fetch(`${apiUrl}/Users/${selectedUser.id}/roles/${matchedRole.id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                  });
                }
              }
            }
            await fetch(`${apiUrl}/Users/${selectedUser.id}/roles/${userFormData.roleId}`, {
              method: 'POST',
              headers: { 'Authorization': `Bearer ${token}` }
            });
          }
          showToast('Usuario actualizado exitosamente', 'success');
          addAuditLog('USER_UPDATE', `Usuario actualizado: ${userFormData.username}`);
          setShowUserModal(false);
          fetchUsers();
        } else {
          const errData = await editRes.json();
          showToast(errData.message || 'No se pudo actualizar el usuario', 'error');
        }
      }
    } catch (err) {
      console.error(err);
      showToast('Ocurrió un error inesperado', 'error');
    }
  };

  const handleOpenPasswordModal = (user) => {
    setPasswordChangeUser(user);
    setNewPassword('');
    setConfirmPassword('');
    setShowPasswordModal(true);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      showToast('Las contraseñas no coinciden', 'warning');
      return;
    }

    if (newPassword.length < 6) {
      showToast('La contraseña debe tener al menos 6 caracteres', 'warning');
      return;
    }

    try {
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      if (!token) return;

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/Users/${passwordChangeUser.id}/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          newPassword: newPassword
        })
      });

      if (res.ok) {
        showToast('Contraseña actualizada exitosamente', 'success');
        addAuditLog('PASSWORD_CHANGE', `Contraseña cambiada para usuario: ${passwordChangeUser.username}`);
        setShowPasswordModal(false);
        setNewPassword('');
        setConfirmPassword('');
        setPasswordChangeUser(null);
      } else {
        const errData = await res.json();
        showToast(errData.message || 'No se pudo cambiar la contraseña', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Ocurrió un error inesperado', 'error');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('¿Está seguro de eliminar este usuario?')) return;
    try {
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      if (!token) return;
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/Users/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        showToast('Usuario eliminado exitosamente', 'success');
        addAuditLog('USER_DELETE', `Usuario ID ${userId} eliminado`);
        fetchUsers();
      } else {
        showToast('No se pudo eliminar el usuario', 'error');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleTogglePermission = async (roleId, permissionId, hasPermission) => {
    try {
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      if (!token) return;
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      
      const method = hasPermission ? 'DELETE' : 'POST';
      const res = await fetch(`${apiUrl}/Roles/${roleId}/permissions/${permissionId}`, {
        method: method,
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (res.ok) {
        addAuditLog('PERMISSION_CHANGE', `Permiso ${permissionId} ${hasPermission ? 'revocado de' : 'otorgado a'} rol ${roleId}`);
        fetchRoles();
      } else {
        showToast('No tiene permisos para modificar los permisos de este rol o el endpoint falló.', 'error');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Crews Actions
  const handleOpenCrewModal = () => {
    const isJefeMtto = hasRole('JEFE_MTTO');
    const eligibleUsers = isJefeMtto
      ? users.filter(u => u.roles && u.roles.includes('CUADRILLA'))
      : users;

    setCrewFormData({
      name: '',
      description: '',
      department: '',
      location: '',
      managedByUserId: eligibleUsers[0]?.id || ''
    });
    setShowCrewModal(true);
  };

  const handleSaveCrew = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      if (!token) return;
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      
      const res = await fetch(`${apiUrl}/Crews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: crewFormData.name,
          description: crewFormData.description,
          department: crewFormData.department,
          location: crewFormData.location,
          managedByUserId: parseInt(crewFormData.managedByUserId)
        })
      });

      if (res.ok) {
        showToast('Cuadrilla creada exitosamente', 'success');
        addAuditLog('CREW_CREATE', `Cuadrilla creada: ${crewFormData.name}`);
        setShowCrewModal(false);
        fetchCrews();
      } else {
        const data = await res.json();
        showToast(data.message || 'No se pudo crear la cuadrilla', 'error');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenMembersModal = (crew) => {
    setSelectedCrew(crew);
    setShowMembersModal(true);
  };

  const handleAddMemberToCrew = async (userId) => {
    if (!selectedCrew) return;
    try {
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/Crews/${selectedCrew.id}/members/${userId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        showToast('Miembro agregado', 'success');
        fetchCrews();
        fetchUsers();
        // refresh selected crew
        const updatedRes = await fetch(`${apiUrl}/Crews/${selectedCrew.id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (updatedRes.ok) {
          const updatedCrew = await updatedRes.json();
          setSelectedCrew(updatedCrew);
        }
      } else {
        showToast('Error al agregar miembro', 'error');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveMemberFromCrew = async (userId) => {
    if (!selectedCrew) return;
    try {
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/Crews/${selectedCrew.id}/members/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        showToast('Miembro removido', 'success');
        fetchCrews();
        fetchUsers();
        // refresh selected crew
        const updatedRes = await fetch(`${apiUrl}/Crews/${selectedCrew.id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (updatedRes.ok) {
          const updatedCrew = await updatedRes.json();
          setSelectedCrew(updatedCrew);
        }
      } else {
        showToast('Error al remover miembro', 'error');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Submissions state updates
  const handleOpenSubmissionDetail = async (id) => {
    try {
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/FormSubmissions/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const details = await res.json();
        setSelectedSubmission(details);
        setSubmissionComments('');
        setRectifierObservations(details.observationsByRectifier || '');
        setRequiresReview(details.requiresReview || false);
        setShowSubmissionModal(true);
      } else {
        // Fallback using mock list item details
        const mockItem = inspections.find(i => i.id === id);
        if (mockItem) {
          setSelectedSubmission(mockItem);
          setShowSubmissionModal(true);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateStatus = async (status) => {
    if (!selectedSubmission) return;
    let success = false;
    try {
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/FormSubmissions/${selectedSubmission.id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status: status,
          comment: submissionComments
        })
      });
      if (res.ok) {
        success = true;
      }
    } catch (err) {
      console.error(err);
    }

    const stateStatus = status === 'Approved' ? 'OPERATIVO' : status === 'Rejected' ? 'INOPERATIVO' : 'PROGRAMADO';

    if (success) {
      showToast(`Estado actualizado a ${status} exitosamente.`, 'success');
      addAuditLog('SUBMISSION_STATUS', `Inspección ID ${selectedSubmission.id} marcada como ${status}`);
      setShowSubmissionModal(false);
      fetchSubmissionsData();
    } else {
      // Fallback local update for mocked data
      setInspections(prev => prev.map(item => {
        if (item.id === selectedSubmission.id) {
          return {
            ...item,
            estado: stateStatus,
            observaciones: submissionComments || item.observaciones
          };
        }
        return item;
      }));
      showToast(`Estado de inspección local actualizado a ${stateStatus} (Modo Fallback).`, 'info');
      addAuditLog('SUBMISSION_STATUS', `Inspección ID ${selectedSubmission.id} marcada como ${status} (Local)`);
      setShowSubmissionModal(false);
    }
  };

  const handleVerifySubmission = async () => {
    if (!selectedSubmission) return;
    let success = false;
    try {
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/FormSubmissions/${selectedSubmission.id}/verify`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          observationsByRectifier: rectifierObservations,
          requiresReview: requiresReview
        })
      });
      if (res.ok) {
        success = true;
      }
    } catch (err) {
      console.error(err);
    }

    if (success) {
      showToast('Inspección verificada por cuadrilla exitosamente.', 'success');
      addAuditLog('SUBMISSION_VERIFY', `Inspección ID ${selectedSubmission.id} verificada por Cuadrilla`);
      setShowSubmissionModal(false);
      fetchSubmissionsData();
    } else {
      // Fallback local update for mocked data
      setInspections(prev => prev.map(item => {
        if (item.id === selectedSubmission.id) {
          return {
            ...item,
            observaciones: rectifierObservations || item.observaciones,
            estado: 'OPERATIVO'
          };
        }
        return item;
      }));
      showToast('Inspección verificada exitosamente (Modo Fallback).', 'info');
      addAuditLog('SUBMISSION_VERIFY', `Inspección ID ${selectedSubmission.id} verificada por Cuadrilla (Local)`);
      setShowSubmissionModal(false);
    }
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
          <a href="#panel" className={`menu-item ${activeView === 'panel' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveView('panel'); }}>
            <IconDashboard />
            <span>Panel</span>
          </a>
          
          {hasPermission('VIEW_USER') && (
            <a href="#usuarios" className={`menu-item ${activeView === 'users' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveView('users'); }}>
              <IconUsers />
              <span>Gestión de Usuarios</span>
            </a>
          )}
          
          {(hasPermission('VIEW_FORM') || hasRole('INGENIERO_MECANICO') || hasRole('SUPERVISOR_HSEQ')) && (
            <a href="#inspecciones" className={`menu-item ${activeView === 'inspecciones' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveView('inspecciones'); }}>
              <IconActiveInspections />
              <span>Inspecciones Activas</span>
            </a>
          )}
          
          {hasPermission('VIEW_CREW') && (
            <a href="#flota" className={`menu-item ${activeView === 'flota' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveView('flota'); }}>
              <IconFleet />
              <span>Registro de Cuadrillas</span>
            </a>
          )}
          
          {hasPermission('VIEW_FORM') && (
            <a href="#bitacora" className={`menu-item ${activeView === 'bitacora' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveView('bitacora'); }}>
              <IconLog />
              <span>Bitácora Mantenimiento</span>
            </a>
          )}
          
          {hasPermission('VIEW_REPORTS') && (
            <a href="#reportes" className={`menu-item ${activeView === 'reportes' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveView('reportes'); }}>
              <IconReports />
              <span>Reportes</span>
            </a>
          )}
        </nav>

        <div className="sidebar-footer">
          {hasPermission('MANAGE_ROLES') && (
            <a href="#config" className={`menu-item ${activeView === 'config' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveView('config'); }}>
              <IconGear />
              <span>Configuración</span>
            </a>
          )}
          <a href="#soporte" className="menu-item" onClick={(e) => { e.preventDefault(); showToast('Soporte técnico: soporte@autocheckaml.com', 'info'); }}>
            <IconSupport />
            <span>Soporte</span>
          </a>
          <a href="#salir" className="menu-item logout-menu-item" onClick={(e) => { e.preventDefault(); onLogout(); }} style={{ color: '#ef4444' }}>
            <IconExit />
            <span>Cerrar Sesión</span>
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

            <div className="notification-bell-container" style={{ position: 'relative' }}>
              <button 
                className="icon-notification-btn" 
                aria-label="Notificaciones" 
                onClick={() => setNotificationsOpen(!notificationsOpen)}
              >
                <IconBell />
                {notifications.some(n => !n.read) && <span className="badge-dot"></span>}
              </button>

              {notificationsOpen && (
                <div className="notifications-dropdown">
                  <div className="dropdown-header" style={{
                    padding: '12px 16px',
                    borderBottom: '1px solid var(--admin-border)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: '#f8fafc',
                    borderTopLeftRadius: '12px',
                    borderTopRightRadius: '12px'
                  }}>
                    <span style={{ fontWeight: 600, fontSize: '14px', color: 'var(--admin-primary)' }}>Notificaciones</span>
                    {notifications.some(n => !n.read) && (
                      <button 
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--admin-primary)',
                          fontSize: '11px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          textDecoration: 'underline',
                          padding: 0
                        }}
                        onClick={() => {
                          setNotifications(prev => prev.map(n => ({ ...n, read: true })));
                          addAuditLog('NOTIFICATION', 'Marcadas todas las notificaciones como leídas');
                        }}
                      >
                        Marcar todo leído
                      </button>
                    )}
                  </div>

                  <div className="dropdown-body" style={{
                    overflowY: 'auto',
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                    {notifications.map(n => (
                      <div 
                        key={n.id} 
                        className={`notification-item ${n.read ? 'read' : 'unread'}`}
                        style={{
                          padding: '12px 16px',
                          borderBottom: '1px solid #f1f5f9',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          backgroundColor: n.read ? '#fff' : '#f0f7ff',
                          cursor: 'pointer',
                          transition: 'background-color 0.2s'
                        }}
                        onClick={() => {
                          handleOpenSubmissionDetail(n.submissionId);
                          setNotificationsOpen(false);
                          setNotifications(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x));
                        }}
                      >
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', flex: 1, paddingRight: '8px', textAlign: 'left' }}>
                          <span style={{ fontWeight: n.read ? 500 : 700, fontSize: '13px', color: 'var(--admin-text-main)' }}>{n.title}</span>
                          <span style={{ fontSize: '12px', color: 'var(--admin-text-muted)', lineHeight: '1.4' }}>{n.message}</span>
                          <span style={{ fontSize: '10px', color: 'var(--admin-text-muted)', marginTop: '2px' }}>{n.time}</span>
                        </div>
                        
                        <button 
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '4px',
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: n.read ? '#cbd5e1' : 'var(--admin-primary)',
                            transition: 'color 0.2s',
                            marginTop: '2px'
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setNotifications(prev => prev.map(x => x.id === n.id ? { ...x, read: !x.read } : x));
                          }}
                          title={n.read ? "Marcar como no leído" : "Marcar como leído"}
                        >
                          {n.read ? (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/></svg>
                          ) : (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/></svg>
                          )}
                        </button>
                      </div>
                    ))}
                    {notifications.length === 0 && (
                      <div style={{ padding: '30px', textAlign: 'center', color: 'var(--admin-text-muted)', fontSize: '13px', fontStyle: 'italic' }}>
                        No tienes notificaciones
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {hasPermission('MANAGE_ROLES') && (
              <button className="icon-setting-btn" aria-label="Ajustes" onClick={() => setActiveView('config')}>
                <IconGear />
              </button>
            )}

            <div className="admin-profile-box" style={{ borderLeft: '1px solid var(--admin-border)', paddingLeft: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--admin-text-main)' }}>{currentUser?.fullName || 'Administrador'}</span>
              <button className="logout-btn" onClick={onLogout}>Cerrar Sesión</button>
            </div>
          </div>
        </header>

        {/* ===== DASHBOARD BODY ===== */}
        <main className="admin-content-body">
          {activeView === 'panel' && (
            <>
              {/* ===== KPI METRIC CARDS ===== */}
              <section className="kpi-grid">
                <div className="kpi-card">
                  <span className="kpi-label">VEHÍCULOS REGISTRADOS</span>
                  <div className="kpi-value-row">
                    <span className="kpi-number">{new Set(inspections.map(i => i.placa)).size}</span>
                  </div>
                </div>

                <div className="kpi-card">
                  <span className="kpi-label">INSPECCIONES TOTALES</span>
                  <div className="kpi-value-row">
                    <span className="kpi-number">{inspections.length} <span className="kpi-sub">registros</span></span>
                  </div>
                </div>

                <div className="kpi-card">
                  <span className="kpi-label">EN MANTENIMIENTO (INOP)</span>
                  <div className="kpi-value-row">
                    <span className="kpi-number">
                      {inspections.filter(i => i.estado === 'INOPERATIVO').length}
                    </span>
                    {inspections.filter(i => i.estado === 'INOPERATIVO').length > 0 && (
                      <span className="kpi-badge-alert">ALERTA</span>
                    )}
                  </div>
                </div>

                <div className="kpi-card">
                  <span className="kpi-label">DISPONIBILIDAD DE VEHÍCULOS</span>
                  <div className="kpi-value-row flex-column">
                    <span className="kpi-number">
                      {inspections.length > 0 
                        ? Math.round(((inspections.filter(i => i.estado !== 'INOPERATIVO').length) / inspections.length) * 100) 
                        : 100}%
                    </span>
                    <div className="kpi-progress-container">
                      <div className="kpi-progress-bar" style={{ 
                        width: `${inspections.length > 0 
                          ? ((inspections.filter(i => i.estado !== 'INOPERATIVO').length) / inspections.length) * 100 
                          : 100}%` 
                      }}></div>
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
                        placeholder="EJ. FLT-8821" 
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
                  <h2>Resumen de Inspecciones Recientes</h2>
                  <div className="table-header-actions">
                    <button className="btn-export-csv" onClick={handleExportCSV}>
                      <IconDownload /> Exportar Excel
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
                            <button className="btn-action-view" title="Ver detalle" onClick={() => handleOpenSubmissionDetail(item.id)}>
                              <IconEye />
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
              </section>
            </>
          )}

          {activeView === 'users' && hasPermission('VIEW_USER') && (
            <div className="users-management-view">
              <section className="inspections-table-card">
                <div className="table-card-header">
                  <h2>Gestión de Usuarios</h2>
                  <div className="table-header-actions">
                    <button className="btn-new-inspection-dark" onClick={handleOpenCreateModal}>
                      <IconPlus /> Nuevo Usuario
                    </button>
                  </div>
                </div>

                <div className="table-responsive-container">
                  <table className="inspections-table">
                    <thead>
                      <tr>
                        <th>NOMBRE COMPLETO</th>
                        <th>USUARIO</th>
                        <th>EMAIL</th>
                        <th>ROLES</th>
                        <th>ACCIONES</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u.id}>
                          <td className="cell-operador" style={{ fontWeight: 600 }}>{u.fullName}</td>
                          <td className="cell-fecha">{u.username}</td>
                          <td>{u.email}</td>
                          <td>
                            {u.roles && u.roles.map((r, idx) => (
                              <span key={idx} className="user-badge-role">{r}</span>
                            ))}
                          </td>
                          <td className="cell-acciones">
                            <button className="btn-action-edit" title="Editar" onClick={() => handleOpenEditModal(u)}>
                              <IconPencil />
                            </button>
                            <button className="btn-action-view" style={{ color: '#2196F3' }} title="Cambiar Contraseña" onClick={() => handleOpenPasswordModal(u)}>
                              <IconKey />
                            </button>
                            {u.id !== 1 && (
                              <button className="btn-action-view" style={{ color: 'var(--status-inop-text)' }} title="Eliminar" onClick={() => handleDeleteUser(u.id)}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          )}

          {activeView === 'inspecciones' && (
            <div className="active-inspections-view">
              <section className="inspections-table-card">
                <div className="table-card-header">
                  <h2>Inspecciones Activas y Diligenciadas</h2>
                  <p className="section-subtitle">Visualice las respuestas de los formularios de inspección en tiempo real.</p>
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
                      {inspections.map((item) => (
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
                            <button className="btn-action-view" title="Ver Detalle / Gestionar" onClick={() => handleOpenSubmissionDetail(item.id)}>
                              <IconEye /> Ver Respuestas
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          )}

          {activeView === 'flota' && hasPermission('VIEW_CREW') && (
            <div className="fleet-crews-view">
              <section className="inspections-table-card">
                <div className="table-card-header">
                  <h2>Cuadrillas</h2>
                  <div className="table-header-actions">
                    <button className="btn-new-inspection-dark" onClick={handleOpenCrewModal}>
                      <IconPlus /> Nueva Cuadrilla
                    </button>
                  </div>
                </div>

                <div className="crews-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px', marginTop: '16px' }}>
                  {crews.map(c => (
                    <div key={c.id} className="kpi-card crew-card" style={{ gap: '10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ margin: 0, color: 'var(--admin-primary)', fontSize: '18px' }}>{c.name}</h3>
                        <span className="status-badge operativo" style={{ fontSize: '10px' }}>{c.department || 'Operaciones'}</span>
                      </div>
                      <p style={{ fontSize: '13px', color: 'var(--admin-text-muted)', margin: '4px 0' }}>{c.description || 'Sin descripción'}</p>
                      
                      <div style={{ fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '4px', borderTop: '1px solid #eee', paddingTop: '10px', marginTop: '5px' }}>
                        <div><strong>Ubicación:</strong> {c.location || 'General'}</div>
                        <div><strong>Líder asignado:</strong> {c.managedByUserName || 'No asignado'}</div>
                        <div><strong>Miembros activos:</strong> {c.memberCount || 0}</div>
                      </div>

                      <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                        <button className="btn-modal-cancel" style={{ padding: '6px 12px', fontSize: '12px', flex: 1 }} onClick={() => handleOpenMembersModal(c)}>
                          Miembros
                        </button>
                      </div>
                    </div>
                  ))}
                  {crews.length === 0 && (
                    <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', color: 'var(--admin-text-muted)', fontStyle: 'italic' }}>
                      No se han registrado cuadrillas en el sistema.
                    </div>
                  )}
                </div>
              </section>
            </div>
          )}

          {activeView === 'bitacora' && (
            <div className="maintenance-log-view">
              <section className="inspections-table-card">
                <div className="table-card-header">
                  <h2>Bitácora de Vehículos Inoperativos / Mantenimiento</h2>
                  <p className="section-subtitle">Visualice y gestione los vehículos con fallas críticas reportadas.</p>
                </div>

                <div className="table-responsive-container">
                  <table className="inspections-table">
                    <thead>
                      <tr>
                        <th>FECHA REPORTE</th>
                        <th>PLACA</th>
                        <th>OPERADOR</th>
                        <th>FALLA DETECTADA</th>
                        <th>ESTADO</th>
                        <th>ACCIONES</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inspections.filter(i => i.estado === 'INOPERATIVO').map((item) => (
                        <tr key={item.id}>
                          <td className="cell-fecha">{item.fecha}</td>
                          <td className="cell-placa">{item.placa}</td>
                          <td className="cell-operador">{item.operador}</td>
                          <td className="cell-observaciones" style={{ color: 'var(--status-inop-text)', fontWeight: 500 }}>
                            {item.observaciones}
                          </td>
                          <td>
                            <span className="status-badge inoperativo">INOPERATIVO</span>
                          </td>
                          <td className="cell-acciones">
                            <button className="btn-new-inspection-dark" style={{ backgroundColor: 'var(--status-op-text)', fontSize: '11px', height: '32px' }} onClick={() => handleOpenSubmissionDetail(item.id)}>
                              Resolver Falla
                            </button>
                          </td>
                        </tr>
                      ))}
                      {inspections.filter(i => i.estado === 'INOPERATIVO').length === 0 && (
                        <tr>
                          <td colSpan="6" className="no-records-cell" style={{ color: 'var(--status-op-text)' }}>
                            ✔ ¡Excelente! No hay vehículos reportados como inoperativos en este momento.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          )}

          {activeView === 'reportes' && (
            <div className="reports-and-audit-view" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Stats & Mini Graph */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
                <section className="inspections-table-card" style={{ flex: 1 }}>
                  <h2>Distribución de Estados</h2>
                  <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
                    {/* SVG Pie Chart */}
                    <svg width="160" height="160" viewBox="0 0 36 36" className="donut">
                      <circle className="donut-hole" cx="18" cy="18" r="15.915" fill="#fff"></circle>
                      <circle className="donut-ring" cx="18" cy="18" r="15.915" fill="transparent" stroke="#f3f6f9" strokeWidth="4"></circle>
                      
                      {/* Operativo circle segment */}
                      <circle className="donut-segment" cx="18" cy="18" r="15.915" fill="transparent" stroke="var(--status-op-text)" strokeWidth="4.2" 
                              strokeDasharray={`${(inspections.filter(i => i.estado === 'OPERATIVO').length / inspections.length) * 100} ${100 - (inspections.filter(i => i.estado === 'OPERATIVO').length / inspections.length) * 100}`} 
                              strokeDashoffset="25"></circle>
                    </svg>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>🟢 Operativos</span>
                      <strong>{inspections.filter(i => i.estado === 'OPERATIVO').length}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>🟡 Programados</span>
                      <strong>{inspections.filter(i => i.estado === 'PROGRAMADO').length}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>🔴 Inoperativos</span>
                      <strong>{inspections.filter(i => i.estado === 'INOPERATIVO').length}</strong>
                    </div>
                  </div>
                </section>

                <section className="inspections-table-card" style={{ flex: 2 }}>
                  <h2>Historial de Auditoría de Sesión</h2>
                  <p className="section-subtitle">Registro de eventos y acciones realizadas en el panel en la sesión actual.</p>
                  
                  <div className="audit-timeline" style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '16px', maxHeight: '250px', overflowY: 'auto' }}>
                    {auditLogs.map(log => (
                      <div key={log.id} style={{ display: 'flex', gap: '14px', borderLeft: '3px solid var(--admin-primary-light)', paddingLeft: '14px' }}>
                        <div style={{ fontSize: '11px', color: 'var(--admin-text-muted)', minWidth: '110px' }}>{log.date}</div>
                        <div>
                          <strong style={{ fontSize: '12px', color: 'var(--admin-primary)' }}>[{log.action}] </strong>
                          <span style={{ fontSize: '13px' }}>{log.detail}</span>
                          <span style={{ fontSize: '11px', color: 'var(--admin-text-muted)', marginLeft: '10px' }}>({log.user})</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          )}

          {activeView === 'config' && hasPermission('MANAGE_ROLES') && (
            <div className="config-view">
              <section className="inspections-table-card">
                <div className="table-card-header">
                  <h2>Configuración de Seguridad - Matriz de Roles y Permisos</h2>
                  <p className="section-subtitle">Asigne y modifique los permisos que posee cada rol en la plataforma.</p>
                </div>

                <div className="permissions-matrix-container">
                  <div className="role-selector-bar">
                    {roles.map((r) => (
                      <button key={r.id} className={`role-select-btn ${selectedRoleId === r.id ? 'active' : ''}`} onClick={() => setSelectedRoleId(r.id)}>
                        {r.name}
                      </button>
                    ))}
                  </div>

                  <div className="permissions-grid">
                    {Object.entries(
                      permissions.reduce((acc, p) => {
                        const rawCat = p.category || 'Otros';
                        const cat = CATEGORY_MAP[rawCat] || rawCat;
                        if (!acc[cat]) acc[cat] = [];
                        acc[cat].push(p);
                        return acc;
                      }, {})
                    ).map(([category, perms]) => (
                      <div key={category} className="permission-category-card">
                        <div className="category-card-header">{category}</div>
                        <div className="category-permissions-list">
                          {perms.map((p) => {
                            const role = roles.find(r => r.id === selectedRoleId);
                            const hasPerm = role?.permissions?.some(rp => rp.id === p.id) ?? false;
                            const mapped = PERMISSION_MAP[p.name] || { name: p.name, desc: p.description };
                            
                            return (
                              <div key={p.id} className="permission-item-row">
                                <div className="permission-checkbox-col">
                                  <input 
                                    type="checkbox" 
                                    checked={hasPerm}
                                    onChange={() => handleTogglePermission(selectedRoleId, p.id, hasPerm)}
                                  />
                                </div>
                                <div className="permission-text-col">
                                  <span className="permission-name-lbl">{mapped.name}</span>
                                  <span className="permission-desc-lbl">{mapped.desc}</span>
                                  {p.isCritical && <span className="permission-critical-badge">CRÍTICO</span>}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </div>
          )}
        </main>
      </div>

      {/* ===== USER MODAL ===== */}
      {showUserModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{modalMode === 'create' ? 'Crear Nuevo Usuario' : 'Editar Usuario'}</h3>
              <button className="modal-close-btn" onClick={() => setShowUserModal(false)}>
                <IconClose />
              </button>
            </div>
            <form onSubmit={handleSaveUser}>
              <div className="modal-body">
                <div className="modal-form-group">
                  <label htmlFor="modal-fullName">Nombre Completo *</label>
                  <input 
                    type="text" 
                    id="modal-fullName" 
                    required 
                    value={userFormData.fullName}
                    onChange={(e) => setUserFormData({ ...userFormData, fullName: e.target.value })}
                  />
                </div>
                <div className="modal-form-group">
                  <label htmlFor="modal-username">Usuario *</label>
                  <input 
                    type="text" 
                    id="modal-username" 
                    required 
                    value={userFormData.username}
                    onChange={(e) => setUserFormData({ ...userFormData, username: e.target.value })}
                  />
                </div>
                <div className="modal-form-group">
                  <label htmlFor="modal-email">Email *</label>
                  <input 
                    type="email" 
                    id="modal-email" 
                    required 
                    value={userFormData.email}
                    onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
                  />
                </div>
                {modalMode === 'create' && (
                  <div className="modal-form-group">
                    <label htmlFor="modal-password">Contraseña *</label>
                    <input 
                      type="password" 
                      id="modal-password" 
                      required 
                      value={userFormData.password}
                      onChange={(e) => setUserFormData({ ...userFormData, password: e.target.value })}
                    />
                  </div>
                )}
                <div className="modal-form-group">
                  <label htmlFor="modal-role">Rol Principal *</label>
                  <select 
                    id="modal-role" 
                    required 
                    value={userFormData.roleId}
                    onChange={(e) => setUserFormData({ ...userFormData, roleId: e.target.value })}
                  >
                    {roles.map((r) => (
                      <option key={r.id} value={r.id.toString()}>{r.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-modal-cancel" onClick={() => setShowUserModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-modal-submit">
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===== CREW MODAL ===== */}
      {showCrewModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Crear Nueva Cuadrilla</h3>
              <button className="modal-close-btn" onClick={() => setShowCrewModal(false)}>
                <IconClose />
              </button>
            </div>
            <form onSubmit={handleSaveCrew}>
              <div className="modal-body">
                <div className="modal-form-group">
                  <label>Nombre de Cuadrilla *</label>
                  <input 
                    type="text" 
                    required 
                    value={crewFormData.name}
                    onChange={(e) => setCrewFormData({ ...crewFormData, name: e.target.value })}
                  />
                </div>
                <div className="modal-form-group">
                  <label>Descripción</label>
                  <input 
                    type="text" 
                    value={crewFormData.description}
                    onChange={(e) => setCrewFormData({ ...crewFormData, description: e.target.value })}
                  />
                </div>
                <div className="modal-form-group">
                  <label>Departamento</label>
                  <input 
                    type="text" 
                    value={crewFormData.department}
                    onChange={(e) => setCrewFormData({ ...crewFormData, department: e.target.value })}
                  />
                </div>
                <div className="modal-form-group">
                  <label>Ubicación</label>
                  <input 
                    type="text" 
                    value={crewFormData.location}
                    onChange={(e) => setCrewFormData({ ...crewFormData, location: e.target.value })}
                  />
                </div>
                <div className="modal-form-group">
                  <label>Líder de Cuadrilla (Manager) *</label>
                  <select 
                    required 
                    value={crewFormData.managedByUserId}
                    onChange={(e) => setCrewFormData({ ...crewFormData, managedByUserId: e.target.value })}
                  >
                    {(hasRole('JEFE_MTTO')
                      ? users.filter(u => u.roles && u.roles.includes('CUADRILLA'))
                      : users
                    ).map(u => (
                      <option key={u.id} value={u.id}>{u.fullName} ({u.username})</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-modal-cancel" onClick={() => setShowCrewModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-modal-submit">
                  Crear
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===== CREW MEMBERS MODAL ===== */}
      {showMembersModal && selectedCrew && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ width: '600px' }}>
            <div className="modal-header">
              <h3>Miembros de {selectedCrew.name}</h3>
              <button className="modal-close-btn" onClick={() => setShowMembersModal(false)}>
                <IconClose />
              </button>
            </div>
            <div className="modal-body">
              <div style={{ marginBottom: '15px' }}>
                <h4>Agregar Nuevo Miembro</h4>
                <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
                  <select id="select-new-member" className="filter-field" style={{ flex: 1, height: '40px', border: '1px solid var(--admin-border)', borderRadius: '8px' }}>
                    {(hasRole('JEFE_MTTO')
                      ? users.filter(u => u.roles && u.roles.includes('CUADRILLA'))
                      : users
                    ).filter(u => u.crewId !== selectedCrew.id).map(u => (
                      <option key={u.id} value={u.id}>{u.fullName} ({u.username})</option>
                    ))}
                  </select>
                  <button className="btn-new-inspection-dark" onClick={() => {
                    const select = document.getElementById('select-new-member');
                    if (select && select.value) {
                      handleAddMemberToCrew(parseInt(select.value));
                    }
                  }}>
                    Agregar
                  </button>
                </div>
              </div>

              <h4>Miembros Actuales</h4>
              <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {users.filter(u => u.crewId === selectedCrew.id || u.crewName === selectedCrew.name).map(m => (
                  <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px', borderBottom: '1px solid #eee' }}>
                    <span>{m.fullName} ({m.username})</span>
                    <button className="logout-btn" style={{ fontSize: '11px', padding: '2px 6px' }} onClick={() => handleRemoveMemberFromCrew(m.id)}>
                      Eliminar
                    </button>
                  </div>
                ))}
                {users.filter(u => u.crewId === selectedCrew.id || u.crewName === selectedCrew.name).length === 0 && (
                  <div style={{ color: 'var(--admin-text-muted)', fontStyle: 'italic', padding: '10px 0' }}>
                    No hay miembros en esta cuadrilla.
                  </div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-modal-cancel" onClick={() => setShowMembersModal(false)}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== DETAILED SUBMISSION / RESPONSES MODAL ===== */}
      {showSubmissionModal && selectedSubmission && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ width: '700px' }}>
            <div className="modal-header">
              <h3>Respuestas Detalladas de Inspección</h3>
              <button className="modal-close-btn" onClick={() => setShowSubmissionModal(false)}>
                <IconClose />
              </button>
            </div>
            <div className="modal-body" style={{ maxHeight: '65vh' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', backgroundColor: '#f8fafc', padding: '15px', borderRadius: '8px', marginBottom: '15px', fontSize: '13px' }}>
                <div><strong>Placa:</strong> {selectedSubmission.placa}</div>
                <div><strong>Operador:</strong> {selectedSubmission.operador}</div>
                <div><strong>Fecha:</strong> {selectedSubmission.fecha}</div>
                <div><strong>Estado Actual:</strong> <span className={`status-badge ${selectedSubmission.estado?.toLowerCase()}`}>{selectedSubmission.estado}</span></div>
              </div>

              <h4>Respuestas del Formulario:</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
                {selectedSubmission.answers && selectedSubmission.answers.map((ans, idx) => (
                  <div key={idx} style={{ padding: '10px', border: '1px solid var(--admin-border)', borderRadius: '6px' }}>
                    <div style={{ fontWeight: 600, fontSize: '13px' }}>{ans.formFieldLabel}</div>
                    <div style={{ fontSize: '14px', marginTop: '4px', color: 'var(--admin-primary)', fontWeight: 500 }}>{ans.fieldValue}</div>
                    {ans.notes && <div style={{ fontSize: '12px', color: 'var(--admin-text-muted)', marginTop: '4px', fontStyle: 'italic' }}>Nota: {ans.notes}</div>}
                  </div>
                ))}
                {(!selectedSubmission.answers || selectedSubmission.answers.length === 0) && (
                  <div style={{ color: 'var(--admin-text-muted)', fontStyle: 'italic' }}>
                    Sin respuestas estructuradas (Registro semilla / Datos de prueba).
                  </div>
                )}
              </div>

              <div style={{ borderTop: '1px solid var(--admin-border)', marginTop: '20px', paddingTop: '15px' }}>
                {/* Rectification / Verification by Crew (Cuadrilla) Section */}
                {hasPermission('VERIFY_FORM') && (
                  <div style={{ marginBottom: '15px', backgroundColor: '#fff8e1', padding: '15px', borderRadius: '8px' }}>
                    <h4 style={{ margin: '0 0 10px 0', color: 'var(--status-prog-text)' }}>Verificación por Cuadrilla</h4>
                    <div className="modal-form-group">
                      <label>Observaciones del Rectificador</label>
                      <textarea 
                        className="form-input" 
                        style={{ width: '100%', minHeight: '60px', padding: '8px', border: '1px solid #ccc', borderRadius: '6px', fontFamily: 'inherit', fontSize: '13px' }}
                        value={rectifierObservations} 
                        onChange={(e) => setRectifierObservations(e.target.value)}
                      />
                    </div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px', fontSize: '13px' }}>
                      <input 
                        type="checkbox" 
                        checked={requiresReview} 
                        onChange={(e) => setRequiresReview(e.target.checked)}
                      />
                      Requiere revisión adicional por ingeniería
                    </label>
                    <button className="btn-new-inspection-dark" style={{ marginTop: '12px', width: '100%', backgroundColor: 'var(--status-prog-text)' }} onClick={handleVerifySubmission}>
                      Verificar Inspección
                    </button>
                  </div>
                )}

                {/* Status Update Section */}
                {hasPermission('EDIT_USER') && (
                  <div>
                    <h4>Cambiar Estado de la Inspección (Administración)</h4>
                    <div className="modal-form-group" style={{ marginTop: '10px' }}>
                      <label>Comentarios / Justificación</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        value={submissionComments} 
                        onChange={(e) => setSubmissionComments(e.target.value)}
                        placeholder="Ej. Cambio de repuesto completado"
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                      <button className="btn-new-inspection-dark" style={{ backgroundColor: 'var(--status-op-text)', flex: 1 }} onClick={() => handleUpdateStatus('Approved')}>
                        Marcar OPERATIVO (Aprobar)
                      </button>
                      <button className="btn-new-inspection-dark" style={{ backgroundColor: 'var(--status-inop-text)', flex: 1 }} onClick={() => handleUpdateStatus('Rejected')}>
                        Marcar INOPERATIVO
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-modal-cancel" onClick={() => setShowSubmissionModal(false)}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== PASSWORD CHANGE MODAL ===== */}
      {showPasswordModal && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '450px' }}>
            <div className="modal-header">
              <h3>Cambiar Contraseña</h3>
              <button className="modal-close-btn" onClick={() => setShowPasswordModal(false)}>
                <IconClose />
              </button>
            </div>
            <form onSubmit={handleChangePassword}>
              <div className="modal-body">
                <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
                  <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
                    <strong>Usuario:</strong> {passwordChangeUser?.username}
                  </p>
                  <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#666' }}>
                    <strong>Nombre:</strong> {passwordChangeUser?.fullName}
                  </p>
                </div>
                <div className="modal-form-group">
                  <label htmlFor="modal-newPassword">Nueva Contraseña *</label>
                  <input
                    type="password"
                    id="modal-newPassword"
                    required
                    minLength="6"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                  />
                </div>
                <div className="modal-form-group">
                  <label htmlFor="modal-confirmPassword">Confirmar Contraseña *</label>
                  <input
                    type="password"
                    id="modal-confirmPassword"
                    required
                    minLength="6"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repita la contraseña"
                  />
                </div>
                {newPassword && confirmPassword && newPassword !== confirmPassword && (
                  <p style={{ color: 'var(--status-inop-text)', fontSize: '13px', margin: '10px 0' }}>
                    ⚠️ Las contraseñas no coinciden
                  </p>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-modal-cancel" onClick={() => setShowPasswordModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-new-inspection-dark">
                  Actualizar Contraseña
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
