import React from 'react';

interface ModuleIconProps {
  moduleName: string;
  className?: string;
}

type IconDefinition = {
  viewBox: string;
  path: string;
};

const ModuleIcon: React.FC<ModuleIconProps> = ({ moduleName, className = "h-6 w-6" }) => {
  const iconByModule: Record<string, IconDefinition> = {
    'Início': {
      viewBox: '0 0 24 24',
      path: 'M12 3.2 3 10.4v10.4h6.4v-6h5.2v6H21V10.4z',
    },
    'Integração': {
      viewBox: '0 0 24 24',
      path: 'M7.8 7.8h3.8V4H7.8zm4.6 0h3.8V4h-3.8zM4 12.4h3.8V8.6H4zm12.2 0H20V8.6h-3.8zM7.8 20h3.8v-3.8H7.8zm4.6 0h3.8v-3.8h-3.8zM8.6 12h6.8v-1.2H8.6z',
    },
    'Identidade': {
      viewBox: '0 0 24 24',
      path: 'M12 3.8a4.2 4.2 0 1 1 0 8.4 4.2 4.2 0 0 1 0-8.4m0 10.2c4.2 0 7.6 2.1 7.6 4.7V21H4.4v-2.3c0-2.6 3.4-4.7 7.6-4.7',
    },
    'Estrutura': {
      viewBox: '0 0 24 24',
      path: 'M4 10h16V4H4zm2-4h3v2H6zm0 6h3v8H6zm5 0h3v8h-3zm5 0h3v8h-3z',
    },
    'Gestão': {
      viewBox: '0 0 24 24',
      path: 'M13.8 2h-3.6l-.6 2.2a7.6 7.6 0 0 0-1.8.8L5.8 3.8 3.2 6.4l1.2 2a7.6 7.6 0 0 0-.8 1.8L1.4 10.8v3.6l2.2.6c.2.6.5 1.2.8 1.8l-1.2 2 2.6 2.6 2-1.2c.6.3 1.2.6 1.8.8l.6 2.2h3.6l.6-2.2c.6-.2 1.2-.5 1.8-.8l2 1.2 2.6-2.6-1.2-2c.3-.6.6-1.2.8-1.8l2.2-.6v-3.6l-2.2-.6a7.6 7.6 0 0 0-.8-1.8l1.2-2-2.6-2.6-2 1.2a7.6 7.6 0 0 0-1.8-.8zM12 15.8A3.8 3.8 0 1 1 12 8a3.8 3.8 0 0 1 0 7.8',
    },
    'Liderança': {
      viewBox: '0 0 24 24',
      path: 'M12 3.6a3 3 0 1 1 0 6 3 3 0 0 1 0-6M6.6 8a2.4 2.4 0 1 1 0 4.8 2.4 2.4 0 0 1 0-4.8m10.8 0a2.4 2.4 0 1 1 0 4.8 2.4 2.4 0 0 1 0-4.8M12 11.4c3.2 0 5.8 1.8 5.8 4V20H6.2v-4.6c0-2.2 2.6-4 5.8-4',
    },
    'Transversalidade': {
      viewBox: '0 0 24 24',
      path: 'M12 2.8a9.2 9.2 0 1 0 0 18.4 9.2 9.2 0 0 0 0-18.4m-6.8 8.6h3a14 14 0 0 1 .8-4.2A7.2 7.2 0 0 0 5.2 11.4m0 1.2a7.2 7.2 0 0 0 3.8 4.2 14 14 0 0 1-.8-4.2zm4.2 0h5.2a12.7 12.7 0 0 1-1 4.6c-.5.1-1 .2-1.6.2s-1.1 0-1.6-.2a12.7 12.7 0 0 1-1-4.6m0-1.2c.1-1.7.4-3.3 1-4.6.5-.1 1-.2 1.6-.2s1.1 0 1.6.2c.6 1.3.9 2.9 1 4.6zm6.4 1.2h3a7.2 7.2 0 0 1-3.8 4.2 14 14 0 0 0 .8-4.2m0-1.2a14 14 0 0 0-.8-4.2 7.2 7.2 0 0 1 3.8 4.2z',
    },
    'Técnica': {
      viewBox: '0 0 24 24',
      path: 'M21 7.6 16.4 12l-1.8-1.8 4.6-4.4a4 4 0 0 0-4.8 5.2l-6.8 6.8a2.6 2.6 0 1 0 3.7 3.7l6.8-6.8A4 4 0 0 0 21 7.6M9.4 20a1 1 0 1 1 0-2 1 1 0 0 1 0 2',
    },
    'Planejamento': {
      viewBox: '0 0 24 24',
      path: 'M5 4h14v16H5zm2 3v2h2V7zm0 4v2h2v-2zm0 4v2h2v-2zm4-8h6v2h-6zm0 4h6v2h-6zm0 4h6v2h-6z',
    },
    'Autodesenvolvimento': {
      viewBox: '0 0 24 24',
      path: 'M9 3h6v3.2l4.8 8.4A4.8 4.8 0 0 1 15.6 22H8.4a4.8 4.8 0 0 1-4.2-7.4L9 6.2zm1.8 7.4-3.4 6h9.2l-3.4-6-.6 1.4h-1.2z',
    },
    'Rastreamento': {
      viewBox: '0 0 24 24',
      path: 'M3 15.4c2 0 2-6.8 4-6.8s2 10.4 4 10.4 2-13.8 4-13.8 2 8.2 4 8.2',
    },
    'Instrumentos': {
      viewBox: '0 0 24 24',
      path: 'M6 3h9l5 5v13H6zm8 1.8V9h4.2zM8 12h8v1.6H8zm0 3.2h8v1.6H8z',
    },
    'Monitoramento': {
      viewBox: '0 0 24 24',
      path: 'M12 3.2 21 7.4v9.2L12 20.8 3 16.6V7.4zM7.2 11.8l3 3 6.6-6.4-1.2-1.2-5.4 5.2-1.8-1.8z',
    },
  };
  const icon = iconByModule[moduleName] ?? iconByModule['Integração'];

  return (
    <svg viewBox={icon.viewBox} className={className} fill="currentColor" aria-hidden="true" focusable="false">
      <path d={icon.path} />
    </svg>
  );
};

export default ModuleIcon;
