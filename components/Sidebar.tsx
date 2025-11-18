import React from 'react';
import ModuleIcon from './ModuleIcon';

interface SidebarProps {
  modules: string[];
  activeModule: string;
  onModuleSelect: (moduleName: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ modules, activeModule, onModuleSelect }) => {
  const sidebarClasses = `sidebar bg-slate-800 flex flex-col shadow-lg transition-all duration-300 ease-in-out w-80`;

  return (
    <aside className={sidebarClasses}>
      <div className={`p-6 pt-16 flex items-center justify-between`}>
        <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-400">
          PGC
        </div>
      </div>
      
      <nav className="flex-grow px-4">
        <ul>
          {modules.map((moduleName) => (
            <li key={moduleName} className="mb-2">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onModuleSelect(moduleName);
                }}
                className={`flex items-center py-2.5 rounded-lg transition-colors duration-200 px-4 ${
                  activeModule === moduleName
                    ? 'bg-orange-600 text-white font-semibold shadow-md'
                    : 'text-gray-300 hover:bg-slate-700 hover:text-white'
                }`}
                title={moduleName}
              >
                <ModuleIcon moduleName={moduleName} className="h-5 w-5 flex-shrink-0" />
                <span className="ml-4 text-sm font-medium">{moduleName}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 text-center">
         <div className={`flex justify-center text-xs text-slate-500 mt-4 transition-opacity duration-300 opacity-100`}>
        <img 
            src="https://dmenezes007.github.io/pgi-inpi/files/imgs/logo_inpi_branco_fundo_transparente.png" 
            alt="Logo do INPI" 
            className="h-8"
        />
    </div>
      </div>
    </aside>
  );
};

export default Sidebar;