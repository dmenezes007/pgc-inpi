import React, { useState, useEffect, useMemo } from 'react';
import Papa from 'papaparse';
import Select, { SingleValue } from 'react-select';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, Tooltip, ResponsiveContainer } from 'recharts';

// --- Interfaces ---
interface RastreamentoData {
    Unidade: string;
    Sigla: string;
    Conhecimento_Sugerido: string;
    'Relevancia (Score)': string;
    Ordem: string;
    Tipo_de_Conhecimento: 'Crítico' | 'Essencial' | 'Apoio';
    Grau_Conhecimento_Instalado: string;
}

interface SelectOption {
    value: string;
    label: string;
}

// --- Estilos (reutilizados e adaptados) ---
const customSelectStyles = {
    control: (provided: any) => ({
        ...provided,
        backgroundColor: '#334155',
        borderColor: '#475569',
        color: 'white',
        borderRadius: '0.375rem',
        padding: '0.2rem',
        border: '1px solid #475569',
        boxShadow: 'none',
        '&:hover': { borderColor: '#64748b' },
    }),
    singleValue: (provided: any) => ({ ...provided, color: 'white' }),
    menu: (provided: any) => ({ ...provided, backgroundColor: '#1e293b', borderColor: '#475569' }),
    option: (provided: any, state: { isFocused: any; isSelected: any; }) => ({
        ...provided,
        backgroundColor: state.isFocused ? '#475569' : state.isSelected ? '#f97316' : '#1e293b',
        color: 'white',
        '&:active': { backgroundColor: '#f97316' },
    }),
    input: (provided: any) => ({ ...provided, color: 'white' }),
    placeholder: (provided: any) => ({ ...provided, color: '#94a3b8' }),
};

// --- Subcomponentes para cada Aba ---

const VisaoGeral: React.FC<{ data: RastreamentoData[] }> = ({ data }) => {
    const [selectedUnidade, setSelectedUnidade] = useState<string>('');

    const unidadeOptions = useMemo((): SelectOption[] => {
        const unidadesMap = new Map<string, string>();
        data.forEach(item => {
            if (item.Unidade && item.Sigla && !unidadesMap.has(item.Unidade)) {
                unidadesMap.set(item.Unidade, item.Sigla);
            }
        });
        const uniqueUnidades = Array.from(unidadesMap.entries());
        return uniqueUnidades.map(([nome, sigla]) => ({
            value: nome,
            label: `${nome} - ${sigla}`
        }));
    }, [data]);

    const handleUnidadeChange = (option: SingleValue<SelectOption>) => {
        setSelectedUnidade(option ? option.value : '');
    };

    const filteredData = useMemo(() => {
        if (!selectedUnidade) return [];
        return data
            .filter(item => item.Unidade === selectedUnidade)
            .sort((a, b) => parseInt(a.Ordem) - parseInt(b.Ordem));
    }, [data, selectedUnidade]);

    const DevelopmentBar: React.FC<{ level: number, activeLevel: number }> = ({ level, activeLevel }) => {
        const colors = ['bg-red-500', 'bg-yellow-500', 'bg-green-500'];
        const isActive = level === activeLevel;
        return (
            <div className={`h-2.5 w-8 rounded-sm ${colors[level - 1]} ${isActive ? 'opacity-100' : 'opacity-20'}`}></div>
        );
    };

    return (
        <div className="space-y-6">
            <p className="text-gray-300">Dados do conhecimento Instalado em cada unidade, com a indicação da relevância, prioridade e grau de desenvolvimento.</p>
            <div className="max-w-lg">
                <Select
                    instanceId="unidade-select"
                    value={unidadeOptions.find(option => option.value === selectedUnidade) || null}
                    onChange={handleUnidadeChange}
                    options={unidadeOptions}
                    styles={customSelectStyles}
                    placeholder="Selecione ou digite uma unidade..."
                    isClearable
                />
            </div>

            {selectedUnidade && (
                <div className="mt-6 space-y-3">
                    {filteredData.map((item, index) => (
                        <div key={index} className="bg-slate-900/70 p-4 rounded-lg border border-slate-700 flex items-center space-x-4">
                            <span className="text-orange-400 font-bold text-lg w-6">{item.Ordem}.</span>
                            <div className="flex-grow">
                                <p className="text-white font-medium">{item.Conhecimento_Sugerido}</p>
                            </div>
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center justify-center w-12 h-12 bg-slate-800 rounded-full border border-slate-600" title={`Relevância: ${item['Relevancia (Score)']}`}>
                                    <span className="text-sm font-bold text-white">{parseFloat(item['Relevancia (Score)']).toFixed(0)}%</span>
                                </div>
                                <div className="flex space-x-1.5" title={`Grau de Desenvolvimento: ${item.Grau_Conhecimento_Instalado}`}>
                                    <DevelopmentBar level={1} activeLevel={parseInt(item.Grau_Conhecimento_Instalado)} />
                                    <DevelopmentBar level={2} activeLevel={parseInt(item.Grau_Conhecimento_Instalado)} />
                                    <DevelopmentBar level={3} activeLevel={parseInt(item.Grau_Conhecimento_Instalado)} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const VisaoRadarChart: React.FC<{ data: RastreamentoData[], type: 'Essencial' | 'Crítico' }> = ({ data, type }) => {
    const [selectedUnidade, setSelectedUnidade] = useState<string>('');

    const unidadeOptions = useMemo((): SelectOption[] => {
        const unidadesMap = new Map<string, string>();
        data.forEach(item => {
            if (item.Unidade && item.Sigla && !unidadesMap.has(item.Unidade)) {
                unidadesMap.set(item.Unidade, item.Sigla);
            }
        });
        const uniqueUnidades = Array.from(unidadesMap.entries());
        return uniqueUnidades.map(([nome, sigla]) => ({
            value: nome,
            label: `${nome} - ${sigla}`
        }));
    }, [data]);

    const handleUnidadeChange = (option: SingleValue<SelectOption>) => {
        setSelectedUnidade(option ? option.value : '');
    };

    const introText = {
        'Essencial': 'Dados do conhecimento essencial ao INPI, fundamental ao seu funcionamento e necessário para as suas operações e execução de suas atividades básicas.',
        'Crítico': 'Dados do conhecimento crítico ao INPI, estratégico, diferenciado e necessário à realização de sua missão, visão e objetivos estratégicos.'
    };

    const chartData = useMemo(() => {
        let filtered = data.filter(item => item.Tipo_de_Conhecimento === type);
        if (selectedUnidade) {
            filtered = filtered.filter(item => item.Unidade === selectedUnidade);
        }
        return filtered.map(item => ({
            subject: `${item.Conhecimento_Sugerido} (${item.Sigla})`,
            value: parseInt(item.Grau_Conhecimento_Instalado, 10),
            fullMark: 3,
        }));
    }, [data, type, selectedUnidade]);

    return (
        <div className="space-y-6">
            <p className="text-gray-300">{introText[type]}</p>
            <div className="max-w-lg">
                <Select
                    instanceId={`${type}-unidade-select`}
                    value={unidadeOptions.find(option => option.value === selectedUnidade) || null}
                    onChange={handleUnidadeChange}
                    options={unidadeOptions}
                    styles={customSelectStyles}
                    placeholder="Filtrar por unidade..."
                    isClearable
                />
            </div>
            <div style={{ width: '100%', height: 500 }}>
                <ResponsiveContainer>
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                        <PolarGrid stroke="#475569" />
                        <PolarAngleAxis 
                            dataKey="subject" 
                            stroke="#cbd5e1" 
                            tick={{ fontSize: 12, fill: '#cbd5e1' }}
                        />
                        <PolarRadiusAxis angle={30} domain={[0, 3]} ticks={[0, 1, 2, 3]} stroke="#94a3b8" />
                        <Radar name="Grau de Conhecimento" dataKey="value" stroke="#fb923c" fill="#fb923c" fillOpacity={0.6} />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                            labelStyle={{ color: '#cbd5e1' }}
                            formatter={(value: number) => [value, 'Grau de Conhecimento']}
                        />
                        <Legend wrapperStyle={{ color: '#cbd5e1' }} />
                    </RadarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};


// --- Componente Principal ---
const Rastreamento: React.FC = () => {
    const [activeTab, setActiveTab] = useState('unidade');
    const [data, setData] = useState<RastreamentoData[]>([]);

    const tabs = [
        { id: 'unidade', title: 'Visão Geral' },
        { id: 'essencial', title: 'Visão Essencial' },
        { id: 'critico', title: 'Visão Crítica' },
    ];

    useEffect(() => {
        Papa.parse<RastreamentoData>('https://dmenezes007.github.io/pgc-inpi/src/files/docs/rastreamento.csv', {
            download: true,
            header: true,
            delimiter: ';',
            skipEmptyLines: true,
            complete: (results) => {
                const filteredData = results.data.filter(row => row.Unidade && row.Conhecimento_Sugerido);
                setData(filteredData);
            },
        });
    }, []);

    const renderContent = () => {
        switch (activeTab) {
            case 'unidade':
                return <VisaoGeral data={data} />;
            case 'essencial':
                return <VisaoRadarChart data={data} type="Essencial" />;
            case 'critico':
                return <VisaoRadarChart data={data} type="Crítico" />;
            default:
                return null;
        }
    };

    return (
        <div>
            <h1 className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-400">
                Rastreamento
            </h1>

            <div className="bg-slate-800 p-6 rounded-lg shadow-lg mb-10 border border-slate-700">
                <p className="text-lg leading-relaxed text-gray-300">
                    O rastreamento é o processo de <span className="text-orange-400 font-serif-highlight">levantamento geral</span> das diferentes naturezas e dimensões do conhecimento. Seu objetivo é <span className="text-orange-400 font-serif-highlight">mapear e identificar os conhecimentos essenciais e críticos</span>, bem como as <span className="text-orange-400 font-serif-highlight">lacunas de conhecimento</span> existentes na organização, servindo de base para o planejamento estratégico da gestão do conhecimento. Nesse sentido, foi adotada a <span className="text-orange-400 font-serif-highlight">metodologia de análise hierárquica e contextual</span> no levantamento dos conhecimentos associados às diferentes instâncias organizacionais, com a sinalização de seu índice de relevância e das lacunas identificadas.
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
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default Rastreamento;