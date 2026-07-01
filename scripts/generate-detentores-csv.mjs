import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import XLSX from 'xlsx';
import Papa from 'papaparse';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const inputExcel = path.join(rootDir, 'base-capacitacoes.xlsx');
const inputTecnica = path.join(rootDir, 'src', 'files', 'docs', 'tecnica.csv');
const outputCsv = path.join(rootDir, 'src', 'files', 'docs', 'detentores.csv');

const LIDERANCA_OPTIONS = [
  'Visão de Futuro',
  'Inovação e Mudança',
  'Comunicação Estratégica',
  'Geração de Valor para o Usuário',
  'Gestão para Resultados',
  'Gestão de Crises',
  'Autoconhecimento e Desenvolvimento Pessoal',
  'Engajamento de Pessoas e Equipes',
  'Coordenação e Colaboração em Rede',
];

const TRANSVERSAL_OPTIONS = [
  'Resolução de Problemas com Base em Dados',
  'Foco nos Resultados para os Cidadãos',
  'Mentalidade Digital',
  'Comunicação',
  'Trabalho em Equipe',
  'Orientação por Valores Éticos',
  'Visão Sistêmica',
];

const STOP_WORDS = new Set([
  'CURSO', 'EVENTO', 'CAPACITACAO', 'SOBRE', 'PESSOAS', 'COM', 'PARA', 'DAS', 'DOS', 'DA', 'DE', 'DO', 'EM',
  'NO', 'NA', 'E', 'A', 'O', 'AS', 'OS', 'AO', 'AOS', 'NAS', 'NOS', 'POR', 'PELA', 'PELO', 'UM', 'UMA', 'UNIDADE',
  'INPI', 'BRASIL', 'NACIONAL', 'INSTITUTO', 'OFICINA', 'WORKSHOP', 'TREINAMENTO', 'MODULO'
]);

const NATUREZA_KEYWORDS = {
  Liderança: [
    'LIDERANCA', 'LIDERAR', 'GESTAO', 'RESULTADOS', 'CRISE', 'ENGAJAMENTO', 'EQUIPE', 'MOTIVACAO', 'COORDENACAO',
    'ESTRATEGICA', 'DESENVOLVIMENTO PESSOAL'
  ],
  Transversal: [
    'COMUNICACAO', 'TRABALHO EM EQUIPE', 'ETICA', 'MENTALIDADE DIGITAL', 'VISAO SISTEMICA', 'DADOS',
    'RESOLUCAO DE PROBLEMAS', 'COLABORACAO'
  ],
  Técnico: [
    'PATENTE', 'MARCAS', 'DESENHO INDUSTRIAL', 'PROPRIEDADE INTELECTUAL', 'TECNOLOGIA', 'EXAME', 'NULIDADE',
    'OPOSICAO', 'DI', 'PI', 'SOFTWARE', 'TRANSFERENCIA DE TECNOLOGIA', 'BUSCA'
  ]
};

const normalizeText = (value) =>
  String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toUpperCase();

const cleanupText = (value) =>
  String(value ?? '')
    .replace(/\s+/g, ' ')
    .replace(/\s*\/\s*/g, ' / ')
    .trim();

const toTitlePt = (value) => {
  const minor = new Set(['de', 'da', 'do', 'das', 'dos', 'e', 'em', 'para', 'por', 'com']);
  return cleanupText(value)
    .toLowerCase()
    .split(' ')
    .map((word, idx) => {
      if (!word) return word;
      if (idx > 0 && minor.has(word)) return word;
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
};

const simpleStem = (token) => {
  let out = token;
  out = out.replace(/(COES|CAO|MENTOS|MENTO|IDADES|IDADE|S|ES)$/g, '');
  out = out.replace(/(MENTE|ALMENTE)$/g, '');
  return out.length >= 4 ? out : token;
};

const tokenizeMeaningful = (value) =>
  normalizeText(value)
    .split(/[^A-Z0-9]+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 2 && !STOP_WORDS.has(t))
    .flatMap((t) => [t, simpleStem(t)]);

const toNgrams = (value, size = 3) => {
  const input = normalizeText(value).replace(/\s+/g, ' ');
  const grams = new Set();
  if (input.length < size) return grams;
  for (let i = 0; i <= input.length - size; i += 1) grams.add(input.slice(i, i + size));
  return grams;
};

const jaccard = (aSet, bSet) => {
  if (aSet.size === 0 || bSet.size === 0) return 0;
  let inter = 0;
  aSet.forEach((item) => {
    if (bSet.has(item)) inter += 1;
  });
  const union = aSet.size + bSet.size - inter;
  return union === 0 ? 0 : inter / union;
};

const semanticScore = (source, option) => {
  const sourceNorm = normalizeText(source);
  const optionNorm = normalizeText(option);
  if (!sourceNorm || !optionNorm) return 0;

  const exact = sourceNorm === optionNorm ? 1 : 0;
  const contains = sourceNorm.includes(optionNorm) ? 1 : 0;

  const sourceTokens = new Set(tokenizeMeaningful(sourceNorm));
  const optionTokens = new Set(tokenizeMeaningful(optionNorm));
  const tokenOverlap = jaccard(sourceTokens, optionTokens);

  const trigramOverlap = jaccard(toNgrams(sourceNorm), toNgrams(optionNorm));

  let prefixHits = 0;
  optionTokens.forEach((token) => {
    if (Array.from(sourceTokens).some((src) => src.startsWith(token) || token.startsWith(src))) {
      prefixHits += 1;
    }
  });

  return exact * 8 + contains * 4 + tokenOverlap * 5 + trigramOverlap * 3 + prefixHits * 0.6;
};

const bestMatch = (source, options, minScore = 2.2) => {
  let best = '';
  let bestScore = 0;
  options.forEach((option) => {
    const score = semanticScore(source, option);
    if (score > bestScore) {
      best = option;
      bestScore = score;
    }
  });
  return bestScore >= minScore ? best : '';
};

const detectAno = (anoValue, context) => {
  const normalizedAno = cleanupText(anoValue);
  if (/^(19|20)\d{2}$/.test(normalizedAno)) return normalizedAno;
  const match = normalizeText(context).match(/(19|20)\d{2}/);
  return match ? match[0] : '-';
};

const getCell = (obj, candidates) => {
  for (const key of Object.keys(obj)) {
    const lower = key.toLowerCase();
    if (candidates.some((candidate) => lower.includes(candidate))) {
      return cleanupText(obj[key]);
    }
  }
  return '';
};

const classifyNatureza = (text) => {
  const content = normalizeText(text);
  const scores = {
    Liderança: 0,
    Transversal: 0,
    Técnico: 0,
  };

  Object.entries(NATUREZA_KEYWORDS).forEach(([natureza, keywords]) => {
    keywords.forEach((keyword) => {
      if (content.includes(keyword)) scores[natureza] += 2;
    });
  });

  const liderancaSemantic = bestMatch(content, LIDERANCA_OPTIONS, 0) ? 1.5 : 0;
  const transversalSemantic = bestMatch(content, TRANSVERSAL_OPTIONS, 0) ? 1.2 : 0;
  scores['Liderança'] += liderancaSemantic;
  scores['Transversal'] += transversalSemantic;

  const ordered = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  if (ordered[0][1] <= 0) return 'Técnico';
  return ordered[0][0];
};

const main = async () => {
  const tecnicaText = await fs.readFile(inputTecnica, 'utf-8');
  const tecnicaParsed = Papa.parse(tecnicaText, { header: true, skipEmptyLines: true, delimiter: ';' });

  const tecnicaOptions = new Set();
  tecnicaParsed.data.forEach((row) => {
    const nivel3 = cleanupText(row.Nivel3 || '');
    const nivel2 = cleanupText(row.Nivel2 || '');
    const nivel1 = cleanupText(row.Nivel1 || '');
    if (nivel3) tecnicaOptions.add(toTitlePt(nivel3));
    else if (nivel2) tecnicaOptions.add(toTitlePt(nivel2));
    else if (nivel1) tecnicaOptions.add(toTitlePt(nivel1));
  });

  const tecnicaList = Array.from(tecnicaOptions).sort((a, b) => a.localeCompare(b, 'pt-BR'));

  const workbook = XLSX.readFile(inputExcel);
  const sheet = workbook.Sheets['BASE CETEC'] || workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });

  const outputRows = [];

  rows.forEach((row) => {
    const servidor = getCell(row, ['servidor', 'nome']);
    const conhecimento = getCell(row, ['conhecimento', 'tema', 'assunto', 'capacita']);
    const capacitacao = getCell(row, ['evento']);
    const ano = getCell(row, ['ano', 'year']);
    const cargaHoraria = getCell(row, ['carga horaria', 'carga']);
    const linhaCapacitacao = getCell(row, ['linha de capacitacao']);
    const programa = getCell(row, ['programa']);
    const uorg = getCell(row, ['uorg']);

    if (!servidor || (!conhecimento && !capacitacao)) return;

    const merged = [conhecimento, capacitacao, linhaCapacitacao, programa, uorg].filter(Boolean).join(' | ');
    const natureza = classifyNatureza(merged);

    let mapped = '';
    if (natureza === 'Liderança') {
      mapped = bestMatch(merged, LIDERANCA_OPTIONS) || LIDERANCA_OPTIONS[0];
    } else if (natureza === 'Transversal') {
      mapped = bestMatch(merged, TRANSVERSAL_OPTIONS) || TRANSVERSAL_OPTIONS[0];
    } else {
      mapped = bestMatch(merged, tecnicaList) || tecnicaList[0] || 'Conhecimento Técnico';
    }

    outputRows.push({
      Servidor: toTitlePt(servidor),
      Natureza: natureza,
      Conhecimento: toTitlePt(mapped),
      Capacitacao: toTitlePt(capacitacao || conhecimento),
      Ano: detectAno(ano, merged),
      CargaHoraria: cleanupText(cargaHoraria || '-'),
    });
  });

  const csv = Papa.unparse(outputRows, { delimiter: ';', header: true, newline: '\n' });
  await fs.writeFile(outputCsv, csv, 'utf-8');
  console.log(`Arquivo gerado com ${outputRows.length} registros em: ${outputCsv}`);
};

main().catch((err) => {
  console.error('Falha na geração do CSV de detentores:', err);
  process.exit(1);
});
