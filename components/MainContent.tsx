
import React from 'react';
import Inicio from './Inicio';
import Integracao from './Integracao';
import Identidade from './Identidade';
import Estrutura from './Estrutura';
import Gestao from './Gestao';
import Lideranca from './Lideranca';
import Transversalidade from './Transversalidade';
import Tecnica from './Tecnica';
import Planejamento from './Planejamento';
import Autodesenvolvimento from './Autodesenvolvimento';
import Rastreamento from './Rastreamento';
import Instrumentos from './Instrumentos';
import Monitoramento from './Monitoramento';

interface MainContentProps {
  activeModule: string;
  onModuleSelect: (moduleName: string) => void;
}

const MainContent: React.FC<MainContentProps> = ({ activeModule, onModuleSelect }) => {
    const sharedIntro = (
        <div className="module-intro mb-8">
            <div className="module-kicker">AMBIENTE INSTITUCIONAL</div>
            <p className="module-lead">
                O <span className="text-orange-400 font-serif-highlight font-medium">Portal da Gestão do Conhecimento</span> consolida a proposta institucional da Coordenação-Geral de Recursos Humanos e da Academia de Propriedade Intelectual, Inovação e Desenvolvimento do INPI, reafirmando o <span className="text-orange-400 font-serif-highlight font-medium">conhecimento como pilar estratégico</span> para a <span className="text-orange-400 font-serif-highlight font-medium">transformação organizacional</span>, a melhoria da prestação de serviços e a geração de valor público.
            </p>
        </div>
    );

    const renderContent = () => {
        switch (activeModule) {
            case 'Início':
                return <Inicio onModuleSelect={onModuleSelect} />;
            case 'Integração':
                return <Integracao />;
            case 'Identidade':
                return <Identidade />;
            case 'Estrutura':
                return <Estrutura />;
            case 'Gestão':
                 return <Gestao />;
            case 'Liderança':
                return <Lideranca />;
            case 'Transversalidade':
                 return <Transversalidade />;
            case 'Técnica':
                return <Tecnica />;
            case 'Planejamento':
                return <Planejamento />;
            case 'Autodesenvolvimento':
                return <Autodesenvolvimento />;
            case 'Rastreamento':
                return <Rastreamento />;
            case 'Instrumentos':
                return <Instrumentos />;
            case 'Monitoramento':
                return <Monitoramento />;
            default:
                 return (
                    <div key={activeModule}>
                      <h1 className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-400">
                        {activeModule}
                      </h1>
                      <div className="bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-700">
                        <p className="text-lg text-gray-300">Conteúdo para este módulo em desenvolvimento.</p>
                      </div>
                    </div>
                );
        }
    };

    return (
        <main className="main-content-scroll-area flex-1 p-4 sm:p-8 overflow-y-auto">
            <div className="max-w-full mx-auto">
                {sharedIntro}
                {renderContent()}
            </div>
        </main>
    );
};

export default MainContent;
