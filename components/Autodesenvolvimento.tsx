
import React from 'react';

const Autodesenvolvimento: React.FC = () => {
    return (
        <div>
            <h1 className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-400">
                Autodesenvolvimento
            </h1>
            <div className="bg-slate-800 p-6 rounded-lg shadow-lg mb-10 border border-slate-700">
                <p className="text-lg leading-relaxed text-gray-300">
                    O <span className="text-orange-400 font-serif-highlight">protagonismo do servidor</span> em sua própria jornada de aprendizagem é fundamental. O autodesenvolvimento reflete a <span className="text-orange-400 font-serif-highlight">iniciativa individual</span> na busca por qualificação, e o INPI apoia e incentiva essa postura por meio de programas que valorizam o <span className="text-orange-400 font-serif-highlight">crescimento contínuo</span>.
                </p>
            </div>
            <div className="bg-slate-800 p-8 rounded-lg shadow-lg border border-slate-700">
                <h2 className="text-2xl font-bold text-orange-400 mb-4">Programa de Incentivos Educacionais</h2>
                <p className="text-gray-300 mb-4">
                    Para estimular o autodesenvolvimento, o INPI oferece um Programa de Incentivos Educacionais que apoia a participação de servidores em cursos de graduação, pós-graduação, idiomas e outros, que sejam alinhados às áreas de interesse do Instituto.
                </p>
                <p className="text-gray-300">
                    Este programa não apenas contribui para o crescimento profissional do indivíduo, mas também agrega novas competências e conhecimentos à organização, fortalecendo nosso capital intelectual de forma sustentável.
                </p>
            </div>
        </div>
    );
};

export default Autodesenvolvimento;
