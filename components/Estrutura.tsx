import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import Papa from 'papaparse';

interface CompRegData {
  Unidade: string;
  Sigla: string;
  Competencia: string;
}

const Estrutura: React.FC = () => {
  const [options, setOptions] = useState<any[]>([]);
  const [selectedUnit, setSelectedUnit] = useState<CompRegData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Substitua pela URL pública do seu arquivo CSV
        const response = await fetch('https://dmenezes007.github.io/pgc-inpi/src/files/docs/estrutura.csv');
        const reader = response.body?.getReader();
        const result = await reader?.read();
        const decoder = new TextDecoder('utf-8');
        const csv = decoder.decode(result?.value);

        Papa.parse(csv, {
          header: true,
          complete: (results) => {
            const data = results.data as CompRegData[];
            const formattedOptions = data.map((item) => ({
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

  const handleUnitChange = (selectedOption: any) => {
    setSelectedUnit(selectedOption.value);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Estrutura Organizacional</h2>
      <Select
        options={options}
        onChange={handleUnitChange}
        isSearchable
        placeholder="Selecione ou digite para pesquisar a unidade..."
      />
      {selectedUnit && (
        <div className="mt-4 p-4 border rounded">
          <h3 className="text-xl font-semibold">{selectedUnit.Unidade} ({selectedUnit.Sigla})</h3>
          <p className="mt-2 whitespace-pre-line">{selectedUnit.Competencia}</p>
        </div>
      )}
    </div>
  );
};

export default Estrutura;