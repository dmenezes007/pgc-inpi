import React, { useState } from 'react';

// --- AccordionItem sub-component (from Transversalidade.tsx) ---
const AccordionItem = ({ title, description, isOpen, onClick }: { title: string; description: string; isOpen: boolean; onClick: () => void; }) => (
  <div className="border-b border-slate-700 last:border-b-0">
    <h2>
      <button
        type="button"
        className="flex items-center justify-between w-full p-5 font-medium text-left text-gray-200 hover:bg-slate-700/50 transition-colors duration-200"
        onClick={onClick}
        aria-expanded={isOpen}
      >
        <span className="flex items-center text-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-4 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
            {title}
        </span>
        <svg className={`w-6 h-6 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
      </button>
    </h2>
    <div className={`transition-all duration-500 ease-in-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'} grid`}>
        <div className="overflow-hidden">
            <div className="p-5 border-t border-slate-700/50">
                <p className="text-gray-300">{description}</p>
            </div>
        </div>
    </div>
  </div>
);


const Monitoramento: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'desempenho' | 'impacto'>('desempenho');
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  const handleAccordionToggle = (id: string) => {
      setOpenAccordion(openAccordion === id ? null : id);
  };

  const desempenhoIndicators = [
    { title: "Percentual de Unidades com Conhecimentos Essenciais e Críticos Mapeados", description: "Mede o avanço do mapeamento em relação ao total da instituição" },
    { title: "Número de Mapas de Conhecimento (Taxonomias) Criados e Validados", description: "Quantifica a estruturação formal do conhecimento" },
    { title: "Percentual de Conhecimentos Críticos com Detentores (Especialistas) Formalmente Identificados", description: "Mede o progresso da definição e identificação das 'pessoas detentoras'" },
    { title: "Grau de Maturidade do Diagnóstico de Gestão do Conhecimento", description: "Apura o percentual de execução ou nota de maturidade baseada no diagnóstico inicial" },
    { title: "Número de Comunidades de Prática e de Interações de Gestão do Conhecimento Ativas", description: "Mede a existência de ambientes e redes de troca" },
    { title: "Taxa de Engajamento nas Comunidades de Prática de Gestão do Conhecimento", description: "Apura o percentual de membros ativos, número de campanhas e reuniões" },
    { title: "Número de Lições Aprendidas Registradas", description: "Quantifica a geração de conhecimento com base na experiência" },
    { title: "Percentual de Aderência do Plano de Capacitação aos Conhecimentos Essenciais e Críticos Mapeados", description: "Mede a conexão entre treinamentos e necessidades estratégicas" },
    { title: "Percentual de Conhecimentos Essenciais e Críticos Armazenados em Repositórios Oficiais de Conhecimento", description: "Mede o progresso da implementação de formas de armazenamento" },
    { title: "Taxa de Atualização dos Conteúdos de Conhecimento", description: "Apura o percentual de documentos revisados no último ano" },
    { title: "Número de Ações de Reconhecimento Implementadas", description: "Quantifica as ações para valorizar os detentores de conhecimento" },
    { title: "Taxa de Acesso aos Repositórios Oficiais de Conhecimento", description: "Mede o número de visualizações, downloads e pesquisas" },
    { title: "Taxa de Participação em Eventos de Disseminação do Conhecimento", description: "Mede o compartilhamento dos conhecimentos" },
  ];

  const impactoIndicators = [
    { title: "Índice de Risco de Perda de Conhecimento", description: "Mede o cruzamento da criticidade do conhecimento com o risco de saída dos seus detentores" },
    { title: "Percentual de Alinhamento dos Conhecimentos Essenciais e Críticos Identificados com os Objetivos Estratégicos", description: "Garante o foco da Gestão do Conhecimento no que importa à consecução da missão e visão institucionais" },
    { title: "Redução do Tempo Médio para Localização de Especialistas", description: "Mede a agilidade em encontrar a pessoa certa para uma nova demanda ou projeto" },
    { title: "Percentual de Lições Aprendidas Aplicadas a Novos Projetos", description: "Mede se o conhecimento gerado está sendo de fato utilizado para evitar erros ou replicar acertos" },
    { title: "Aumento no Índice de Inovação", description: "Quantifica o número de novas soluções, melhorias de processo ou projetos implementados a partir das redes de conhecimento" },
    { title: "Redução da Taxa de Turnover de Talentos-Chave", description: "Mede a eficácia da retenção de pessoas, evitando a rotatividade" },
    { title: "Redução do Tempo de Onboarding de Novos Servidores e Colaboradores", description: "Mede a aceleração da integração e ambientação a partir da capacidade de retenção do conhecimento" },
    { title: "Índice de Conhecimento Salvo", description: "Apura o percentual de conhecimento essencial e crítico de egressos da instituição mantido retido" },
    { title: "Redução do Tempo Médio de Solução de Problemas", description: "Indica o quanto as pessoas estão encontrando as respostas que precisam mais rapidamente" },
    { title: "Redução da Taxa de Retrabalho ou de Erros Recorrentes", description: "Demonstra o quanto o conhecimento está sendo aplicado na prática" },
    { title: "Aumento da Produtividade em Processos-Chave", description: "Quantifica a melhoria nos indicadores de negócio que dependem do conhecimento aplicado" },
  ];

  const tabs = [
      { id: 'desempenho', title: 'Indicadores de Desempenho' },
      { id: 'impacto', title: 'Indicadores de Impacto' },
  ];

  const renderContent = () => {
    const indicators = activeTab === 'desempenho' ? desempenhoIndicators : impactoIndicators;
    return (
        <div id="accordion-monitoramento" className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
            {indicators.map(indicator => (
                <AccordionItem
                    key={indicator.title}
                    title={indicator.title}
                    description={indicator.description}
                    isOpen={openAccordion === indicator.title}
                    onClick={() => handleAccordionToggle(indicator.title)}
                />
            ))}
        </div>
    );
  };

  return (
    <div>
      <h1 className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-400">
        Monitoramento
      </h1>

      <div className="bg-slate-800 p-6 rounded-lg shadow-lg mb-10 border border-slate-700">
          <p className="text-lg leading-relaxed text-gray-300">
            A definição de indicadores é uma etapa <span className="text-orange-400 font-serif-highlight">crucial</span> para transformar a Gestão do Conhecimento de um conceito abstrato em uma <span className="text-orange-400 font-serif-highlight">prática gerenciável</span> e com <span className="text-orange-400 font-serif-highlight">resultados mensuráveis</span>.
          </p>
      </div>

      <div className="w-full">
          <div className="border-b border-slate-700">
              <nav className="-mb-px flex space-x-6 overflow-x-auto flex-nowrap" aria-label="Tabs">
                  {tabs.map(tab => (
                      <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id as 'desempenho' | 'impacto')}
                          className={`${
                              activeTab === tab.id
                                  ? 'border-orange-500 text-orange-400'
                                  : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'
                          } whitespace-nowrap py-4 px-2 border-b-2 font-medium text-sm sm:text-base transition-colors duration-200`}
                      >
                          {tab.title}
                      </button>
                  ))}
              </nav>
          </div>
          <div className="py-6">
              {renderContent()}
          </div>
      </div>
    </div>
  );
};

export default Monitoramento;
