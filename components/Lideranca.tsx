import React, { useState, useMemo } from 'react';
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

// --- Local CSV Data ---
const csvData = `Conhecimento;Especificação
Visão de Futuro;Compreender de maneira integrada as tendências sociais, políticas, tecnológicas e econômicas nos cenários local, regional, nacional e internacional, que possam impactar os processos decisórios de planejamento estratégico e gestão de políticas públicas.
Visão de Futuro;Reconhecer os diversos fatores técnicos e políticos, internos e externos, que devem ser considerados no processo de planejamento de atividades organizacionais.
Visão de Futuro;Conhecer técnicas e metodologias de planejamento e análise de cenários, especialmente no setor público.
Visão de Futuro;Compreender a posição e as necessidades da organização frente a contextos diversos.
Inovação e Mudança;Conhecer técnicas e metodologias de promoção da inovação no setor público, como práticas de triagem, experimentação, ideação e prototipagem de inovações na organização.
Inovação e Mudança;Discutir políticas, métodos e abordagens para incentivo à criatividade e gestão da inovação no contexto organizacional.
Inovação e Mudança;Distinguir oportunidades de uso de tecnologias digitais e ferramentas de análise de dados para a melhoria de processos internos e prestação de serviços públicos focados nas necessidades dos cidadãos.
Inovação e Mudança;Manter-se atualizado com relação aos desenvolvimentos tecnológicos que podem atender às necessidades específicas de programas organizacionais ou governamentais.
Inovação e Mudança;Identificar conceitos para novos programas, produtos ou serviços para o contexto do serviço público.
Inovação e Mudança;Identificar relações entre programas, projetos ou processos organizacionais dentro e fora da organização em busca de novas alternativas e formas de trabalho.
Comunicação Estratégica;Identificar estratégias de comunicação corporativa que apoiam os objetivos organizacionais e fortalecem a imagem e a reputação da organização e do Governo.
Comunicação Estratégica;Compreender o papel, a função e os posicionamentos da organização no âmbito do serviço público.
Comunicação Estratégica;Identificar saberes e técnicas destinados a dar voz aos interlocutores para apreender de forma empática seus interesses e necessidades.
Comunicação Estratégica;Identificar as melhores formas de apresentação de mensagens, dados e informações, adaptadas ao contexto e ao público-alvo.
Comunicação Estratégica;Identificar estratégias de adequação da narrativa ao público e à situação para comunicar as informações mais relevantes para a organização.
Geração de Valor para o Usuário;Reconhecer a centralidade da  participação social na formulação e implantação de políticas e de desenvolvimento de produtos e serviços para os cidadãos.
Geração de Valor para o Usuário;Compreender a função do serviço público, e o conceito de valor público.
Geração de Valor para o Usuário;Demonstrar conhecimento acerca dos seus usuários, dos serviços prestados e das comunidades e mercados que são afetados pelas atividades de sua organização e pelo setor público em geral.
Geração de Valor para o Usuário;Reconhecer a diversidade dos usuários finais e considera suas necessidades específicas no desenvolvimento de políticas e serviços públicos.
Geração de Valor para o Usuário;Identificar abordagens para a prestação de serviços que melhor atendam às necessidades específicas dos usuários e aos interesses organizacionais.
Gestão para Resultados;Conhecer conteúdos e métodos associados à gestão e sua especificidade no setor público, e à constante melhoria dos processos de trabalho.
Gestão para Resultados;Dominar os conhecimentos inerentes ao funcionamento dos arranjos federativos da gestão de políticas públicas.
Gestão para Resultados;Compreender os princípios, procedimentos, requisitos, regulamentos e políticas que se relacionam à sua área de atuação.
Gestão para Resultados;Conhecer procedimentos, instrumentos e rotinas inerentes à gestão orçamentária e financeira no serviço público.
Gestão para Resultados;Possuir expertise em assuntos técnicos que compõem a agenda da organização.
Gestão para Resultados;Possuir conhecimento técnico sobre planejamento, implementação, monitoramento e avaliação de ações, projetos e programas da organização.
Gestão de Crises;Compreender a extensão dos impactos que as mudanças no cenário podem causar nas estruturas governamentais, na organização, na correlação de forças entre os atores, e nas estratégias políticas formuladas.
Gestão de Crises;Considerar fatores culturais, sociais, econômicos, históricos, regionais e políticos relevantes na concepção de abordagens para a solução de problemas.
Gestão de Crises;Identificar obstáculos, erros e problemas na consecução de estratégias e atividades organizacionais, de forma a antecipar e mitigar os riscos decorrentes.
Gestão de Crises;Reconhecer as principais normas, regulamentos e métodos relativos ao levantamento, mapeamento, análise e gestão de riscos no serviço público.
Gestão de Crises;Reconhecer diferentes níveis de abordagem e condutas apropriadas para situações de crise.
Gestão de Crises;Dispor de saberes e domínio sobre ferramentas e estratégias passíveis de serem tempestivamente mobilizadas em situações de crise.
Autoconhecimento e Desenvolvimento Pessoal;Identificar seu propósito e o que lhe impulsiona e motiva na carreira pública.
Autoconhecimento e Desenvolvimento Pessoal;Compreender quais são as competências fundamentais para o exercício da liderança.
Autoconhecimento e Desenvolvimento Pessoal;Reconhecer as características e qualidades dos diferentes estilos de liderança.
Autoconhecimento e Desenvolvimento Pessoal;Identificar dimensões da inteligência emocional e comportamental para a autoliderança, assim como para interações interpessoais e em grupos.
Autoconhecimento e Desenvolvimento Pessoal;Demonstrar conhecimento acerca de técnicas de gestão do tempo e produtividade.
Engajamento de Pessoas e Equipes;Compreender as particularidades e as potencialidades da liderança no serviço público.
Engajamento de Pessoas e Equipes;Dominar técnicas e métodos de gestão de pessoas e liderança.
Engajamento de Pessoas e Equipes;Identificar diferentes ferramentas e tecnologias para a gestão do desempenho e desenvolvimento de equipes de alta performance.
Engajamento de Pessoas e Equipes;Compreender aspectos fundamentais para promoção da qualidade de vida no trabalho e equilíbrio entre trabalho e vida pessoal.
Engajamento de Pessoas e Equipes;Reconhecer as características, requisitos, vantagens e desvantagens de diversos arranjos e regimes de trabalho e como se relacionam com os diversos perfis e competências da equipe e da liderança.
Engajamento de Pessoas e Equipes;Conhecer técnicas de feedback e diálogo produtivo como ferramentas de melhoria e desenvolvimento de pessoas.
Engajamento de Pessoas e Equipes;Identificar estratégias adequadas para atrair, recrutar e motivar talentos com o objetivo de desenvolver equipes diversificadas e de alto desempenho.
Coordenação e Colaboração em Rede;Identificar diferentes arranjos institucionais e relações organizacionais no setor público e na sociedade civil passíveis de atuar em rede para a  implementação e efetividade de políticas públicas.
Coordenação e Colaboração em Rede;Identificar tendências e desafios para a efetividade de redes de governança diante de fatores organizacionais e contextuais de ordem política, econômica e social.
Coordenação e Colaboração em Rede;Compreender as relações federativas e o papel de cada ente federado e de cada poder para a consecução de objetivos públicos.
Coordenação e Colaboração em Rede;Compreender a interface entre as esferas política e técnica e suas implicações para a área de atuação.
Coordenação e Colaboração em Rede;Identificar os diversos atores no contexto em que opera, seus objetivos e potenciais oportunidades de parcerias e de benefício mútuo.`;

// --- Icon Definitions ---
const defaultIcon = <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>;

const conhecimentoIcons: { [key: string]: React.ReactNode } = {
    'Visão de Futuro': <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>,
    'Inovação e Mudança': <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>,
    'Comunicação Estratégica': <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-2.236 9.168-5.518" /></svg>,
    'Geração de Valor para o Usuário': <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>,
    'Gestão para Resultados': <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
    'Gestão de Crises': <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 20.917l9 2.083 9-2.083c-1.482-4.696-4.236-8.405-8.618-11.046z" /></svg>,
    'Autoconhecimento e Desenvolvimento Pessoal': defaultIcon,
    'Engajamento de Pessoas e Equipes': <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
    'Coordenação e Colaboração em Rede': <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" /></svg>,
};


// --- Main Lideranca Component ---
const Lideranca: React.FC = () => {
    const [openAccordion, setOpenAccordion] = useState<string | null>(null);

    const accordionData = useMemo(() => {
        const groupedData = new Map<string, string[]>();
        const parsedData = Papa.parse<LiderancaData>(csvData, {
            header: true,
            skipEmptyLines: true,
            delimiter: ';',
        });

        parsedData.data.forEach(row => {
            if (row.Conhecimento && row.Especificação) {
                if (!groupedData.has(row.Conhecimento)) {
                    groupedData.set(row.Conhecimento, []);
                }
                groupedData.get(row.Conhecimento)?.push(row.Especificação);
            }
        });
        return groupedData;
    }, []);

    const handleAccordionToggle = (id: string) => {
        setOpenAccordion(openAccordion === id ? null : id);
    };

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
                        icon={conhecimentoIcons[conhecimento] || defaultIcon}
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