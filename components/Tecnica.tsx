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
    control: (provided: any, state: { isFocused: boolean }) => ({
        ...provided,
        backgroundColor: '#ffffff',
        borderColor: state.isFocused ? 'var(--gov-blue)' : 'var(--gov-border)',
        color: 'var(--gov-blue-dark)',
        borderRadius: '0.375rem', // rounded-md
        padding: '0.2rem',
        border: '1px solid var(--gov-border)',
        boxShadow: state.isFocused ? '0 0 0 1px var(--gov-blue)' : 'none',
        '&:hover': {
            borderColor: 'var(--gov-blue)',
        },
    }),
    singleValue: (provided: any) => ({
        ...provided,
        color: 'var(--gov-blue-dark)',
    }),
    menu: (provided: any) => ({
        ...provided,
        backgroundColor: '#ffffff',
        borderColor: 'var(--gov-border)',
    }),
    option: (provided: any, state: { isFocused: any; isSelected: any; }) => ({
        ...provided,
        backgroundColor: state.isSelected ? 'var(--gov-blue)' : state.isFocused ? 'var(--gov-blue-soft)' : '#ffffff',
        color: state.isSelected ? '#ffffff' : 'var(--gov-blue-dark)',
        '&:active': {
            backgroundColor: 'var(--gov-blue)',
        },
    }),
    input: (provided: any) => ({
        ...provided,
        color: 'var(--gov-blue-dark)',
    }),
    placeholder: (provided: any) => ({
        ...provided,
        color: 'var(--gov-blue)',
    }),
    clearIndicator: (provided: any) => ({
        ...provided,
        color: 'var(--gov-blue)',
        '&:hover': { color: 'var(--gov-blue-dark)' },
    }),
    dropdownIndicator: (provided: any) => ({
        ...provided,
        color: 'var(--gov-blue)',
        '&:hover': { color: 'var(--gov-blue-dark)' },
    }),
    indicatorSeparator: () => ({ display: 'none' }),
    menuPortal: (base: any) => ({ ...base, zIndex: 9999 }),
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
            <div className="bg-slate-800 p-6 rounded-lg shadow-lg mb-10 border border-slate-700">
                <p className="text-lg leading-relaxed text-gray-300">
                    Os conhecimentos técnicos representam o <span className="text-orange-400 font-serif-highlight">conhecimento especializado</span> necessário para a execução das atividades finalísticas e de suporte do INPI. Eles variam de acordo com as especificidades de cada <span className="text-orange-400 font-serif-highlight">cargo, unidade, formação e experiência</span>, sendo o alicerce para a <span className="text-orange-400 font-serif-highlight">qualidade e a precisão</span> de nossos serviços.
                </p>
            </div>

            <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Nível 1 Dropdown */}
                    <div className="space-y-2">
                        <label htmlFor="nivel1" className="block text-sm font-medium text-blue-900">Nível 1 de Conhecimento</label>
                        <Select
                            id="nivel1"
                            instanceId="nivel1-select"
                            classNamePrefix="tecnica-select"
                            value={selectedNivel1 ? { value: selectedNivel1, label: selectedNivel1 } : null}
                            onChange={handleNivel1Change}
                            options={nivel1Options}
                            styles={customStyles}
                            placeholder="Busque pelo Nível 1 de Conhecimento"
                            isClearable
                            menuPortalTarget={document.body}
                        />
                    </div>

                    {/* Nível 2 Dropdown */}
                    <div className="space-y-2">
                        <label htmlFor="nivel2" className="block text-sm font-medium text-blue-900">Nível 2 de Conhecimento</label>
                        <Select
                            id="nivel2"
                            instanceId="nivel2-select"
                            classNamePrefix="tecnica-select"
                            value={selectedNivel2 ? { value: selectedNivel2, label: selectedNivel2 } : null}
                            onChange={handleNivel2Change}
                            options={nivel2Options}
                            styles={customStyles}
                            isDisabled={!selectedNivel1}
                            placeholder="Busque pelo Nível 2 de Conhecimento"
                            isClearable
                            menuPortalTarget={document.body}
                        />
                    </div>

                    {/* Nível 3 Display */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-blue-900">Nível 3 de Conhecimento</label>
                        <div className="space-y-2 pt-2">
                            {nivel3Options.length > 0 ? (
                                nivel3Options.map(item => (
                                    <div key={item} className="flex items-start text-gray-300 p-3 bg-slate-900/50 rounded-md text-sm">
                                        <svg className="w-4 h-4 mr-3 mt-0.5 flex-shrink-0 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                        <span>{item}</span>
                                    </div>
                                ))
                            ) : (
                                <div className="tecnica-empty-state text-gray-400 text-sm p-3 bg-slate-900/50 rounded-md">
                                    {selectedNivel2 ? 'Nenhum item encontrado.' : 'Selecione os Níveis 1 e 2 de Conhecimento'}
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
