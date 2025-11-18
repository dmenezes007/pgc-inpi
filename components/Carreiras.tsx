import React from 'react';

const Carreiras: React.FC = () => {
    const carreiras = [
        {
            titulo: "Especialista Sênior em Propriedade Intelectual",
            descricao: "Cargo isolado de provimento efetivo, estruturado em Classe única, com atribuições de natureza técnica especializada de alto nível de complexidade, voltadas às atividades de prospecção e disseminação de novas tecnologias produtivas, ensino e pesquisa continuados, coordenação de projetos de desenvolvimento técnico especializado, de planos de ação estratégica e de estudos socioeconômicos para a formulação de políticas e programas de propriedade intelectual."
        },
        {
            titulo: "Carreira de Pesquisa em Propriedade Industrial",
            descricao: "Estruturada nas Classes A, B, C e Especial, composta de cargo de Pesquisador em Propriedade Industrial, de nível superior, com atribuições de natureza técnica especializada, voltadas aos exames de pedidos e elaboração de pareceres técnicos para concessão de direitos de patentes, averbação de contratos de transferência de tecnologia, registro de desenho industrial e de indicações geográficas, desenvolvimento de programas e projetos visando à disseminação da informação tecnológica das bases de patentes, desenvolvimento de ações e projetos de divulgação e fortalecimento da propriedade industrial e realização de estudos e pesquisas relativas à área."
        },
        {
            titulo: "Carreira de Produção e Análise em Propriedade Industrial",
            descricao: "Estruturada nas classes A, B, C e Especial, composta de cargo de Tecnologista em Propriedade Industrial, de nível superior, com atribuições de natureza técnica especializada, voltadas aos exames de pedidos e elaboração de pareceres técnicos para concessão de direitos relativos ao registro de marcas, de desenho industrial e de indicações geográficas, entre outros, desenvolvimento de ações e projetos de divulgação e fortalecimento da propriedade industrial e realização de estudos técnicos relativos à área."
        },
        {
            titulo: "Carreira de Suporte Técnico em Propriedade Industrial",
            descricao: "Estruturada nas classes A, B, C e Especial, composta de cargo de Técnico em Propriedade Industrial, de nível intermediário, com atribuições voltadas para o suporte e o apoio técnico especializado em matéria de propriedade industrial e intelectual."
        },
        {
            titulo: "Carreira de Planejamento, Gestão e Infraestrutura em Propriedade Industrial",
            descricao: "Estruturada nas classes A, B, C e Especial, composta de cargo de Analista de Planejamento, Gestão e Infraestrutura em Propriedade Industrial, de nível superior, com atribuições voltadas para o exercício de atividades de análise, elaboração, aperfeiçoamento e aplicação de modelos conceituais, processos, instrumentos e técnicas relacionadas às funções de planejamento, logística e administração em geral, bem como desenvolvimento de ações e projetos de divulgação e fortalecimento da propriedade industrial."
        },
        {
            titulo: "Carreira de Suporte em Planejamento, Gestão e Infraestrutura em Propriedade Industrial",
            descricao: "Estruturada nas classes A, B, C e Especial, composta de cargo de Técnico em Planejamento, Gestão e Infraestrutura em Propriedade Industrial, de nível intermediário, com atribuições voltadas para o exercício de atividades administrativas e logísticas de nível intermediário, relativas ao exercício das competências institucionais e legais a cargo do INPI."
        }
    ];

    return (
        <div className="space-y-8">
            <h3 className="text-2xl font-semibold text-gray-200">Plano de Carreiras e Cargos do INPI</h3>
            <p className="text-gray-300">
                O Plano de Carreiras e Cargos do INPI, conforme o Art. 90 da Lei nº 11.355, de 19 de outubro de 2006, é composto pelas seguintes Carreiras e cargos:
            </p>
            <div className="space-y-4">
                {carreiras.map((carreira, index) => (
                    <div key={index} className="p-4 bg-slate-900/50 rounded-lg border border-slate-700">
                        <h4 className="font-bold text-orange-400">{carreira.titulo}</h4>
                        <p className="text-gray-400 mt-2">{carreira.descricao}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Carreiras;
