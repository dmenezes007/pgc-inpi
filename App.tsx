

import React, { useState, useEffect } from 'react';
import LoginPage from './components/LoginPage';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import './styles/App.css';
import { MODULES } from './constants';

// FIX: Define and export types for Project, Step, and Risk to be used across components.
export interface Step {
    step: string;
    startDate: string;
    endDate: string;
    manager: string;
    executor: string;
}

export type RiskProbability = 'Baixa' | 'Média' | 'Alta';
export type RiskImpact = 'Baixo' | 'Médio' | 'Alto';

export interface Risk {
    description: string;
    probability: RiskProbability;
    impact: RiskImpact;
    mitigation: string;
}

export interface Project {
    id: string;
    title: string;
    scope: string;
    steps: Step[];
    risks: Risk[];
    performanceIndicators: string[];
    impactIndicators: string[];
    resources: string;
}


const CORRECT_PASSWORD = 'PGC_INPI_2025';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeModule, setActiveModule] = useState(MODULES[0]);

  useEffect(() => {
    const storedAuth = sessionStorage.getItem('isAuthenticated');
    if (storedAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (password: string) => {
    if (password === CORRECT_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem('isAuthenticated', 'true');
    } else {
      alert('Senha incorreta');
    }
  };

  const handleModuleSelect = (moduleName: string) => {
    setActiveModule(moduleName);
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="app-container">
      <Sidebar
        modules={MODULES}
        activeModule={activeModule}
        onModuleSelect={handleModuleSelect}
      />
      <div className="main-content">
        <MainContent 
          activeModule={activeModule} 
          onModuleSelect={handleModuleSelect}
        />
      </div>
    </div>
  );
}

export default App;