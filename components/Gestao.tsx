
import React, { useState } from 'react';

const Gestao: React.FC = () => {
    const [activeTab, setActiveTab] = useState('meg');

    const tabs = [
        { id: 'meg', title: 'Modelo de Excelência da Gestão (MEG/FNQ)' },
        { id: 'iesgo', title: 'Levantamento de Governança (iESGo/TCU)' },
    ];

    return (
        <div>
            <h1 className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-400">
                Gestão
            </h1>
            <div className="bg-slate-800 p-6 rounded-lg shadow-lg mb-10 border border-slate-700">
                <p className="text-lg leading-relaxed text-gray-300">
                    A gestão do conhecimento no INPI é orientada por <span className="text-orange-400 font-serif-highlight">modelos de referência</span> que estruturam as cadeias de conhecimento e guiam a excelência organizacional. Estes frameworks asseguram o alinhamento das práticas de conhecimento com as <span className="text-orange-400 font-serif-highlight">melhores práticas de governança e gestão</span>.
                </p>
            </div>
            <div className="w-full">
                <div className="border-b border-slate-700">
                    <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
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
                <div className="py-6 bg-slate-800/50 mt-4 rounded-lg p-6 border border-slate-700">
                    {activeTab === 'meg' && (
                        <div className="space-y-4">
                             <h3 className="text-xl font-semibold text-gray-200">MEG - FNQ</h3>
                             <p className="text-gray-300">
                                O <span className="font-semibold text-white">Modelo de Excelência da Gestão® (MEG)</span> da Fundação Nacional da Qualidade (FNQ) serve como um referencial para a maturidade da gestão. No contexto do conhecimento, ele nos orienta a estruturar processos que abrangem desde a <span className="text-orange-400 font-serif-highlight">gestão do conhecimento e da informação</span> até a <span className="text-orange-400 font-serif-highlight">gestão da inovação</span>, garantindo que o aprendizado organizacional seja contínuo e gere valor para a sociedade.
                             </p>
                        </div>
                    )}
                    {activeTab === 'iesgo' && (
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold text-gray-200">iESGo - TCU</h3>
                            <p className="text-gray-300">
                                O <span className="font-semibold text-white">Levantamento de Governança, Sustentabilidade e Gestão (iESGo)</span>, do Tribunal de Contas da União (TCU), avalia a capacidade das organizações públicas em gerar resultados. A gestão do conhecimento é um pilar essencial neste modelo, pois impacta diretamente a <span className="text-orange-400 font-serif-highlight">capacidade de planejamento</span>, a <span className="text-orange-400 font-serif-highlight">tomada de decisão baseada em evidências</span> e a <span className="text-orange-400 font-serif-highlight">transparência</span> das nossas ações, fortalecendo a governança e a entrega de valor público.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Gestao;
