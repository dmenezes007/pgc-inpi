import React, { useDeferredValue, useEffect, useMemo, useState } from 'react';
import Papa from 'papaparse';
import Select, { SingleValue } from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import detentoresCsvUrl from '../src/files/docs/detentores.csv?url';

type NaturezaConhecimento = 'Liderança' | 'Transversal' | 'Técnico';

interface CsvRow {
  Servidor: string;
  Natureza: NaturezaConhecimento;
  Conhecimento: string;
  Capacitacao: string;
  Ano: string;
  CargaHoraria: string;
}

interface JoinedRow {
  id: string;
  servidor: string;
  conhecimento: string;
  capacitacao: string;
  ano: string;
  cargaHoraria: string;
  natureza: NaturezaConhecimento;
}

interface SelectOption {
  value: string;
  label: string;
}

const STORAGE_KEY = 'pgc_detentores_v1';
const NATUREZA_OPTIONS: NaturezaConhecimento[] = ['Liderança', 'Transversal', 'Técnico'];

const normalize = (value: unknown): string => String(value ?? '').trim();
const normalizeKey = (value: unknown): string =>
  String(value ?? '')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .trim()
    .toUpperCase();

const toTitlePt = (value: string): string => {
  const smallWords = new Set(['a', 'as', 'o', 'os', 'de', 'da', 'das', 'do', 'dos', 'e', 'em', 'para', 'por', 'com']);
  const normalized = value
    .trim()
    .replace(/\s+/g, ' ')
    .toLocaleLowerCase('pt-BR');

  if (!normalized) return '';

  return normalized
    .split(' ')
    .map((word, index) => {
      if (!word) return word;
      if (index > 0 && smallWords.has(word)) return word;
      return word[0].toLocaleUpperCase('pt-BR') + word.slice(1);
    })
    .join(' ');
};

const formatConhecimento = (value: unknown): string => toTitlePt(String(value ?? ''));

const formatNatureza = (value: unknown): NaturezaConhecimento => {
  const key = normalizeKey(value);
  if (key === 'LIDERANCA') return 'Liderança';
  if (key === 'TRANSVERSAL') return 'Transversal';
  return 'Técnico';
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

const Detentores: React.FC = () => {
  const DETAIL_PAGE_SIZE = 8;
  const [rows, setRows] = useState<JoinedRow[]>([]);
  const [queryConhecimento, setQueryConhecimento] = useState('');
  const [queryServidor, setQueryServidor] = useState('');
  const [queryNatureza, setQueryNatureza] = useState<'Todos' | NaturezaConhecimento>('Todos');
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [expandedServidores, setExpandedServidores] = useState<Record<string, boolean>>({});
  const [detailVisibleRows, setDetailVisibleRows] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [saveMessage, setSaveMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const deferredQueryConhecimento = useDeferredValue(queryConhecimento);
  const deferredQueryServidor = useDeferredValue(queryServidor);

  const saveLocal = (next: JoinedRow[]) => {
    setRows(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const updateRow = (id: string, patch: Partial<Pick<JoinedRow, 'natureza' | 'conhecimento'>>) => {
    const next = rows.map((row) => {
      if (row.id !== id) return row;
      return {
        ...row,
        natureza: patch.natureza ?? row.natureza,
        conhecimento: patch.conhecimento !== undefined ? formatConhecimento(patch.conhecimento) : row.conhecimento,
      };
    });
    saveLocal(next);
  };

  const handleAlterRow = (id: string) => {
    const row = rows.find((item) => item.id === id);
    if (!row) return;
    setErrorMessage('');
    setSaveMessage(`Registro de ${row.servidor} alterado com sucesso.`);
  };

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setSaveMessage('');
      setErrorMessage('');
      try {
        const resp = await fetch(detentoresCsvUrl);
        const csvText = await resp.text();
        const parsed = Papa.parse<CsvRow>(csvText, {
          header: true,
          skipEmptyLines: true,
          delimiter: ';',
        });

        const baseRows: JoinedRow[] = parsed.data
          .map((r, idx) => ({
            id: `csv-${idx + 1}`,
            servidor: normalize(r.Servidor),
            conhecimento: formatConhecimento(r.Conhecimento),
            capacitacao: normalize(r.Capacitacao),
            ano: normalize(r.Ano) || '-',
            cargaHoraria: normalize(r.CargaHoraria) || '-',
            natureza: formatNatureza(r.Natureza),
          }))
          .filter((r) => r.servidor && (r.conhecimento || r.capacitacao));

        const localRaw = localStorage.getItem(STORAGE_KEY);
        if (localRaw) {
          try {
            const localRows = JSON.parse(localRaw) as Array<Partial<JoinedRow>>;
            const sanitized = localRows
              .map((row, idx) => ({
                id: normalize(row.id) || `local-${idx + 1}`,
                servidor: normalize(row.servidor),
                conhecimento: formatConhecimento(row.conhecimento),
                capacitacao: normalize(row.capacitacao),
                ano: normalize(row.ano) || '-',
                cargaHoraria: normalize(row.cargaHoraria) || '-',
                natureza: formatNatureza(row.natureza),
              }))
              .filter((row) => row.servidor && (row.conhecimento || row.capacitacao));

            if (sanitized.length > 0) {
              setRows(sanitized);
              return;
            }
          } catch {
            // fallback to base rows
          }
        }

        saveLocal(baseRows);
      } catch (error) {
        console.error('Falha ao carregar o módulo Detentores:', error);
        setRows([]);
        setErrorMessage('Não foi possível carregar a tabela de detentores.');
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
        const searchKey = normalizeKey(`${r.conhecimento} ${r.capacitacao}`);
        const byConhecimento = !conhecimentoKey || searchKey.includes(conhecimentoKey);
        const byServidor = !servidorKey || normalizeKey(r.servidor).includes(servidorKey);
        const byNatureza = queryNatureza === 'Todos' || r.natureza === queryNatureza;
        return byConhecimento && byServidor && byNatureza;
      })
      .sort((a, b) => a.servidor.localeCompare(b.servidor, 'pt-BR'));
  }, [rows, deferredQueryConhecimento, deferredQueryServidor, queryNatureza]);

  const conhecimentoRelationOptions = useMemo(() => {
    const unique = Array.from(new Set(rows.map((row) => row.conhecimento).filter(Boolean)));
    return unique.sort((a, b) => a.localeCompare(b, 'pt-BR')).map(toOption);
  }, [rows]);

  const naturezaOptions = useMemo(() => NATUREZA_OPTIONS.map(toOption), []);

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
          </select>
        </div>
      </div>

      {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}
      {saveMessage && <p className="text-sm text-slate-600">{saveMessage}</p>}

      {isLoading && (
        <div className="flex items-center gap-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-4 text-blue-800">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border-2 border-blue-200 border-t-blue-700 animate-spin" aria-hidden="true" />
          <p className="text-sm font-medium">Carregando a fonte única de detentores. Este processo pode levar alguns segundos.</p>
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-700">
            <tr>
              <th className="text-left px-4 py-3">Servidor</th>
              <th className="text-left px-4 py-3">Qtd. Registros</th>
              <th className="text-left px-4 py-3">Natureza</th>
              <th className="text-left px-4 py-3">Último Ano</th>
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
                    <td className="px-4 py-3 font-semibold text-slate-800">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleExpand(group.servidor);
                          }}
                          className="inline-flex h-6 w-6 items-center justify-center text-blue-700 hover:text-blue-900"
                          aria-label={expanded ? 'Recolher linha' : 'Expandir linha'}
                        >
                          <FontAwesomeIcon icon={expanded ? faChevronUp : faChevronDown} aria-hidden="true" />
                        </button>
                        <span>{group.servidor}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-700">{group.quantidade}</td>
                    <td className="px-4 py-3 text-slate-700">{group.naturezas || '-'}</td>
                    <td className="px-4 py-3 text-slate-700">{group.ultimoAno}</td>
                  </tr>

                  {expanded && (
                    <tr className="border-t border-slate-100 bg-slate-50/50">
                      <td colSpan={4} className="px-4 py-4">
                        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
                          <table className="w-full text-sm">
                            <thead className="bg-slate-100 text-slate-700">
                              <tr>
                                <th className="text-left px-3 py-2">Ano</th>
                                <th className="text-left px-3 py-2">Natureza</th>
                                <th className="text-left px-3 py-2">Conhecimento</th>
                                <th className="text-left px-3 py-2">Capacitação</th>
                                <th className="text-left px-3 py-2">Carga Horária</th>
                                <th className="text-left px-3 py-2">Ações</th>
                              </tr>
                            </thead>
                            <tbody>
                              {visibleItems.map((row) => (
                                <tr key={row.id} className="border-t border-slate-100">
                                  <td className="px-3 py-2 text-slate-700">{row.ano || '-'}</td>
                                  <td className="px-3 py-2 text-slate-700 min-w-[13rem]">
                                    <Select
                                      instanceId={`detentores-natureza-${row.id}`}
                                      classNamePrefix="tecnica-select"
                                      value={toOption(row.natureza)}
                                      onChange={(option: SingleValue<SelectOption>) => {
                                        const selected = NATUREZA_OPTIONS.find((item) => item === option?.value);
                                        if (selected) {
                                          updateRow(row.id, { natureza: selected });
                                        }
                                      }}
                                      options={naturezaOptions}
                                      styles={selectStyles}
                                      menuPortalTarget={document.body}
                                      isSearchable
                                    />
                                  </td>
                                  <td className="px-3 py-2 text-slate-700 min-w-[18rem]">
                                    <CreatableSelect
                                      instanceId={`detentores-conhecimento-${row.id}`}
                                      classNamePrefix="tecnica-select"
                                      value={row.conhecimento ? toOption(row.conhecimento) : null}
                                      onChange={(option) => {
                                        updateRow(row.id, { conhecimento: option?.value || '' });
                                      }}
                                      options={conhecimentoRelationOptions}
                                      styles={selectStyles}
                                      placeholder="Busque ou selecione"
                                      isClearable
                                      isSearchable
                                      menuPortalTarget={document.body}
                                      formatCreateLabel={(input) => `Usar: ${input}`}
                                    />
                                  </td>
                                  <td className="px-3 py-2 text-slate-700">{row.capacitacao || '-'}</td>
                                  <td className="px-3 py-2 text-slate-700">{row.cargaHoraria || '-'}</td>
                                  <td className="px-3 py-2 text-slate-700">
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleAlterRow(row.id);
                                      }}
                                      className="px-3 py-1 rounded-md text-xs font-medium text-white bg-green-600 hover:bg-green-700"
                                    >
                                      Alterar
                                    </button>
                                  </td>
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
                <td colSpan={4} className="px-4 py-6 text-center text-slate-500">
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
