import Papa from 'papaparse';
import coursesCsvRaw from '../curadoria_de_cursos.csv?raw';

export interface CuratedCourse {
  status: string;
  area: string;
  instituicao: string;
  logoInstituicao: string;
  tematica: string;
  curso: string;
  ch: string;
  link: string;
  modalidade: string;
  nivel: string;
  plataforma: string;
  objetivo: string;
  competencia: string;
}

interface CuradoriaRow {
  Status?: string;
  Area?: string;
  Instituicao?: string;
  LogoInstituicao?: string;
  Tematica?: string;
  Curso?: string;
  CH?: string;
  Link?: string;
  Modalidade?: string;
  Nivel?: string;
  Plataforma?: string;
  Objetivo?: string;
  Competencia?: string;
}

const statusPriority: Record<string, number> = {
  'ABERTO': 4,
  'EM ANDAMENTO': 3,
  'EM BREVE': 2,
  'CONCLUÍDO': 1,
};

const knowledgeThemes: Record<string, string[]> = {
  'visao de futuro': ['gestao da estrategia', 'governanca', 'impacto regulatorio', 'indicadores gerenciais'],
  'inovacao e mudanca': ['tecnologia da informacao', 'gestao de projetos', 'gestao por processos', 'gestao do conhecimento', 'inovacao'],
  'comunicacao estrategica': ['comunicacao', 'redacao oficial', 'marketing digital'],
  'geracao de valor para o usuario': ['avaliacao da qualidade de servicos', 'defesa do usuario e simplificacao', 'gestao em ouvidoria'],
  'gestao para resultados': ['gestao por resultados', 'indicadores gerenciais', 'gestao da estrategia', 'gestao por processos'],
  'gestao de crises': ['gestao de riscos', 'integridade', 'auditoria'],
  'autoconhecimento e desenvolvimento pessoal': ['desenvolvimento pessoal', 'gestao de pessoas', 'bem-estar e saude'],
  'engajamento de pessoas e equipes': ['gestao de pessoas', 'desenvolvimento de equipes'],
  'coordenacao e colaboracao em rede': ['governanca', 'comunicacao', 'gestao da estrategia'],
  'resolucao de problemas com base em dados': ['dados', 'power bi', 'tecnologia da informacao'],
  'foco nos resultados para os cidadaos': ['gestao por resultados', 'avaliacao da qualidade de servicos', 'defesa do usuario e simplificacao'],
  'mentalidade digital': ['tecnologia da informacao', 'dados', 'transformacao digital'],
  'comunicacao': ['comunicacao', 'redacao oficial', 'marketing digital'],
  'trabalho em equipe': ['gestao de pessoas', 'desenvolvimento de equipes'],
  'orientacao por valores eticos': ['integridade', 'direito administrativo (correicao)', 'diversidade'],
  'visao sistemica': ['governanca', 'gestao da estrategia', 'impacto regulatorio', 'gestao por processos'],
};

const technicalKeywordThemes: Record<string, string[]> = {
  'patentes': ['patentes'],
  'marcas': ['marcas'],
  'desenhos industriais': ['desenhos industriais'],
  'indicacoes geograficas': ['indicacoes geograficas'],
  'programas de computador': ['programas de computador'],
  'software': ['programas de computador', 'tecnologia da informacao'],
  'topografias de circuitos integrados': ['direitos de propriedade industrial'],
  'propriedade intelectual': ['propriedade intelectual', 'direitos de propriedade industrial'],
  'propriedade industrial': ['direitos de propriedade industrial'],
  'previdencia': ['previdencia'],
  'auditoria': ['auditoria'],
  'integridade': ['integridade'],
  'dados': ['dados', 'power bi'],
  'comunicacao': ['comunicacao', 'redacao oficial'],
  'gestao de pessoas': ['gestao de pessoas'],
  'gestao de projetos': ['gestao de projetos'],
  'tecnologia da informacao': ['tecnologia da informacao'],
  'diversidade': ['diversidade'],
  'idiomas': ['idiomas'],
};

const normalize = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

const tokenize = (value: string): string[] => {
  const stopwords = new Set([
    'de', 'da', 'do', 'das', 'dos', 'e', 'em', 'no', 'na', 'nos', 'nas', 'para', 'com', 'por', 'a', 'o', 'as', 'os', 'ao', 'aos'
  ]);

  return normalize(value)
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length > 2 && !stopwords.has(token));
};

const parseCourses = (): CuratedCourse[] => {
  const parsed = Papa.parse<CuradoriaRow>(coursesCsvRaw, {
    header: true,
    skipEmptyLines: true,
    delimiter: ';',
  });

  const dedupe = new Set<string>();

  return parsed.data
    .filter((row) => row?.Curso)
    .map((row) => ({
      status: row.Status?.trim() || 'N/D',
      area: row.Area?.trim() || '',
      instituicao: row.Instituicao?.trim() || '',
      logoInstituicao: row.LogoInstituicao?.trim() || '',
      tematica: row.Tematica?.trim() || '',
      curso: row.Curso?.trim() || '',
      ch: row.CH?.trim() || '',
      link: row.Link?.trim() || '',
      modalidade: row.Modalidade?.trim() || '',
      nivel: row.Nivel?.trim() || '',
      plataforma: row.Plataforma?.trim() || '',
      objetivo: row.Objetivo?.trim() || '',
      competencia: row.Competencia?.trim() || '',
    }))
    .filter((course) => {
      const key = `${normalize(course.curso)}|${course.link}`;
      if (dedupe.has(key)) {
        return false;
      }
      dedupe.add(key);
      return true;
    });
};

const collectHints = (knowledge: string): string[] => {
  const normalized = normalize(knowledge);
  const hints = new Set<string>();

  Object.entries(technicalKeywordThemes).forEach(([needle, themes]) => {
    if (normalized.includes(needle)) {
      themes.forEach((theme) => hints.add(theme));
    }
  });

  const mappedThemes = knowledgeThemes[normalized] || [];
  mappedThemes.forEach((theme) => hints.add(theme));

  tokenize(knowledge).forEach((token) => hints.add(token));

  return Array.from(hints);
};

const scoreCourse = (course: CuratedCourse, hints: string[]): number => {
  const tematica = normalize(course.tematica);
  const curso = normalize(course.curso);
  const objetivo = normalize(course.objetivo);
  const competencia = normalize(course.competencia);

  let score = 0;

  hints.forEach((hint) => {
    if (!hint) {
      return;
    }

    if (tematica === hint) {
      score += 5;
    } else if (tematica.includes(hint)) {
      score += 3;
    }

    if (curso.includes(hint)) {
      score += 2;
    }

    if (objetivo.includes(hint) || competencia.includes(hint)) {
      score += 1;
    }
  });

  return score;
};

export const curatedCourses: CuratedCourse[] = parseCourses();

export const getRecommendedCourses = (knowledge: string, maxItems = 3): CuratedCourse[] => {
  const hints = collectHints(knowledge);

  return curatedCourses
    .map((course) => ({
      course,
      score: scoreCourse(course, hints),
      priority: statusPriority[course.status] || 0,
    }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      if (b.priority !== a.priority) {
        return b.priority - a.priority;
      }
      return a.course.curso.localeCompare(b.course.curso);
    })
    .slice(0, maxItems)
    .map((entry) => entry.course);
};
