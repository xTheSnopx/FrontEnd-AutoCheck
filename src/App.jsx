import { useState } from 'react';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import FormComponent from './components/FormComponent';
import AdminPanel from './components/AdminPanel';
import './App.css';

function App() {
  const [screen, setScreen] = useState('login');
  const [formDataList, setFormDataList] = useState([]);
  const [activeTab, setActiveTab] = useState('form');

  const handleLoginSuccess = () => {
    setScreen('dashboard');
  };

  const handleNewInspection = () => {
    setScreen('form');
    setActiveTab('form');
  };

  const handleFormSubmit = (formData) => {
    setFormDataList((prevList) => [
      ...prevList,
      { ...formData, id: Date.now() },
    ]);
    setScreen('dashboard');
  };

  const handleGoDashboard = () => {
    setScreen('dashboard');
  };

  if (screen === 'login') {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  if (screen === 'dashboard') {
    return <Dashboard onNewInspection={handleNewInspection} />;
  }

  if (screen === 'form') {
    return (
      <div className="app">
        <nav className="navbar">
          <div className="nav-container">
            <div className="nav-brand">
              <h1>AutoCheck AML</h1>
              <p>Formulario y Panel de Administración</p>
            </div>
            <div className="nav-tabs">
              <button
                className={`nav-btn ${activeTab === 'form' ? 'active' : ''}`}
                onClick={() => setActiveTab('form')}
              >
                Formulario
              </button>
              <button
                className={`nav-btn ${activeTab === 'admin' ? 'active' : ''}`}
                onClick={() => setActiveTab('admin')}
              >
                Administración
                {formDataList.length > 0 && (
                  <span className="badge">{formDataList.length}</span>
                )}
              </button>
            </div>
          </div>
        </nav>

        <main className="main-content">
          {activeTab === 'form' ? (
            <FormComponent onSubmit={handleFormSubmit} />
          ) : (
            <AdminPanel data={formDataList} />
          )}
        </main>

        <footer className="footer">
          <p>&copy; 2024 AutoCheck AML. Todos los derechos reservados.</p>
        </footer>
      </div>
    );
  }

  return null;
}

export default App;
