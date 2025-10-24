

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
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

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
    if (window.innerWidth < 768) {
      setIsMobileSidebarOpen(false);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="app-container">
      <button className="hamburger-menu" onClick={toggleMobileSidebar}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <Sidebar
        modules={MODULES}
        activeModule={activeModule}
        isExpanded={isSidebarExpanded}
        isMobileOpen={isMobileSidebarOpen}
        onModuleSelect={handleModuleSelect}
        onToggle={toggleSidebar}
      />
      <div className="main-content" onClick={() => {
        if (isMobileSidebarOpen) {
          setIsMobileSidebarOpen(false);
        }
      }}>
        <MainContent 
          activeModule={activeModule} 
          onModuleSelect={handleModuleSelect}
        />
      </div>
    </div>
  );
}

export default App;