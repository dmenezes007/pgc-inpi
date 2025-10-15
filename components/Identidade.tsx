import React, { useState } from 'react';

const identityData = {
  mission: "Impulsionar a inovação por meio da Propriedade Industrial (PI).",
  vision: "Consolidar-se como escritório de PI de classe mundial.",
  strategicObjectives: [
    {
      id: 1,
      title: "Otimizar qualidade e agilidade na concessão e registro de direitos de propriedade industrial, alcançando padrões de desempenho de referência internacional.",
      drivers: [
        "A conformidade (qualidade) do exame de PI dever ser uma prioridade e um diferencial estratégico do INPI.",
        "Propor a revisão da LPI com foco na otimização do processamento dos pedidos de direitos de PI.",
        "Terceirizar a busca de patentes.",
        "Otimizar e modernizar a automação   dos processos de exame de pedidos de PI, em primeira e segunda instâncias.",
        "Aprimorar a harmonização de procedimentos de primeira e segunda instâncias em busca de maior previsibilidade e segurança jurídica.",
        "Aceitar novas modalidades de marcas não tradicionais, tais como sonoras e olfativas.",
        "Estabelecer de maneira sistemática e contínua processos de interação com as partes interessadas e de avaliação da qualidade dos serviços pelos usuários."
      ]
    },
    {
      id: 2,
      title: "Promover a cultura e o uso estratégico da propriedade industrial para a competividade, a inovação e o desenvolvimento do Brasil.",
      drivers: [
        "Os públicos-alvo das ações de disseminação da PI devem ser Instituições Científicas e tecnológicas (ICTs) e as micro, pequenas e médias empresas inovadoras em setores estratégicos para a política de desenvolvimento industrial do país.",
        "Liderar a inserção da PI no ensino básico e superior.",
        "Participar ativamente das instâncias de formulação das políticas públicas de PI.",
        "Consolidar-se como referência em ensino e pesquisa em PI e inovação, assegurando a manutenção da nota máxima da CAPES para o mestrado e doutorado profissionais.",
        "Produzir estudos de inteligência estratégica em PI, de forma integrada com parceiros do ecossistema de inovação.",
        "Ampliar a cobertura e a capilaridade (interiorização) da atuação junto aos ecossistemas de inovação, independente da criação de novas unidades regionais.",
        "Apoiar tecnicamente a promoção da observância aos direitos de propriedade industrial no Brasil, em parceria com o CNCP.",
        "Fomentar a participação de brasileiros no Protocolo de Madri, no PCT e nos demais acordos e tratados internacionais de PI a serem operacionalizados pelo INPI.",
        "Expandir a assistência técnica a ICTs e micro, pequenas e médias empresas por meio de ações de mentoria.",
        "Fomentar a equidade de gênero, diversidade e inclusão em PI."
      ]
    },
    {
        id: 3,
        title: "Consolidar a inserção do Brasil como protagonista no sistema internacional de propriedade industrial.",
        drivers: [
            "Elaborar estudos para eventual adesão do Brasil ao Acordo de Lisboa.",
            "Promover a integração regional em PI, tendo em vista os arranjos já existentes, com ênfase no MERCOSUL.",
            "Estruturar-se para atender, sem restrições, a demandas por exame prioritário de patentes.",
            "Alinhar a cooperação com os escritórios de PI de referência internacional para capacitação técnica e gerencial do INPI ao planejamento estratégico institucional.",
            "Participar de forma sistemática e propositiva dos fóruns internacionais de discussão e governança da PI, com destaque para a OMPI e a OMC.",
            "Internacionalizar o Programa de Pós-graduação em PI e Inovação do INPI."
        ]
    },
    {
        id: 4,
        title: "Elevar o conhecimento e o reconhecimento do valor do INPI para a sociedade.",
        drivers: [
            "Segmentar a estratégia de comunicação de acordo com cada público de interesse.",
            "Divulgar o INPI para o público em geral.",
            "Participar da estratégia de comunicação da Estratégia Nacional de Propriedade Intelectual (ENPI).",
            "Posicionar o INPI como órgão de excelência pela proteção dos direitos de PI no Brasil, a partir da comunicação intensiva do desempenho institucional."
        ]
    },
    {
        id: 5,
        title: "Aprofundar a transformação digital com foco na melhoria do desempenho e do atendimento aos usuários.",
        drivers: [
            "Estabelecer interlocução proativa e sistemática da área de TI com a SGD, buscando alinhar as decisões e soluções de TI às adotadas pela Administração Pública Federal.",
            "Aprimorar e sistematizar a governança e gestão de TIC.",
            "Substituir sistemas legados que utilizam Informix.",
            "Adotar operação em nuvem.",
            "Adotar modelos de desenvolvimento de sistemas por fábrica de software ou por contração de projetos de software com escopo definido.",
            "Viabilizar modelo de contingência e redundância de serviços de TIC.",
            "Implantar soluções de Inteligência Artificial (IA).",
            "Estruturar, tratar, sanear e harmonizar os dados do INPI."
        ]
    },
    {
        id: 6,
        title: "Assegurar financiamento sustentável para modernização e expansão da capacidade de prestação de serviços.",
        drivers: [
            "Assegurar autonomia financeira e de gestão do INPI.",
            "Implementar a Política de Preços e aprovar a nova Tabela de Preços do INPI."
        ]
    },
    {
        id: 7,
        title: "Garantir a recomposição e retenção da força de trabalho dimensionada para atender uma demanda crescente e sustentar o alto desempenho na prestação de serviços.",
        drivers: [
            "Estabelecer políticas de sucessão para gestores e ocupações críticas.",
            "Promover ativamente o desenvolvimento de políticas e práticas de diversidade, gênero e inclusão.",
            "Engajar o corpo funcional na missão, visão e valores do INPI, a partir do aperfeiçoamento e da implementação de ferramentas atualizadas de endomarketing e do compromisso com a qualidade dos fluxos descendentes, ascendentes e horizontais de comunicação interna.",
            "Promover a melhoria da qualidade de vida e bem-estar das pessoas no trabalho e realizar o monitoramento do clima organizacional.",
            "Promover oportunidades de estágio a alunos do ensino técnico, superior e da pós-graduação, possibilitando a vivência profissional e conhecimento básico de PI."
        ]
    },
    {
        id: 8,
        title: "Prover suporte de logística e infraestrutura econômico, eficiente e sustentável.",
        drivers: [
            "Assegurar infraestrutura necessária para operação e expansão da ação regional.",
            "Manter o modelo de locação de imóvel no quadriênio 2023-2026.",
            "Modelar o projeto de Parceria Público-Privada (PPP) para reforma do prédio da Praça da Bandeira.",
            "Consolidar e conquistar o reconhecimento público do programa de logística sustentável.",
            "Digitalizar o acervo de documentos físicos do INPI, com a estruturação de um banco de dados que permita a busca e acesso aos documentos."
        ]
    },
    {
        id: 9,
        title: "Aprimorar as práticas de governança e gestão, e de relacionamento institucional.",
        drivers: [
            "Modernizar o modelo institucional com ênfase na maior autonomia financeira de gestão e na preservação da natureza exclusiva de Estado das atividades do Instituto.",
            "Aprimorar continuamente e conquistar o reconhecimento público da excelência da gestão do INPI, tendo como base o modelo referencial do Modelo de Excelência em Gestão da Fundação Nacional da Qualidade (MEG/FNQ).",
            "Aprimorar a estrutura organizacional com foco no alinhamento com a estratégia, horizontalização e integração de processos.",
            "Aprimorar e sistematizar a governança institucional.",
            "Desenvolver a cultura de excelência do atendimento, de transparência e de valorização da experiência do usuário.",
            "Estruturar o relacionamento institucional com o Legislativo, Executivo e Judiciário.",
            "Estreitar o relacionamento institucional com as Justiças Estaduais, com vistas a auxiliar os Juízos com informações para solução de lides em matéria de PI.",
            "Sistematizar a produção normativa da PI no âmbito institucional."
        ]
    }
  ],
  values: [
    { name: "Excelência", description: "Perseguir padrões de excelência nos processos de trabalho, nos serviços prestados aos usuários e nas práticas de governança e gestão." },
    { name: "Foco nos Usuários", description: "Conhecer ativa e sistematicamente e orientar continuamente a ação individual e institucional a partir das necessidades e expectativas legítimas dos usuários internos e externos dos processos e serviços do INPI." },
    { name: "Vocação Pública", description: "Reconhecimento de que ser servidor público é uma escolha individual em servir a um bem comum e à sociedade, com dedicação, espírito de coletividade e satisfação." },
    { name: "Valorização das Pessoas", description: "Propiciar um ambiente que promova o desenvolvimento humano e a qualidade de vida, reconhecendo a satisfação no trabalho como fator crítico para o engajamento e o alto desempenho." },
    { name: "Espírito Inovador", description: "Incentivar a busca por soluções inovadoras, viáveis e efetivas para solução de problemas, reconhecendo e administrando os riscos inerentes à concepção e implementação de novas formas de pensar." },
    { name: "Cooperação", description: "Reconhecer e estimular a cooperação interna e externa como prática voltada à mobilização de recursos e competências para alavancar resultados transformadores." }
  ]
};

const Identidade: React.FC = () => {
    const [selectedObjective, setSelectedObjective] = useState(identityData.strategicObjectives[0].id);

    const currentDrivers = identityData.strategicObjectives.find(obj => obj.id === selectedObjective)?.drivers || [];

    const ObjectiveSelector: React.FC<{ objective: typeof identityData.strategicObjectives[0] }> = ({ objective }) => (
        <li>
            <label className={`flex items-center p-3 w-full text-sm font-medium text-left rounded-lg cursor-pointer transition-all duration-200 ${selectedObjective === objective.id ? 'bg-orange-600 text-white shadow-lg' : 'text-gray-300 bg-slate-700/50 hover:bg-slate-700'}`}>
                <input
                    type="radio"
                    name="objective"
                    className="hidden"
                    checked={selectedObjective === objective.id}
                    onChange={() => setSelectedObjective(objective.id)}
                />
                <div className={`w-5 h-5 flex-shrink-0 mr-4 rounded-full border-2 flex items-center justify-center ${selectedObjective === objective.id ? 'border-orange-200 bg-orange-600' : 'border-slate-500'}`}>
                    {selectedObjective === objective.id && <div className="w-2 h-2 bg-white rounded-full"></div>}
                </div>
                <span>{objective.title}</span>
            </label>
        </li>
    );

    return (
        <div className="space-y-12">
            <div>
                <h1 className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-400">
                    Identidade
                </h1>
                <div className="bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-700">
                    <p className="text-lg leading-relaxed text-gray-300">
                        A identidade institucional é o alicerce que orienta todas as nossas ações. Este módulo apresenta os pilares estratégicos do INPI — <span className="text-orange-400 font-serif-highlight">Missão, Visão, Valores e Objetivos</span> — e destaca a importância de alinhar o Processo de Gestão do Conhecimento a esses propósitos, garantindo que a criação, o compartilhamento e o uso do conhecimento contribuam diretamente para a <span className="text-orange-400 font-serif-highlight">realização da nossa estratégia</span> organizacional.
                    </p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-slate-800 p-8 rounded-xl border border-slate-700 flex flex-col items-center text-center shadow-lg">
                    <h2 className="text-2xl font-bold text-orange-400 mb-3">Missão</h2>
                    <p className="text-gray-200 text-xl font-light">{identityData.mission}</p>
                </div>
                <div className="bg-slate-800 p-8 rounded-xl border border-slate-700 flex flex-col items-center text-center shadow-lg">
                    <h2 className="text-2xl font-bold text-orange-400 mb-3">Visão</h2>
                    <p className="text-gray-200 text-xl font-light">{identityData.vision}</p>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                    <h2 className="text-2xl font-bold text-orange-400 mb-4">Objetivos Estratégicos</h2>
                    <ul className="space-y-3">
                        {identityData.strategicObjectives.map(obj => <ObjectiveSelector key={obj.id} objective={obj} />)}
                    </ul>
                </div>
                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                    <h2 className="text-2xl font-bold text-orange-400 mb-4">Direcionadores Estratégicos</h2>
                    <div className="space-y-3">
                         {currentDrivers.map((driver, index) => (
                            <div key={index} className="flex items-start text-gray-300 p-3 bg-slate-900/50 rounded-md">
                                <svg className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
                                <span>{driver}</span>
                            </div>
                         ))}
                    </div>
                </div>
            </div>

            <div>
                <h2 className="text-3xl font-bold text-center mb-8 text-gray-300">Valores Institucionais</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {identityData.values.map(value => (
                        <div key={value.name} className="bg-slate-800 p-6 rounded-lg border border-slate-700 hover:border-orange-500/50 transition-colors duration-300">
                            <h3 className="text-xl font-bold text-orange-400 mb-2">{value.name}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">{value.description}</p>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default Identidade;