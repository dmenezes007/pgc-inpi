
import React, { useState } from 'react';
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
function App() {
  const [activeModule, setActiveModule] = useState(MODULES[0]);
  const [isExpanded, setIsExpanded] = useState(true);

  const handleModuleSelect = (moduleName: string) => {
    setActiveModule(moduleName);
  };

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="app-container">
      <Sidebar
        modules={MODULES}
        activeModule={activeModule}
        onModuleSelect={handleModuleSelect}
        isExpanded={isExpanded}
        onToggle={toggleSidebar}
      />
      <div className="main-content custom-gradient-orange">
        <header className="gov-shell-header">
          <div className="gov-shell-brand">
            <img
              src="/logo-conhecimento.png"
              alt="Logo da inovação"
              className="gov-shell-mark"
            />
            <div>
              <p className="gov-shell-kicker">Portal da Gestão do Conhecimento</p>
              <h1 className="gov-shell-title">{activeModule}</h1>
            </div>
          </div>
        </header>

        <div className="gov-content-surface">
        <MainContent 
          activeModule={activeModule} 
          onModuleSelect={handleModuleSelect}
        />
        </div>
      </div>
    </div>
  );
}

export default App;