import React, { useState, useEffect } from 'react';
import Select, { SingleValue } from 'react-select';
import Papa from 'papaparse';
import estruturaCsvUrl from '../src/files/docs/estrutura.csv?url';

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
                const response = await fetch(estruturaCsvUrl);
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
            {/* Seção de Texto Introdutório */}
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
                    classNamePrefix="estrutura-select"
                    placeholder="Buscar por unidade ou sigla..."
                    aria-label="Buscar na estrutura organizacional"
                    menuPortalTarget={document.body}
                    menuPosition="fixed"
                    // Estilização para combinar com o layout original
                    styles={{
                        control: (base, state) => ({
                            ...base,
                            backgroundColor: '#ffffff',
                            borderColor: state.isFocused ? 'var(--gov-blue)' : 'var(--gov-border)',
                            boxShadow: state.isFocused ? '0 0 0 1px var(--gov-blue)' : 'none',
                            borderRadius: '0.5rem',
                            minHeight: '48px',
                            '&:hover': {
                                borderColor: 'var(--gov-blue)'
                            },
                            transition: 'border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                        }),
                        singleValue: (base) => ({ ...base, color: 'var(--gov-blue-dark)' }),
                        input: (base) => ({ ...base, color: 'var(--gov-blue-dark)' }),
                        menu: (base) => ({
                            ...base,
                            backgroundColor: '#ffffff',
                            borderRadius: '0.5rem',
                            border: '1px solid var(--gov-border)',
                        }),
                        option: (base, { isFocused, isSelected }) => ({
                            ...base,
                            backgroundColor: isSelected ? 'var(--gov-blue)' : isFocused ? 'var(--gov-blue-soft)' : 'transparent',
                            color: isSelected ? 'white' : 'var(--gov-blue-dark)',
                            borderRadius: '0.375rem',
                            '&:active': { backgroundColor: 'var(--gov-blue)' },
                        }),
                        placeholder: (base) => ({ ...base, color: 'var(--gov-blue)' }),
                        clearIndicator: (base) => ({
                            ...base,
                            color: 'var(--gov-blue)',
                            '&:hover': { color: 'var(--gov-blue-dark)' },
                        }),
                        dropdownIndicator: (base) => ({
                            ...base,
                            color: 'var(--gov-blue)',
                            '&:hover': { color: 'var(--gov-blue-dark)' },
                        }),
                        indicatorSeparator: () => ({ display: 'none' }),
                        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
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