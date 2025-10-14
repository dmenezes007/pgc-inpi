
import React from 'react';

const Tecnica: React.FC = () => {
    return (
        <div>
            <h1 className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-400">
                Técnica
            </h1>
            <div className="bg-slate-800 p-6 rounded-lg shadow-lg mb-10 border border-slate-700">
                <p className="text-lg leading-relaxed text-gray-300">
                    As competências técnicas representam o <span className="text-orange-400 font-serif-highlight">conhecimento especializado</span> necessário para a execução das atividades finalísticas e de suporte do INPI. Elas variam de acordo com as especificidades de cada <span className="text-orange-400 font-serif-highlight">cargo, unidade, formação e experiência</span>, sendo o alicerce para a <span className="text-orange-400 font-serif-highlight">qualidade e a precisão</span> de nossos serviços.
                </p>
            </div>
            <div className="space-y-6">
                <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
                    <h2 className="text-xl font-bold text-gray-200 mb-3">Mapeamento Contínuo</h2>
                    <p className="text-gray-300">
                        A identificação e o desenvolvimento das competências técnicas são um processo contínuo, que envolve o mapeamento das necessidades de cada área, a análise de lacunas de conhecimento e a criação de trilhas de aprendizagem específicas para garantir que nossos servidores estejam sempre atualizados com as melhores práticas e as mais recentes tecnologias de suas áreas de atuação.
                    </p>
                </div>
                 <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
                    <h2 className="text-xl font-bold text-gray-200 mb-3">Exemplos de Áreas de Competência</h2>
                    <ul className="list-disc list-inside text-gray-300 space-y-2">
                        <li>Exame de Patentes em áreas tecnológicas específicas (ex: biotecnologia, telecomunicações).</li>
                        <li>Análise de registrabilidade de Marcas e Desenhos Industriais.</li>
                        <li>Desenvolvimento e manutenção de sistemas de TI para Propriedade Industrial.</li>
                        <li>Atuação em contencioso judicial e administrativo de PI.</li>
                        <li>Gestão de contratos, finanças e recursos humanos no setor público.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Tecnica;
