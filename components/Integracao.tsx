import React from 'react';

const integrationAreas = [
  {
    icon: '👥',
    title: 'Sucessão Gerencial',
    description: 'A GC formaliza o conhecimento crítico dos gestores, criando um repositório de experiências e decisões que facilita a transição e prepara novos líderes.',
  },
  {
    icon: '🚀',
    title: 'Formação Inicial e Continuada',
    description: 'Estrutura o conhecimento essencial que novos servidores precisam e mapeia as competências a serem desenvolvidas continuamente por todos.',
  },
  {
    icon: '💡',
    title: 'Gestão da Inovação',
    description: 'Funciona como o motor da inovação, organizando o conhecimento existente para que novas ideias possam ser geradas e transformadas em projetos concretos.',
  },
  {
    icon: '🌟',
    title: 'Desenvolvimento de Competências',
    description: 'Identifica as lacunas de conhecimento (gaps) na organização e orienta os programas de capacitação para que sejam mais estratégicos e eficazes.',
  },
  {
    icon: '🌱',
    title: 'Cultura e Clima Organizacional',
    description: 'Promove uma cultura de colaboração e aprendizado contínuo, onde compartilhar conhecimento é valorizado, melhorando o clima e o engajamento.',
  },
  {
    icon: '🎯',
    title: 'Compromisso com a Estratégia',
    description: 'Assegura que o conhecimento coletivo da organização esteja alinhado e seja aplicado para alcançar os objetivos estratégicos definidos no planejamento.',
  },
];

const Integracao: React.FC = () => {
    return (
        <div>
            <div className="bg-slate-800 p-6 rounded-lg shadow-lg mb-10 border border-slate-700">
                <p className="text-lg leading-relaxed text-gray-300">
                    A Gestão do Conhecimento não é um processo isolado. Ela se fortalece e gera valor quando se <span className="text-orange-400 font-serif-highlight">integra sinergicamente</span> com outros processos-chave de gestão de pessoas e da organização, formando um <span className="text-orange-400 font-serif-highlight">ecossistema coeso e interdependente</span>.
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {integrationAreas.map((area) => (
                    <div key={area.title} className="group bg-slate-800 p-6 rounded-xl border border-slate-700 transition-all duration-300 hover:border-orange-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-orange-500/10">
                        <div className="flex items-center mb-4">
                            <div className="text-4xl mr-4 transition-transform duration-300 group-hover:scale-110">{area.icon}</div>
                            <h2 className="text-xl font-bold text-gray-200">{area.title}</h2>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed">{area.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Integracao;