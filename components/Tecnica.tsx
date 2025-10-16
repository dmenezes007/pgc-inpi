import React, { useState, useEffect, useMemo } from 'react';
import Papa from 'papaparse';

interface TecnicaData {
    Nivel1: string;
    Nivel2: string;
    Nivel3: string;
}

const Tecnica: React.FC = () => {
    const [data, setData] = useState<TecnicaData[]>([]);
    const [selectedNivel1, setSelectedNivel1] = useState<string>('');
    const [selectedNivel2, setSelectedNivel2] = useState<string>('');

    useEffect(() => {
        Papa.parse<TecnicaData>('https://dmenezes007.github.io/pgc-inpi/src/files/docs/tecnica.csv', {
            download: true,
            header: true,
            delimiter: ';',
            skipEmptyLines: true,
            complete: (results) => {
                setData(results.data);
            },
        });
    }, []);

    const nivel1Options = useMemo(() => {
        const uniqueNivel1 = [...new Set(data.map(item => item.Nivel1))];
        return uniqueNivel1.sort();
    }, [data]);

    const nivel2Options = useMemo(() => {
        if (!selectedNivel1) return [];
        const filtered = data.filter(item => item.Nivel1 === selectedNivel1);
        const uniqueNivel2 = [...new Set(filtered.map(item => item.Nivel2))];
        return uniqueNivel2.sort();
    }, [data, selectedNivel1]);

    const nivel3Options = useMemo(() => {
        if (!selectedNivel2) return [];
        const filtered = data.filter(item => item.Nivel1 === selectedNivel1 && item.Nivel2 === selectedNivel2);
        const uniqueNivel3 = [...new Set(filtered.map(item => item.Nivel3))];
        return uniqueNivel3.sort();
    }, [data, selectedNivel1, selectedNivel2]);

    const handleNivel1Change = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedNivel1(e.target.value);
        setSelectedNivel2('');
    };

    const handleNivel2Change = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedNivel2(e.target.value);
    };

    return (
        <div>
            <h1 className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-400">
                Técnica
            </h1>
            <div className="bg-slate-800 p-6 rounded-lg shadow-lg mb-10 border border-slate-700">
                <p className="text-lg leading-relaxed text-gray-300">
                    As competências técnicas representam o <span className="text-orange-400 font-serif-highlight">conhecimento especializado</span> necessário para a execução das atividades finalísticas e de suporte do INPI. Elas variam de acordo com as especificidades de cada <span className="text-orange-400 font-serif-highlight">cargo, unidade, formação e experiência</span>, sendo o alicerce para a <span className="text-orange-400 font-serif-highlight">qualidade e a precisão</span> de nossos serviços.
                </p>
            </div>

            <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
                <h2 className="text-xl font-bold text-gray-200 mb-4">Explore as Competências Técnicas</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Nível 1 Dropdown */}
                    <div className="space-y-2">
                        <label htmlFor="nivel1" className="block text-sm font-medium text-gray-300">Nível 1</label>
                        <select
                            id="nivel1"
                            value={selectedNivel1}
                            onChange={handleNivel1Change}
                            className="w-full p-2.5 bg-slate-700 border border-slate-600 rounded-md text-white focus:ring-orange-500 focus:border-orange-500"
                        >
                            <option value="">Selecione o Nível 1</option>
                            {nivel1Options.map(option => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                    </div>

                    {/* Nível 2 Dropdown */}
                    <div className="space-y-2">
                        <label htmlFor="nivel2" className="block text-sm font-medium text-gray-300">Nível 2</label>
                        <select
                            id="nivel2"
                            value={selectedNivel2}
                            onChange={handleNivel2Change}
                            disabled={!selectedNivel1}
                            className="w-full p-2.5 bg-slate-700 border border-slate-600 rounded-md text-white focus:ring-orange-500 focus:border-orange-500 disabled:opacity-50"
                        >
                            <option value="">Selecione o Nível 2</option>
                            {nivel2Options.map(option => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                    </div>

                    {/* Nível 3 Display */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-300">Nível 3</label>
                        <div className="space-y-2 pt-2">
                            {nivel3Options.length > 0 ? (
                                nivel3Options.map(item => (
                                    <div key={item} className="flex items-start text-gray-300 p-3 bg-slate-900/50 rounded-md text-sm">
                                        <svg className="w-4 h-4 mr-3 mt-0.5 flex-shrink-0 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                        <span>{item}</span>
                                    </div>
                                ))
                            ) : (
                                <div className="text-gray-400 text-sm p-3 bg-slate-900/50 rounded-md">
                                    {selectedNivel2 ? 'Nenhum item encontrado.' : 'Selecione Nível 1 e 2 para ver os itens.'}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Tecnica;