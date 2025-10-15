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
                        control: (base) => ({
                            ...base,
                            backgroundColor: '#334155', // bg-slate-700
                            borderColor: '#475569', // border-slate-600
                            color: 'white',
                        }),
                        singleValue: (base) => ({
                            ...base,
                            color: 'white',
                        }),
                        input: (base) => ({
                            ...base,
                            color: 'white',
                        }),
                        menu: (base) => ({
                            ...base,
                            backgroundColor: '#1e293b', // bg-slate-800
                        }),
                        option: (base, { isFocused, isSelected }) => ({
                            ...base,
                            backgroundColor: isSelected ? '#4f46e5' : isFocused ? '#334155' : '#1e293b',
                            color: 'white',
                        }),
                        placeholder: (base) => ({
                            ...base,
                            color: '#9ca3af', // placeholder-gray-400
                        }),
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