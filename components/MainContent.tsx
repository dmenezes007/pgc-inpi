
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
    'Metodologia': 'A metodologia da Gestão do Conhecimento no INPI combina diagnóstico organizacional, priorização de conhecimentos, estruturação de instrumentos e ciclos de revisão contínua, com foco em governança, rastreabilidade e efetividade institucional.',
    'Integração': 'A articulação entre gestão do conhecimento, sucessão, formação, inovação e desenvolvimento de competências fortalece resultados institucionais.',
    'Identidade': 'Missão, visão, valores e objetivos estratégicos do INPI orientam as práticas de Gestão do Conhecimento com alinhamento institucional e foco em valor público.',
    'Estrutura': 'Competências regimentais e estrutura organizacional sustentam o mapeamento de conhecimentos essenciais e críticos por unidade.',
    'Referências': 'Referenciais de governança e gestão orientam a maturidade institucional e sustentam a Gestão do Conhecimento no INPI.',
    'Liderança': 'Conhecimentos de liderança mobilizam equipes, promovem aprendizagem contínua e consolidam uma cultura de compartilhamento do conhecimento.',
    'Transversalidade': 'Conhecimentos transversais viabilizam colaboração, integração entre áreas e atuação orientada a resultados no serviço público.',
    'Técnica': 'Conhecimentos técnicos especializados, organizados por níveis e temas, apoiam a qualificação das atividades finalísticas e de suporte do Instituto.',
    'Mapa': 'Mapeamento de conhecimentos de apoio, essenciais e críticos, com inserção de dados gerenciais e persistência simples para apoiar a gestão contínua.',
    'Detentores': 'Pesquisa estruturada de detentores de conhecimento no âmbito institucional, combinando registros de capacitações e dados funcionais para apoiar consulta, mobilização e sucessão.',
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
    'Detentores': 'DETENTORES DE CONHECIMENTO',
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
                {activeModule === 'Metodologia' && (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5 rounded-xl border border-orange-200 bg-orange-50 mb-8">
                        <div className="flex-1">
                            <p className="text-sm font-semibold text-orange-800 mb-1">Guia Metodológico de Implementação</p>
                            <p className="text-sm text-orange-700 leading-relaxed">
                                Documento de referência para a Gestão do Conhecimento no INPI que estabelece diretrizes,
                                conceitos, papéis, critérios e procedimentos para orientar, com unidade conceitual,
                                todo o ciclo de inovação e aprendizagem organizacional, da captação de ideias à
                                priorização, implementação, monitoramento e ampliação em escala. Sua aplicação
                                estrutura responsabilidades, reduz assimetrias entre áreas e fortalece decisões
                                baseadas em evidências, assegurando rastreabilidade das ações e geração de valor
                                público mensurável ao longo do tempo.
                            </p>
                        </div>
                        <a
                            href="https://dmenezes007.github.io/pgi-inpi/files/docs/guia-motodologico.md"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm text-white bg-purple-600 hover:bg-purple-700 transition-colors duration-200 whitespace-nowrap"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            Acessar o Guia Metodológico
                        </a>
                    </div>
                )}
                {activeModule === 'Mapa' && (
                    <div className="bg-slate-800 p-6 rounded-lg shadow-lg mb-10 border border-slate-700">
                        <p className="text-base leading-relaxed !text-[#334155] mb-5">
                            O Mapa de Conhecimentos é preenchido em fluxo único por unidade para registrar prioridades,
                            lacunas e grau de domínio com rastreabilidade gerencial.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-3">
                            <div className="rounded-lg border border-slate-600 bg-slate-900/40 p-3 text-sm [border-color:var(--gov-blue)!important] [background-color:#ffffff!important] !text-slate-700 !border-0 !text-white [background-color:var(--gov-blue)!important] [color:#ffffff!important]">
                                <p className="text-xs !text-white font-semibold mb-1">PASSO 1</p>
                                Unidade
                            </div>
                            <div className="rounded-lg border border-slate-600 bg-slate-900/40 p-3 text-sm [border-color:var(--gov-blue)!important] [background-color:#ffffff!important] !text-slate-700 !border-0 !text-white [background-color:var(--gov-blue)!important] [color:#ffffff!important]">
                                <p className="text-xs !text-white font-semibold mb-1">PASSO 2</p>
                                Natureza do Conhecimento
                            </div>
                            <div className="rounded-lg border border-slate-600 bg-slate-900/40 p-3 text-sm [border-color:var(--gov-blue)!important] [background-color:#ffffff!important] !text-slate-700 !border-0 !text-white [background-color:var(--gov-blue)!important] [color:#ffffff!important]">
                                <p className="text-xs !text-white font-semibold mb-1">PASSO 3</p>
                                Conhecimento Aplicável
                            </div>
                            <div className="rounded-lg border border-slate-600 bg-slate-900/40 p-3 text-sm [border-color:var(--gov-blue)!important] [background-color:#ffffff!important] !text-slate-700 !border-0 !text-white [background-color:var(--gov-blue)!important] [color:#ffffff!important]">
                                <p className="text-xs !text-white font-semibold mb-1">PASSO 4</p>
                                Tipo de Conhecimento
                            </div>
                            <div className="rounded-lg border border-slate-600 bg-slate-900/40 p-3 text-sm [border-color:var(--gov-blue)!important] [background-color:#ffffff!important] !text-slate-700 !border-0 !text-white [background-color:var(--gov-blue)!important] [color:#ffffff!important]">
                                <p className="text-xs !text-white font-semibold mb-1">PASSO 5</p>
                                Relevância do Conhecimento
                            </div>
                            <div className="rounded-lg border border-slate-600 bg-slate-900/40 p-3 text-sm [border-color:var(--gov-blue)!important] [background-color:#ffffff!important] !text-slate-700 !border-0 !text-white [background-color:var(--gov-blue)!important] [color:#ffffff!important]">
                                <p className="text-xs !text-white font-semibold mb-1">PASSO 6</p>
                                Grau de Conhecimento Instalado
                            </div>
                        </div>
                    </div>
                )}
                {renderContent()}
            </div>
        </main>
    );
};

export default MainContent;
