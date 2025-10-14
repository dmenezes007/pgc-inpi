
import React from 'react';

const Planejamento: React.FC = () => {
    return (
        <div>
            <h1 className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-400">
                Planejamento
            </h1>
            <div className="bg-slate-800 p-8 rounded-lg shadow-lg border border-slate-700 space-y-6">
                <p className="text-lg text-gray-300 leading-relaxed">
                    O planejamento é a ferramenta que <span className="text-orange-400 font-serif-highlight">traduz as necessidades de conhecimento em ações concretas</span> de capacitação e desenvolvimento. Ele assegura que os investimentos em qualificação estejam alinhados aos <span className="text-orange-400 font-serif-highlight">objetivos estratégicos</span> e às prioridades orçamentárias do Instituto.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                    <div className="bg-slate-700/50 p-6 rounded-lg border border-slate-600">
                        <h2 className="text-xl font-semibold text-orange-400 mb-3">Plano de Desenvolvimento de Pessoas (PDP)</h2>
                        <p className="text-gray-300 text-sm">
                            O PDP é o instrumento que consolida as necessidades de desenvolvimento dos servidores do INPI para o ano seguinte. Ele é elaborado a partir de um diagnóstico das competências necessárias para o alcance dos objetivos institucionais e serve como base para todas as ações de capacitação.
                        </p>
                    </div>
                     <div className="bg-slate-700/50 p-6 rounded-lg border border-slate-600">
                        <h2 className="text-xl font-semibold text-orange-400 mb-3">Plano Interno Orçamentário de Capacitação (PIOC)</h2>
                        <p className="text-gray-300 text-sm">
                            O PIOC detalha a alocação dos recursos orçamentários para as ações de capacitação previstas no PDP. Ele garante a viabilidade financeira do planejamento, permitindo a execução de cursos, treinamentos, e outras iniciativas de desenvolvimento de forma organizada e transparente.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Planejamento;
