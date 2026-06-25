
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

const moduleIntroTexts: Record<string, string> = {
    'Início': 'Este portal organiza diretrizes, métodos e instrumentos para orientar a Gestão do Conhecimento no INPI, conectando pessoas, processos e decisões estratégicas.',
    'Integração': 'Este módulo evidencia como a Gestão do Conhecimento se articula com sucessão, formação, inovação e desenvolvimento de competências para fortalecer resultados institucionais.',
    'Identidade': 'Este módulo conecta missão, visão, valores e objetivos estratégicos do INPI às práticas de Gestão do Conhecimento, reforçando alinhamento institucional e foco em valor público.',
    'Estrutura': 'Este módulo relaciona competências regimentais e estrutura organizacional para apoiar o mapeamento de conhecimentos essenciais e críticos por unidade.',
    'Referências': 'Este módulo apresenta referenciais de governança e gestão que orientam a maturidade institucional e sustentam a Gestão do Conhecimento no INPI.',
    'Liderança': 'Este módulo destaca competências de liderança necessárias para mobilizar equipes, promover aprendizagem contínua e consolidar uma cultura de compartilhamento do conhecimento.',
    'Transversalidade': 'Este módulo reúne competências transversais que viabilizam colaboração, integração entre áreas e atuação orientada a resultados no serviço público.',
    'Técnica': 'Este módulo organiza conhecimentos técnicos especializados por níveis e temas, apoiando a qualificação das atividades finalísticas e de suporte do Instituto.',
    'Planejamento': 'Este módulo traduz necessidades de conhecimento em ações de desenvolvimento, com alinhamento ao planejamento institucional e à viabilidade orçamentária.',
    'Autodesenvolvimento': 'Este módulo reforça o protagonismo do servidor no desenvolvimento contínuo, com incentivo institucional para ampliar competências estratégicas.',
    'Rastreamento': 'Este módulo apoia o levantamento e a análise de conhecimentos essenciais e críticos, identificando lacunas e subsidiando decisões de desenvolvimento.',
    'Instrumentos': 'Este módulo apresenta as ferramentas institucionais que sustentam identificação, desenvolvimento, retenção, proteção e uso do conhecimento organizacional.',
    'Monitoramento': 'Este módulo estrutura indicadores para acompanhar desempenho e impacto da Gestão do Conhecimento, favorecendo avaliação contínua e melhoria de resultados.'
};

const moduleKickerTexts: Record<string, string> = {
    'Início': 'VISÃO GERAL DO PORTAL',
    'Integração': 'ARTICULAÇÃO INSTITUCIONAL',
    'Identidade': 'DIRECIONAMENTO ESTRATÉGICO',
    'Estrutura': 'COMPETÊNCIAS REGIMENTAIS',
    'Referências': 'GOVERNANÇA E MATURIDADE',
    'Liderança': 'LIDERANÇA PARA CONHECIMENTO',
    'Transversalidade': 'COMPETÊNCIAS TRANSVERSAIS',
    'Técnica': 'CONHECIMENTO ESPECIALIZADO',
    'Planejamento': 'PLANO DE DESENVOLVIMENTO',
    'Autodesenvolvimento': 'PROTAGONISMO DO SERVIDOR',
    'Rastreamento': 'MAPEAMENTO DE CONHECIMENTO',
    'Instrumentos': 'FERRAMENTAS INSTITUCIONAIS',
    'Monitoramento': 'INDICADORES E RESULTADOS'
};

const MainContent: React.FC<MainContentProps> = ({ activeModule, onModuleSelect }) => {
    const introText = moduleIntroTexts[activeModule] || moduleIntroTexts['Início'];
    const kickerText = moduleKickerTexts[activeModule] || moduleKickerTexts['Início'];
    const shouldRenderSharedIntro = activeModule !== 'Início';

    const sharedIntro = (
        <div className="module-intro mb-8">
            <div className="module-kicker">{kickerText}</div>
            <p className="module-lead">
                {introText}
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
              case 'Referências':
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
                {shouldRenderSharedIntro && sharedIntro}
                {renderContent()}
            </div>
        </main>
    );
};

export default MainContent;
