import React, { useState } from 'react';

const AccordionItem = ({
  title,
  icon,
  children,
  isOpen,
  onClick,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  isOpen: boolean;
  onClick: () => void;
}) => (
  <div className="border-b border-slate-200 last:border-b-0">
    <h2>
      <button
        type="button"
        className="flex w-full items-center justify-between p-5 text-left font-medium text-slate-800 transition-colors duration-200 hover:bg-orange-50"
        onClick={onClick}
        aria-expanded={isOpen}
      >
        <span className="flex items-center text-lg">
          {icon}
          <span className="ml-4">{title}</span>
        </span>
        <svg
          className={`w-6 h-6 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>
    </h2>
    <div className={`transition-all duration-500 ease-in-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'} grid`}>
      <div className="overflow-hidden">
        <div className="border-t border-slate-200/80 p-5">
          <div className="space-y-4 leading-relaxed text-slate-700">{children}</div>
        </div>
      </div>
    </div>
  </div>
);

const MetodologiaGC: React.FC = () => {
  const [openAccordion, setOpenAccordion] = useState<string | null>('troca');

  const handleAccordionToggle = (id: string) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  return (
    <div className="space-y-8">
      <div id="accordion-metodologia-gc" className="module-card overflow-hidden p-0">
        <AccordionItem
          title="Troca de Experiências"
          isOpen={openAccordion === 'troca'}
          onClick={() => handleAccordionToggle('troca')}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5V4h-5M2 20h5V4H2m15 8H7" />
            </svg>
          }
        >
          <p>
            No dia 23 de maio de 2025 foi realizado o evento <span className="font-semibold text-slate-900">Troca de Experiências em Gestão do Conhecimento</span>, com representantes do INPI,
            da Agência Nacional de Aviação Civil (ANAC) e da Controladoria-Geral da União (CGU).
          </p>
          <p>
            O encontro teve como foco a socialização de modelos de governança, mecanismos de retenção e estratégias para integrar gestão do conhecimento,
            desenvolvimento de competências e melhoria contínua dos processos institucionais.
          </p>
        </AccordionItem>

        <AccordionItem
          title="Benchmarking em Gestão do Conhecimento"
          isOpen={openAccordion === 'benchmarking'}
          onClick={() => handleAccordionToggle('benchmarking')}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-6m4 6V7m4 10v-3M3 21h18" />
            </svg>
          }
        >
          <p>
            No período de 2 a 24 de julho de 2025 foi conduzido benchmarking nacional e internacional em gestão do conhecimento, com questionários estruturados,
            roteiro de reuniões e acompanhamento semanal do plano de trabalho conjunto entre CGRH, CQUAL e consultoria.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="rounded-xl border border-orange-100 bg-orange-50 p-4">
              <p className="text-xs uppercase tracking-wide text-orange-700">Instituições consultadas</p>
              <p className="text-2xl font-bold text-orange-900">22</p>
            </div>
            <div className="rounded-xl border border-green-100 bg-green-50 p-4">
              <p className="text-xs uppercase tracking-wide text-green-700">Respostas obtidas</p>
              <p className="text-2xl font-bold text-green-900">8</p>
            </div>
            <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
              <p className="text-xs uppercase tracking-wide text-blue-700">Taxa de retorno</p>
              <p className="text-2xl font-bold text-blue-900">36,4%</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-600">Janela de coleta</p>
              <p className="text-sm font-semibold text-slate-900">02/07 a 24/07/2025</p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="font-semibold text-slate-900 mb-2">Instituições respondentes</p>
            <p className="text-sm text-slate-700">
              ANAC, Portugal, México, Austrália, Espanha, Japão, Canadá e Europa (EUIPO e EPO).
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="font-semibold text-slate-900 mb-3">Tendências identificadas</p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs">Políticas formais de GC</span>
              <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs">Integração com capacitação</span>
              <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs">Repositórios digitais</span>
              <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs">Sucessão e retenção do conhecimento</span>
              <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs">Indicadores e monitoramento</span>
            </div>
          </div>

          <p>
            Como repercussão metodológica, o estudo reforçou no INPI a necessidade de evoluir de práticas fragmentadas para um modelo contínuo e integrado,
            baseado em governança, métricas, proteção do conhecimento crítico e mecanismos formais de transferência.
          </p>
        </AccordionItem>

        <AccordionItem
          title="Workshop sobre Gestão da Inovação e Gestão do Conhecimento"
          isOpen={openAccordion === 'workshop'}
          onClick={() => handleAccordionToggle('workshop')}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-4l-4 4v-4z" />
            </svg>
          }
        >
          <p>
            No dia 13 de outubro de 2025, a convite da Coordenação-Geral da Qualidade, foi apresentada a versão inicial do Portal da Gestão do Conhecimento
            à Presidência, Diretorias e Coordenações-Gerais, como primeiro avanço no desenvolvimento do processo.
          </p>
          <p>
            O workshop permitiu validar a arquitetura metodológica, alinhar expectativas da alta gestão e consolidar o entendimento institucional sobre o papel
            do portal como instrumento de integração entre diagnóstico, desenvolvimento, retenção e monitoramento de conhecimentos.
          </p>
        </AccordionItem>

        <AccordionItem
          title="Semana da Qualidade 2025: Pense Diferente"
          isOpen={openAccordion === 'semana'}
          onClick={() => handleAccordionToggle('semana')}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 1.567-3 3.5 0 1.437.742 2.671 1.802 3.214L10 18h4l-.802-3.286A3.64 3.64 0 0015 11.5C15 9.567 13.657 8 12 8z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2m0 14v2m9-9h-2M5 12H3m14.364 6.364l-1.414-1.414M8.05 8.05 6.636 6.636m10.728 0L15.95 8.05M8.05 15.95l-1.414 1.414" />
            </svg>
          }
        >
          <p>
            No dia 18 de novembro de 2025 foram apresentados na Semana da Qualidade do INPI os estudos desenvolvidos para a sistematização dos processos
            de gestão do conhecimento e gestão da inovação no âmbito institucional.
          </p>
          <p>
            A apresentação fortaleceu a agenda de transformação organizacional, ampliou a visibilidade do modelo metodológico em construção e consolidou
            a conexão entre qualidade, aprendizagem organizacional e geração de valor público.
          </p>
        </AccordionItem>
      </div>
    </div>
  );
};

export default MetodologiaGC;
