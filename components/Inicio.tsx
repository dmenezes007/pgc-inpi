import React from 'react';
import { MODULES } from '../constants';
import ModuleCard from './ModuleCard';

interface InicioProps {
    onModuleSelect: (moduleName: string) => void;
}

const Inicio: React.FC<InicioProps> = ({ onModuleSelect }) => {
  const otherModules = MODULES.filter(m => m !== 'Início');

  return (
    <div className="space-y-8">
      <div className="module-intro">
        <div className="module-kicker">VISÃO GERAL</div>
        <p className="module-lead">
          O <span className="text-orange-400 font-serif-highlight font-medium">Portal da Gestão do Conhecimento</span> consolida as diretrizes, processos e instrumentos institucionais propostas pela Gerência Executiva de Projetos da Presidência do INPI para transformar conhecimento em capacidade organizacional, fortalecendo a <span className="text-orange-400 font-serif-highlight font-medium">aprendizagem contínua</span>, a <span className="text-orange-400 font-serif-highlight font-medium">eficiência dos serviços</span> e a geração de valor público no INPI.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5 mb-8 rounded-xl border border-orange-200 bg-orange-50">
        <div className="flex-1">
          <p className="text-sm font-semibold text-orange-800 mb-1">Sobre o Portal</p>
          <p className="text-sm text-orange-700">
            O Portal da Gestão do Conhecimento foi desenvolvido pela Gerência Executiva de Projetos da Presidência do INPI e publicado no GitLab, em consonância com práticas de governança, rastreabilidade, colaboração aberta, segurança da informação e observância ao Padrão Digital de Governo, sem backend transacional de coleta ou armazenamento de dados persistentes.
          </p>
        </div>
      </div>
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-orange-700">Arquitetura do portal</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">Navegação por Módulos</h2>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {otherModules.map(moduleName => (
          <ModuleCard key={moduleName} moduleName={moduleName} onModuleSelect={onModuleSelect} />
        ))}
      </div>
      <div className="flex items-center justify-center rounded-2xl border border-slate-200 bg-white/80 p-5">
        <p className="text-sm text-slate-500">© 2025 INPI · Portal da Gestão do Conhecimento</p>
      </div>
    </div>
  );
};

export default Inicio;