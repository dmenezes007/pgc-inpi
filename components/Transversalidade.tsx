import React, { useState, useMemo } from 'react';
import Papa from 'papaparse';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBookOpen,
    faBullhorn,
    faBullseye,
    faFileLines,
    faGears,
    faScrewdriverWrench,
    faShield,
    faUsers,
} from '@fortawesome/free-solid-svg-icons';
import RecommendedTraining from './RecommendedTraining';
import { getRecommendedCourses } from './courseCuration';

// --- AccordionItem sub-component ---
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
interface TransversalidadeData {
  Conhecimento: string;
  Especificação: string;
}

// --- Local CSV Data ---
const csvData = `Conhecimento;Especificação
Resolução de Problemas com Base em Dados;Identificar métodos e técnicas para a análise e caracterização de problemas.
Resolução de Problemas com Base em Dados;Identificar métodos e técnicas para identificar e selecionar dados numéricos e não numéricos Identificar bancos de dados numéricos e não numéricos.
Resolução de Problemas com Base em Dados;Identificar recursos tecnológicos e digitais para a prospecção e tratamento de dados.
Foco nos Resultados para os Cidadãos;Identificar métodos e técnicas de avaliação de satisfação e prospecção das necessidades.
Foco nos Resultados para os Cidadãos;Identificar métodos e técnicas para a avaliação e aperfeiçoamento do padrão de qualidade e efetividade dos serviços prestados.
Foco nos Resultados para os Cidadãos;Examinar dados e evidências para adequar os serviços prestados às reais necessidades.
Foco nos Resultados para os Cidadãos;Identificar métodos e técnicas de planejamento na definição e alinhamento das ações e dos recursos necessários para garantir o cumprimento das metas e objetivos estabelecidos.
Foco nos Resultados para os Cidadãos;Identificar métodos orientados para melhoria contínua visando o ganho de eficiência e efetividade dos processos organizacionais.
Foco nos Resultados para os Cidadãos;Identificar estratégias para coordenar os processos para que não sejam contraproducentes no alcance dos resultados esperados.
Mentalidade Digital;Explicar os conceitos de transformação digital, como inteligência artificial, realidade virtual, big data, e seus impactos na sociedade.
Mentalidade Digital;Reconhecerr novos conceitos de aprendizagem a exemplo da construção coletiva do conhecimento viabilizada pelo uso de redes para o diálogo e desenvolvimento da argumentação.
Mentalidade Digital;Familiarizar-se com os conceitos relacionados à segurança da informação, como: uso ético de dados públicos, proteção aos dados e aos sistemas, etc...
Mentalidade Digital;Identificar tendências e impactos da tecnologia sobre sua área de atuação profissional.
Mentalidade Digital;Familiarizar-se com o desenvolvimento de novas tecnologias, como robôs de última geração, chatbots, impressoras 3D.
Comunicação;Identificar técnicas, ferramentas e metodologias para garantir a assertividade da comunicação interna e de resultados.
Comunicação;Reconhecer o uso adequado do sistema de signos, símbolos linguísticos, gráficos, visuais e gestuais para garantir a efetividade da comunicação.
Trabalho em Equipe;Reconhecer as particularidades da dinâmica do trabalho em grupo quanto à definição de metas em comum e manutenção da sinergia.
Trabalho em Equipe;Apreender técnicas de comunicação ativa e assertiva.
Trabalho em Equipe;Apreender técnicas de gestão de equipes de alto desempenho.
Trabalho em Equipe;Apreender conceitos e ferramentas de gestão para lidar com o conflito e com processos de negociação.
Trabalho em Equipe;Apreender técnicas de gestão para lidar com o fator emocional nas relações interpessoais. Identificar estratégias de manutenção do clima organizacional inclusivo e produtivo.
Orientação por Valores Éticos;Identificar os princípios constitucionais que regem os procedimentos na administração pública federal. Reconhecer os princípios e valores que regem o exercício da função pública.
Orientação por Valores Éticos;Reconhecer os princípios e determinações do Código Civil e do Código Penal brasileiro que têm incidência direta ou indireta na conduta dos servidores públicos. Identificar os princípios, valores, regras e normas do código de ética dos servidores públicos federais.
Visão Sistêmica;Apreender métodos e técnicas para prospecção de cenários e tendências sociais, políticas e econômicas no contexto local e internacional.
Visão Sistêmica;Identificar os principais marcos constitucionais da estrutura e funcionamento do Estado brasileiro.
Visão Sistêmica;Identificar o conjunto de normas, regras e leis que regem os procedimentos no contexto organizacional.
Visão Sistêmica;Apreender métodos e técnicas para a análise de conjuntura para compreender as potencialidades e limites no contexto do trabalho.
Visão Sistêmica;Identificar as relações de poder e influência existentes dentro da organização e seus impactos nos processos e procedimentos no contexto do trabalho.
Visão Sistêmica;Identificar a estrutura informal e formal da organização, a cadeia de comando e os procedimentos operacionais instituídos.`;

// --- Icon Definitions ---
const defaultIcon = <FontAwesomeIcon icon={faBookOpen} className="h-6 w-6 text-orange-400" />;

const transversalidadeIcons: { [key: string]: React.ReactNode } = {
    'Resolução de Problemas com Base em Dados': <FontAwesomeIcon icon={faFileLines} className="h-6 w-6 text-orange-400" />,
    'Foco nos Resultados para os Cidadãos': <FontAwesomeIcon icon={faBullseye} className="h-6 w-6 text-orange-400" />,
    'Mentalidade Digital': <FontAwesomeIcon icon={faScrewdriverWrench} className="h-6 w-6 text-orange-400" />,
    'Comunicação': <FontAwesomeIcon icon={faBullhorn} className="h-6 w-6 text-orange-400" />,
    'Trabalho em Equipe': <FontAwesomeIcon icon={faUsers} className="h-6 w-6 text-orange-400" />,
    'Orientação por Valores Éticos': <FontAwesomeIcon icon={faShield} className="h-6 w-6 text-orange-400" />,
    'Visão Sistêmica': <FontAwesomeIcon icon={faGears} className="h-6 w-6 text-orange-400" />,
};

// --- Main Transversalidade Component ---
const Transversalidade: React.FC = () => {
    const [openAccordion, setOpenAccordion] = useState<string | null>(null);

    const accordionData = useMemo(() => {
        const groupedData = new Map<string, string[]>();
        // Correcting potential double spaces in keys from CSV
        const cleanCsvData = csvData.replace(/  /g, ' ');
        const parsedData = Papa.parse<TransversalidadeData>(cleanCsvData, {
            header: true,
            skipEmptyLines: true,
            delimiter: ';',
        });

        parsedData.data.forEach(row => {
            const conhecimentoKey = row.Conhecimento.trim();
            if (conhecimentoKey && row.Especificação) {
                if (!groupedData.has(conhecimentoKey)) {
                    groupedData.set(conhecimentoKey, []);
                }
                groupedData.get(conhecimentoKey)?.push(row.Especificação);
            }
        });
        return groupedData;
    }, []);

    const handleAccordionToggle = (id: string) => {
        setOpenAccordion(openAccordion === id ? null : id);
    };

    return (
        <div>
            <div className="bg-slate-800 p-6 rounded-lg shadow-lg mb-10 border border-slate-700">
                <p className="text-lg leading-relaxed text-gray-300">
                    Os conhecimentos transversais são a base para uma <span className="text-orange-400 font-serif-highlight">atuação integrada e eficiente</span> no serviço público. Eles permeiam todas as áreas e níveis do Instituto, sendo essenciais para a <span className="text-orange-400 font-serif-highlight">colaboração</span>, o compartilhamento de conhecimento e o <span className="text-orange-400 font-serif-highlight">desenvolvimento de uma cultura organizacional</span> coesa e orientada a resultados.
                </p>
            </div>

            <div id="accordion-transversalidade" className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
                {Array.from(accordionData.keys()).map(conhecimento => (
                    <AccordionItem
                        key={conhecimento}
                        title={conhecimento}
                        isOpen={openAccordion === conhecimento}
                        onClick={() => handleAccordionToggle(conhecimento)}
                        icon={transversalidadeIcons[conhecimento.trim()] || defaultIcon}
                    >
                        {accordionData.get(conhecimento)?.map((especificacao, index) => (
                            <div key={index} className="flex items-start text-gray-300 p-3 bg-slate-900/50 rounded-md">
                                <svg className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
                                <span>{especificacao}</span>
                            </div>
                        ))}
                        <RecommendedTraining courses={getRecommendedCourses(conhecimento)} />
                    </AccordionItem>
                ))}
            </div>
        </div>
    );
};

export default Transversalidade;
