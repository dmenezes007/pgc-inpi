import React, { useEffect, useMemo, useState } from 'react';
import Papa from 'papaparse';
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
}

const STORAGE_KEY = 'pgc_mapa_conhecimento_v3';
const PAGE_SIZE = 8;

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

const tooltipByField: Record<string, string> = {
  unidade: 'Escolha a sigla e confirme o nome da unidade.',
  natureza: 'Selecione a natureza: Liderança, Transversal ou Técnico.',
  conhecimento: 'Selecione ou digite o conhecimento aplicável.',
  tipo: 'Classifique em Apoio, Essencial ou Crítico.',
  relevancia: 'Selecione a faixa de relevância gerencial.',
  grau: 'Informe o grau instalado do conhecimento na unidade.',
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

const Mapa: React.FC = () => {
  const [rows, setRows] = useState<MapaRow[]>([]);
  const [suggestedRows, setSuggestedRows] = useState<MapaRow[]>([]);
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

  const [suggestedPage, setSuggestedPage] = useState(1);
  const [saveMessage, setSaveMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const findUnidade = (sigla: string): UnidadeOption | undefined => {
    const key = normalize(sigla);
    return unidades.find((u) => normalize(u.sigla) === key);
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

      const unidadesSorted = Array.from(unidadeMap.values()).sort((a, b) =>
        a.sigla.localeCompare(b.sigla, 'pt-BR')
      );
      setUnidades(unidadesSorted);

      const tecnicaClean = tecnicaRows.filter((item) => item.Nivel1 && item.Nivel2 && item.Nivel3);
      setTecnicaData(tecnicaClean);

      const localRaw = localStorage.getItem(STORAGE_KEY);
      if (localRaw) {
        try {
          const localRows: MapaRow[] = JSON.parse(localRaw);
          setRows(localRows);
        } catch {
          setRows([]);
        }
      }

      const nivel3Unicos = Array.from(
        new Set(tecnicaClean.map((row) => `${row.Nivel1}|${row.Nivel2}|${row.Nivel3}`))
      )
        .slice(0, 8)
        .map((item) => {
          const [nivel1, nivel2, conhecimento] = item.split('|');
          return { nivel1, nivel2, conhecimento };
        });

      const baseUnidades = unidadesSorted.slice(0, 6);
      const cruzados: MapaRow[] = [];

      baseUnidades.forEach((unidade, unidadeIndex) => {
        const lideranca = LIDERANCA_OPTIONS[unidadeIndex % LIDERANCA_OPTIONS.length];
        const transversal = TRANSVERSAL_OPTIONS[unidadeIndex % TRANSVERSAL_OPTIONS.length];
        cruzados.push({
          id: `sug-l-${unidade.sigla}-${unidadeIndex}`,
          unidadeSigla: unidade.sigla,
          unidadeNome: unidade.nome,
          natureza: 'Liderança',
          conhecimento: lideranca,
          tipo: TIPO_OPTIONS[unidadeIndex % TIPO_OPTIONS.length],
          relevanciaFaixa: RELEVANCIA_OPTIONS[unidadeIndex % RELEVANCIA_OPTIONS.length],
          grauInstalado: GRAU_OPTIONS[unidadeIndex % GRAU_OPTIONS.length],
        });
        cruzados.push({
          id: `sug-t-${unidade.sigla}-${unidadeIndex}`,
          unidadeSigla: unidade.sigla,
          unidadeNome: unidade.nome,
          natureza: 'Transversal',
          conhecimento: transversal,
          tipo: TIPO_OPTIONS[(unidadeIndex + 1) % TIPO_OPTIONS.length],
          relevanciaFaixa: RELEVANCIA_OPTIONS[(unidadeIndex + 1) % RELEVANCIA_OPTIONS.length],
          grauInstalado: GRAU_OPTIONS[(unidadeIndex + 1) % GRAU_OPTIONS.length],
        });
      });

      nivel3Unicos.forEach((item, idx) => {
        if (baseUnidades.length === 0) return;
        const unidade = baseUnidades[idx % baseUnidades.length];
        cruzados.push({
          id: `sug-k-${unidade.sigla}-${idx}`,
          unidadeSigla: unidade.sigla,
          unidadeNome: unidade.nome,
          natureza: 'Técnico',
          nivel1: item.nivel1,
          nivel2: item.nivel2,
          conhecimento: item.conhecimento,
          tipo: TIPO_OPTIONS[idx % TIPO_OPTIONS.length],
          relevanciaFaixa: RELEVANCIA_OPTIONS[idx % RELEVANCIA_OPTIONS.length],
          grauInstalado: GRAU_OPTIONS[idx % GRAU_OPTIONS.length],
        });
      });

      setSuggestedRows(cruzados);
    };

    hydrate().catch(() => {
      setErrorMessage('Não foi possível carregar todas as referências do mapa.');
    });
  }, []);

  const selectedUnidadeInfo = useMemo(
    () => findUnidade(selectedUnidade),
    [selectedUnidade, unidades]
  );

  const nivel1Options = useMemo(() => {
    const unique = Array.from(new Set(tecnicaData.map((item) => item.Nivel1.trim())));
    return unique.sort((a, b) => a.localeCompare(b, 'pt-BR'));
  }, [tecnicaData]);

  const nivel2Options = useMemo(() => {
    if (!selectedNivel1) return [];
    const unique = Array.from(
      new Set(
        tecnicaData
          .filter((item) => item.Nivel1 === selectedNivel1)
          .map((item) => item.Nivel2.trim())
      )
    );
    return unique.sort((a, b) => a.localeCompare(b, 'pt-BR'));
  }, [tecnicaData, selectedNivel1]);

  const nivel3Options = useMemo(() => {
    if (!selectedNivel1 || !selectedNivel2) return [];
    const unique = Array.from(
      new Set(
        tecnicaData
          .filter((item) => item.Nivel1 === selectedNivel1 && item.Nivel2 === selectedNivel2)
          .map((item) => item.Nivel3.trim())
      )
    );
    return unique.sort((a, b) => a.localeCompare(b, 'pt-BR'));
  }, [tecnicaData, selectedNivel1, selectedNivel2]);

  const knowledgeOptions = useMemo(() => {
    if (selectedNatureza === 'Liderança') return LIDERANCA_OPTIONS;
    if (selectedNatureza === 'Transversal') return TRANSVERSAL_OPTIONS;
    if (selectedNatureza === 'Técnico') return nivel3Options;
    return [];
  }, [selectedNatureza, nivel3Options]);

  const finalConhecimento =
    selectedNatureza === 'Técnico' && customNivel3.trim() !== ''
      ? customNivel3.trim()
      : selectedConhecimento;

  const resetKnowledgeStep = () => {
    setSelectedConhecimento('');
    setCustomNivel3('');
    setSelectedTipo('');
    setSelectedRelevancia('');
    setSelectedGrau('');
  };

  const handleNaturezaChange = (value: string) => {
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
    };

    const next = [newRow, ...rows];
    setRows(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));

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

  const removeRow = (id: string) => {
    const next = rows.filter((row) => row.id !== id);
    setRows(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const canChooseKnowledge =
    selectedNatureza === 'Liderança' ||
    selectedNatureza === 'Transversal' ||
    (selectedNatureza === 'Técnico' && selectedNivel1 !== '' && selectedNivel2 !== '');

  const canChooseTipo = finalConhecimento.trim() !== '';
  const canChooseRelevancia = canChooseTipo && selectedTipo !== '';
  const canChooseGrau = canChooseRelevancia && selectedRelevancia !== '';

  const filteredSuggestedRows = useMemo(() => {
    return suggestedRows.filter((row) => {
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
  }, [
    suggestedRows,
    selectedUnidade,
    selectedNatureza,
    selectedNivel1,
    selectedNivel2,
    finalConhecimento,
    selectedTipo,
    selectedRelevancia,
    selectedGrau,
  ]);

  useEffect(() => {
    setSuggestedPage(1);
  }, [
    selectedUnidade,
    selectedNatureza,
    selectedNivel1,
    selectedNivel2,
    finalConhecimento,
    selectedTipo,
    selectedRelevancia,
    selectedGrau,
  ]);

  const totalPages = Math.max(1, Math.ceil(filteredSuggestedRows.length / PAGE_SIZE));
  const pagedSuggestedRows = useMemo(() => {
    const start = (suggestedPage - 1) * PAGE_SIZE;
    return filteredSuggestedRows.slice(start, start + PAGE_SIZE);
  }, [filteredSuggestedRows, suggestedPage]);

  const updateSuggestedRow = (id: string, patch: Partial<MapaRow>) => {
    setSuggestedRows((prev) =>
      prev.map((row) => {
        if (row.id !== id) return row;
        const nextRow = { ...row, ...patch };
        if (patch.unidadeSigla !== undefined) {
          const unidadeInfo = findUnidade(patch.unidadeSigla);
          nextRow.unidadeNome = unidadeInfo?.nome || row.unidadeNome;
        }
        return nextRow;
      })
    );
  };

  const addSuggestedToMapa = (id: string) => {
    const found = suggestedRows.find((row) => row.id === id);
    if (!found) return;
    const newRow: MapaRow = {
      ...found,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    };
    const next = [newRow, ...rows];
    setRows(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setSaveMessage('Registro pré-cruzado adicionado ao mapa.');
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
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200" title={tooltipByField.unidade}>
              1. Selecione a Unidade
            </label>
            <input
              list="mapa-unidades-list"
              value={selectedUnidade}
              onChange={(e) => setSelectedUnidade(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-700"
              placeholder="Digite ou selecione a sigla"
            />
            <datalist id="mapa-unidades-list">
              {unidades.map((item) => (
                <option key={item.sigla} value={item.sigla} label={`${item.sigla} - ${item.nome}`} />
              ))}
            </datalist>
            <p className="text-xs text-gray-400">
              {selectedUnidadeInfo ? `${selectedUnidadeInfo.sigla} - ${selectedUnidadeInfo.nome}` : 'Selecione uma sigla para exibir o nome completo da unidade.'}
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200" title={tooltipByField.natureza}>
              2. Selecione a Natureza do Conhecimento
            </label>
            <input
              list="mapa-natureza-list"
              value={selectedNatureza}
              onChange={(e) => handleNaturezaChange(e.target.value)}
              disabled={!selectedUnidade}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 disabled:opacity-60"
              placeholder="Digite ou selecione a natureza"
            />
            <datalist id="mapa-natureza-list">
              {NATUREZA_OPTIONS.map((item) => (
                <option key={item} value={item} />
              ))}
            </datalist>
          </div>

          {selectedNatureza === 'Técnico' && (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-200" title="Primeira camada da trilha técnica.">
                  2.1 Nível 1 Técnico
                </label>
                <input
                  list="mapa-nivel1-list"
                  value={selectedNivel1}
                  onChange={(e) => {
                    setSelectedNivel1(e.target.value);
                    setSelectedNivel2('');
                    resetKnowledgeStep();
                  }}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-700"
                  placeholder="Digite ou selecione"
                />
                <datalist id="mapa-nivel1-list">
                  {nivel1Options.map((item) => (
                    <option key={item} value={item} />
                  ))}
                </datalist>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-200" title="Segunda camada da trilha técnica.">
                  2.2 Nível 2 Técnico
                </label>
                <input
                  list="mapa-nivel2-list"
                  value={selectedNivel2}
                  onChange={(e) => {
                    setSelectedNivel2(e.target.value);
                    resetKnowledgeStep();
                  }}
                  disabled={!selectedNivel1}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 disabled:opacity-60"
                  placeholder="Digite ou selecione"
                />
                <datalist id="mapa-nivel2-list">
                  {nivel2Options.map((item) => (
                    <option key={item} value={item} />
                  ))}
                </datalist>
              </div>
            </>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200" title={tooltipByField.conhecimento}>
              3. Selecione o Conhecimento
            </label>
            <input
              list="mapa-conhecimento-list"
              value={selectedConhecimento}
              onChange={(e) => setSelectedConhecimento(e.target.value)}
              disabled={!canChooseKnowledge}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 disabled:opacity-60"
              placeholder="Digite ou selecione o conhecimento"
            />
            <datalist id="mapa-conhecimento-list">
              {knowledgeOptions.map((item) => (
                <option key={item} value={item} />
              ))}
            </datalist>
          </div>

          {selectedNatureza === 'Técnico' && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-200" title="Edite ou acrescente um Nível 3 para casos específicos.">
                3.1 Nível 3 Editável
              </label>
              <input
                value={customNivel3}
                onChange={(e) => setCustomNivel3(e.target.value)}
                placeholder="Digite para editar/acrescentar"
                disabled={!canChooseKnowledge}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 disabled:opacity-60"
              />
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200" title={tooltipByField.tipo}>
              4. Selecione o Tipo de Conhecimento
            </label>
            <input
              list="mapa-tipo-list"
              value={selectedTipo}
              onChange={(e) => setSelectedTipo((TIPO_OPTIONS.find((opt) => opt === e.target.value) || '') as TipoConhecimento | '')}
              disabled={!canChooseTipo}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 disabled:opacity-60"
              placeholder="Digite ou selecione o tipo"
            />
            <datalist id="mapa-tipo-list">
              {TIPO_OPTIONS.map((item) => (
                <option key={item} value={item} />
              ))}
            </datalist>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200" title={tooltipByField.relevancia}>
              5. Selecione a Relevância
            </label>
            <input
              list="mapa-relevancia-list"
              value={selectedRelevancia}
              onChange={(e) => setSelectedRelevancia((RELEVANCIA_OPTIONS.find((opt) => opt === e.target.value) || '') as RelevanciaFaixa | '')}
              disabled={!canChooseRelevancia}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 disabled:opacity-60"
              placeholder="Digite ou selecione a faixa"
            />
            <datalist id="mapa-relevancia-list">
              {RELEVANCIA_OPTIONS.map((item) => (
                <option key={item} value={item} />
              ))}
            </datalist>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200" title={tooltipByField.grau}>
              6. Selecione o Grau Instalado
            </label>
            <input
              list="mapa-grau-list"
              value={selectedGrau}
              onChange={(e) => setSelectedGrau((GRAU_OPTIONS.find((opt) => opt === e.target.value) || '') as GrauInstalado | '')}
              disabled={!canChooseGrau}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 disabled:opacity-60"
              placeholder="Digite ou selecione o grau"
            />
            <datalist id="mapa-grau-list">
              {GRAU_OPTIONS.map((item) => (
                <option key={item} value={item} />
              ))}
            </datalist>
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleAddRegistro}
            className="px-4 py-2 rounded-lg font-semibold text-white bg-orange-600 hover:bg-orange-700"
          >
            Adicionar ao Mapa
          </button>

          <button
            onClick={saveToSheet}
            disabled={isSaving}
            className="px-4 py-2 rounded-lg font-semibold text-white bg-slate-600 hover:bg-slate-700 disabled:opacity-60"
          >
            {isSaving ? 'Salvando...' : 'Salvar Mapa'}
          </button>
        </div>
      </div>

      {errorMessage && <p className="text-sm text-red-400">{errorMessage}</p>}
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
              <th className="text-left px-4 py-3">Ações</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-t border-slate-100">
                <td className="px-4 py-3 align-top text-slate-800">{`${row.unidadeSigla} - ${row.unidadeNome}`}</td>
                <td className="px-4 py-3 align-top text-slate-700">{row.natureza}</td>
                <td className="px-4 py-3 align-top text-slate-800">
                  {row.natureza === 'Técnico' && row.nivel1 && row.nivel2
                    ? `${row.nivel1} > ${row.nivel2} > ${row.conhecimento}`
                    : row.conhecimento}
                </td>
                <td className="px-4 py-3 align-top text-slate-700">{row.tipo}</td>
                <td className="px-4 py-3 align-top text-slate-700">{row.relevanciaFaixa}</td>
                <td className="px-4 py-3 align-top text-slate-700">{row.grauInstalado}</td>
                <td className="px-4 py-3 align-top">
                  <button
                    onClick={() => removeRow(row.id)}
                    className="px-3 py-1 rounded-md text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100"
                  >
                    Remover
                  </button>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-slate-500">
                  Nenhum registro no mapa. Preencha o fluxo acima para inserir dados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <h3 className="text-lg font-semibold text-white">Atualização por Base Pré-cruzada</h3>
          <p className="text-xs text-slate-300">Tabela paginada, editável e filtrada automaticamente conforme os campos preenchidos acima.</p>
        </div>

        <div className="overflow-x-auto rounded-lg border border-slate-700 bg-slate-900/40">
          <table className="w-full text-sm">
            <thead className="bg-slate-900 text-slate-200">
              <tr>
                <th className="text-left px-3 py-2">Unidade</th>
                <th className="text-left px-3 py-2">Natureza</th>
                <th className="text-left px-3 py-2">Conhecimento</th>
                <th className="text-left px-3 py-2">Tipo</th>
                <th className="text-left px-3 py-2">Relevância</th>
                <th className="text-left px-3 py-2">Grau</th>
                <th className="text-left px-3 py-2">Ação</th>
              </tr>
            </thead>
            <tbody>
              {pagedSuggestedRows.map((row) => (
                <tr key={row.id} className="border-t border-slate-700/70">
                  <td className="px-3 py-2 align-top">
                    <input
                      list="mapa-unidades-list"
                      value={row.unidadeSigla}
                      onChange={(e) => updateSuggestedRow(row.id, { unidadeSigla: e.target.value })}
                      className="w-40 px-2 py-1 rounded border border-slate-500 bg-white text-slate-700"
                    />
                    <div className="text-[11px] text-slate-300 mt-1">{row.unidadeNome}</div>
                  </td>
                  <td className="px-3 py-2 align-top">
                    <input
                      list="mapa-natureza-list"
                      value={row.natureza}
                      onChange={(e) => {
                        const natureza = NATUREZA_OPTIONS.find((opt) => opt === e.target.value);
                        if (natureza) updateSuggestedRow(row.id, { natureza });
                      }}
                      className="w-36 px-2 py-1 rounded border border-slate-500 bg-white text-slate-700"
                    />
                  </td>
                  <td className="px-3 py-2 align-top">
                    <input
                      value={row.conhecimento}
                      onChange={(e) => updateSuggestedRow(row.id, { conhecimento: e.target.value })}
                      className="w-64 px-2 py-1 rounded border border-slate-500 bg-white text-slate-700"
                    />
                  </td>
                  <td className="px-3 py-2 align-top">
                    <input
                      list="mapa-tipo-list"
                      value={row.tipo}
                      onChange={(e) => {
                        const tipo = TIPO_OPTIONS.find((opt) => opt === e.target.value);
                        if (tipo) updateSuggestedRow(row.id, { tipo });
                      }}
                      className="w-28 px-2 py-1 rounded border border-slate-500 bg-white text-slate-700"
                    />
                  </td>
                  <td className="px-3 py-2 align-top">
                    <input
                      list="mapa-relevancia-list"
                      value={row.relevanciaFaixa}
                      onChange={(e) => {
                        const faixa = RELEVANCIA_OPTIONS.find((opt) => opt === e.target.value);
                        if (faixa) updateSuggestedRow(row.id, { relevanciaFaixa: faixa });
                      }}
                      className="w-36 px-2 py-1 rounded border border-slate-500 bg-white text-slate-700"
                    />
                  </td>
                  <td className="px-3 py-2 align-top">
                    <input
                      list="mapa-grau-list"
                      value={row.grauInstalado}
                      onChange={(e) => {
                        const grau = GRAU_OPTIONS.find((opt) => opt === e.target.value);
                        if (grau) updateSuggestedRow(row.id, { grauInstalado: grau });
                      }}
                      className="w-36 px-2 py-1 rounded border border-slate-500 bg-white text-slate-700"
                    />
                  </td>
                  <td className="px-3 py-2 align-top">
                    <button
                      onClick={() => addSuggestedToMapa(row.id)}
                      className="px-3 py-1 rounded-md text-xs font-semibold text-white bg-orange-600 hover:bg-orange-700"
                    >
                      Inserir
                    </button>
                  </td>
                </tr>
              ))}
              {pagedSuggestedRows.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-slate-300">
                    Sem registros na base pré-cruzada para os filtros atuais.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center justify-between text-sm text-slate-300">
          <span>{`Página ${suggestedPage} de ${totalPages}`}</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSuggestedPage((p) => Math.max(1, p - 1))}
              disabled={suggestedPage <= 1}
              className="px-3 py-1 rounded border border-slate-500 disabled:opacity-50"
            >
              Anterior
            </button>
            <button
              onClick={() => setSuggestedPage((p) => Math.min(totalPages, p + 1))}
              disabled={suggestedPage >= totalPages}
              className="px-3 py-1 rounded border border-slate-500 disabled:opacity-50"
            >
              Próxima
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mapa;
