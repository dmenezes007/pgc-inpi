import React from 'react';

// --- Dados e Configuração ---

const instrumentData = [
    { name: "Academia Virtual do INPI", url: "https://academiavirtual.inpi.gov.br/", conversao: true, retencao: true, utilizacao: true, compartilhamento: true, ensino: true, publicidade: false },
    { name: "Docmost e Redmine", url: "https://intranet.inpi.gov.br/index.php?view=article&id=1279:confira-a-gravacao-do-evento-sobre-as-ferramentas-docmost-e-redmine&catid=11&highlight=WyJkb2Ntb3N0Il0=", conversao: true, retencao: true, utilizacao: true, compartilhamento: true, ensino: false, publicidade: false },
    { name: "E-mail Institucional", url: "https://mail.inpi.gov.br/", conversao: true, retencao: true, utilizacao: false, compartilhamento: false, ensino: false, publicidade: false },
    { name: "INPI Drive", url: "https://inpidrive.inpi.gov.br/", conversao: true, retencao: true, utilizacao: true, compartilhamento: true, ensino: false, publicidade: false },
    { name: "Intranet do INPI", url: "https://intranet.inpi.gov.br/", conversao: true, retencao: true, utilizacao: true, compartilhamento: false, ensino: false, publicidade: true },
    { name: "Portal do INPI", url: "https://gov.br/inpi/", conversao: true, retencao: true, utilizacao: true, compartilhamento: false, ensino: false, publicidade: true },
    { name: "Rede Institucional", url: "file:///N:/", conversao: true, retencao: true, utilizacao: true, compartilhamento: true, ensino: false, publicidade: false },
    { name: "MarcasDoc", url: "http://marcasdoc.inpi.gov.br/", conversao: true, retencao: true, utilizacao: true, compartilhamento: true, ensino: false, publicidade: false },
    { name: "Sistema Eletrônico de Informações (SEI)", url: "https://sei.inpi.gov.br/", conversao: true, retencao: true, utilizacao: true, compartilhamento: true, ensino: false, publicidade: false },
    { name: "Sistema de Cadastramento da Produção (Siscap)", url: "https://siscap/adm/login.php", conversao: true, retencao: true, utilizacao: true, compartilhamento: true, ensino: false, publicidade: false },
].sort((a, b) => a.name.localeCompare(b.name));

const categoryConfig = {
    conversao: { 
        title: "Conversão", 
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>,
        activeClasses: "bg-blue-600/80 border-blue-500 text-white",
        inactiveClasses: "bg-blue-500/[.12] border-blue-200/50 text-blue-900/60",
    },
    retencao: { 
        title: "Retenção", 
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>,
        activeClasses: "bg-blue-600/80 border-blue-500 text-white",
        inactiveClasses: "bg-blue-500/[.12] border-blue-200/50 text-blue-900/60",
    },
    utilizacao: { 
        title: "Utilização", 
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.096 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
        activeClasses: "bg-blue-600/80 border-blue-500 text-white",
        inactiveClasses: "bg-blue-500/[.12] border-blue-200/50 text-blue-900/60",
    },
    compartilhamento: { 
        title: "Compartilhamento", 
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.368a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" /></svg>,
        activeClasses: "bg-blue-600/80 border-blue-500 text-white",
        inactiveClasses: "bg-blue-500/[.12] border-blue-200/50 text-blue-900/60",
    },
    ensino: { 
        title: "Ensino", 
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 14l9-5-9-5-9 5 9 5z" /><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0v6" /></svg>,
        activeClasses: "bg-blue-600/80 border-blue-500 text-white",
        inactiveClasses: "bg-blue-500/[.12] border-blue-200/50 text-blue-900/60",
    },
    publicidade: { 
        title: "Publicidade", 
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>,
        activeClasses: "bg-blue-600/80 border-blue-500 text-white",
        inactiveClasses: "bg-blue-500/[.12] border-blue-200/50 text-blue-900/60",
    },
};

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

const Instrumentos: React.FC = () => {
    const categories = Object.keys(categoryConfig) as (keyof typeof categoryConfig)[];
    const gridCols = `grid-cols-[1fr_repeat(6,9rem)]`;

    return (
        <div>
            <div className="bg-slate-800 p-6 rounded-lg shadow-lg mb-10 border border-slate-700">
                <p className="text-lg leading-relaxed text-gray-300">
                   Os instrumentos de gestão do conhecimento são as <span className="text-orange-400 font-serif-highlight">ferramentas e plataformas institucionais</span> que apoiam a <span className="text-orange-400 font-serif-highlight">identificação, desenvolvimento, retenção, proteção e utilização</span> dos conhecimentos. Cada um desempenha um papel vital no ciclo de vida do conhecimento organizacional.
                </p>
            </div>

            <div className="overflow-x-auto rounded-lg border border-blue-200 bg-blue-50/70">
                <div className="min-w-[1200px]">
                    <div className={`grid ${gridCols} gap-x-6 items-center text-sm font-semibold text-blue-900 px-4`}>
                        {/* Cabeçalho */}
                        <div className="pr-4 py-3 sticky left-0 bg-blue-50/90">Instrumento</div>
                        {categories.map(key => (
                            <div key={key} className="text-center py-3">
                                {categoryConfig[key].title}
                            </div>
                        ))}
                    </div>

                    <div className="bg-white/90">
                        {instrumentData.map((item, index) => (
                            <div 
                                key={index} 
                                className={`grid ${gridCols} gap-x-6 items-center border-t border-blue-100 hover:bg-blue-50/80 px-4`}
                            >
                                <div className="pr-4 py-2 sticky left-0 bg-white/95 hover:bg-blue-50/80">
                                    {item.url ? (
                                        <a
                                            href={item.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group inline-flex max-w-full items-center gap-2 rounded-xl border border-blue-200 bg-white px-3 py-2 text-blue-900 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-400 hover:bg-blue-50 hover:shadow-md"
                                        >
                                            <span className="truncate text-sm font-semibold sm:text-base">{item.name}</span>
                                            <span className="inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border border-blue-200 bg-blue-100/70 text-blue-700 transition-colors duration-200 group-hover:border-blue-400 group-hover:bg-blue-200/70 group-hover:text-blue-900">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 3h7m0 0v7m0-7L10 14" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 5v14h14" />
                                                </svg>
                                            </span>
                                        </a>
                                    ) : (
                                        <p className="text-blue-900 font-medium text-base">{item.name}</p>
                                    )}
                                </div>
                                {categories.map(key => (
                                    <div key={key} className="py-2">
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