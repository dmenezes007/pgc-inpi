
import React from 'react';

const instruments = [
    { title: 'Academia Virtual do INPI', description: 'Plataforma de ensino a distância (EAD) que oferece cursos e capacitações sobre propriedade industrial e inovação.', icon: '🎓' },
    { title: 'Portal do INPI', description: 'Principal canal de comunicação externa, oferecendo serviços, informações e transparência para a sociedade.', icon: '🌐' },
    { title: 'Intranet', description: 'Ambiente interno para comunicação, colaboração e acesso a normas, sistemas e informações para o corpo funcional.', icon: '🏢' },
    { title: 'Sistemas de TI', description: 'Conjunto de sistemas de negócio que suportam o registro e exame de direitos de PI, essenciais para a operação.', icon: '💻' },
    { title: 'Rede Institucional e INPI Drive', description: 'Infraestrutura para armazenamento, compartilhamento e colaboração em documentos e arquivos de forma segura.', icon: '💾' },
    { title: 'Comunidades de Prática', description: 'Espaços (formais ou informais) onde os colaboradores compartilham experiências, resolvem problemas e desenvolvem novas abordagens.', icon: '💬' }
];

const Instrumentos: React.FC = () => {
    return (
        <div>
            <h1 className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-400">
                Instrumentos
            </h1>
            <div className="bg-slate-800 p-6 rounded-lg shadow-lg mb-10 border border-slate-700">
                <p className="text-lg leading-relaxed text-gray-300">
                   Os instrumentos de gestão do conhecimento são as <span className="text-orange-400 font-serif-highlight">ferramentas e plataformas institucionais</span> que apoiam a <span className="text-orange-400 font-serif-highlight">identificação, desenvolvimento, retenção, proteção e utilização</span> dos conhecimentos. Cada um desempenha um papel vital no ciclo de vida do conhecimento organizacional.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {instruments.map((item, index) => (
                    <div key={index} className="group bg-slate-800 p-6 rounded-xl border border-slate-700 transition-all duration-300 hover:border-orange-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-orange-500/10">
                        <div className="flex items-center mb-4">
                            <div className="text-4xl mr-4 transition-transform duration-300 group-hover:scale-110">{item.icon}</div>
                            <h2 className="text-xl font-bold text-gray-200">{item.title}</h2>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Instrumentos;
