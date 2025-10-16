import React, { useState, useEffect, useMemo } from 'react';
import Papa from 'papaparse';
import Select, { SingleValue } from 'react-select';

interface TecnicaData {
    Nivel1: string;
    Nivel2: string;
    Nivel3: string;
}

interface SelectOption {
    value: string;
    label: string;
}

const customStyles = {
    control: (provided: any) => ({
        ...provided,
        backgroundColor: '#334155', // bg-slate-700
        borderColor: '#475569', // border-slate-600
        color: 'white',
        borderRadius: '0.375rem', // rounded-md
        padding: '0.2rem',
        border: '1px solid #475569',
        boxShadow: 'none',
        '&:hover': {
            borderColor: '#64748b', // border-slate-500
        },
    }),
    singleValue: (provided: any) => ({
        ...provided,
        color: 'white',
    }),
    menu: (provided: any) => ({
        ...provided,
        backgroundColor: '#1e293b', // bg-slate-800
        borderColor: '#475569', // border-slate-600
    }),
    option: (provided: any, state: { isFocused: any; isSelected: any; }) => ({
        ...provided,
        backgroundColor: state.isFocused ? '#475569' : state.isSelected ? '#f97316' : '#1e293b',
        color: 'white',
        '&:active': {
            backgroundColor: '#f97316',
        },
    }),
    input: (provided: any) => ({
        ...provided,
        color: 'white',
    }),
    placeholder: (provided: any) => ({
        ...provided,
        color: '#94a3b8', // text-gray-400
    }),
};


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

    const nivel1Options = useMemo((): SelectOption[] => {
        const uniqueNivel1 = [...new Set(data.map(item => item.Nivel1))];
        return uniqueNivel1.sort().map(option => ({ value: option, label: option }));
    }, [data]);

    const nivel2Options = useMemo((): SelectOption[] => {
        if (!selectedNivel1) return [];
        const filtered = data.filter(item => item.Nivel1 === selectedNivel1);
        const uniqueNivel2 = [...new Set(filtered.map(item => item.Nivel2))];
        return uniqueNivel2.sort().map(option => ({ value: option, label: option }));
    }, [data, selectedNivel1]);

    const nivel3Options = useMemo(() => {
        if (!selectedNivel2) return [];
        const filtered = data.filter(item => item.Nivel1 === selectedNivel1 && item.Nivel2 === selectedNivel2);
        const uniqueNivel3 = [...new Set(filtered.map(item => item.Nivel3))];
        return uniqueNivel3.sort();
    }, [data, selectedNivel1, selectedNivel2]);

    const handleNivel1Change = (option: SingleValue<SelectOption>) => {
        setSelectedNivel1(option ? option.value : '');
        setSelectedNivel2('');
    };

    const handleNivel2Change = (option: SingleValue<SelectOption>) => {
        setSelectedNivel2(option ? option.value : '');
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Nível 1 Dropdown */}
                    <div className="space-y-2">
                        <label htmlFor="nivel1" className="block text-sm font-medium text-gray-300">Nível 1</label>
                        <Select
                            id="nivel1"
                            instanceId="nivel1-select"
                            value={selectedNivel1 ? { value: selectedNivel1, label: selectedNivel1 } : null}
                            onChange={handleNivel1Change}
                            options={nivel1Options}
                            styles={customStyles}
                            placeholder="Selecione ou digite o Nível 1"
                            isClearable
                        />
                    </div>

                    {/* Nível 2 Dropdown */}
                    <div className="space-y-2">
                        <label htmlFor="nivel2" className="block text-sm font-medium text-gray-300">Nível 2</label>
                        <Select
                            id="nivel2"
                            instanceId="nivel2-select"
                            value={selectedNivel2 ? { value: selectedNivel2, label: selectedNivel2 } : null}
                            onChange={handleNivel2Change}
                            options={nivel2Options}
                            styles={customStyles}
                            isDisabled={!selectedNivel1}
                            placeholder="Selecione ou digite o Nível 2"
                            isClearable
                        />
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