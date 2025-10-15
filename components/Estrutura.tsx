import React, { useState, useEffect } from 'react';
import Select, { SingleValue } from 'react-select';
import Papa from 'papaparse';

// Define a estrutura de dados vinda do CSV
interface CompRegData {
  Unidade: string;
  Sigla: string;
  Competencia: string;
}

// Define o tipo para as opções do Select, para melhor integração com TypeScript
type SelectOptionType = {
  label: string;
  value: CompRegData;
};

// Componente principal para o módulo Estrutura
const Estrutura: React.FC = () => {
    const [options, setOptions] = useState<SelectOptionType[]>([]);
    const [selectedUnit, setSelectedUnit] = useState<CompRegData | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://dmenezes007.github.io/pgc-inpi/src/files/docs/estrutura.csv');
                const csvText = await response.text();

                Papa.parse<CompRegData>(csvText, {
                    header: true,
                    skipEmptyLines: true,
                    complete: (results) => {
                        const formattedOptions: SelectOptionType[] = results.data
                            .filter(item => item.Unidade && item.Sigla) // Garante que itens vazios não sejam mapeados
                            .map((item) => ({
                                value: item,
                                label: `${item.Unidade} - ${item.Sigla}`,
                            }));
                        setOptions(formattedOptions);
                    },
                });
            } catch (error) {
                console.error("Erro ao buscar ou processar os dados do CSV:", error);
            }
        };

        fetchData();
    }, []);

    // Função para lidar com a mudança de seleção na lista
    const handleUnitChange = (selectedOption: SingleValue<SelectOptionType>) => {
        setSelectedUnit(selectedOption ? selectedOption.value : null);
    };

    return (
        <div>
            {/* Seção de Título e Texto Introdutório (MANTIDOS DO CÓDIGO ORIGINAL) */}
            <h1 className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-400">
                Estrutura
            </h1>
            <div className="bg-slate-800 p-6 rounded-lg shadow-lg mb-10 border border-slate-700">
                <p className="text-lg leading-relaxed text-gray-300">
                    A gestão do conhecimento deve considerar as <span className="text-orange-400 font-serif-highlight">competências regimentais</span> estabelecidas na estrutura organizacional para o mapeamento e identificação dos <span className="text-orange-400 font-serif-highlight">conhecimentos essenciais e críticos</span>.
                </p>
            </div>

            {/* Seção da Lista Suspensa e Exibição da Competência (NOVA IMPLEMENTAÇÃO) */}
            <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
                <Select
                    options={options}
                    onChange={handleUnitChange}
                    isSearchable
                    isClearable
                    placeholder="Buscar por unidade ou sigla..."
                    aria-label="Buscar na estrutura organizacional"
                    // Estilização para combinar com o layout original
                    styles={{
                        control: (base, state) => ({
                            ...base,
                            backgroundColor: '#1e293b',
                            borderColor: state.isFocused ? '#f97316' : '#334155',
                            boxShadow: state.isFocused ? '0 0 0 1px #f97316' : 'none',
                            borderRadius: '0.5rem',
                            minHeight: '48px',
                            '&:hover': {
                                borderColor: '#f97316'
                            },
                            transition: 'border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                        }),
                        singleValue: (base) => ({ ...base, color: '#f1f5f9' }),
                        input: (base) => ({ ...base, color: '#f1f5f9' }),
                        menu: (base) => ({
                            ...base,
                            backgroundColor: '#1e293b',
                            borderRadius: '0.5rem',
                            border: '1px solid #334155',
                        }),
                        option: (base, { isFocused, isSelected }) => ({
                            ...base,
                            backgroundColor: isSelected ? '#ea580c' : isFocused ? 'rgba(249, 115, 22, 0.2)' : 'transparent',
                            color: isSelected ? 'white' : '#f1f5f9',
                            borderRadius: '0.375rem',
                            '&:active': { backgroundColor: '#c2410c' },
                        }),
                        placeholder: (base) => ({ ...base, color: '#64748b' }),
                        clearIndicator: (base) => ({
                            ...base,
                            color: '#64748b',
                            '&:hover': { color: '#94a3b8' },
                        }),
                        dropdownIndicator: (base) => ({
                            ...base,
                            color: '#64748b',
                            '&:hover': { color: '#94a3b8' },
                        }),
                        indicatorSeparator: () => ({ display: 'none' }),
                    }}
                />

                {/* Exibe as competências da unidade selecionada */}
                {selectedUnit && (
                    <div className="mt-6 p-4 border border-slate-700 rounded-md bg-slate-900/50">
                        <h3 className="text-xl font-semibold text-gray-200">
                            {selectedUnit.Unidade} ({selectedUnit.Sigla})
                        </h3>
                        {/* A classe 'whitespace-pre-line' preserva as quebras de linha do CSV */}
                        <p className="mt-2 whitespace-pre-line text-gray-300">
                            {selectedUnit.Competencia}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Estrutura;