
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
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
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  const handleModuleSelect = (moduleName: string) => {
    setActiveModule(moduleName);
  };

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  return (
    <div className="flex h-screen bg-slate-900 text-white font-sans">
      <Sidebar
        modules={MODULES}
        activeModule={activeModule}
        isExpanded={isSidebarExpanded}
        onModuleSelect={handleModuleSelect}
        onToggle={toggleSidebar}
      />
      <MainContent 
        activeModule={activeModule} 
        onModuleSelect={handleModuleSelect}
      />
    </div>
  );
}

export default App;