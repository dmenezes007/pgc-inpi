import React from 'react';
import DocIcon from './DocIcon';

const PROCESSOS_NIVEL_4 = [
    {
        titulo: '4.1 Identificação e Rastreamento dos Conhecimentos',
        objetivo:
            'Mapear, inventariar e classificar os conhecimentos existentes na organização, abrangendo conhecimentos explícitos e tácitos, com indicação de sua natureza, relevância, grau de domínio e distribuição por unidade.',
    },
    {
        titulo: '4.2 Mapeamento e Refinamento dos Conhecimentos',
        objetivo:
            'Organizar a base de conhecimentos priorizados, consolidando o mapa institucional com critérios gerenciais, cruzamentos de informação e ajustes contínuos para suporte à decisão.',
    },
    {
        titulo: '4.3 Detentores de Conhecimento',
        objetivo:
            'Identificar os servidores e as evidências institucionais associadas aos conhecimentos relevantes, fortalecendo consulta, mobilização, reposição e sucessão do conhecimento.',
    },
    {
        titulo: '4.4 Desenvolvimento dos Conhecimentos',
        objetivo:
            'Criar novos conhecimentos e aprimorar os existentes, orientando ações de capacitação, autodesenvolvimento, planejamento e fortalecimento das competências institucionais.',
    },
    {
        titulo: '4.5 Retenção e Proteção dos Conhecimentos',
        objetivo:
            'Preservar conhecimentos críticos e assegurar sua proteção, reduzindo riscos de perda de expertise, indisponibilidade de informações e exposição indevida de conteúdo sensível ou sigiloso.',
    },
    {
        titulo: '4.6 Utilização e Compartilhamento dos Conhecimentos',
        objetivo:
            'Garantir a aplicação efetiva dos conhecimentos nos processos de trabalho, na tomada de decisão e na geração de valor público, promovendo circulação, integração e uso institucional do conhecimento.',
    },
    {
        titulo: '4.7 Monitoramento da Gestão do Conhecimento',
        objetivo:
            'Acompanhar a execução, os resultados e a maturidade da Gestão do Conhecimento, permitindo avaliação contínua, correção de rumos e melhoria dos instrumentos adotados.',
    },
];

const Documentacao: React.FC = () => {
    return (
        <div className="module-page">
            <h1 className="module-title">
                Documentação
            </h1>
            <div className="module-intro">
                <div className="module-kicker">REPOSITÓRIO INSTITUCIONAL</div>
                <p className="module-lead">
                    Registro institucional dos documentos de referência ou de suporte ao desenvolvimento do processo de gestão do conhecimento no âmbito institucional.
                </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white/95 p-8 shadow-lg shadow-blue-100/50 space-y-8">
                <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-6">
                    <div className="space-y-6">
                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900">Estrutura do Processo de Gestão do Conhecimento</h2>
                                <p className="mt-1 block text-sm text-slate-500 doc-subtext">Representação da árvore de processo para orientação dos instrumentos e módulos operacionais.</p>
                            </div>
                            <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-blue-700">Processo de Nível 3 ativo</span>
                        </div>

                        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                            <div className="rounded-xl border border-blue-100 bg-white p-4">
                                <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">Tipo de Processo</p>
                                <p className="mt-1 text-sm font-semibold text-slate-800">Gestão</p>
                            </div>
                            <div className="rounded-xl border border-blue-100 bg-white p-4">
                                <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">Macroprocesso</p>
                                <p className="mt-1 text-sm font-semibold text-slate-800">Desenvolvimento e Transformação Organizacional</p>
                            </div>
                            <div className="rounded-xl border border-blue-100 bg-white p-4">
                                <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">Processo de Nível 2</p>
                                <p className="mt-1 text-sm font-semibold text-slate-800">Gestão da Inovação e do Conhecimento</p>
                            </div>
                            <div className="rounded-xl border border-blue-100 bg-white p-4">
                                <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">Processo de Nível 3</p>
                                <p className="mt-1 text-sm font-semibold text-slate-800">Gestão do Conhecimento</p>
                            </div>
                        </div>

                        <div className="rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50 p-5">
                            <p className="text-xs font-semibold uppercase tracking-wide text-blue-800">Objetivo do Processo de Nível 3</p>
                            <p className="mt-2 text-sm leading-relaxed text-slate-700">
                                Gerenciar o ciclo de vida do conhecimento organizacional, promovendo sua identificação, estruturação,
                                desenvolvimento, retenção, proteção, compartilhamento, aplicação e monitoramento, de modo a preservar
                                o capital intelectual, mitigar a perda de expertise crítica e ampliar a eficiência, a aprendizagem e a inovação institucional.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-slate-900 mb-3">Processos de Nível 4</h3>
                            <div className="grid gap-3 md:grid-cols-2">
                                {PROCESSOS_NIVEL_4.map((item) => (
                                    <article key={item.titulo} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                                        <h4 className="text-sm font-semibold text-blue-800">{item.titulo}</h4>
                                        <p className="mt-2 text-sm leading-relaxed text-slate-700">
                                            <span className="font-semibold">Objetivo:</span> {item.objetivo}
                                        </p>
                                    </article>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-slate-900">Normas Estruturantes da Gestão do Conhecimento</h2>
                    <a href="/docs/Minuta%20do%20Programa%20de%20Incentivos%20Educacionais.pdf" download="Minuta do Programa de Incentivos Educacionais.pdf" className="group flex items-center rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md">
                        <DocIcon />
                        <div>
                            <span className="block text-sm font-semibold text-slate-900 group-hover:text-blue-700">Minuta do Programa de Incentivos Educacionais</span>
                            <span className="mt-1 block text-sm text-slate-500">Documento de referência para diretrizes de incentivo ao autodesenvolvimento e formação continuada.</span>
                        </div>
                    </a>
                    <a href="/docs/Minuta%20da%20Pol%C3%ADtica%20de%20Direitos%20Autorais%20da%20Academia.pdf" download="Minuta da Política de Direitos Autorais da Academia.pdf" className="group flex items-center rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md">
                        <DocIcon />
                        <div>
                            <span className="block text-sm font-semibold text-slate-900 group-hover:text-blue-700">Minuta da Política de Direitos Autorais da Academia</span>
                            <span className="mt-1 block text-sm text-slate-500">Documento de referência para proteção, uso e compartilhamento de conteúdos acadêmicos.</span>
                        </div>
                    </a>
                    <a href="/docs/Minuta%20da%20Pol%C3%ADtica%20Editorial%20da%20Academia.pdf" download="Minuta da Política Editorial da Academia.pdf" className="group flex items-center rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md">
                        <DocIcon />
                        <div>
                            <span className="block text-sm font-semibold text-slate-900 group-hover:text-blue-700">Minuta da Política Editorial da Academia</span>
                            <span className="mt-1 block text-sm text-slate-500">Documento de referência para critérios editoriais, qualidade e curadoria institucional.</span>
                        </div>
                    </a>
                    <a href="/docs/Minuta%20do%20Regulamento%20da%20Revista%20Interfaces%20da%20PI.pdf" download="Minuta do Regulamento da Revista Interfaces da PI.pdf" className="group flex items-center rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md">
                        <DocIcon />
                        <div>
                            <span className="block text-sm font-semibold text-slate-900 group-hover:text-blue-700">Minuta do Regulamento da Revista Interfaces da PI</span>
                            <span className="mt-1 block text-sm text-slate-500">Documento de referência para governança editorial e publicação científica.</span>
                        </div>
                    </a>
                </div>

            </div>
        </div>
    );
};

export default Documentacao;