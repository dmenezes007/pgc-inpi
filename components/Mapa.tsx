import React, { useEffect, useMemo, useState } from 'react';
import Papa from 'papaparse';
import Select, { SingleValue } from 'react-select';
import CreatableSelect from 'react-select/creatable';
import * as XLSX from 'xlsx';
import tecnicaCsvUrl from '../src/files/docs/tecnica.csv?url';
import estruturaCsvUrl from '../src/files/docs/estrutura.csv?url';

type TipoConhecimento = 'Apoio' | 'Essencial' | 'Crítico';
type NaturezaConhecimento = 'Liderança' | 'Transversal' | 'Técnico';
type GrauInstalado = 'Inexistente' | 'Iniciante' | 'Intermediário' | 'Avançado';
type RelevanciaFaixa = 'De 1 a 25%' | 'De 26 a 50%' | 'De 51 a 75%' | 'De 76 a 100%';

interface TecnicaRow {
  Nivel1: string;
  Nivel2: string;
  Nivel3: string;
}

interface EstruturaRow {
  Unidade: string;
  Sigla: string;
}

interface UnidadeOption {
  sigla: string;
  nome: string;
}

interface MapaRow {
  id: string;
  unidadeSigla: string;
  unidadeNome: string;
  natureza: NaturezaConhecimento;
  nivel1?: string;
  nivel2?: string;
  conhecimento: string;
  tipo: TipoConhecimento;
  relevanciaFaixa: RelevanciaFaixa;
  grauInstalado: GrauInstalado;
  origem: 'precruzada' | 'manual';
}

interface SelectOption {
  value: string;
  label: string;
}

const STORAGE_KEY = 'pgc_mapa_conhecimento_v5';

const NATUREZA_OPTIONS: NaturezaConhecimento[] = ['Liderança', 'Transversal', 'Técnico'];
const TIPO_OPTIONS: TipoConhecimento[] = ['Apoio', 'Essencial', 'Crítico'];
const GRAU_OPTIONS: GrauInstalado[] = ['Inexistente', 'Iniciante', 'Intermediário', 'Avançado'];
const RELEVANCIA_OPTIONS: RelevanciaFaixa[] = ['De 1 a 25%', 'De 26 a 50%', 'De 51 a 75%', 'De 76 a 100%'];

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

const customStyles = {
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

const getSheetEndpoint = (): string => {
  const value = (import.meta as any).env?.VITE_GSHEET_MAPA_ENDPOINT;
  return typeof value === 'string' ? value : '';
};

const parseCsvFromUrl = <T,>(url: string): Promise<T[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse<T>(url, {
      download: true,
      header: true,
      skipEmptyLines: true,
      delimiter: ';',
      complete: (results) => resolve(results.data),
      error: (error) => reject(error),
    });
  });
};

const normalize = (value: string): string => value.trim().toLowerCase();
const toOption = (value: string): SelectOption => ({ value, label: value });

const Mapa: React.FC = () => {
  const [rows, setRows] = useState<MapaRow[]>([]);
  const [unidades, setUnidades] = useState<UnidadeOption[]>([]);
  const [tecnicaData, setTecnicaData] = useState<TecnicaRow[]>([]);

  const [selectedUnidade, setSelectedUnidade] = useState('');
  const [selectedNatureza, setSelectedNatureza] = useState<NaturezaConhecimento | ''>('');
  const [selectedNivel1, setSelectedNivel1] = useState('');
  const [selectedNivel2, setSelectedNivel2] = useState('');
  const [selectedConhecimento, setSelectedConhecimento] = useState('');
  const [customNivel3, setCustomNivel3] = useState('');
  const [selectedTipo, setSelectedTipo] = useState<TipoConhecimento | ''>('');
  const [selectedRelevancia, setSelectedRelevancia] = useState<RelevanciaFaixa | ''>('');
  const [selectedGrau, setSelectedGrau] = useState<GrauInstalado | ''>('');

  const [pageSize, setPageSize] = useState(5);
  const [page, setPage] = useState(1);
  const [saveMessage, setSaveMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const fieldClass = (enabled: boolean, filled: boolean): string => {
    if (enabled || filled) {
      return 'rounded-lg border border-blue-300 bg-blue-50 p-3';
    }
    return 'rounded-lg border border-slate-300 bg-slate-200 p-3';
  };

  const findUnidade = (sigla: string): UnidadeOption | undefined => {
    const key = normalize(sigla);
    return unidades.find((u) => normalize(u.sigla) === key);
  };

  const saveLocal = (next: MapaRow[]) => {
    setRows(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  useEffect(() => {
    const hydrate = async () => {
      const [estruturaRows, tecnicaRows] = await Promise.all([
        parseCsvFromUrl<EstruturaRow>(estruturaCsvUrl),
        parseCsvFromUrl<TecnicaRow>(tecnicaCsvUrl),
      ]);

      const unidadeMap = new Map<string, UnidadeOption>();
      estruturaRows
        .filter((item) => item.Sigla && item.Unidade)
        .forEach((item) => {
          const sigla = String(item.Sigla).trim();
          if (!unidadeMap.has(sigla)) {
            unidadeMap.set(sigla, { sigla, nome: String(item.Unidade).trim() });
          }
        });

      const unidadesSorted = Array.from(unidadeMap.values()).sort((a, b) => a.sigla.localeCompare(b.sigla, 'pt-BR'));
      setUnidades(unidadesSorted);

      const tecnicaClean = tecnicaRows.filter((item) => item.Nivel1 && item.Nivel2 && item.Nivel3);
      setTecnicaData(tecnicaClean);

      const nivel3Unicos = Array.from(
        new Set(tecnicaClean.map((row) => `${row.Nivel1}|${row.Nivel2}|${row.Nivel3}`))
      ).map((item) => {
        const [nivel1, nivel2, conhecimento] = item.split('|');
        return { nivel1, nivel2, conhecimento };
      });

      const basePre: MapaRow[] = [];
      unidadesSorted.forEach((unidade, idx) => {
        const lideranca = LIDERANCA_OPTIONS[idx % LIDERANCA_OPTIONS.length];
        const transversal = TRANSVERSAL_OPTIONS[idx % TRANSVERSAL_OPTIONS.length];
        const tecnico = nivel3Unicos[idx % Math.max(1, nivel3Unicos.length)];

        basePre.push({
          id: `pre-l-${unidade.sigla}`,
          unidadeSigla: unidade.sigla,
          unidadeNome: unidade.nome,
          natureza: 'Liderança',
          conhecimento: lideranca,
          tipo: TIPO_OPTIONS[idx % TIPO_OPTIONS.length],
          relevanciaFaixa: RELEVANCIA_OPTIONS[idx % RELEVANCIA_OPTIONS.length],
          grauInstalado: GRAU_OPTIONS[idx % GRAU_OPTIONS.length],
          origem: 'precruzada',
        });

        basePre.push({
          id: `pre-t-${unidade.sigla}`,
          unidadeSigla: unidade.sigla,
          unidadeNome: unidade.nome,
          natureza: 'Transversal',
          conhecimento: transversal,
          tipo: TIPO_OPTIONS[(idx + 1) % TIPO_OPTIONS.length],
          relevanciaFaixa: RELEVANCIA_OPTIONS[(idx + 1) % RELEVANCIA_OPTIONS.length],
          grauInstalado: GRAU_OPTIONS[(idx + 1) % GRAU_OPTIONS.length],
          origem: 'precruzada',
        });

        if (tecnico) {
          basePre.push({
            id: `pre-k-${unidade.sigla}`,
            unidadeSigla: unidade.sigla,
            unidadeNome: unidade.nome,
            natureza: 'Técnico',
            nivel1: tecnico.nivel1,
            nivel2: tecnico.nivel2,
            conhecimento: tecnico.conhecimento,
            tipo: TIPO_OPTIONS[(idx + 2) % TIPO_OPTIONS.length],
            relevanciaFaixa: RELEVANCIA_OPTIONS[(idx + 2) % RELEVANCIA_OPTIONS.length],
            grauInstalado: GRAU_OPTIONS[(idx + 2) % GRAU_OPTIONS.length],
            origem: 'precruzada',
          });
        }
      });

      const localRaw = localStorage.getItem(STORAGE_KEY);
      if (localRaw) {
        try {
          const localRows: MapaRow[] = JSON.parse(localRaw);
          const manuais = localRows.filter((row) => row.origem === 'manual');
          const merged = [...basePre, ...manuais];
          saveLocal(merged);
          return;
        } catch {
          // fall back
        }
      }

      saveLocal(basePre);
    };

    hydrate().catch(() => setErrorMessage('Não foi possível carregar as referências do mapa.'));
  }, []);

  const selectedUnidadeInfo = useMemo(() => findUnidade(selectedUnidade), [selectedUnidade, unidades]);

  const unidadeOptions = useMemo(() => unidades.map((u) => ({ value: u.sigla, label: `${u.sigla} - ${u.nome}` })), [unidades]);
  const naturezaOptions = useMemo(() => NATUREZA_OPTIONS.map(toOption), []);
  const tipoOptions = useMemo(() => TIPO_OPTIONS.map(toOption), []);
  const relevanciaOptions = useMemo(() => RELEVANCIA_OPTIONS.map(toOption), []);
  const grauOptions = useMemo(() => GRAU_OPTIONS.map(toOption), []);

  const nivel1Options = useMemo(() => {
    const unique = Array.from(new Set(tecnicaData.map((item) => item.Nivel1.trim())));
    return unique.sort((a, b) => a.localeCompare(b, 'pt-BR')).map(toOption);
  }, [tecnicaData]);

  const nivel2Options = useMemo(() => {
    if (!selectedNivel1) return [] as SelectOption[];
    const unique = Array.from(new Set(tecnicaData.filter((item) => item.Nivel1 === selectedNivel1).map((item) => item.Nivel2.trim())));
    return unique.sort((a, b) => a.localeCompare(b, 'pt-BR')).map(toOption);
  }, [tecnicaData, selectedNivel1]);

  const nivel3Options = useMemo(() => {
    if (!selectedNivel1 || !selectedNivel2) return [] as SelectOption[];
    const unique = Array.from(new Set(tecnicaData.filter((item) => item.Nivel1 === selectedNivel1 && item.Nivel2 === selectedNivel2).map((item) => item.Nivel3.trim())));
    return unique.sort((a, b) => a.localeCompare(b, 'pt-BR')).map(toOption);
  }, [tecnicaData, selectedNivel1, selectedNivel2]);

  const knowledgeOptions = useMemo(() => {
    if (selectedNatureza === 'Liderança') return LIDERANCA_OPTIONS.map(toOption);
    if (selectedNatureza === 'Transversal') return TRANSVERSAL_OPTIONS.map(toOption);
    if (selectedNatureza === 'Técnico') return nivel3Options;
    return [] as SelectOption[];
  }, [selectedNatureza, nivel3Options]);

  const finalConhecimento = selectedNatureza === 'Técnico' && customNivel3.trim() !== '' ? customNivel3.trim() : selectedConhecimento;

  const resetKnowledgeStep = () => {
    setSelectedConhecimento('');
    setCustomNivel3('');
    setSelectedTipo('');
    setSelectedRelevancia('');
    setSelectedGrau('');
  };

  const handleNaturezaChange = (option: SingleValue<SelectOption>) => {
    const value = option?.value || '';
    const parsed = NATUREZA_OPTIONS.find((opt) => opt === value);
    setSelectedNatureza(parsed || '');
    setSelectedNivel1('');
    setSelectedNivel2('');
    resetKnowledgeStep();
  };

  const handleAddRegistro = () => {
    setErrorMessage('');
    setSaveMessage('');

    if (!selectedUnidade || !selectedNatureza || !finalConhecimento || !selectedTipo || !selectedRelevancia || !selectedGrau) {
      setErrorMessage('Preencha todas as etapas obrigatórias antes de adicionar ao mapa.');
      return;
    }

    if (selectedNatureza === 'Técnico' && (!selectedNivel1 || !selectedNivel2)) {
      setErrorMessage('Para natureza Técnica, selecione Nível 1 e Nível 2 antes do conhecimento.');
      return;
    }

    const unidadeInfo = findUnidade(selectedUnidade);
    const newRow: MapaRow = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      unidadeSigla: selectedUnidade,
      unidadeNome: unidadeInfo?.nome || 'Unidade não identificada',
      natureza: selectedNatureza,
      nivel1: selectedNatureza === 'Técnico' ? selectedNivel1 : undefined,
      nivel2: selectedNatureza === 'Técnico' ? selectedNivel2 : undefined,
      conhecimento: finalConhecimento,
      tipo: selectedTipo,
      relevanciaFaixa: selectedRelevancia,
      grauInstalado: selectedGrau,
      origem: 'manual',
    };

    saveLocal([newRow, ...rows]);

    setSelectedNatureza('');
    setSelectedNivel1('');
    setSelectedNivel2('');
    setSelectedConhecimento('');
    setCustomNivel3('');
    setSelectedTipo('');
    setSelectedRelevancia('');
    setSelectedGrau('');
    setSaveMessage('Registro incluído no mapa com sucesso.');
  };

  const updateRow = (id: string, patch: Partial<MapaRow>) => {
    const next = rows.map((row) => {
      if (row.id !== id) return row;
      const updated = { ...row, ...patch };
      if (patch.unidadeSigla !== undefined) {
        const unidadeInfo = findUnidade(patch.unidadeSigla);
        updated.unidadeNome = unidadeInfo?.nome || row.unidadeNome;
      }
      return updated;
    });
    saveLocal(next);
  };

  const removeRow = (id: string) => {
    saveLocal(rows.filter((row) => row.id !== id));
  };

  const handleAlterRow = (id: string) => {
    const row = rows.find((item) => item.id === id);
    if (!row) return;
    setSaveMessage(`Registro ${row.unidadeSigla} alterado com sucesso.`);
  };

  const canChooseKnowledge = selectedNatureza === 'Liderança' || selectedNatureza === 'Transversal' || (selectedNatureza === 'Técnico' && selectedNivel1 !== '' && selectedNivel2 !== '');
  const canChooseTipo = finalConhecimento.trim() !== '';
  const canChooseRelevancia = canChooseTipo && selectedTipo !== '';
  const canChooseGrau = canChooseRelevancia && selectedRelevancia !== '';

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const byUnidade = !selectedUnidade || normalize(row.unidadeSigla) === normalize(selectedUnidade);
      const byNatureza = !selectedNatureza || row.natureza === selectedNatureza;
      const byNivel1 = !selectedNivel1 || normalize(row.nivel1 || '') === normalize(selectedNivel1);
      const byNivel2 = !selectedNivel2 || normalize(row.nivel2 || '') === normalize(selectedNivel2);
      const byConhecimento = !finalConhecimento || normalize(row.conhecimento).includes(normalize(finalConhecimento));
      const byTipo = !selectedTipo || row.tipo === selectedTipo;
      const byRelevancia = !selectedRelevancia || row.relevanciaFaixa === selectedRelevancia;
      const byGrau = !selectedGrau || row.grauInstalado === selectedGrau;
      return byUnidade && byNatureza && byNivel1 && byNivel2 && byConhecimento && byTipo && byRelevancia && byGrau;
    });
  }, [rows, selectedUnidade, selectedNatureza, selectedNivel1, selectedNivel2, finalConhecimento, selectedTipo, selectedRelevancia, selectedGrau]);

  useEffect(() => {
    setPage(1);
  }, [filteredRows.length, pageSize]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const pagedRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredRows.slice(start, start + pageSize);
  }, [filteredRows, page, pageSize]);

  const downloadCsv = () => {
    const exportRows = filteredRows.map((row) => ({
      unidade: `${row.unidadeSigla} - ${row.unidadeNome}`,
      natureza: row.natureza,
      conhecimento: row.conhecimento,
      tipo: row.tipo,
      relevancia: row.relevanciaFaixa,
      grau_instalado: row.grauInstalado,
      origem: row.origem,
    }));
    const csv = Papa.unparse(exportRows);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mapa-conhecimentos.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadXlsx = () => {
    const exportRows = filteredRows.map((row) => ({
      Unidade: `${row.unidadeSigla} - ${row.unidadeNome}`,
      Natureza: row.natureza,
      Conhecimento: row.conhecimento,
      Tipo: row.tipo,
      Relevancia: row.relevanciaFaixa,
      GrauInstalado: row.grauInstalado,
      Origem: row.origem,
    }));
    const ws = XLSX.utils.json_to_sheet(exportRows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Mapa');
    XLSX.writeFile(wb, 'mapa-conhecimentos.xlsx');
  };

  const saveToSheet = async () => {
    const endpoint = getSheetEndpoint();
    setIsSaving(true);
    setErrorMessage('');
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(rows));
      if (!endpoint) {
        setSaveMessage('Dados salvos localmente. Defina VITE_GSHEET_MAPA_ENDPOINT para envio à planilha.');
        return;
      }

      const payload = {
        source: 'pgc-inpi-mapa',
        timestamp: new Date().toISOString(),
        rows,
      };

      const resp = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!resp.ok) {
        throw new Error(`Falha no endpoint (${resp.status})`);
      }

      setSaveMessage('Dados salvos na planilha com sucesso.');
    } catch {
      setSaveMessage('Falha ao salvar na planilha. Os dados permanecem salvos localmente.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <div className={fieldClass(true, selectedUnidade !== '')}>
            <label className="text-sm font-medium text-slate-900">1. Selecione a Unidade</label>
            <Select
              instanceId="mapa-unidade"
              classNamePrefix="tecnica-select"
              value={selectedUnidade ? unidadeOptions.find((o) => o.value === selectedUnidade) || null : null}
              onChange={(option) => setSelectedUnidade(option?.value || '')}
              options={unidadeOptions}
              styles={customStyles}
              placeholder="Busque por sigla ou unidade"
              isClearable
              isSearchable
              menuPortalTarget={document.body}
            />
            {selectedUnidadeInfo && <p className="text-xs text-slate-700 mt-1">{`${selectedUnidadeInfo.sigla} - ${selectedUnidadeInfo.nome}`}</p>}
          </div>

          <div className={fieldClass(!!selectedUnidade, selectedNatureza !== '')}>
            <label className="text-sm font-medium text-slate-900">2. Selecione a Natureza do Conhecimento</label>
            <Select
              instanceId="mapa-natureza"
              classNamePrefix="tecnica-select"
              value={selectedNatureza ? toOption(selectedNatureza) : null}
              onChange={handleNaturezaChange}
              options={naturezaOptions}
              styles={customStyles}
              isDisabled={!selectedUnidade}
              placeholder="Selecione a natureza"
              isClearable
              isSearchable
              menuPortalTarget={document.body}
            />
          </div>

          {selectedNatureza === 'Técnico' && (
            <>
              <div className={fieldClass(true, selectedNivel1 !== '')}>
                <label className="text-sm font-medium text-slate-900">2.1 Nível 1 Técnico</label>
                <Select
                  instanceId="mapa-nivel1"
                  classNamePrefix="tecnica-select"
                  value={selectedNivel1 ? toOption(selectedNivel1) : null}
                  onChange={(option) => {
                    setSelectedNivel1(option?.value || '');
                    setSelectedNivel2('');
                    resetKnowledgeStep();
                  }}
                  options={nivel1Options}
                  styles={customStyles}
                  placeholder="Busque pelo Nível 1"
                  isClearable
                  isSearchable
                  menuPortalTarget={document.body}
                />
              </div>

              <div className={fieldClass(selectedNivel1 !== '', selectedNivel2 !== '')}>
                <label className="text-sm font-medium text-slate-900">2.2 Nível 2 Técnico</label>
                <Select
                  instanceId="mapa-nivel2"
                  classNamePrefix="tecnica-select"
                  value={selectedNivel2 ? toOption(selectedNivel2) : null}
                  onChange={(option) => {
                    setSelectedNivel2(option?.value || '');
                    resetKnowledgeStep();
                  }}
                  options={nivel2Options}
                  styles={customStyles}
                  placeholder="Busque pelo Nível 2"
                  isDisabled={!selectedNivel1}
                  isClearable
                  isSearchable
                  menuPortalTarget={document.body}
                />
              </div>
            </>
          )}

          <div className={fieldClass(canChooseKnowledge, selectedConhecimento !== '' || customNivel3 !== '')}>
            <label className="text-sm font-medium text-slate-900">3. Selecione o Conhecimento</label>
            <CreatableSelect
              instanceId="mapa-conhecimento"
              classNamePrefix="tecnica-select"
              value={selectedConhecimento ? toOption(selectedConhecimento) : null}
              onChange={(option) => setSelectedConhecimento(option?.value || '')}
              options={knowledgeOptions}
              styles={customStyles}
              placeholder="Busque ou digite o conhecimento"
              isDisabled={!canChooseKnowledge}
              isClearable
              isSearchable
              menuPortalTarget={document.body}
              formatCreateLabel={(input) => `Usar: ${input}`}
            />
          </div>

          {selectedNatureza === 'Técnico' && (
            <div className={fieldClass(canChooseKnowledge, customNivel3 !== '')}>
              <label className="text-sm font-medium text-slate-900">3.1 Nível 3 Editável</label>
              <CreatableSelect
                instanceId="mapa-nivel3"
                classNamePrefix="tecnica-select"
                value={customNivel3 ? toOption(customNivel3) : null}
                onChange={(option) => setCustomNivel3(option?.value || '')}
                options={nivel3Options}
                styles={customStyles}
                placeholder="Busque ou digite Nível 3"
                isDisabled={!canChooseKnowledge}
                isClearable
                isSearchable
                menuPortalTarget={document.body}
              />
            </div>
          )}

          <div className={fieldClass(canChooseTipo, selectedTipo !== '')}>
            <label className="text-sm font-medium text-slate-900">4. Selecione o Tipo de Conhecimento</label>
            <Select
              instanceId="mapa-tipo"
              classNamePrefix="tecnica-select"
              value={selectedTipo ? toOption(selectedTipo) : null}
              onChange={(option) => {
                const value = option?.value || '';
                const parsed = TIPO_OPTIONS.find((o) => o === value);
                setSelectedTipo((parsed || '') as TipoConhecimento | '');
              }}
              options={tipoOptions}
              styles={customStyles}
              placeholder="Selecione o tipo"
              isDisabled={!canChooseTipo}
              isClearable
              isSearchable
              menuPortalTarget={document.body}
            />
          </div>

          <div className={fieldClass(canChooseRelevancia, selectedRelevancia !== '')}>
            <label className="text-sm font-medium text-slate-900">5. Selecione a Relevância</label>
            <Select
              instanceId="mapa-relevancia"
              classNamePrefix="tecnica-select"
              value={selectedRelevancia ? toOption(selectedRelevancia) : null}
              onChange={(option) => {
                const value = option?.value || '';
                const parsed = RELEVANCIA_OPTIONS.find((o) => o === value);
                setSelectedRelevancia((parsed || '') as RelevanciaFaixa | '');
              }}
              options={relevanciaOptions}
              styles={customStyles}
              placeholder="Selecione a faixa"
              isDisabled={!canChooseRelevancia}
              isClearable
              isSearchable
              menuPortalTarget={document.body}
            />
          </div>

          <div className={fieldClass(canChooseGrau, selectedGrau !== '')}>
            <label className="text-sm font-medium text-slate-900">6. Selecione o Grau Instalado</label>
            <Select
              instanceId="mapa-grau"
              classNamePrefix="tecnica-select"
              value={selectedGrau ? toOption(selectedGrau) : null}
              onChange={(option) => {
                const value = option?.value || '';
                const parsed = GRAU_OPTIONS.find((o) => o === value);
                setSelectedGrau((parsed || '') as GrauInstalado | '');
              }}
              options={grauOptions}
              styles={customStyles}
              placeholder="Selecione o grau"
              isDisabled={!canChooseGrau}
              isClearable
              isSearchable
              menuPortalTarget={document.body}
            />
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button onClick={handleAddRegistro} className="px-4 py-2 rounded-lg font-semibold text-white bg-orange-600 hover:bg-orange-700">
            Adicionar ao Mapa
          </button>

          <button
            onClick={saveToSheet}
            disabled={isSaving}
            className="px-4 py-2 rounded-lg font-semibold border [border-color:var(--gov-blue)!important] [background-color:#ffffff!important] !text-[var(--gov-blue-dark)] hover:!bg-[var(--gov-blue-soft)] disabled:opacity-60"
          >
            {isSaving ? 'Salvando...' : 'Salvar Mapa'}
          </button>

          <button onClick={downloadCsv} className="px-4 py-2 rounded-lg font-semibold text-white bg-slate-700 hover:bg-slate-800">
            Download CSV
          </button>

          <button onClick={downloadXlsx} className="px-4 py-2 rounded-lg font-semibold text-white bg-slate-700 hover:bg-slate-800">
            Download XLSX
          </button>
        </div>
      </div>

      {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}
      {saveMessage && <p className="text-sm text-slate-600">{saveMessage}</p>}

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-700">
            <tr>
              <th className="text-left px-4 py-3">Unidade</th>
              <th className="text-left px-4 py-3">Natureza</th>
              <th className="text-left px-4 py-3">Conhecimento</th>
              <th className="text-left px-4 py-3">Tipo</th>
              <th className="text-left px-4 py-3">Relevância</th>
              <th className="text-left px-4 py-3">Grau Instalado</th>
              <th className="text-left px-4 py-3">Origem</th>
              <th className="text-left px-4 py-3">Ações</th>
            </tr>
          </thead>
          <tbody>
            {pagedRows.map((row) => (
              <tr key={row.id} className="border-t border-slate-100">
                <td className="px-4 py-3 align-top text-slate-800">{`${row.unidadeSigla} - ${row.unidadeNome}`}</td>
                <td className="px-4 py-3 align-top text-slate-700">{row.natureza}</td>
                <td className="px-4 py-3 align-top text-slate-700">
                  <input
                    value={row.conhecimento}
                    onChange={(e) => updateRow(row.id, { conhecimento: e.target.value })}
                    className="w-72 px-2 py-1 rounded border border-slate-300"
                  />
                </td>
                <td className="px-4 py-3 align-top text-slate-700">
                  <select
                    value={row.tipo}
                    onChange={(e) => {
                      const tipo = TIPO_OPTIONS.find((item) => item === e.target.value);
                      if (tipo) updateRow(row.id, { tipo });
                    }}
                    className="px-2 py-1 rounded border border-slate-300"
                  >
                    {TIPO_OPTIONS.map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3 align-top text-slate-700">
                  <select
                    value={row.relevanciaFaixa}
                    onChange={(e) => {
                      const faixa = RELEVANCIA_OPTIONS.find((item) => item === e.target.value);
                      if (faixa) updateRow(row.id, { relevanciaFaixa: faixa });
                    }}
                    className="px-2 py-1 rounded border border-slate-300"
                  >
                    {RELEVANCIA_OPTIONS.map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3 align-top text-slate-700">
                  <select
                    value={row.grauInstalado}
                    onChange={(e) => {
                      const grau = GRAU_OPTIONS.find((item) => item === e.target.value);
                      if (grau) updateRow(row.id, { grauInstalado: grau });
                    }}
                    className="px-2 py-1 rounded border border-slate-300"
                  >
                    {GRAU_OPTIONS.map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3 align-top text-slate-600">{row.origem === 'precruzada' ? 'Pré-cruzada' : 'Manual'}</td>
                <td className="px-4 py-3 align-top">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleAlterRow(row.id)}
                      className="px-3 py-1 rounded-md text-xs font-medium text-white bg-green-600 hover:bg-green-700"
                    >
                      Alterar
                    </button>
                    <button
                      onClick={() => removeRow(row.id)}
                      className="px-3 py-1 rounded-md text-xs font-medium text-white bg-red-600 hover:bg-red-700"
                    >
                      Remover
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {pagedRows.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-6 text-center text-slate-500">
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

export default Mapa;
