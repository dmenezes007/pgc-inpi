import React from 'react';
import DocIcon from './DocIcon';

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
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900">Minutas para apreciação</h2>
                            <p className="mt-1 block text-sm text-slate-500 doc-subtext">Documentos centrais para leitura, análise técnica e contribuições complementares.</p>
                        </div>
                        <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-blue-700">3 documentos ativos</span>
                    </div>
                </div>

                <div className="space-y-4">
                    <a href="https://dmenezes007.github.io/pgi-inpi/files/docs/Minuta%20da%20Pol%C3%ADtica%20de%20Direitos%20Autorais%20da%20Academia.docx" target="_blank" rel="noopener noreferrer" className="group flex items-center rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md">
                        <DocIcon />
                        <div>
                            <span className="block text-sm font-semibold text-slate-900 group-hover:text-blue-700">Minuta da Política de Direitos Autorais da Academia</span>
                            <span className="mt-1 block text-sm text-slate-500">Documento de referência para proteção, uso e compartilhamento de conteúdos acadêmicos.</span>
                        </div>
                    </a>
                    <a href="https://dmenezes007.github.io/pgi-inpi/files/docs/Minuta%20da%20Pol%C3%ADtica%20Editorial%20da%20Academia.docx" target="_blank" rel="noopener noreferrer" className="group flex items-center rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md">
                        <DocIcon />
                        <div>
                            <span className="block text-sm font-semibold text-slate-900 group-hover:text-blue-700">Minuta da Política Editorial da Academia</span>
                            <span className="mt-1 block text-sm text-slate-500">Documento de referência para critérios editoriais, qualidade e curadoria institucional.</span>
                        </div>
                    </a>
                    <a href="https://dmenezes007.github.io/pgi-inpi/files/docs/Minuta%20do%20Regulamento%20da%20Revista%20Interfaces%20da%20PI.docx" target="_blank" rel="noopener noreferrer" className="group flex items-center rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md">
                        <DocIcon />
                        <div>
                            <span className="block text-sm font-semibold text-slate-900 group-hover:text-blue-700">Minuta do Regulamento da Revista Interfaces da PI</span>
                            <span className="mt-1 block text-sm text-slate-500">Documento de referência para governança editorial e publicação científica.</span>
                        </div>
                    </a>
                </div>

                <div className="grid gap-4 border-t border-slate-200 pt-6 md:grid-cols-2">
                    <p className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5 text-base text-slate-600">
                        Materiais de referência, apresentações e registros da metaoficina estão disponíveis em: <a href="https://inpidrive.inpi.gov.br/index.php/s/8O5OUlrufgmof3d" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-700 hover:underline">Repositório institucional</a>.
                    </p>
                    <p className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5 text-base text-slate-600">
                        Registro externo da colaboração com o Pólen/Fiocruz: <a href="https://www.instagram.com/p/DOydE7sjYcF/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-700 hover:underline">publicação de referência</a>.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Documentacao;