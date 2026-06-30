
import React from 'react';
import Inicio from './Inicio';
import Metodologia from './MetodologiaGC';
import Integracao from './Integracao';
import Identidade from './Identidade';
import Estrutura from './Estrutura';
import Gestao from './Gestao';
import Lideranca from './Lideranca';
import Transversalidade from './Transversalidade';
import Tecnica from './Tecnica';
import Mapa from './Mapa';
import Detentores from './Detentores';
import Planejamento from './Planejamento';
import Autodesenvolvimento from './Autodesenvolvimento';
import Rastreamento from './Rastreamento';
import Instrumentos from './Instrumentos';
import Monitoramento from './Monitoramento';
import Documentacao from './Documentacao';

interface MainContentProps {
  activeModule: string;
  onModuleSelect: (moduleName: string) => void;
}

const moduleIntroTexts: Record<string, string> = {
    'Início': 'Diretrizes, métodos e instrumentos da Gestão do Conhecimento no INPI conectam pessoas, processos e decisões estratégicas em uma visão integrada.',
    'Metodologia': 'Abordagem metodológica aplicada ao desenvolvimento e à consolidação da Gestão do Conhecimento no INPI, com foco em evidências, melhoria contínua e governança.',
    'Integração': 'A articulação entre gestão do conhecimento, sucessão, formação, inovação e desenvolvimento de competências fortalece resultados institucionais.',
    'Identidade': 'Missão, visão, valores e objetivos estratégicos do INPI orientam as práticas de Gestão do Conhecimento com alinhamento institucional e foco em valor público.',
    'Estrutura': 'Competências regimentais e estrutura organizacional sustentam o mapeamento de conhecimentos essenciais e críticos por unidade.',
    'Referências': 'Referenciais de governança e gestão orientam a maturidade institucional e sustentam a Gestão do Conhecimento no INPI.',
    'Liderança': 'Conhecimentos de liderança mobilizam equipes, promovem aprendizagem contínua e consolidam uma cultura de compartilhamento do conhecimento.',
    'Transversalidade': 'Conhecimentos transversais viabilizam colaboração, integração entre áreas e atuação orientada a resultados no serviço público.',
    'Técnica': 'Conhecimentos técnicos especializados, organizados por níveis e temas, apoiam a qualificação das atividades finalísticas e de suporte do Instituto.',
    'Mapa': 'Mapa editável de conhecimentos de apoio, essenciais e críticos, com métricas rastreáveis e persistência simples para apoiar a gestão contínua.',
    'Detentores': 'Consulta estruturada aos detentores de conhecimento do INPI com base em capacitações e dados funcionais para apoiar alocação e sucessão.',
    'Planejamento': 'Necessidades de conhecimento convertem-se em ações de desenvolvimento com alinhamento ao planejamento institucional e à viabilidade orçamentária.',
    'Autodesenvolvimento': 'Protagonismo do servidor no desenvolvimento contínuo amplia competências estratégicas com incentivo institucional.',
    'Rastreamento': 'Levantamento e análise de conhecimentos essenciais e críticos identificam lacunas e subsidiam decisões de desenvolvimento.',
    'Instrumentos': 'Ferramentas institucionais sustentam a identificação, o desenvolvimento, a retenção, a proteção e o uso do conhecimento organizacional.',
    'Monitoramento': 'Indicadores estruturados acompanham desempenho e impacto da Gestão do Conhecimento, favorecendo avaliação contínua e melhoria de resultados.',
    'Documentação': 'Registro institucional de minutas, documentos de referência e contribuições técnicas para consolidação de políticas e iniciativas do INPI.'
};

const moduleKickerTexts: Record<string, string> = {
    'Início': 'VISÃO GERAL DO PORTAL',
    'Metodologia': 'DESENVOLVIMENTO METODOLÓGICO',
    'Integração': 'ARTICULAÇÃO INSTITUCIONAL',
    'Identidade': 'DIRECIONAMENTO ESTRATÉGICO',
    'Estrutura': 'COMPETÊNCIAS REGIMENTAIS',
    'Referências': 'GOVERNANÇA E MATURIDADE',
    'Liderança': 'CONHECIMENTO PARA LIDERANÇA',
    'Transversalidade': 'CONHECIMENTO TRANSVERSAL',
    'Técnica': 'CONHECIMENTO ESPECIALIZADO',
    'Mapa': 'MÉTRICAS E REFINAMENTO',
    'Detentores': 'CAPITAL INTELECTUAL INSTALADO',
    'Planejamento': 'PLANO DE DESENVOLVIMENTO',
    'Autodesenvolvimento': 'PROTAGONISMO DO SERVIDOR',
    'Rastreamento': 'MAPEAMENTO DE CONHECIMENTO',
    'Instrumentos': 'FERRAMENTAS INSTITUCIONAIS',
    'Monitoramento': 'INDICADORES E RESULTADOS',
    'Documentação': 'REPOSITÓRIO INSTITUCIONAL'
};

const MainContent: React.FC<MainContentProps> = ({ activeModule, onModuleSelect }) => {
    const introText = moduleIntroTexts[activeModule] || moduleIntroTexts['Início'];
    const kickerText = moduleKickerTexts[activeModule] || moduleKickerTexts['Início'];
    const shouldRenderSharedIntro = activeModule !== 'Início' && activeModule !== 'Documentação';

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
            case 'Metodologia':
                return <Metodologia />;
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
            case 'Mapa':
                return <Mapa />;
            case 'Detentores':
                return <Detentores />;
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
            case 'Documentação':
                return <Documentacao />;
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
