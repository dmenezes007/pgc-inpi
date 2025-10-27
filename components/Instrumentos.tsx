
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
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
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
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
    },
};

// --- Subcomponentes ---

const LuminousBar: React.FC<{ active: boolean; color: string; icon: React.ReactNode; title: string }> = ({ active, color, icon, title }) => {
    const baseStyle = "flex items-center justify-center h-12 w-full rounded-lg transition-all duration-300";
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

            <div className="space-y-3">
                {/* Cabeçalho para Telas Maiores */}
                <div className="hidden md:flex items-center text-sm font-semibold text-gray-400 px-4">
                    <div className="flex-grow pr-4">Instrumento</div>
                                            <div className="flex-shrink-0 grid grid-cols-6 gap-4" style={{ width: '42rem' }}>                        {categories.map(key => (
                            <div key={key} className="text-center">{categoryConfig[key].title}</div>
                        ))}
                    </div>
                </div>

                {/* Lista de Instrumentos */}
                {instrumentData.map((item, index) => (
                    <div 
                        key={index} 
                        className="bg-slate-900/70 p-4 rounded-lg border border-slate-700 flex flex-col md:flex-row md:items-center transition-colors duration-300 hover:bg-slate-800/90 hover:border-slate-600"
                    >
                        {/* Título do Instrumento */}
                        <div className="flex-grow mb-4 md:mb-0 pr-4">
                            <p className="text-white font-medium text-base">{item.name}</p>
                        </div>

                        {/* Barras Luminosas */}
                    <div className="flex-shrink-0 grid grid-cols-6 gap-4" style={{ width: '42rem' }}>
                            {categories.map(key => (
                                <div key={key}>
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
