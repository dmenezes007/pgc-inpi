import React from 'react';
import { MODULES } from '../constants';
import ModuleCard from './ModuleCard';

interface InicioProps {
    onModuleSelect: (moduleName: string) => void;
}

const Inicio: React.FC<InicioProps> = ({ onModuleSelect }) => {
  const otherModules = MODULES.filter(m => m !== 'Início');

  return (
    <div>
      <h1 className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-400">
        Início
      </h1>
      <h2 className="text-2xl font-semibold mb-6 text-gray-300">Navegue pelos Módulos</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {otherModules.map(moduleName => (
          <ModuleCard key={moduleName} moduleName={moduleName} onModuleSelect={onModuleSelect} />
        ))}
      </div>
    </div>
  );
};

export default Inicio;