import React, { useState, useEffect, useMemo } from 'react';
import Papa from 'papaparse';

// Interfaces para tipagem dos dados do CSV
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

// Subcomponente para a correlação do MEG
const MegCorrelationSystem: React.FC = () => {
    const [data, setData] = useState<MegData[]>([]);
    const [selectedFundamento, setSelectedFundamento] = useState('');
    const [selectedTema, setSelectedTema] = useState('');

    useEffect(() => {
        Papa.parse<MegData>("https://dmenezes007.github.io/pgc-inpi/src/files/docs/meg.csv", {
            download: true,
            header: true,
            delimiter: ";",
            skipEmptyLines: true,
            complete: (results) => setData(results.data),
        });
    }, []);

    const fundamentos = useMemo(() => {
        const unique = [...new Map(data.map(item => [item.Fundamento, item])).values()];
        return unique;
    }, [data]);

    const temas = useMemo(() => {
        if (!selectedFundamento) return [];
        const filtered = data.filter(item => item.Fundamento === selectedFundamento);
        const unique = [...new Set(filtered.map(item => item.Tema))];
        return unique;
    }, [data, selectedFundamento]);
    
    const subtemas = useMemo(() => {
        if (!selectedTema) return [];
        const filtered = data.filter(item => item.Fundamento === selectedFundamento && item.Tema === selectedTema);
        const unique = [...new Set(filtered.map(item => item.Subtema))];
        return unique;
    }, [data, selectedFundamento, selectedTema]);

    const selectedConceito = useMemo(() => {
        return fundamentos.find(f => f.Fundamento === selectedFundamento)?.Conceito;
    }, [fundamentos, selectedFundamento]);

    const handleFundamentoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedFundamento(e.target.value);
        setSelectedTema(''); // Reseta o tema ao mudar o fundamento
    };

    const commonSelectClass = "w-full p-3 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed";

    return (
        <div className="mt-8 pt-6 border-t border-slate-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                {/* Coluna Fundamento e Conceito */}
                <div className="space-y-2">
                    <label htmlFor="fundamento" className="block text-sm font-medium text-gray-300">Fundamento</label>
                    <select id="fundamento" value={selectedFundamento} onChange={handleFundamentoChange} className={commonSelectClass}>
                        <option value="">Selecione...</option>
                        {fundamentos.map(item => <option key={item.Fundamento} value={item.Fundamento}>{item.Fundamento}</option>)}
                    </select>
                    {selectedConceito && <p className="mt-2 text-sm text-gray-400 p-3 bg-slate-900/50 rounded-md">{selectedConceito}</p>}
                </div>

                {/* Coluna Tema */}
                <div className="space-y-2">
                    <label htmlFor="tema" className="block text-sm font-medium text-gray-300">Tema</label>
                    <select id="tema" value={selectedTema} onChange={(e) => setSelectedTema(e.target.value)} className={commonSelectClass} disabled={!selectedFundamento}>
                        <option value="">Selecione...</option>
                        {temas.map(tema => <option key={tema} value={tema}>{tema}</option>)}
                    </select>
                </div>

                {/* Coluna Subtema */}
                <div className="space-y-2">
                     <label htmlFor="subtema" className="block text-sm font-medium text-gray-300">Subtema</label>
                    <select id="subtema" className={commonSelectClass} disabled={!selectedTema}>
                         <option value="">Selecione...</option>
                         {subtemas.map(subtema => <option key={subtema} value={subtema}>{subtema}</option>)}
                     </select>
                </div>
            </div>
        </div>
    );
};

// Subcomponente para a correlação do iESGo
const IesgoCorrelationSystem: React.FC = () => {
    const [data, setData] = useState<IesgoData[]>([]);
    const [niv1, setNiv1] = useState('');
    const [niv2, setNiv2] = useState('');
    const [niv3, setNiv3] = useState('');

    useEffect(() => {
        Papa.parse<IesgoData>("https://dmenezes007.github.io/pgc-inpi/src/files/docs/iesgo.csv", {
            download: true,
            header: true,
            delimiter: ";",
            skipEmptyLines: true,
            complete: (results) => setData(results.data),
        });
    }, []);

    const optionsNiv1 = useMemo(() => [...new Set(data.map(item => item.Tema_Niv_1))], [data]);
    const optionsNiv2 = useMemo(() => niv1 ? [...new Set(data.filter(item => item.Tema_Niv_1 === niv1).map(item => item.Tema_Niv_2))] : [], [data, niv1]);
    const optionsNiv3 = useMemo(() => niv2 ? [...new Set(data.filter(item => item.Tema_Niv_2 === niv2).map(item => item.Tema_Niv_3))] : [], [data, niv2]);
    const optionsNiv4 = useMemo(() => niv3 ? [...new Set(data.filter(item => item.Tema_Niv_3 === niv3).map(item => item.Tema_Niv_4))] : [], [data, niv3]);

    const commonSelectClass = "w-full p-3 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed";
    
    return (
        <div className="mt-8 pt-6 border-t border-slate-700">
             <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Nível 1 */}
                <div className="space-y-2">
                    <label htmlFor="niv1" className="block text-sm font-medium text-gray-300">Nível 1</label>
                    <select id="niv1" value={niv1} onChange={e => { setNiv1(e.target.value); setNiv2(''); setNiv3(''); }} className={commonSelectClass}>
                        <option value="">Selecione...</option>
                        {optionsNiv1.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                </div>
                {/* Nível 2 */}
                 <div className="space-y-2">
                    <label htmlFor="niv2" className="block text-sm font-medium text-gray-300">Nível 2</label>
                    <select id="niv2" value={niv2} onChange={e => { setNiv2(e.target.value); setNiv3(''); }} className={commonSelectClass} disabled={!niv1}>
                        <option value="">Selecione...</option>
                        {optionsNiv2.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                </div>
                 {/* Nível 3 */}
                 <div className="space-y-2">
                    <label htmlFor="niv3" className="block text-sm font-medium text-gray-300">Nível 3</label>
                    <select id="niv3" value={niv3} onChange={e => setNiv3(e.target.value)} className={commonSelectClass} disabled={!niv2}>
                        <option value="">Selecione...</option>
                        {optionsNiv3.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                </div>
                 {/* Nível 4 */}
                 <div className="space-y-2">
                    <label htmlFor="niv4" className="block text-sm font-medium text-gray-300">Nível 4</label>
                    <select id="niv4" className={commonSelectClass} disabled={!niv3}>
                        <option value="">Selecione...</option>
                        {optionsNiv4.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                </div>
             </div>
        </div>
    );
};


// Componente principal Gestao
const Gestao: React.FC = () => {
    const [activeTab, setActiveTab] = useState('meg');

    const tabs = [
        { id: 'meg', title: 'Modelo de Excelência da Gestão (MEG/FNQ)' },
        { id: 'iesgo', title: 'Levantamento de Governança (iESGo/TCU)' },
    ];

    return (
        <div>
            <h1 className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-400">
                Gestão
            </h1>
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
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`${
                                    activeTab === tab.id
                                        ? 'border-orange-500 text-orange-400'
                                        : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'
                                } whitespace-nowrap py-4 px-2 border-b-2 font-medium text-sm sm:text-base transition-colors duration-200`}
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
                             <p className="text-gray-300">
                                 O <span className="font-semibold text-white">Modelo de Excelência da Gestão® (MEG)</span> da Fundação Nacional da Qualidade (FNQ) serve como um referencial para a maturidade da gestão. No contexto do conhecimento, ele nos orienta a estruturar processos que abrangem desde a <span className="text-orange-400 font-serif-highlight">gestão do conhecimento e da informação</span> até a <span className="text-orange-400 font-serif-highlight">gestão da inovação</span>, garantindo que o aprendizado organizacional seja contínuo e gere valor para a sociedade.
                             </p>
                             {/* Sistema de correlação do MEG é inserido aqui */}
                             <MegCorrelationSystem />
                        </div>
                    )}
                    {activeTab === 'iesgo' && (
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold text-gray-200">iESGo - TCU</h3>
                            <p className="text-gray-300">
                                O <span className="font-semibold text-white">Levantamento de Governança, Sustentabilidade e Gestão (iESGo)</span>, do Tribunal de Contas da União (TCU), avalia a capacidade das organizações públicas em gerar resultados. A gestão do conhecimento é um pilar essencial neste modelo, pois impacta diretamente a <span className="text-orange-400 font-serif-highlight">capacidade de planejamento</span>, a <span className="text-orange-400 font-serif-highlight">tomada de decisão baseada em evidências</span> e a <span className="text-orange-400 font-serif-highlight">transparência</span> das nossas ações, fortalecendo a governança e a entrega de valor público.
                            </p>
                            {/* Sistema de correlação do iESGo é inserido aqui */}
                            <IesgoCorrelationSystem />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Gestao;