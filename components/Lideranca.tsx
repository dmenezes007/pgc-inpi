import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';

// --- AccordionItem sub-component (adapted from Metodologia.tsx) ---
const AccordionItem = ({ title, icon, children, isOpen, onClick }: { title: string; icon: React.ReactNode; children: React.ReactNode; isOpen: boolean; onClick: () => void; }) => (
  <div className="border-b border-slate-700 last:border-b-0">
    <h2>
      <button
        type="button"
        className="flex items-center justify-between w-full p-5 font-medium text-left text-gray-200 hover:bg-slate-700/50 transition-colors duration-200"
        onClick={onClick}
        aria-expanded={isOpen}
      >
        <span className="flex items-center text-lg">
            {icon}
            <span className="ml-4">{title}</span>
        </span>
        <svg className={`w-6 h-6 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
      </button>
    </h2>
    <div className={`transition-all duration-500 ease-in-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'} grid`}>
        <div className="overflow-hidden">
            <div className="p-5 border-t border-slate-700/50">
                <div className="space-y-3">
                    {children}
                </div>
            </div>
        </div>
    </div>
  </div>
);

// --- Data structure for the CSV ---
interface LiderancaData {
  Conhecimento: string;
  Especificação: string;
}

// --- Main Lideranca Component ---
const Lideranca: React.FC = () => {
    const [accordionData, setAccordionData] = useState<Map<string, string[]>>(new Map());
    const [openAccordion, setOpenAccordion] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // This URL is based on the structure of other components.
                const response = await fetch('https://dmenezes007.github.io/pgc-inpi/src/files/docs/lideranca.csv');
                const csvText = await response.text();

                Papa.parse<LiderancaData>(csvText, {
                    header: true,
                    skipEmptyLines: true,
                    complete: (results) => {
                        const groupedData = new Map<string, string[]>();
                        results.data.forEach(row => {
                            if (row.Conhecimento && row.Especificação) {
                                if (!groupedData.has(row.Conhecimento)) {
                                    groupedData.set(row.Conhecimento, []);
                                }
                                groupedData.get(row.Conhecimento)?.push(row.Especificação);
                            }
                        });
                        setAccordionData(groupedData);
                    },
                });
            } catch (error) {
                console.error("Erro ao buscar ou processar os dados do CSV:", error);
            }
        };

        fetchData();
    }, []);

    const handleAccordionToggle = (id: string) => {
        setOpenAccordion(openAccordion === id ? null : id);
    };

    // Generic icon for "Conhecimento", themed with orange.
    const conhecimentoIcon = (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
    );

    return (
        <div>
            <h1 className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-400">
                Liderança
            </h1>
            <div className="bg-slate-800 p-6 rounded-lg shadow-lg mb-10 border border-slate-700">
                <p className="text-lg leading-relaxed text-gray-300">
                    O desenvolvimento da liderança é crucial para o sucesso da gestão do conhecimento. Este módulo apresenta as <span className="text-orange-400 font-serif-highlight">competências essenciais de liderança</span> previstas para a qualificação do serviço público federal, que capacitam nossos gestores a <span className="text-orange-400 font-serif-highlight">inspirar equipes</span> e a <span className="text-orange-400 font-serif-highlight">guiar a organização</span> em direção a uma cultura de aprendizado e inovação.
                </p>
            </div>

            <div id="accordion-lideranca" className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
                {Array.from(accordionData.keys()).map(conhecimento => (
                    <AccordionItem
                        key={conhecimento}
                        title={conhecimento}
                        isOpen={openAccordion === conhecimento}
                        onClick={() => handleAccordionToggle(conhecimento)}
                        icon={conhecimentoIcon}
                    >
                        {accordionData.get(conhecimento)?.map((especificacao, index) => (
                            // --- Style adapted from Identidade.tsx ---
                            <div key={index} className="flex items-start text-gray-300 p-3 bg-slate-900/50 rounded-md">
                                <svg className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
                                <span>{especificacao}</span>
                            </div>
                        ))}
                    </AccordionItem>
                ))}
            </div>
        </div>
    );
};

export default Lideranca;