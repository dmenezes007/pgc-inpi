import React from 'react';

const dimensions = [
  { title: "Conhecimento Tácito", description: "Mapeamento do conhecimento prático, da experiência e das habilidades individuais que não estão formalmente documentadas.", icon: "🧠" },
  { title: "Conhecimento Explícito", description: "Levantamento de manuais, normas, relatórios, bases de dados e outros documentos que formalizam o conhecimento.", icon: "📚" },
  { title: "Conhecimentos Essenciais e Críticos", description: "Identificação do saber-fazer e das competências (técnicas, transversais e de liderança) que, se perdidos, impactam criticamente a operação e a estratégia do INPI.", icon: "⭐" },
  { title: "Lacunas de Conhecimento", description: "Análise das discrepâncias entre as competências existentes e as necessárias para os desafios futuros, orientando as ações de capacitação.", icon: "🔍" },
];

const Rastreamento: React.FC = () => {
    return (
        <div>
            <h1 className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-400">
                Rastreamento
            </h1>
            <div className="bg-slate-800 p-6 rounded-lg shadow-lg mb-10 border border-slate-700">
                <p className="text-lg leading-relaxed text-gray-300">
                    O rastreamento é o processo de <span className="text-orange-400 font-serif-highlight">levantamento geral</span> das diferentes naturezas e dimensões do conhecimento. Seu objetivo é <span className="text-orange-400 font-serif-highlight">mapear e identificar os conhecimentos essenciais e críticos</span>, bem como as <span className="text-orange-400 font-serif-highlight">lacunas de conhecimento</span> existentes na organização, servindo de base para o planejamento estratégico da gestão do conhecimento.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {dimensions.map(dim => (
                    <div key={dim.title} className="bg-slate-800 p-6 rounded-lg border border-slate-700">
                        <div className="flex items-center mb-3">
                            <span className="text-3xl mr-4">{dim.icon}</span>
                            <h2 className="text-xl font-bold text-gray-200">{dim.title}</h2>
                        </div>
                        <p className="text-gray-300 text-sm">{dim.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Rastreamento;
