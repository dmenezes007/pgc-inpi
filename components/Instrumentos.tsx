import React from 'react';

// --- Dados e Configuração ---

const instrumentData = [
    { name: "Academia Virtual do INPI", conversao: true, retencao: true, utilizacao: true, compartilhamento: true, ensino: true, publicidade: false },
    { name: "Docmost (CGTI)", conversao: true, retencao: true, utilizacao: true, compartilhamento: true, ensino: false, publicidade: false },
    { name: "E-mails", conversao: true, retencao: true, utilizacao: false, compartilhamento: false, ensino: false, publicidade: false },
    { name: "INPI Drive", conversao: true, retencao: true, utilizacao: true, compartilhamento: true, ensino: false, publicidade: false },
    { name: "Intranet do INPI", conversao: true, retencao: true, utilizacao: true, compartilhamento: false, ensino: false, publicidade: true },
    { name: "Portal do INPI", conversao: true, retencao: true, utilizacao: true, compartilhamento: false, ensino: false, publicidade: true },
    { name: "Rede Institucional", conversao: true, retencao: true, utilizacao: true, compartilhamento: true, ensino: false, publicidade: false },
    { name: "Redmine/Marcas Doc", conversao: true, retencao: true, utilizacao: true, compartilhamento: true, ensino: false, publicidade: false },
    { name: "Repositório Institucional (BIBLI)", conversao: true, retencao: true, utilizacao: true, compartilhamento: true, ensino: false, publicidade: true },
    { name: "Siscap (DIRPA)", conversao: true, retencao: true, utilizacao: true, compartilhamento: true, ensino: false, publicidade: false },
];

const categoryConfig = {
    conversao: { 
        title: "Conversão", 
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>,
        activeClasses: "bg-green-500/75 border-green-400 text-white",
        inactiveClasses: "bg-green-500/[.15] border-transparent text-green-200/[.60]",
    },
    retencao: { 
        title: "Retenção", 
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>,
        activeClasses: "bg-purple-500/75 border-purple-400 text-white",
        inactiveClasses: "bg-purple-500/[.15] border-transparent text-purple-200/[.60]",
    },
    utilizacao: { 
        title: "Utilização", 
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.096 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
        activeClasses: "bg-yellow-500/75 border-yellow-400 text-white",
        inactiveClasses: "bg-yellow-500/[.15] border-transparent text-yellow-200/[.60]",
    },
    compartilhamento: { 
        title: "Compartilhamento", 
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.368a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" /></svg>,
        activeClasses: "bg-red-500/75 border-red-400 text-white",
        inactiveClasses: "bg-red-500/[.15] border-transparent text-red-200/[.60]",
    },
    ensino: { 
        title: "Ensino", 
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 14l9-5-9-5-9 5 9 5z" /><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0v6" /></svg>,
        activeClasses: "bg-blue-500/75 border-blue-400 text-white",
        inactiveClasses: "bg-blue-500/[.15] border-transparent text-blue-200/[.60]",
    },
    publicidade: { 
        title: "Publicidade", 
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>,
        activeClasses: "bg-pink-500/75 border-pink-400 text-white",
        inactiveClasses: "bg-pink-500/[.15] border-transparent text-pink-200/[.60]",
    },
};

// --- Subcomponentes ---

const LuminousBar: React.FC<{ active: boolean; classNames: { active: string; inactive: string }; icon: React.ReactNode; title: string }> = ({ active, classNames, icon, title }) => {
    const baseStyle = "flex items-center justify-center h-12 w-full rounded-lg transition-all duration-300 border";
    const stateStyle = active ? classNames.active : classNames.inactive;

    return (
        <div title={title} className={`${baseStyle} ${stateStyle}`}>
            <div className={`transition-opacity duration-300 ${active ? 'opacity-100' : 'opacity-40'}`}>
                {icon}
            </div>
        </div>
    );
};


// --- Componente Principal ---

const Instrumentos: React.FC = () => {
    const categories = Object.keys(categoryConfig) as (keyof typeof categoryConfig)[];
    const gridCols = `grid-cols-[1fr_repeat(6,8rem)]`;

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

            <div className="overflow-x-auto rounded-lg border border-slate-700">
                <div className="min-w-[960px]">
                    {/* Cabeçalho */}
                    <div className={`grid ${gridCols} gap-x-6 items-center bg-slate-900/70 text-sm font-semibold text-gray-400 px-4`}>
                        <div className="pr-4 py-3">Instrumento</div>
                        {categories.map(key => (
                            <div key={key} className="flex justify-center items-center py-3">
                                <span>{categoryConfig[key].title}</span>
                            </div>
                        ))}
                    </div>

                    {/* Lista de Instrumentos */}
                    <div className="space-y-2 p-2 bg-slate-800/50">
                        {instrumentData.map((item, index) => (
                            <div 
                                key={index} 
                                className={`grid ${gridCols} gap-x-6 items-center bg-slate-900/70 p-4 rounded-lg border border-transparent transition-colors duration-300 hover:bg-slate-800/90 hover:border-slate-600`}
                            >
                                <div className="pr-4">
                                    <p className="text-white font-medium text-base">{item.name}</p>
                                </div>
                                {categories.map(key => (
                                    <div key={key}>
                                        <LuminousBar
                                            active={item[key as keyof typeof item] as boolean}
                                            classNames={{ active: categoryConfig[key].activeClasses, inactive: categoryConfig[key].inactiveClasses }}
                                            icon={categoryConfig[key].icon}
                                            title={categoryConfig[key].title}
                                        />
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Instrumentos;
