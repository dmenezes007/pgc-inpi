import React, { useState } from 'react';

const TabButton = ({ active, onClick, children }: { active: boolean, onClick: () => void, children: React.ReactNode }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-all duration-300
      ${active
        ? 'bg-slate-700 text-orange-400 border-b-2 border-orange-500'
        : 'text-gray-400 hover:bg-slate-800/50 hover:text-gray-200'
      }
    `}
  >
    {children}
  </button>
);

const IndicatorCard = ({ title, description }: { title: string, description: string }) => (
    <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
        <h3 className="font-bold text-orange-400">{title}</h3>
        <p className="text-gray-300 mt-1">{description}</p>
    </div>
);

const Monitoramento: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'desempenho' | 'impacto'>('desempenho');

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

  return (
    <div>
      <h1 className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-400">
        Monitoramento
      </h1>
      <p className="text-gray-400 mb-8">
        A definição de indicadores é uma etapa crucial para transformar a Gestão do Conhecimento de um conceito abstrato em uma prática gerenciável e com resultados mensuráveis.
      </p>

      <div className="border-b border-slate-700 mb-6">
        <div className="flex space-x-2">
          <TabButton active={activeTab === 'desempenho'} onClick={() => setActiveTab('desempenho')}>
            Indicadores de Desempenho
          </TabButton>
          <TabButton active={activeTab === 'impacto'} onClick={() => setActiveTab('impacto')}>
            Indicadores de Impacto
          </TabButton>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {activeTab === 'desempenho' && desempenhoIndicators.map(indicator => (
          <IndicatorCard key={indicator.title} {...indicator} />
        ))}
        {activeTab === 'impacto' && impactoIndicators.map(indicator => (
          <IndicatorCard key={indicator.title} {...indicator} />
        ))}
      </div>
    </div>
  );
};

export default Monitoramento;