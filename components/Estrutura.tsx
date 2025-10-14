import React, { useState, useEffect, useMemo } from 'react';

// Define a estrutura para uma unidade organizacional
export interface OrgUnit {
  id: string;
  parentId: string | null;
  name: string;
  acronym: string;
  competencies: string[];
  children: OrgUnit[];
  // Usado na filtragem para manter os pais de resultados encontrados
  isExpandedBySearch?: boolean; 
}

// Dados CSV simulados. O usuário substituirá a fonte desses dados.
// FIX: Formatação CSV corrigida, envolvendo nomes de unidades em aspas para lidar com vírgulas internas.
const csvData = `id,parentId,name,acronym,competencies
1,,"Presidência",PRES,"Representar o INPI;Dirigir, coordenar e controlar as atividades do Instituto;Cumprir e fazer cumprir as decisões do Conselho Diretor"
2,1,"Gabinete da Presidência",GABIN,"Assistir o Presidente em sua representação;Coordenar o preparo e a expedição do expediente do Presidente;Secretariar as reuniões do Conselho Diretor"
3,1,"Diretoria de Patentes, Programas de Computador e Topografias de Circuitos Integrados",DIRPA,"Dirigir, coordenar e supervisionar as atividades de exame de pedidos de patente;Propor normas e procedimentos para o exame;Emitir pareceres técnicos"
4,3,"Divisão de Exame de Patentes I",DIEXP1,"Realizar o exame técnico de pedidos de patente na área de mecânica;Emitir pareceres sobre a patenteabilidade"
5,3,"Divisão de Exame de Patentes II",DIEXP2,"Realizar o exame técnico de pedidos de patente na área de eletrônica;Emitir pareceres sobre a patenteabilidade"
6,1,"Diretoria de Marcas, Desenhos Industriais e Indicações Geográficas",DIRMA,"Dirigir, coordenar e supervisionar as atividades de registro de marcas;Propor normas e procedimentos para o registro;Decidir sobre pedidos de registro"
7,6,"Divisão de Exame de Marcas",DIEXM,"Analisar pedidos de registro de marca;Verificar a conformidade com a legislação;Emitir pareceres sobre a registrabilidade"
8,1,"Procuradoria Federal Especializada",PFE,"Representar judicial e extrajudicialmente o INPI;Prestar assessoria e consultoria jurídica"
`;

// Função para processar o CSV e construir uma estrutura de árvore
const parseAndBuildTree = (csv: string): OrgUnit[] => {
    const lines = csv.trim().split('\n').slice(1);
    const nodes: { [id: string]: OrgUnit } = {};
    const tree: OrgUnit[] = [];

    lines.forEach(line => {
        if (!line) return; // Pular linhas vazias

        // Regex para separar por vírgula, mas ignorar vírgulas dentro de aspas duplas
        const regex = /,(?=(?:(?:[^"]*"){2})*[^"]*$)/;
        const values = line.split(regex);
        
        // Remove aspas e espaços extras de cada valor
        const [id, parentId, name, acronym, competencies] = values.map(v => 
            (v || '').replace(/^"|"$/g, '').trim()
        );

        if (id) {
            nodes[id] = {
                id,
                parentId: parentId || null,
                name,
                acronym,
                // FIX: Divide as competências com segurança, tratando casos onde podem ser indefinidas ou vazias.
                competencies: (competencies || '').split(';').map(c => c.trim()).filter(Boolean),
                children: [],
            };
        }
    });

    Object.values(nodes).forEach(node => {
        if (node.parentId && nodes[node.parentId]) {
            nodes[node.parentId].children.push(node);
        } else {
            tree.push(node);
        }
    });

    return tree;
};


// Componente principal para o módulo Estrutura
const Estrutura: React.FC = () => {
    const [units, setUnits] = useState<OrgUnit[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

    useEffect(() => {
        // TODO: Substitua a variável `csvData` pelo URL do seu arquivo CSV.
        // Exemplo: fetch('/caminho/para/seu/arquivo.csv').then(res => res.text()).then(data => { ... })
        const parsedUnits = parseAndBuildTree(csvData);
        setUnits(parsedUnits);
    }, []);

    const handleToggleRow = (id: string) => {
        setExpandedRows(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };
    
    const filteredUnits = useMemo(() => {
        if (!searchTerm.trim()) {
            return units;
        }

        const lowercasedFilter = searchTerm.toLowerCase();

        const filterTree = (nodes: OrgUnit[]): OrgUnit[] => {
            const result: OrgUnit[] = [];
            for (const node of nodes) {
                const children = filterTree(node.children);
                const nameMatch = node.name.toLowerCase().includes(lowercasedFilter);
                const acronymMatch = node.acronym.toLowerCase().includes(lowercasedFilter);
                const competenciesMatch = node.competencies.some(c => c.toLowerCase().includes(lowercasedFilter));

                if (nameMatch || acronymMatch || competenciesMatch || children.length > 0) {
                     result.push({ ...node, children, isExpandedBySearch: children.length > 0 && !(nameMatch || acronymMatch || competenciesMatch) });
                }
            }
            return result;
        };

        return filterTree(units);
    }, [searchTerm, units]);

     const RecursiveRow: React.FC<{ unit: OrgUnit; level: number }> = ({ unit, level }) => {
        const isExpanded = expandedRows.has(unit.id) || (unit.isExpandedBySearch && searchTerm.length > 0);
        
        return (
            <>
                <tr className="bg-slate-800 hover:bg-slate-700/50 border-b border-slate-700">
                    <td className="px-6 py-4 align-top">
                        <div style={{ paddingLeft: `${level * 1.5}rem` }} className="flex items-start">
                            {unit.children.length > 0 ? (
                                <button onClick={() => handleToggleRow(unit.id)} className="mr-3 mt-1 text-orange-400 flex-shrink-0 focus:outline-none" aria-expanded={isExpanded}>
                                    <svg className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                                </button>
                            ) : (
                                <div className="w-4 h-4 mr-3 flex-shrink-0"></div> // Placeholder for alignment
                            )}
                            <span className="font-medium text-gray-200">{unit.name}</span>
                        </div>
                    </td>
                    <td className="px-6 py-4 text-gray-400 align-top">{unit.acronym}</td>
                    <td className="px-6 py-4 text-gray-300 align-top">
                        <ul className="list-disc list-inside space-y-1 text-sm">
                            {unit.competencies.map((comp, index) => <li key={index}>{comp}</li>)}
                        </ul>
                    </td>
                </tr>
                {isExpanded && unit.children.map(child => (
                    <RecursiveRow key={child.id} unit={child} level={level + 1} />
                ))}
            </>
        );
    };

    return (
        <div>
            <h1 className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-400">
                Estrutura
            </h1>
            <div className="bg-slate-800 p-6 rounded-lg shadow-lg mb-10 border border-slate-700">
                <p className="text-lg leading-relaxed text-gray-300">
                    A gestão do conhecimento deve considerar as <span className="text-orange-400 font-serif-highlight">competências regimentais</span> estabelecidas na estrutura organizacional para o mapeamento e identificação dos <span className="text-orange-400 font-serif-highlight">conhecimentos essenciais e críticos</span>.
                </p>
            </div>
            
            <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
                <div className="mb-6">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <input
                            id="search-structure"
                            type="search"
                            placeholder="Buscar por unidade, sigla ou competência..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="block w-full pl-10 pr-3 py-3 text-white bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 placeholder-gray-400"
                            aria-label="Buscar na estrutura organizacional"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
                    <table className="w-full text-sm text-left text-gray-400">
                        <thead className="text-xs text-gray-300 uppercase bg-slate-700">
                            <tr>
                                <th scope="col" className="px-6 py-3 w-1/3">Nome da Unidade</th>
                                <th scope="col" className="px-6 py-3">Sigla</th>
                                <th scope="col" className="px-6 py-3 w-1/2">Competência Regimental</th>
                            </tr>
                        </thead>
                        <tbody>
                           {filteredUnits.length > 0 ? (
                                filteredUnits.map(unit => <RecursiveRow key={unit.id} unit={unit} level={0} />)
                           ) : (
                                <tr>
                                    <td colSpan={3} className="text-center py-10 px-6 text-gray-400">
                                        Nenhum resultado encontrado para "<span className="font-semibold text-gray-200">{searchTerm}</span>".
                                    </td>
                                </tr>
                           )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Estrutura;