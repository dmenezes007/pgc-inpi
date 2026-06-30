import React, { useEffect, useMemo, useState } from 'react';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import baseCapacitacoesUrl from '../base-capacitacoes.xlsx?url';
import tecnicaCsvUrl from '../src/files/docs/tecnica.csv?url';

type NaturezaConhecimento = 'Liderança' | 'Transversal' | 'Técnico' | 'Não classificado';

interface CapacitacaoRow {
  servidor: string;
  conhecimento: string;
  capacitacao: string;
  ano: string;
  cargaHoraria: string;
  linhaCapacitacao: string;
  programa: string;
  uorg: string;
}

interface JoinedRow {
  servidor: string;
  conhecimento: string;
  capacitacao: string;
  ano: string;
  cargaHoraria: string;
  natureza: NaturezaConhecimento;
}

interface TecnicaRow {
  Nivel1: string;
  Nivel2: string;
  Nivel3: string;
}

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

const LIDERANCA_KEYWORDS = [
  'LIDERAN',
  'GESTAO POR OBJETIVOS',
  'GESTAO POR OBJETIVOS/RESULTADOS',
  'GESTAO DE EQUIPES',
  'MOTIVA',
  'LIDERANCA E MOTIVACAO',
  'DESENVOLVIMENTO DE EQUIPES',
  'MELHORIA CONTINUA',
  'QUALIDADE TOTAL',
  'GESTAO',
];

const TRANSVERSAL_KEYWORDS = [
  'COMUNICAC',
  'TRABALHO EM EQUIPE',
  'VISAO SISTEMICA',
  'RESULTADOS PARA OS CIDADAOS',
  'ORIENTACAO POR VALORES ETICOS',
  'MENTALIDADE DIGITAL',
  'RESOLUCAO DE PROBLEMAS',
  'COLABORAC',
  'INSTRU',
  'FACILITA',
];

const TECNICA_KEYWORDS = [
  'TECNICA',
  'TECNOLOG',
  'PROPRIEDADE INTELECTUAL',
  'MARCAS',
  'PATENTE',
  'DESENHO INDUSTRIAL',
  'NOME DE DOMINIO',
  'ENGENHARIA',
  'AVALIAC',
  'PERIC',
  'DIREITO AUTORAL',
  'PUBLICAC',
  'REVISTA',
];

const normalize = (value: unknown): string => String(value ?? '').trim();
const normalizeKey = (value: unknown): string => normalize(value).toLowerCase();

const getCell = (obj: Record<string, any>, candidates: string[]): string => {
  for (const key of Object.keys(obj)) {
    const lower = key.toLowerCase();
    if (candidates.some((c) => lower.includes(c))) {
      return normalize(obj[key]);
    }
  }
  return '';
};

const detectAno = (anoValue: string, cursoValue: string = ''): string => {
  if (anoValue) return anoValue;
  const match = cursoValue.match(/(19|20)\d{2}/);
  return match ? match[0] : '-';
};

const normalizeText = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toUpperCase()
    .trim();

const tokenize = (value: string): string[] =>
  normalizeText(value)
    .split(/[^A-Z0-9]+/)
    .filter((token) => token.length > 2);

const bestAreaMatch = (source: string, options: string[]): string | '' => {
  const sourceTokens = tokenize(source);
  if (sourceTokens.length === 0) return '';

  let best = '';
  let bestScore = -1;

  options.forEach((option) => {
    const optionTokens = tokenize(option);
    const tokenHits = optionTokens.filter((token) => sourceTokens.includes(token)).length;
    const directBoost = normalizeText(source).includes(normalizeText(option)) ? 2 : 0;
    const score = tokenHits + directBoost;

    if (score > bestScore) {
      best = option;
      bestScore = score;
    }
  });

  return bestScore > 0 ? best : '';
};

const classifyNatureza = (row: Record<string, any>): NaturezaConhecimento => {
  const eventText = normalizeText(getCell(row, ['evento', 'curso', 'acao', 'capacita']));
  const lineText = normalizeText(getCell(row, ['linha de capacitacao', 'programa', 'uorg']));

  if (LIDERANCA_KEYWORDS.some((keyword) => eventText.includes(keyword) || lineText.includes(keyword))) {
    return 'Liderança';
  }

  if (TRANSVERSAL_KEYWORDS.some((keyword) => eventText.includes(keyword) || lineText.includes(keyword))) {
    return 'Transversal';
  }

  if (TECNICA_KEYWORDS.some((keyword) => eventText.includes(keyword) || lineText.includes(keyword))) {
    return 'Técnico';
  }

  return 'Técnico';
};

const Detentores: React.FC = () => {
  const [rows, setRows] = useState<JoinedRow[]>([]);
  const [queryConhecimento, setQueryConhecimento] = useState('');
  const [queryServidor, setQueryServidor] = useState('');
  const [queryNatureza, setQueryNatureza] = useState<'Todos' | NaturezaConhecimento>('Todos');
  const [pageSize, setPageSize] = useState(5);
  const [page, setPage] = useState(1);
  const [expandedServidores, setExpandedServidores] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const load = async () => {
      try {
        const [excelResp, tecnicaResp] = await Promise.all([
          fetch(baseCapacitacoesUrl),
          fetch(tecnicaCsvUrl),
        ]);

        const [buffer, tecnicaCsv] = await Promise.all([
          excelResp.arrayBuffer(),
          tecnicaResp.text(),
        ]);

        const tecnicaParsed = Papa.parse<TecnicaRow>(tecnicaCsv, {
          header: true,
          skipEmptyLines: true,
          delimiter: ';',
        });

        const tecnicaSet = new Set<string>();
        const tecnicaAreasSet = new Set<string>();
        tecnicaParsed.data.forEach((row) => {
          if (row.Nivel1) tecnicaSet.add(normalizeKey(row.Nivel1));
          if (row.Nivel2) tecnicaSet.add(normalizeKey(row.Nivel2));
          if (row.Nivel3) tecnicaSet.add(normalizeKey(row.Nivel3));
          if (row.Nivel3) tecnicaAreasSet.add(normalize(row.Nivel3));
        });

        const tecnicaAreas = Array.from(tecnicaAreasSet).sort((a, b) => a.localeCompare(b, 'pt-BR'));

        const liderancaSet = new Set(LIDERANCA_OPTIONS.map(normalizeKey));
        const transversalSet = new Set(TRANSVERSAL_OPTIONS.map(normalizeKey));

        const wb = XLSX.read(buffer, { type: 'array' });
        const capacitacoesSheet = wb.Sheets[wb.SheetNames[0]];
        const capRaw = XLSX.utils.sheet_to_json<Record<string, any>>(capacitacoesSheet, { defval: '' });

        const capacitacoes: CapacitacaoRow[] = capRaw
          .map((row) => ({
            servidor: getCell(row, ['servidor', 'nome']),
            conhecimento: getCell(row, ['conhecimento', 'tema', 'assunto', 'capacita']),
            capacitacao: getCell(row, ['evento']),
            ano: getCell(row, ['ano', 'year']),
            cargaHoraria: getCell(row, ['carga horaria', 'carga']),
            linhaCapacitacao: getCell(row, ['linha de capacitacao']),
            programa: getCell(row, ['programa']),
            uorg: getCell(row, ['uorg']),
          }))
          .filter((r) => r.servidor && (r.conhecimento || r.capacitacao));

        const joined: JoinedRow[] = capacitacoes.map((c) => {
          const knowledgeKey = normalizeKey(c.conhecimento);
          const capacitacaoKey = normalizeKey(c.capacitacao);
          const combinedText = normalizeText([c.conhecimento, c.capacitacao, c.linhaCapacitacao, c.programa, c.uorg].filter(Boolean).join(' '));
          const sourceText = [c.conhecimento, c.capacitacao, c.linhaCapacitacao, c.programa, c.uorg].filter(Boolean).join(' ');
          let natureza = classifyNatureza({
            conhecimento: combinedText,
            evento: capacitacaoKey,
            'linha de capacitacao': c.linhaCapacitacao,
            programa: c.programa,
            uorg: c.uorg,
          });

          if (liderancaSet.has(knowledgeKey) || liderancaSet.has(capacitacaoKey)) {
            natureza = 'Liderança';
          } else if (transversalSet.has(knowledgeKey) || transversalSet.has(capacitacaoKey)) {
            natureza = 'Transversal';
          } else if (tecnicaSet.has(knowledgeKey) || tecnicaSet.has(capacitacaoKey)) {
            natureza = 'Técnico';
          }

          let conhecimentoMapeado = c.conhecimento || c.capacitacao;

          if (natureza === 'Liderança') {
            conhecimentoMapeado =
              bestAreaMatch(sourceText, LIDERANCA_OPTIONS) ||
              LIDERANCA_OPTIONS[0];
          } else if (natureza === 'Transversal') {
            conhecimentoMapeado =
              bestAreaMatch(sourceText, TRANSVERSAL_OPTIONS) ||
              TRANSVERSAL_OPTIONS[0];
          } else {
            conhecimentoMapeado =
              bestAreaMatch(sourceText, tecnicaAreas) ||
              tecnicaAreas[0] ||
              conhecimentoMapeado;
          }

          return {
            servidor: c.servidor,
            conhecimento: conhecimentoMapeado,
            capacitacao: c.capacitacao.toUpperCase(),
            ano: detectAno(c.ano, [c.capacitacao, c.conhecimento, c.programa].filter(Boolean).join(' ')),
            cargaHoraria: c.cargaHoraria || '-',
            natureza,
          };
        });

        setRows(joined);
      } catch (error) {
        console.error('Falha ao carregar o módulo Detentores:', error);
        setRows([]);
      }
    };

    load();
  }, []);

  const filtered = useMemo(() => {
    return rows
      .filter((r) => {
        const byConhecimento =
          !queryConhecimento ||
          r.conhecimento.toLowerCase().includes(queryConhecimento.toLowerCase()) ||
          r.capacitacao.toLowerCase().includes(queryConhecimento.toLowerCase());

        const byServidor = !queryServidor || r.servidor.toLowerCase().includes(queryServidor.toLowerCase());
        const byNatureza = queryNatureza === 'Todos' || r.natureza === queryNatureza;

        return byConhecimento && byServidor && byNatureza;
      })
      .sort((a, b) => a.servidor.localeCompare(b.servidor, 'pt-BR'));
  }, [rows, queryConhecimento, queryServidor, queryNatureza]);

  const grouped = useMemo(() => {
    const groups = new Map<string, JoinedRow[]>();
    filtered.forEach((row) => {
      const key = row.servidor;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(row);
    });

    return Array.from(groups.entries())
      .map(([servidor, items]) => {
        const naturezas = Array.from(new Set(items.map((item) => item.natureza))).join(', ');
        const latestAno = items
          .map((item) => Number.parseInt(item.ano, 10))
          .filter((value) => Number.isFinite(value))
          .sort((a, b) => b - a)[0];
        return {
          servidor,
          items,
          quantidade: items.length,
          naturezas,
          ultimoAno: Number.isFinite(latestAno) ? String(latestAno) : '-',
        };
      })
      .sort((a, b) => a.servidor.localeCompare(b.servidor, 'pt-BR'));
  }, [filtered]);

  useEffect(() => {
    setPage(1);
  }, [grouped.length, pageSize]);

  const totalPages = Math.max(1, Math.ceil(grouped.length / pageSize));
  const pagedGroups = useMemo(() => {
    const start = (page - 1) * pageSize;
    return grouped.slice(start, start + pageSize);
  }, [grouped, page, pageSize]);

  const toggleExpand = (servidor: string) => {
    setExpandedServidores((prev) => ({ ...prev, [servidor]: !prev[servidor] }));
  };

  return (
    <div className="space-y-6">
      <div className="detentores-filters-container rounded-xl border border-slate-200 bg-slate-50/70 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            value={queryConhecimento}
            onChange={(e) => setQueryConhecimento(e.target.value)}
            placeholder="Buscar por conhecimento/capacitação"
            className="px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-700"
          />
          <input
            value={queryServidor}
            onChange={(e) => setQueryServidor(e.target.value)}
            placeholder="Buscar por servidor"
            className="px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-700"
          />
          <select
            value={queryNatureza}
            onChange={(e) => setQueryNatureza(e.target.value as 'Todos' | NaturezaConhecimento)}
            className="px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-700"
          >
            <option value="Todos">Filtrar por natureza do conhecimento</option>
            <option value="Liderança">Liderança</option>
            <option value="Transversal">Transversal</option>
            <option value="Técnico">Técnico</option>
            <option value="Não classificado">Não classificado</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-700">
            <tr>
              <th className="text-left px-4 py-3">Servidor</th>
              <th className="text-left px-4 py-3">Qtd. Registros</th>
              <th className="text-left px-4 py-3">Desenolvimento</th>
              <th className="text-left px-4 py-3">Último Ano</th>
              <th className="text-left px-4 py-3"><span className="sr-only">Detalhes</span></th>
            </tr>
          </thead>
          <tbody>
            {pagedGroups.map((group) => {
              const expanded = !!expandedServidores[group.servidor];
              return (
                <React.Fragment key={group.servidor}>
                  <tr
                    onClick={() => toggleExpand(group.servidor)}
                    className="border-t border-slate-100 cursor-pointer hover:bg-slate-50"
                  >
                    <td className="px-4 py-3 font-semibold text-slate-800">{group.servidor}</td>
                    <td className="px-4 py-3 text-slate-700">{group.quantidade}</td>
                    <td className="px-4 py-3 text-slate-700">{group.naturezas || '-'}</td>
                    <td className="px-4 py-3 text-slate-700">{group.ultimoAno}</td>
                    <td className="px-4 py-3 text-lg text-slate-700" aria-label={expanded ? 'Ocultar' : 'Expandir'}>{expanded ? '▴' : '▾'}</td>
                  </tr>

                  {expanded && (
                    <tr className="border-t border-slate-100 bg-slate-50/50">
                      <td colSpan={5} className="px-4 py-4">
                        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
                          <table className="w-full text-sm">
                            <thead className="bg-slate-100 text-slate-700">
                              <tr>
                                <th className="text-left px-3 py-2">Ano</th>
                                <th className="text-left px-3 py-2">Natureza</th>
                                <th className="text-left px-3 py-2">Conhecimento</th>
                                <th className="text-left px-3 py-2">Capacitação</th>
                                <th className="text-left px-3 py-2">Carga Horária</th>
                              </tr>
                            </thead>
                            <tbody>
                              {group.items.map((row, index) => (
                                <tr key={`${group.servidor}-${index}`} className="border-t border-slate-100">
                                  <td className="px-3 py-2 text-slate-700">{row.ano || '-'}</td>
                                  <td className="px-3 py-2 text-slate-700">{row.natureza}</td>
                                  <td className="px-3 py-2 text-slate-700">{row.conhecimento || '-'}</td>
                                  <td className="px-3 py-2 text-slate-700">{row.capacitacao || '-'}</td>
                                  <td className="px-3 py-2 text-slate-700">{row.cargaHoraria || '-'}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}

            {pagedGroups.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-slate-500">
                  Sem registros para os filtros atuais.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 py-3 border-t border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <span>Itens por página:</span>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number.parseInt(e.target.value, 10))}
              className="px-2 py-1 rounded border border-slate-300 bg-white text-slate-700"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
            </select>
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-600">
            <span>{`Página ${page} de ${totalPages}`}</span>
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1} className="px-3 py-1 rounded border border-slate-300 disabled:opacity-50">
              Anterior
            </button>
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages} className="px-3 py-1 rounded border border-slate-300 disabled:opacity-50">
              Próxima
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detentores;
