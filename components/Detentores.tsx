import React, { useDeferredValue, useEffect, useMemo, useState } from 'react';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import CreatableSelect from 'react-select/creatable';
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
  unidade: string;
  conhecimento: string;
  capacitacao: string;
  ano: string;
  cargaHoraria: string;
  natureza: NaturezaConhecimento;
}

interface IndexedRow extends JoinedRow {
  servidorKey: string;
  searchKey: string;
}

interface SelectOption {
  value: string;
  label: string;
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
const normalizeKey = (value: unknown): string =>
  String(value ?? '')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .trim()
    .toUpperCase();

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

  return bestScore > 1 ? best : '';
};

const scoreAreaMatch = (source: string, option: string): number => {
  const sourceTokens = tokenize(source);
  if (sourceTokens.length === 0) return 0;

  const optionTokens = tokenize(option);
  const tokenHits = optionTokens.filter((token) => sourceTokens.includes(token)).length;
  const directBoost = normalizeText(source).includes(normalizeText(option)) ? 2 : 0;
  return tokenHits + directBoost;
};

const toOption = (value: string): SelectOption => ({ value, label: value });

const selectStyles = {
  control: (provided: any, state: { isFocused: boolean; isDisabled: boolean }) => ({
    ...provided,
    backgroundColor: state.isDisabled ? '#e5e7eb' : '#ffffff',
    borderColor: state.isFocused ? 'var(--gov-blue)' : 'var(--gov-border)',
    color: 'var(--gov-blue-dark)',
    borderRadius: '0.5rem',
    padding: '0.1rem',
    border: '1px solid var(--gov-border)',
    boxShadow: state.isFocused ? '0 0 0 1px var(--gov-blue)' : 'none',
    '&:hover': {
      borderColor: 'var(--gov-blue)',
    },
  }),
  singleValue: (provided: any) => ({
    ...provided,
    color: 'var(--gov-blue-dark)',
  }),
  menu: (provided: any) => ({
    ...provided,
    backgroundColor: '#ffffff',
    borderColor: 'var(--gov-border)',
  }),
  option: (provided: any, state: { isFocused: boolean; isSelected: boolean }) => ({
    ...provided,
    backgroundColor: state.isSelected ? 'var(--gov-blue)' : state.isFocused ? 'var(--gov-blue-soft)' : '#ffffff',
    color: state.isSelected ? '#ffffff' : 'var(--gov-blue-dark)',
    '&:active': {
      backgroundColor: 'var(--gov-blue)',
    },
  }),
  input: (provided: any) => ({
    ...provided,
    color: 'var(--gov-blue-dark)',
  }),
  placeholder: (provided: any) => ({
    ...provided,
    color: 'var(--gov-blue)',
  }),
  clearIndicator: (provided: any) => ({
    ...provided,
    color: 'var(--gov-blue)',
    '&:hover': { color: 'var(--gov-blue-dark)' },
  }),
  dropdownIndicator: (provided: any) => ({
    ...provided,
    color: 'var(--gov-blue)',
    '&:hover': { color: 'var(--gov-blue-dark)' },
  }),
  indicatorSeparator: () => ({ display: 'none' }),
  menuPortal: (base: any) => ({ ...base, zIndex: 9999 }),
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
  const DETAIL_PAGE_SIZE = 8;
  const [rows, setRows] = useState<IndexedRow[]>([]);
  const [queryConhecimento, setQueryConhecimento] = useState('');
  const [queryServidor, setQueryServidor] = useState('');
  const [queryNatureza, setQueryNatureza] = useState<'Todos' | NaturezaConhecimento>('Todos');
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [expandedServidores, setExpandedServidores] = useState<Record<string, boolean>>({});
  const [detailVisibleRows, setDetailVisibleRows] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const deferredQueryConhecimento = useDeferredValue(queryConhecimento);
  const deferredQueryServidor = useDeferredValue(queryServidor);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
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
        const capacitacoesSheet = wb.Sheets['BASE CETEC'] || wb.Sheets[wb.SheetNames[0]];
        const pessoalSheet = wb.Sheets['ESTAT.PESSOAL 11-25'] || wb.Sheets[wb.SheetNames[1]];
        const capRaw = XLSX.utils.sheet_to_json<Record<string, any>>(capacitacoesSheet, { defval: '' });
        const pessoalRaw = XLSX.utils.sheet_to_json<Record<string, any>>(pessoalSheet, { defval: '' });

        const unidadeByServidor = new Map<string, string>();
        pessoalRaw.forEach((row) => {
          const servidor = getCell(row, ['nome servidor']);
          const unidade = getCell(row, ['unidade']);
          if (!servidor || !unidade) return;
          const key = normalizeKey(servidor);
          if (!unidadeByServidor.has(key)) {
            unidadeByServidor.set(key, unidade);
          }
        });

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

        const joined: IndexedRow[] = capacitacoes.map((c) => {
          const knowledgeKey = normalizeKey(c.conhecimento);
          const capacitacaoKey = normalizeKey(c.capacitacao);
          const combinedText = normalizeText([c.conhecimento, c.capacitacao, c.linhaCapacitacao, c.programa, c.uorg].filter(Boolean).join(' '));
          const sourceText = [c.conhecimento, c.capacitacao, c.linhaCapacitacao, c.programa, c.uorg].filter(Boolean).join(' ');
          const unidade = unidadeByServidor.get(normalizeKey(c.servidor)) || '-';
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
          let confidence = 0;

          if (natureza === 'Liderança') {
            const match = bestAreaMatch(sourceText, LIDERANCA_OPTIONS);
            if (match) {
              conhecimentoMapeado = match;
              confidence = scoreAreaMatch(sourceText, match);
            }
          } else if (natureza === 'Transversal') {
            const match = bestAreaMatch(sourceText, TRANSVERSAL_OPTIONS);
            if (match) {
              conhecimentoMapeado = match;
              confidence = scoreAreaMatch(sourceText, match);
            }
          } else {
            const match = bestAreaMatch(sourceText, tecnicaAreas);
            if (match) {
              conhecimentoMapeado = match;
              confidence = scoreAreaMatch(sourceText, match);
            }
          }

          if (confidence < 2) {
            conhecimentoMapeado = c.conhecimento || c.capacitacao || 'Não classificado';
          }

          return {
            servidor: c.servidor,
            unidade,
            conhecimento: conhecimentoMapeado,
            capacitacao: c.capacitacao.toUpperCase(),
            ano: detectAno(c.ano, [c.capacitacao, c.conhecimento, c.programa].filter(Boolean).join(' ')),
            cargaHoraria: c.cargaHoraria || '-',
            natureza,
            servidorKey: normalizeKey(c.servidor),
            searchKey: normalizeKey(`${conhecimentoMapeado} ${c.capacitacao}`),
          };
        });

        setRows(joined);
      } catch (error) {
        console.error('Falha ao carregar o módulo Detentores:', error);
        setRows([]);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, []);

  const conhecimentoOptions = useMemo(() => {
    const unique = new Set<string>();
    rows.forEach((r) => {
      if (r.conhecimento) unique.add(r.conhecimento);
      if (r.capacitacao) unique.add(r.capacitacao);
    });
    return Array.from(unique)
      .sort((a, b) => a.localeCompare(b, 'pt-BR'))
      .slice(0, 1500)
      .map(toOption);
  }, [rows]);

  const servidorOptions = useMemo(() => {
    const unique = Array.from(new Set(rows.map((r) => r.servidor)));
    return unique
      .sort((a, b) => a.localeCompare(b, 'pt-BR'))
      .slice(0, 1500)
      .map(toOption);
  }, [rows]);

  const filtered = useMemo(() => {
    const conhecimentoKey = normalizeKey(deferredQueryConhecimento);
    const servidorKey = normalizeKey(deferredQueryServidor);
    return rows
      .filter((r) => {
        const byConhecimento = !conhecimentoKey || r.searchKey.includes(conhecimentoKey);
        const byServidor = !servidorKey || r.servidorKey.includes(servidorKey);
        const byNatureza = queryNatureza === 'Todos' || r.natureza === queryNatureza;
        return byConhecimento && byServidor && byNatureza;
      })
      .sort((a, b) => a.servidor.localeCompare(b.servidor, 'pt-BR'));
  }, [rows, deferredQueryConhecimento, deferredQueryServidor, queryNatureza]);

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
        const unidades = Array.from(new Set(items.map((item) => item.unidade).filter(Boolean))).join(', ');
        const latestAno = items
          .map((item) => Number.parseInt(item.ano, 10))
          .filter((value) => Number.isFinite(value))
          .sort((a, b) => b - a)[0];
        return {
          servidor,
          items,
          unidade: unidades || '-',
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
    setExpandedServidores((prev) => {
      const nextExpanded = !prev[servidor];
      if (nextExpanded) {
        setDetailVisibleRows((countPrev) => ({
          ...countPrev,
          [servidor]: countPrev[servidor] || DETAIL_PAGE_SIZE,
        }));
      }
      return { ...prev, [servidor]: nextExpanded };
    });
  };

  return (
    <div className="space-y-6">
      <div className="detentores-filters-container rounded-xl border border-slate-200 bg-slate-50/70 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <CreatableSelect
            instanceId="detentores-conhecimento"
            classNamePrefix="tecnica-select"
            value={queryConhecimento ? toOption(queryConhecimento) : null}
            onChange={(option) => setQueryConhecimento(option?.value || '')}
            onInputChange={(input, meta) => {
              if (meta.action === 'input-change') {
                setQueryConhecimento(input);
              }
            }}
            options={conhecimentoOptions}
            styles={selectStyles}
            placeholder="Buscar por conhecimento/capacitação"
            isClearable
            isSearchable
            menuPortalTarget={document.body}
            formatCreateLabel={(input) => `Buscar por: ${input}`}
          />
          <CreatableSelect
            instanceId="detentores-servidor"
            classNamePrefix="tecnica-select"
            value={queryServidor ? toOption(queryServidor) : null}
            onChange={(option) => setQueryServidor(option?.value || '')}
            onInputChange={(input, meta) => {
              if (meta.action === 'input-change') {
                setQueryServidor(input);
              }
            }}
            options={servidorOptions}
            styles={selectStyles}
            placeholder="Buscar por servidor"
            isClearable
            isSearchable
            menuPortalTarget={document.body}
            formatCreateLabel={(input) => `Buscar por: ${input}`}
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

      {isLoading && (
        <div className="flex items-center gap-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-4 text-blue-800">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border-2 border-blue-200 border-t-blue-700 animate-spin" aria-hidden="true" />
          <p className="text-sm font-medium">Carregando a fonte de dados. Este processo pode levar alguns minutos.</p>
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-700">
            <tr>
              <th className="text-left px-4 py-3">Servidor</th>
              <th className="text-left px-4 py-3">Unidade</th>
              <th className="text-left px-4 py-3">Qtd. Registros</th>
              <th className="text-left px-4 py-3">Desenolvimento</th>
              <th className="text-left px-4 py-3">Último Ano</th>
              <th className="text-left px-4 py-3"><span className="sr-only">Detalhes</span></th>
            </tr>
          </thead>
          <tbody>
            {pagedGroups.map((group) => {
              const expanded = !!expandedServidores[group.servidor];
              const visibleCount = detailVisibleRows[group.servidor] || DETAIL_PAGE_SIZE;
              const visibleItems = group.items.slice(0, visibleCount);
              const hasMore = group.items.length > visibleCount;
              return (
                <React.Fragment key={group.servidor}>
                  <tr
                    onClick={() => toggleExpand(group.servidor)}
                    className="border-t border-slate-100 cursor-pointer hover:bg-slate-50"
                  >
                    <td className="px-4 py-3 font-semibold text-slate-800">{group.servidor}</td>
                    <td className="px-4 py-3 text-slate-700">{group.unidade}</td>
                    <td className="px-4 py-3 text-slate-700">{group.quantidade}</td>
                    <td className="px-4 py-3 text-slate-700">{group.naturezas || '-'}</td>
                    <td className="px-4 py-3 text-slate-700">{group.ultimoAno}</td>
                    <td className="px-4 py-3 text-lg text-slate-700" aria-label={expanded ? 'Ocultar' : 'Expandir'}>
                      <i className={expanded ? 'fa fa-chevron-up' : 'fa fa-chevron-down'} aria-hidden="true" />
                    </td>
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
                              {visibleItems.map((row, index) => (
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

                          <div className="flex items-center justify-between gap-3 px-3 py-2 border-t border-slate-200 bg-slate-50 text-xs text-slate-600">
                            <span>{`Exibindo ${Math.min(visibleCount, group.items.length)} de ${group.items.length} registros`}</span>
                            <div className="flex gap-2">
                              {hasMore && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setDetailVisibleRows((prev) => ({
                                      ...prev,
                                      [group.servidor]: Math.min(group.items.length, (prev[group.servidor] || DETAIL_PAGE_SIZE) + DETAIL_PAGE_SIZE),
                                    }));
                                  }}
                                  className="px-2 py-1 rounded border border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
                                >
                                  Ver mais
                                </button>
                              )}

                              {visibleCount > DETAIL_PAGE_SIZE && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setDetailVisibleRows((prev) => ({
                                      ...prev,
                                      [group.servidor]: DETAIL_PAGE_SIZE,
                                    }));
                                  }}
                                  className="px-2 py-1 rounded border border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
                                >
                                  Reduzir
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}

            {pagedGroups.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-slate-500">
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
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
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
