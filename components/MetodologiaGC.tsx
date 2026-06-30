import React from 'react';

const MetodologiaGC: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="module-intro">
        <div className="module-kicker">DESENVOLVIMENTO METODOLÓGICO</div>
        <p className="module-lead">
          A metodologia da Gestão do Conhecimento no INPI combina diagnóstico organizacional,
          priorização de conhecimentos, estruturação de instrumentos e ciclos de revisão contínua,
          com foco em governança, rastreabilidade e efetividade institucional.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="module-card">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">1. Diagnóstico Estruturado</h3>
          <p className="text-sm text-slate-700 leading-relaxed">
            Levantamento dos conhecimentos por unidade, identificação de lacunas e classificação em apoio,
            essencial e crítico para orientar prioridades institucionais.
          </p>
        </div>

        <div className="module-card">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">2. Priorização e Critérios</h3>
          <p className="text-sm text-slate-700 leading-relaxed">
            Definição de critérios objetivos de relevância, risco e impacto para apoiar decisões de retenção,
            desenvolvimento e compartilhamento do conhecimento.
          </p>
        </div>

        <div className="module-card">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">3. Instrumentação</h3>
          <p className="text-sm text-slate-700 leading-relaxed">
            Desdobramento metodológico em mapas, trilhas e mecanismos de monitoramento, garantindo
            rastreabilidade das ações e padronização de execução entre unidades.
          </p>
        </div>

        <div className="module-card">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">4. Evolução Contínua</h3>
          <p className="text-sm text-slate-700 leading-relaxed">
            Revisões periódicas das métricas e dos conhecimentos priorizados, com incorporação de evidências
            de uso e resultados para melhoria contínua da GC no Instituto.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5 rounded-xl border border-orange-200 bg-orange-50">
        <div className="flex-1">
          <p className="text-sm font-semibold text-orange-800 mb-1">Direcionador Metodológico</p>
          <p className="text-sm text-orange-700">
            Esta primeira versão metodológica estabelece uma base prática para consolidar a gestão do
            conhecimento no INPI com transparência, governança e foco em resultados verificáveis.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MetodologiaGC;
