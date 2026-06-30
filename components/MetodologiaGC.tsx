import React from 'react';

const MetodologiaGC: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="module-card rounded-2xl border border-orange-100 bg-gradient-to-br from-white to-orange-50/70 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
          <h3 className="text-lg font-bold text-slate-900 mb-2">1. Diagnóstico Estruturado</h3>
          <p className="text-sm text-slate-700 leading-relaxed">
            Levantamento dos conhecimentos por unidade, identificação de lacunas e classificação em apoio,
            essencial e crítico para orientar prioridades institucionais.
          </p>
        </div>

        <div className="module-card rounded-2xl border border-orange-100 bg-gradient-to-br from-white to-orange-50/70 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
          <h3 className="text-lg font-bold text-slate-900 mb-2">2. Priorização e Critérios</h3>
          <p className="text-sm text-slate-700 leading-relaxed">
            Definição de critérios objetivos de relevância, risco e impacto para apoiar decisões de retenção,
            desenvolvimento e compartilhamento do conhecimento.
          </p>
        </div>

        <div className="module-card rounded-2xl border border-orange-100 bg-gradient-to-br from-white to-orange-50/70 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
          <h3 className="text-lg font-bold text-slate-900 mb-2">3. Instrumentação</h3>
          <p className="text-sm text-slate-700 leading-relaxed">
            Desdobramento metodológico em mapas, trilhas e mecanismos de monitoramento, garantindo
            rastreabilidade das ações e padronização de execução entre unidades.
          </p>
        </div>

        <div className="module-card rounded-2xl border border-orange-100 bg-gradient-to-br from-white to-orange-50/70 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
          <h3 className="text-lg font-bold text-slate-900 mb-2">4. Evolução Contínua</h3>
          <p className="text-sm text-slate-700 leading-relaxed">
            Revisões periódicas das métricas e dos conhecimentos priorizados, com incorporação de evidências
            de uso e resultados para melhoria contínua da GC no Instituto.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MetodologiaGC;
