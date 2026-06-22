import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
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
    'Integração': faCircleNodes,
    'Identidade': faUser,
    'Estrutura': faBuilding,
    'Gestão': faGears,
    'Liderança': faUsers,
    'Transversalidade': faGlobe,
    'Técnica': faScrewdriverWrench,
    'Planejamento': faListCheck,
    'Autodesenvolvimento': faFlask,
    'Rastreamento': faWaveSquare,
    'Instrumentos': faFileLines,
    'Monitoramento': faBullseye,
  };

  return <FontAwesomeIcon icon={iconByModule[moduleName] ?? faCircleNodes} className={className} />;
};

export default ModuleIcon;
