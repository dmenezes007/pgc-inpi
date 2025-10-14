
import React from 'react';

const competencies = [
  { title: "Comunicação", description: "Expressar ideias de forma clara, objetiva e acessível, tanto na forma escrita quanto oral, adaptando a linguagem aos diferentes públicos." },
  { title: "Trabalho em Equipe", description: "Colaborar com os pares, compartilhando conhecimentos e responsabilidades para o alcance de objetivos comuns." },
  { title: "Orientação ao Cidadão", description: "Atuar com foco nas necessidades dos usuários dos serviços públicos, buscando sempre a melhoria da qualidade do atendimento." },
  { title: "Visão Sistêmica", description: "Compreender a organização como um todo, reconhecendo a interdependência entre as áreas e o impacto de suas ações." },
  { title: "Inovação", description: "Buscar novas formas de realizar o trabalho, propondo melhorias e soluções criativas para os desafios do dia a dia." },
  { title: "Comprometimento com o Resultado", description: "Atuar com foco no alcance das metas e objetivos institucionais, com responsabilidade e proatividade." }
];

const Transversalidade: React.FC = () => {
    return (
        <div>
            <h1 className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-400">
                Transversalidade
            </h1>
            <div className="bg-slate-800 p-6 rounded-lg shadow-lg mb-10 border border-slate-700">
                <p className="text-lg leading-relaxed text-gray-300">
                    As competências transversais são a base para uma <span className="text-orange-400 font-serif-highlight">atuação integrada e eficiente</span> no serviço público. Elas permeiam todas as áreas e níveis da organização, sendo essenciais para a <span className="text-orange-400 font-serif-highlight">colaboração</span>, o compartilhamento de conhecimento e o <span className="text-orange-400 font-serif-highlight">desenvolvimento de uma cultura organizacional</span> coesa e orientada a resultados.
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

export default Transversalidade;
