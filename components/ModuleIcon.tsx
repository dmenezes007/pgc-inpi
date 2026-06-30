import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBookOpen,
  faBuilding,
  faBullseye,
  faCircleNodes,
  faFileLines,
  faFlask,
  faGears,
  faGlobe,
  faHouse,
  faListCheck,
  faScrewdriverWrench,
  faUser,
  faUsers,
  faWaveSquare,
} from '@fortawesome/free-solid-svg-icons';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';

interface ModuleIconProps {
  moduleName: string;
  className?: string;
}

const ModuleIcon: React.FC<ModuleIconProps> = ({ moduleName, className = "h-6 w-6" }) => {
  const iconByModule: Record<string, IconDefinition> = {
    'Início': faHouse,
    'Metodologia': faBookOpen,
    'Integração': faCircleNodes,
    'Identidade': faUser,
    'Estrutura': faBuilding,
    'Referências': faBookOpen,
    'Liderança': faUsers,
    'Transversalidade': faGlobe,
    'Técnica': faScrewdriverWrench,
    'Mapa': faWaveSquare,
    'Detentores': faUsers,
    'Planejamento': faListCheck,
    'Autodesenvolvimento': faFlask,
    'Rastreamento': faWaveSquare,
    'Instrumentos': faFileLines,
    'Monitoramento': faBullseye,
    'Documentação': faFileLines,
  };

  return <FontAwesomeIcon icon={iconByModule[moduleName] ?? faCircleNodes} className={className} />;
};

export default ModuleIcon;
