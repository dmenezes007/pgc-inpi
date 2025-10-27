import React from 'react';

// --- Dados e Configuração ---

const instrumentData = [
    { name: "Academia Virtual do INPI", conversao: true, retencao: true, utilizacao: true, compartilhamento: true, ensino: true, publicidade: false },
    { name: "Portal do INPI", conversao: true, retencao: true, utilizacao: true, compartilhamento: false, ensino: false, publicidade: true },
    { name: "Intranet do INPI", conversao: true, retencao: true, utilizacao: true, compartilhamento: false, ensino: false, publicidade: true },
    { name: "Rede Institucional", conversao: true, retencao: true, utilizacao: true, compartilhamento: true, ensino: false, publicidade: false },
    { name: "INPI Drive", conversao: true, retencao: true, utilizacao: true, compartilhamento: true, ensino: false, publicidade: false },
    { name: "Redmine/Marcas Doc", conversao: true, retencao: true, utilizacao: true, compartilhamento: true, ensino: false, publicidade: false },
    { name: "Siscap (DIRPA)", conversao: true, retencao: true, utilizacao: true, compartilhamento: true, ensino: false, publicidade: false },
    { name: "E-mails", conversao: true, retencao: true, utilizacao: false, compartilhamento: false, ensino: false, publicidade: false },
    { name: "Docmost (CGTI)", conversao: true, retencao: true, utilizacao: true, compartilhamento: true, ensino: false, publicidade: false },
    { name: "Repositório Institucional (BIBLI)", conversao: true, retencao: true, utilizacao: true, compartilhamento: true, ensino: false, publicidade: true },
];

const categoryConfig = {
    conversao: { 
        title: "Conversão", 
        color: "bg-green-500", 
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18m-7 4l4 4m0 0l-4 4m4-4H3" /></svg>
    },
    retencao: { 
        title: "Retenção", 
        color: "bg-purple-500", 
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
    },
    utilizacao: { 
        title: "Utilização", 
        color: "bg-yellow-500", 
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.096 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
    },
    compartilhamento: { 
        title: "Compartilhamento", 
        color: "bg-red-500", 
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.368a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" /></svg>
    },
    ensino: { 
        title: "Ensino", 
        color: "bg-blue-500", 
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 14l9-5-9-5-9 5 9 5z" /><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0v6" /></svg>
    },
    publicidade: { 
        title: "Publicidade", 
        color: "bg-pink-500", 
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.351A1.76 1.76 0 017.166 9.74l5.223-1.654a1.76 1.76 0 001.606-2.208l-.623-1.953a1.76 1.76 0 00-2.208-1.606L11 5.882z" /></svg>
    },
};

// --- Subcomponentes ---

const LuminousBar: React.FC<{ active: boolean; color: string; icon: React.ReactNode; title: string }> = ({ active, color, icon, title }) => {
    const baseStyle = "flex items-center justify-center h-12 w-12 md:w-24 rounded-lg transition-all duration-300";
    const activeStyle = `${color} text-white shadow-lg`;
    const inactiveStyle = "bg-slate-700/50 text-slate-500";

    return (
        <div title={title} className={`${baseStyle} ${active ? activeStyle : inactiveStyle}`}>
            <div className={`transition-opacity duration-300 ${active ? 'opacity-100' : 'opacity-50'}`}>
                {icon}
            </div>
        </div>
    );
};

// --- Componente Principal ---

const Instrumentos: React.FC = () => {
    const categories = Object.keys(categoryConfig) as (keyof typeof categoryConfig)[];

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

            <div className="space-y-4">
                {/* Cabeçalho para Telas Maiores */}
                <div className="hidden md:flex items-center space-x-4 text-sm font-semibold text-gray-400 px-4 py-2">
                    <div className="flex-grow">Instrumento</div>
                    {categories.map(key => (
                        <div key={key} className="w-24 text-center">{categoryConfig[key].title}</div>
                    ))}
                </div>

                {/* Lista de Instrumentos */}
                {instrumentData.map((item, index) => (
                    <div key={index} className="bg-slate-900/70 p-4 rounded-lg border border-slate-700 flex flex-col md:flex-row md:items-center md:space-x-4">
                        {/* Título do Instrumento */}
                        <div className="flex-grow mb-4 md:mb-0">
                            <p className="text-white font-medium text-lg">{item.name}</p>
                        </div>

                        {/* Barras Luminosas */}
                        <div className="flex flex-wrap md:flex-nowrap gap-2">
                            {categories.map(key => (
                                <div key={key} className="flex-1 md:flex-auto">
                                    {/* Rótulo para Telas Pequenas */}
                                    <span className="md:hidden text-xs text-gray-400">{categoryConfig[key].title}</span>
                                    <LuminousBar
                                        active={item[key as keyof typeof item] as boolean}
                                        color={categoryConfig[key].color}
                                        icon={categoryConfig[key].icon}
                                        title={categoryConfig[key].title}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Instrumentos;