
import React from 'react';

const competencies = [
  { title: "Visão de Futuro", description: "Capacidade de antever cenários, alinhar a equipe a uma visão estratégica e inspirar o compromisso com os objetivos de longo prazo." },
  { title: "Geração de Valor", description: "Foco na entrega de resultados para a sociedade, otimizando o uso de recursos e promovendo a melhoria contínua dos serviços públicos." },
  { title: "Gestão de Pessoas", description: "Habilidade de desenvolver, engajar e liderar equipes, promovendo um ambiente de trabalho colaborativo, diverso e de alta performance." },
  { title: "Gestão de Processos e Riscos", description: "Competência para gerenciar processos de forma eficiente e tomar decisões com base em riscos, garantindo a efetividade e a segurança jurídica." },
  { title: "Inovação e Mudança", description: "Abertura para novas ideias, fomento à criatividade e capacidade de conduzir processos de mudança organizacional com resiliência." },
  { title: "Colaboração e Comunicação", description: "Habilidade de construir redes, comunicar-se de forma clara e articular-se com diferentes atores para alcançar objetivos comuns." }
];

const Lideranca: React.FC = () => {
    return (
        <div>
            <h1 className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-400">
                Liderança
            </h1>
            <div className="bg-slate-800 p-6 rounded-lg shadow-lg mb-10 border border-slate-700">
                <p className="text-lg leading-relaxed text-gray-300">
                    O desenvolvimento da liderança é crucial para o sucesso da gestão do conhecimento. Este módulo apresenta as <span className="text-orange-400 font-serif-highlight">competências essenciais de liderança</span> previstas para a qualificação do serviço público federal, que capacitam nossos gestores a <span className="text-orange-400 font-serif-highlight">inspirar equipes</span> e a <span className="text-orange-400 font-serif-highlight">guiar a organização</span> em direção a uma cultura de aprendizado e inovação.
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {competencies.map((comp) => (
                    <div key={comp.title} className="bg-slate-800 p-6 rounded-lg border border-slate-700 transition-all duration-300 hover:border-orange-500 hover:-translate-y-1">
                        <h2 className="text-xl font-bold text-orange-400 mb-3">{comp.title}</h2>
                        <p className="text-gray-300 text-sm leading-relaxed">{comp.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Lideranca;
