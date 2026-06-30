import React, { useEffect, useMemo, useState } from 'react';
import Papa from 'papaparse';
import tecnicaCsvUrl from '../src/files/docs/tecnica.csv?url';
import estruturaCsvUrl from '../src/files/docs/estrutura.csv?url';

type TipoConhecimento = 'Apoio' | 'Essencial' | 'Crítico';
type NaturezaConhecimento = 'Liderança' | 'Transversal' | 'Técnico';
type GrauInstalado = 'Inexistente' | 'Iniciante' | 'Intermediário' | 'Avançado';

interface TecnicaRow {
  Nivel1: string;
  Nivel2: string;
  Nivel3: string;
}

interface EstruturaRow {
  Unidade: string;
  Sigla: string;
}

interface MapaRow {
  id: string;
  unidade: string;
  natureza: NaturezaConhecimento;
  nivel1?: string;
  nivel2?: string;
  conhecimento: string;
  tipo: TipoConhecimento;
  relevancia: number;
  grauInstalado: GrauInstalado;
}

const STORAGE_KEY = 'pgc_mapa_conhecimento_v2';

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
  unidade: 'Selecione a sigla da unidade responsável pelo conhecimento.',
  natureza: 'Defina a natureza: Liderança, Transversal ou Técnico.',
  conhecimento: 'Selecione o conhecimento da lista correspondente à natureza.',
  tipo: 'Classifique o conhecimento em Apoio, Essencial ou Crítico.',
  relevancia: 'Informe um valor entre 0 e 100 para priorização gerencial.',
  grau: 'Indique o estágio atual de domínio na unidade.',
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

const Mapa: React.FC = () => {
  const [rows, setRows] = useState<MapaRow[]>([]);
  const [siglasUnidade, setSiglasUnidade] = useState<string[]>([]);
  const [tecnicaData, setTecnicaData] = useState<TecnicaRow[]>([]);
  const [selectedUnidade, setSelectedUnidade] = useState('');
  const [selectedNatureza, setSelectedNatureza] = useState<NaturezaConhecimento | ''>('');
  const [selectedNivel1, setSelectedNivel1] = useState('');
  const [selectedNivel2, setSelectedNivel2] = useState('');
  const [selectedConhecimento, setSelectedConhecimento] = useState('');
  const [customNivel3, setCustomNivel3] = useState('');
  const [selectedTipo, setSelectedTipo] = useState<TipoConhecimento | ''>('');
  const [relevancia, setRelevancia] = useState('');
  const [selectedGrau, setSelectedGrau] = useState<GrauInstalado | ''>('');
  const [saveMessage, setSaveMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const hydrate = async () => {
      const [estruturaRows, tecnicaRows] = await Promise.all([
        parseCsvFromUrl<EstruturaRow>(estruturaCsvUrl),
        parseCsvFromUrl<TecnicaRow>(tecnicaCsvUrl),
      ]);

      const siglas = Array.from(
        new Set(
          estruturaRows
            .map((item) => String(item.Sigla || '').trim())
            .filter((item) => item !== '')
        )
      ).sort((a, b) => a.localeCompare(b, 'pt-BR'));
      setSiglasUnidade(siglas);

      setTecnicaData(
        tecnicaRows.filter((item) => item.Nivel1 && item.Nivel2 && item.Nivel3)
      );

      const localRaw = localStorage.getItem(STORAGE_KEY);
      if (localRaw) {
        try {
          const localRows: MapaRow[] = JSON.parse(localRaw);
          setRows(localRows);
          return;
        } catch {
          // ignore and start with empty data
        }
      }
      setRows([]);
    };

    hydrate().catch(() => {
      setErrorMessage('Não foi possível carregar todas as referências do mapa.');
    });
  }, []);

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
    setRelevancia('');
    setSelectedGrau('');
  };

  const handleNaturezaChange = (value: NaturezaConhecimento | '') => {
    setSelectedNatureza(value);
    setSelectedNivel1('');
    setSelectedNivel2('');
    resetKnowledgeStep();
  };

  const handleAddRegistro = () => {
    setErrorMessage('');
    setSaveMessage('');

    if (!selectedUnidade || !selectedNatureza || !finalConhecimento || !selectedTipo || !selectedGrau) {
      setErrorMessage('Preencha todas as etapas obrigatórias antes de adicionar ao mapa.');
      return;
    }

    const relevanciaNumber = Number.parseInt(relevancia, 10);
    if (Number.isNaN(relevanciaNumber) || relevanciaNumber < 0 || relevanciaNumber > 100) {
      setErrorMessage('A relevância deve ser um número entre 0 e 100.');
      return;
    }

    if (selectedNatureza === 'Técnico' && (!selectedNivel1 || !selectedNivel2)) {
      setErrorMessage('Para natureza Técnica, selecione Nível 1 e Nível 2 antes do conhecimento.');
      return;
    }

    const newRow: MapaRow = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      unidade: selectedUnidade,
      natureza: selectedNatureza,
      nivel1: selectedNatureza === 'Técnico' ? selectedNivel1 : undefined,
      nivel2: selectedNatureza === 'Técnico' ? selectedNivel2 : undefined,
      conhecimento: finalConhecimento,
      tipo: selectedTipo,
      relevancia: relevanciaNumber,
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
    setRelevancia('');
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
  const canTypeRelevancia = canChooseTipo && selectedTipo !== '';
  const canChooseGrau = canTypeRelevancia && relevancia !== '';

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
            <select
              value={selectedUnidade}
              onChange={(e) => setSelectedUnidade(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-700"
            >
              <option value="">Selecione a sigla da unidade</option>
              {siglasUnidade.map((sigla) => (
                <option key={sigla} value={sigla}>{sigla}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200" title={tooltipByField.natureza}>
              2. Selecione a Natureza do Conhecimento
            </label>
            <select
              value={selectedNatureza}
              onChange={(e) => handleNaturezaChange(e.target.value as NaturezaConhecimento | '')}
              disabled={!selectedUnidade}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 disabled:opacity-60"
            >
              <option value="">Selecione uma natureza</option>
              <option value="Liderança">Liderança</option>
              <option value="Transversal">Transversal</option>
              <option value="Técnico">Técnico</option>
            </select>
          </div>

          {selectedNatureza === 'Técnico' && (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-200" title="Primeira camada da trilha técnica.">
                  2.1 Nível 1 Técnico
                </label>
                <select
                  value={selectedNivel1}
                  onChange={(e) => {
                    setSelectedNivel1(e.target.value);
                    setSelectedNivel2('');
                    resetKnowledgeStep();
                  }}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-700"
                >
                  <option value="">Selecione o Nível 1</option>
                  {nivel1Options.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-200" title="Segunda camada da trilha técnica.">
                  2.2 Nível 2 Técnico
                </label>
                <select
                  value={selectedNivel2}
                  onChange={(e) => {
                    setSelectedNivel2(e.target.value);
                    resetKnowledgeStep();
                  }}
                  disabled={!selectedNivel1}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 disabled:opacity-60"
                >
                  <option value="">Selecione o Nível 2</option>
                  {nivel2Options.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </div>
            </>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200" title={tooltipByField.conhecimento}>
              3. Selecione o Conhecimento
            </label>
            <select
              value={selectedConhecimento}
              onChange={(e) => setSelectedConhecimento(e.target.value)}
              disabled={!canChooseKnowledge}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 disabled:opacity-60"
            >
              <option value="">Selecione um conhecimento</option>
              {knowledgeOptions.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </div>

          {selectedNatureza === 'Técnico' && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-200" title="Use para editar ou acrescentar o Nível 3 quando necessário.">
                3.1 Editar ou Acrescentar Nível 3
              </label>
              <input
                value={customNivel3}
                onChange={(e) => setCustomNivel3(e.target.value)}
                placeholder="Informe novo Nível 3 (opcional)"
                disabled={!canChooseKnowledge}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 disabled:opacity-60"
              />
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200" title={tooltipByField.tipo}>
              4. Selecione o Tipo de Conhecimento
            </label>
            <select
              value={selectedTipo}
              onChange={(e) => setSelectedTipo(e.target.value as TipoConhecimento | '')}
              disabled={!canChooseTipo}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 disabled:opacity-60"
            >
              <option value="">Selecione o tipo</option>
              <option value="Apoio">Apoio</option>
              <option value="Essencial">Essencial</option>
              <option value="Crítico">Crítico</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200" title={tooltipByField.relevancia}>
              5. Indique a Relevância (%)
            </label>
            <input
              type="number"
              min={0}
              max={100}
              value={relevancia}
              onChange={(e) => setRelevancia(e.target.value)}
              disabled={!canTypeRelevancia}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 disabled:opacity-60"
              placeholder="0 a 100"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200" title={tooltipByField.grau}>
              6. Selecione o Grau Instalado
            </label>
            <select
              value={selectedGrau}
              onChange={(e) => setSelectedGrau(e.target.value as GrauInstalado | '')}
              disabled={!canChooseGrau}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 disabled:opacity-60"
            >
              <option value="">Selecione o grau</option>
              <option value="Inexistente">Inexistente</option>
              <option value="Iniciante">Iniciante</option>
              <option value="Intermediário">Intermediário</option>
              <option value="Avançado">Avançado</option>
            </select>
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

      {saveMessage && (
        <p className="text-sm text-slate-600">{saveMessage}</p>
      )}

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-700">
            <tr>
              <th className="text-left px-4 py-3">Unidade</th>
              <th className="text-left px-4 py-3">Natureza</th>
              <th className="text-left px-4 py-3">Conhecimento</th>
              <th className="text-left px-4 py-3">Tipo</th>
              <th className="text-left px-4 py-3">Relevância (%)</th>
              <th className="text-left px-4 py-3">Grau Instalado</th>
              <th className="text-left px-4 py-3">Ações</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-t border-slate-100">
                <td className="px-4 py-3 align-top text-slate-800">{row.unidade}</td>
                <td className="px-4 py-3 align-top text-slate-700">{row.natureza}</td>
                <td className="px-4 py-3 align-top text-slate-800">
                  {row.natureza === 'Técnico' && row.nivel1 && row.nivel2
                    ? `${row.nivel1} > ${row.nivel2} > ${row.conhecimento}`
                    : row.conhecimento}
                </td>
                <td className="px-4 py-3 align-top text-slate-700">{row.tipo}</td>
                <td className="px-4 py-3 align-top text-slate-700">{row.relevancia}</td>
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
    </div>
  );
};

export default Mapa;
