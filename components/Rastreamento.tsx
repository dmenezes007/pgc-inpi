import React, { useState, useEffect, useMemo } from 'react';
import Papa from 'papaparse';
import Select, { SingleValue } from 'react-select';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip, ResponsiveContainer } from 'recharts';
import rastreamentoCsvUrl from '/src/files/docs/rastreamento.csv?url';

// --- Interfaces ---
interface RastreamentoData {
    Unidade: string;
    Sigla: string;
    Conhecimento: string;
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
    menuPortal: (base: any) => ({ ...base, zIndex: 9999 }),
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

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'Crítico': return 'bg-red-500/20 text-red-400';
            case 'Essencial': return 'bg-yellow-500/20 text-yellow-400';
            case 'Apoio': return 'bg-sky-500/20 text-sky-400';
            default: return 'bg-slate-500/20 text-slate-400';
        }
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
                    menuPortalTarget={document.body}
                />
            </div>

            {selectedUnidade && (
                <div className="mt-6 space-y-3">
                    {/* Cabeçalho */}
                    <div className="hidden md:flex items-center space-x-4 text-sm font-semibold text-gray-400 px-4 py-2 border-b border-slate-700">
                        <div className="w-6 text-center">#</div>
                        <div className="flex-grow">Conhecimento</div>
                        <div className="w-28 text-center">Tipo</div>
                        <div className="w-28 text-center">Relevância</div>
                        <div className="w-32 text-center">Grau de Desenvolvimento</div>
                    </div>

                    {filteredData.map((item, index) => (
                        <div key={index} className="bg-slate-900/70 p-4 rounded-lg border border-slate-700 flex flex-col md:flex-row md:items-center md:space-x-4">
                            <div className="flex items-center space-x-4 mb-4 md:mb-0">
                                <span className="text-orange-400 font-bold text-lg w-6 text-center">{item.Ordem}.</span>
                                <div className="flex-grow md:hidden">
                                    <p className="text-white font-medium">{item.Conhecimento}</p>
                                </div>
                            </div>
                            <div className="flex-grow hidden md:block">
                                <p className="text-white font-medium">{item.Conhecimento}</p>
                            </div>
                            <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0 mt-4 md:mt-0">
                                <div className="flex items-center justify-between md:justify-center md:w-28">
                                    <span className="md:hidden font-semibold text-gray-400">Tipo</span>
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(item.Tipo_de_Conhecimento)}`}>
                                        {item.Tipo_de_Conhecimento}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between md:justify-center md:w-28">
                                    <span className="md:hidden font-semibold text-gray-400">Relevância</span>
                                    <div title={`Relevância: ${item['Relevancia (Score)']}`}>
                                        <div className="flex items-center justify-center w-12 h-12 bg-slate-800 rounded-full border border-slate-600">
                                            <span className="text-sm font-bold text-white">{parseFloat(item['Relevancia (Score)']).toFixed(0)}%</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between md:justify-center md:w-32">
                                    <span className="md:hidden font-semibold text-gray-400">Grau de Desenvolvimento</span>
                                    <div title={`Grau de Desenvolvimento: ${item.Grau_Conhecimento_Instalado}`}>
                                        <div className="flex space-x-1.5">
                                            <DevelopmentBar level={1} activeLevel={parseInt(item.Grau_Conhecimento_Instalado)} />
                                            <DevelopmentBar level={2} activeLevel={parseInt(item.Grau_Conhecimento_Instalado)} />
                                            <DevelopmentBar level={3} activeLevel={parseInt(item.Grau_Conhecimento_Instalado)} />
                                        </div>
                                    </div>
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

    const chartColors = useMemo(() => ({
        'Essencial': {
            stroke: '#facc15', // Cor Amarelo (yellow-400)
            fill: '#facc15',
            label: '#facc15',
            border: 'rgba(250, 204, 21, 0.5)',
        },
        'Crítico': {
            stroke: '#f87171', // Cor Vermelho (red-400)
            fill: '#f87171',
            label: '#f87171',
            border: 'rgba(248, 113, 113, 0.5)',
        }
    }), []);

    const colors = chartColors[type];

    const unidadeOptions = useMemo((): SelectOption[] => {
        const unidadesMap = new Map<string, string>();
        const relevantData = data.filter(item => item.Tipo_de_Conhecimento === type);

        relevantData.forEach(item => {
            if (item.Unidade && item.Sigla && !unidadesMap.has(item.Unidade)) {
                unidadesMap.set(item.Unidade, item.Sigla);
            }
        });
        const uniqueUnidades = Array.from(unidadesMap.entries());
        return uniqueUnidades.map(([nome, sigla]) => ({
            value: nome,
            label: `${nome} - ${sigla}`
        }));
    }, [data, type]);

    const handleUnidadeChange = (option: SingleValue<SelectOption>) => {
        setSelectedUnidade(option ? option.value : '');
    };

    const introText = {
        'Essencial': 'Dados do conhecimento essencial ao INPI, fundamental ao seu funcionamento e necessário para as suas operações e execução de suas atividades básicas.',
        'Crítico': 'Dados do conhecimento crítico ao INPI, estratégico, diferenciado e necessário à realização de sua missão, visão e objetivos estratégicos.'
    };

    const chartData = useMemo(() => {
        if (!selectedUnidade) return [];
        let filtered = data.filter(item => item.Tipo_de_Conhecimento === type && item.Unidade === selectedUnidade);
        return filtered.map(item => ({
            subject: item.Conhecimento,
            value: parseInt(item.Grau_Conhecimento_Instalado, 10) || 0,
            fullMark: 3,
        }));
    }, [data, type, selectedUnidade]);

    const getGrauLabel = (grau: number | string): string => {
        const numGrau = typeof grau === 'string' ? parseInt(grau, 10) : grau;
        switch (numGrau) {
            case 1: return '1 (Iniciante)';
            case 2: return '2 (Intermediário)';
            case 3: return '3 (Avançado)';
            default: return `${grau} (desconhecido)`;
        }
    };

    const [chartHeight, setChartHeight] = useState(500);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setChartHeight(300);
            } else {
                setChartHeight(500);
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Set initial height

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const renderCustomAngleTick = ({ payload, x, y, cx, cy, ...rest }: any) => {
        const isRightSide = x >= cx;
        // Offset to push the card away from the chart's data point
        const xOffset = isRightSide ? 16 : -16;
        const cardWidth = window.innerWidth < 768 ? 100 : 160; // Maximum width of the card
        const cardHeight = 55; // Increased height to accommodate wrapped text
        // Calculate position for the foreignObject
        const cardX = isRightSide ? x + xOffset : x + xOffset - cardWidth;
        const cardY = y - (cardHeight / 2); // Center vertically

        return (
            // foreignObject allows embedding HTML inside SVG, perfect for creating a "card"
            <foreignObject x={cardX} y={cardY} width={cardWidth} height={cardHeight} style={{ overflow: 'visible' }}>
                <div
                    xmlns="http://www.w3.org/1999/xhtml"
                    style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        // Align card content to the left or right based on its position
                        justifyContent: isRightSide ? 'flex-start' : 'flex-end',
                    }}
                >
                    {/* The actual card element */}
                    <div style={{
                        padding: '5px 10px',
                        backgroundColor: 'rgba(30, 41, 59, 0.85)', // slate-800 with opacity
                        border: `1px solid ${colors.border}`,
                        borderRadius: '8px',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.5)',
                        backdropFilter: 'blur(3px)', // Frosted glass effect
                        textAlign: isRightSide ? 'left' : 'right',
                        maxWidth: cardWidth,
                        minHeight: cardHeight,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <span style={{
                            color: colors.label,
                            fontSize: window.innerWidth < 768 ? '11px' : '13px', // Slightly smaller font for better wrapping
                            fontWeight: 600,
                            whiteSpace: 'normal', // Allow text to wrap
                            wordBreak: 'break-word', // Break long words
                            lineHeight: '1.3',
                        }}>
                            {payload.value}
                        </span>
                    </div>
                </div>
            </foreignObject>
        );
    };

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
                    menuPortalTarget={document.body}
                />
            </div>
            {selectedUnidade && (
                <div style={{ width: '100%', height: chartHeight }} className="flex items-center justify-center">
                    {chartData.length > 0 ? (
                        <ResponsiveContainer>
                            <RadarChart cx="50%" cy="50%" outerRadius="60%" data={chartData}>
                                <defs>
                                    <filter id="glow-yellow" x="-50%" y="-50%" width="200%" height="200%">
                                        <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="rgba(250, 204, 21, 0.6)" />
                                        <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor="rgba(250, 204, 21, 0.4)" />
                                    </filter>
                                    <filter id="glow-red" x="-50%" y="-50%" width="200%" height="200%">
                                        <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="rgba(248, 113, 113, 0.6)" />
                                        <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor="rgba(248, 113, 113, 0.4)" />
                                    </filter>
                                </defs>
                                <PolarGrid stroke="#475569" />
                                <PolarAngleAxis dataKey="subject" tick={renderCustomAngleTick} />
                                <PolarRadiusAxis angle={30} domain={[0, 3]} ticks={[0, 1, 2, 3]} stroke="#94a3b8" tick={{ fill: 'transparent' }} />
                                <Radar name="Grau de Conhecimento" dataKey="value" stroke={colors.stroke} fill={colors.fill} fillOpacity={0.6} filter={type === 'Essencial' ? 'url(#glow-yellow)' : 'url(#glow-red)'} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                                    labelStyle={{ color: '#cbd5e1', fontWeight: 'bold' }}
                                    formatter={(value: number) => [getGrauLabel(value), 'Grau de Desenvolvimento']}
                                    labelFormatter={(label: string) => `Conhecimento: ${label}`}
                                />
                            </RadarChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-gray-400">
                            Nenhum dado de conhecimento encontrado para esta unidade.
                        </p>
                    )}
                </div>
            )}
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
        Papa.parse<RastreamentoData>(rastreamentoCsvUrl, {
            download: true,
            header: true,
            delimiter: ';',
            skipEmptyLines: true,
            complete: (results) => {
                const filteredData = results.data.filter(row => row.Unidade && row.Conhecimento);
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
                    <nav className="-mb-px flex space-x-6 overflow-x-auto flex-nowrap" aria-label="Tabs">
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
