import { useState, useEffect } from 'react';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import FormComponent from './components/FormComponent';
import AdminPanel from './components/AdminPanel';
import './App.css';

function App() {
  const [screen, setScreen] = useState('login');

  useEffect(() => {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        const userRoles = user.roles || [];
        if (
          userRoles.includes('DEV') || 
          userRoles.includes('SOFTWARE') || 
          userRoles.includes('Administrator') || 
          userRoles.includes('INGENIERO_MECANICO') || 
          userRoles.includes('SUPERVISOR_HSEQ') || 
          userRoles.includes('JEFE_MTTO') || 
          user.username?.toLowerCase() === 'admin'
        ) {
          setScreen('admin-dashboard');
        } else {
          setScreen('dashboard');
        }
      } catch {
        localStorage.clear();
        sessionStorage.clear();
        setScreen('login');
      }
    }
  }, []);

  const handleLoginSuccess = (loginData) => {
    const userRoles = loginData?.roles || [];
    if (
      userRoles.includes('DEV') || 
      userRoles.includes('SOFTWARE') || 
      userRoles.includes('Administrator') || 
      userRoles.includes('INGENIERO_MECANICO') || 
      userRoles.includes('SUPERVISOR_HSEQ') || 
      userRoles.includes('JEFE_MTTO') || 
      loginData?.username?.toLowerCase() === 'admin'
    ) {
      setScreen('admin-dashboard');
    } else {
      setScreen('dashboard');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    setScreen('login');
  };

  const handleNewInspection = () => {
    setScreen('form');
  };

  const handleFormSubmit = () => {
    // Check role to redirect to the correct screen
    const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        const userRoles = user.roles || [];
        if (
          userRoles.includes('DEV') || 
          userRoles.includes('SOFTWARE') || 
          userRoles.includes('Administrator') || 
          userRoles.includes('INGENIERO_MECANICO') || 
          userRoles.includes('SUPERVISOR_HSEQ') || 
          userRoles.includes('JEFE_MTTO') || 
          user.username?.toLowerCase() === 'admin'
        ) {
          setScreen('admin-dashboard');
          return;
        }
      } catch {
        // Fallback
      }
    }
    setScreen('dashboard');
  };

  if (screen === 'login') {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  if (screen === 'dashboard') {
    return <Dashboard onNewInspection={handleNewInspection} onLogout={handleLogout} />;
  }

  if (screen === 'admin-dashboard') {
    return (
      <AdminPanel 
        onLogout={handleLogout} 
        onNewInspection={handleNewInspection} 
      />
    );
  }

  if (screen === 'form') {
    return <FormComponent onSubmit={handleFormSubmit} />;
  }

  return null;
}

export default App;
