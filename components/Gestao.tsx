import React, { useState, useEffect, useMemo } from 'react';
import Papa from "papaparse";

// --- Interfaces para Tipagem dos Dados ---
interface MegData {
  Fundamento: string;
  Conceito: string;
  Tema: string;
  Subtema: string;
}

interface IesgoData {
  Tema_Niv_1: string;
  Tema_Niv_2: string;
  Tema_Niv_3: string;
  Tema_Niv_4: string;
}

// --- Componente Reutilizável para Itens de Seleção ---
const SelectionItem: React.FC<{
    label: string;
    isSelected: boolean;
    onClick: () => void;
}> = ({ label, isSelected, onClick }) => (
    <div
        onClick={onClick}
        className={`flex items-start p-3 w-full text-sm font-medium text-left rounded-lg cursor-pointer transition-all duration-200 ${
            isSelected
                ? 'bg-orange-600 text-white shadow-md'
                : 'text-gray-300 bg-slate-700/50 hover:bg-slate-700'
        }`}
    >
        <div className={`w-4 h-4 flex-shrink-0 mr-3 mt-0.5 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-orange-200 bg-orange-600' : 'border-slate-500'}`}>
            {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
        </div>
        <span>{label}</span>
    </div>
);


// --- Subcomponente para o Sistema de Correlação do MEG ---
const MegCorrelationSystem: React.FC = () => {
    const [data, setData] = useState<MegData[]>([]);
    const [selectedFundamento, setSelectedFundamento] = useState<string | null>(null);
    const [selectedTema, setSelectedTema] = useState<string | null>(null);

    useEffect(() => {
        // Busca e processa os dados do CSV para o MEG
        Papa.parse<MegData>("https://dmenezes007.github.io/pgc-inpi/src/files/docs/meg.csv", {
            download: true, header: true, delimiter: ";", skipEmptyLines: true,
            complete: (results) => setData(results.data),
        });
    }, []);

    const { fundamentos, conceito } = useMemo(() => {
        const uniqueFundamentos = [...new Map(data.map(item => [item.Fundamento, item])).values()];
        const activeConceito = uniqueFundamentos.find(f => f.Fundamento === selectedFundamento)?.Conceito;
        return { fundamentos: uniqueFundamentos.map(f => f.Fundamento), conceito: activeConceito };
    }, [data, selectedFundamento]);

    const temas = useMemo(() => selectedFundamento ? [...new Set(data.filter(item => item.Fundamento === selectedFundamento).map(item => item.Tema))] : [], [data, selectedFundamento]);
    const subtemas = useMemo(() => selectedTema ? [...new Set(data.filter(item => item.Tema === selectedTema && item.Fundamento === selectedFundamento).map(item => item.Subtema))] : [], [data, selectedTema, selectedFundamento]);

    return (
        <div className="mt-8 pt-6 border-t border-slate-700">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Coluna Fundamento e Conceito */}
                <div className="space-y-4">
                    <h4 className="font-semibold text-gray-200">Fundamento</h4>
                    <div className="space-y-2">
                        {fundamentos.map(f => (
                            <SelectionItem key={f} label={f} isSelected={selectedFundamento === f} onClick={() => { setSelectedFundamento(f); setSelectedTema(null); }} />
                        ))}
                    </div>
                    {conceito && <p className="mt-3 text-sm text-gray-400 p-3 bg-slate-900/50 rounded-md border border-slate-700">{conceito}</p>}
                </div>
                {/* Coluna Tema */}
                <div className={`space-y-4 transition-opacity duration-300 ${selectedFundamento ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
                    <h4 className="font-semibold text-gray-200">Tema</h4>
                    <div className="space-y-2">
                        {temas.map(t => (
                            <SelectionItem key={t} label={t} isSelected={selectedTema === t} onClick={() => setSelectedTema(t)} />
                        ))}
                    </div>
                </div>
                {/* Coluna Subtema */}
                <div className={`space-y-4 transition-opacity duration-300 ${selectedTema ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
                    <h4 className="font-semibold text-gray-200">Subtema</h4>
                    <div className="space-y-2">
                         {subtemas.map(st => (
                            <div key={st} className="flex items-start text-gray-300 p-3 bg-slate-900/50 rounded-md">
                                <svg className="w-4 h-4 mr-3 mt-0.5 flex-shrink-0 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                <span>{st}</span>
                            </div>
                         ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Subcomponente para o Sistema de Correlação do iESGo ---
const IesgoCorrelationSystem: React.FC = () => {
    const [data, setData] = useState<IesgoData[]>([]);
    const [niv1, setNiv1] = useState<string | null>(null);
    const [niv2, setNiv2] = useState<string | null>(null);
    const [niv3, setNiv3] = useState<string | null>(null);

    useEffect(() => {
        // Busca e processa os dados do CSV para o iESGo
        Papa.parse<IesgoData>("https://dmenezes007.github.io/pgc-inpi/src/files/docs/iesgo.csv", {
            download: true, header: true, delimiter: ";", skipEmptyLines: true,
            complete: (results) => setData(results.data),
        });
    }, []);

    const optionsNiv1 = useMemo(() => [...new Set(data.map(item => item.Tema_Niv_1))], [data]);
    const optionsNiv2 = useMemo(() => niv1 ? [...new Set(data.filter(item => item.Tema_Niv_1 === niv1).map(item => item.Tema_Niv_2))] : [], [data, niv1]);
    const optionsNiv3 = useMemo(() => niv2 ? [...new Set(data.filter(item => item.Tema_Niv_2 === niv2).map(item => item.Tema_Niv_3))] : [], [data, niv2]);
    const optionsNiv4 = useMemo(() => niv3 ? [...new Set(data.filter(item => item.Tema_Niv_3 === niv3).map(item => item.Tema_Niv_4))] : [], [data, niv3]);

    const createClickHandler = (level: number, value: string) => () => {
        if (level === 1) { setNiv1(value); setNiv2(null); setNiv3(null); }
        if (level === 2) { setNiv2(value); setNiv3(null); }
        if (level === 3) { setNiv3(value); }
    };
    
    return (
        <div className="mt-8 pt-6 border-t border-slate-700">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Nível 1 */}
                <div className="space-y-4"><h4 className="font-semibold text-gray-200">Nível 1</h4><div className="space-y-2">{optionsNiv1.map(o => <SelectionItem key={o} label={o} isSelected={niv1 === o} onClick={createClickHandler(1, o)} />)}</div></div>
                {/* Nível 2 */}
                <div className={`space-y-4 transition-opacity duration-300 ${niv1 ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}><h4 className="font-semibold text-gray-200">Nível 2</h4><div className="space-y-2">{optionsNiv2.map(o => <SelectionItem key={o} label={o} isSelected={niv2 === o} onClick={createClickHandler(2, o)} />)}</div></div>
                {/* Nível 3 */}
                <div className={`space-y-4 transition-opacity duration-300 ${niv2 ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}><h4 className="font-semibold text-gray-200">Nível 3</h4><div className="space-y-2">{optionsNiv3.map(o => <SelectionItem key={o} label={o} isSelected={niv3 === o} onClick={createClickHandler(3, o)} />)}</div></div>
                {/* Nível 4 */}
                <div className={`space-y-4 transition-opacity duration-300 ${niv3 ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}><h4 className="font-semibold text-gray-200">Nível 4</h4><div className="space-y-2">{optionsNiv4.map(o => <div key={o} className="flex items-start text-gray-300 p-3 bg-slate-900/50 rounded-md"><svg className="w-4 h-4 mr-3 mt-0.5 flex-shrink-0 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg><span>{o}</span></div>)}</div></div>
            </div>
        </div>
    );
};

// --- Componente Principal 'Gestao' (Estrutura Intacta) ---
const Gestao: React.FC = () => {
    const [activeTab, setActiveTab] = useState('meg');
    const tabs = [
        { id: 'meg', title: 'Modelo de Excelência da Gestão (MEG/FNQ)' },
        { id: 'iesgo', title: 'Levantamento de Governança (iESGo/TCU)' },
    ];

    return (
        <div>
            <h1 className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-400">Gestão</h1>
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
                                key={tab.id} onClick={() => setActiveTab(tab.id)}
                                className={`${activeTab === tab.id ? 'border-orange-500 text-orange-400' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'} whitespace-nowrap py-4 px-2 border-b-2 font-medium text-sm sm:text-base transition-colors duration-200`}
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
                             <p className="text-gray-300">O <span className="font-semibold text-white">Modelo de Excelência da Gestão® (MEG)</span> da Fundação Nacional da Qualidade (FNQ) serve como um referencial para a maturidade da gestão. No contexto do conhecimento, ele nos orienta a estruturar processos que abrangem desde a <span className="text-orange-400 font-serif-highlight">gestão do conhecimento e da informação</span> até a <span className="text-orange-400 font-serif-highlight">gestão da inovação</span>, garantindo que o aprendizado organizacional seja contínuo e gere valor para a sociedade.</p>
                             <MegCorrelationSystem />
                        </div>
                    )}
                    {activeTab === 'iesgo' && (
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold text-gray-200">iESGo - TCU</h3>
                            <p className="text-gray-300">O <span className="font-semibold text-white">Levantamento de Governança, Sustentabilidade e Gestão (iESGo)</span>, do Tribunal de Contas da União (TCU), avalia a capacidade das organizações públicas em gerar resultados. A gestão do conhecimento é um pilar essencial neste modelo, pois impacta diretamente a <span className="text-orange-400 font-serif-highlight">capacidade de planejamento</span>, a <span className="text-orange-400 font-serif-highlight">tomada de decisão baseada em evidências</span> e a <span className="text-orange-400 font-serif-highlight">transparência</span> das nossas ações, fortalecendo a governança e a entrega de valor público.</p>
                            <IesgoCorrelationSystem />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Gestao;