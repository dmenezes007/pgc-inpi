import React, { useEffect, useMemo, useState } from 'react';
import Papa from 'papaparse';
import rastreamentoCsvUrl from '../src/files/docs/rastreamento.csv?url';

type TipoConhecimento = 'Apoio' | 'Essencial' | 'Crítico';

interface CsvRow {
  Conhecimento: string;
  Tipo_de_Conhecimento: TipoConhecimento;
  'Relevancia (Score)': string;
  Grau_Conhecimento_Instalado: string;
}

interface MapaRow {
  id: string;
  conhecimento: string;
  tipo: TipoConhecimento;
  relevancia: number;
  grauInstalado: number;
  metricaProposta: string;
}

const STORAGE_KEY = 'pgc_mapa_conhecimento_v1';

const getSheetEndpoint = (): string => {
  const value = (import.meta as any).env?.VITE_GSHEET_MAPA_ENDPOINT;
  return typeof value === 'string' ? value : '';
};

const Mapa: React.FC = () => {
  const [rows, setRows] = useState<MapaRow[]>([]);
  const [tipoFiltro, setTipoFiltro] = useState<'Todos' | TipoConhecimento>('Todos');
  const [query, setQuery] = useState('');
  const [saveMessage, setSaveMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const hydrate = async () => {
      const localRaw = localStorage.getItem(STORAGE_KEY);
      if (localRaw) {
        try {
          const localRows: MapaRow[] = JSON.parse(localRaw);
          setRows(localRows);
          return;
        } catch {
          // ignore and rebuild from source
        }
      }

      const response = await fetch(rastreamentoCsvUrl);
      const csvText = await response.text();
      const parsed = Papa.parse<CsvRow>(csvText, { header: true, skipEmptyLines: true, delimiter: ';' });

      const grouped = new Map<string, { tipo: TipoConhecimento; relevancia: number[]; grau: number[] }>();

      parsed.data.forEach((item) => {
        if (!item?.Conhecimento || !item?.Tipo_de_Conhecimento) return;
        const key = item.Conhecimento.trim();
        const rel = Number.parseFloat(item['Relevancia (Score)'] || '0');
        const grau = Number.parseInt(item.Grau_Conhecimento_Instalado || '0', 10);
        if (!grouped.has(key)) {
          grouped.set(key, {
            tipo: item.Tipo_de_Conhecimento,
            relevancia: [],
            grau: [],
          });
        }
        const current = grouped.get(key)!;
        current.relevancia.push(Number.isNaN(rel) ? 0 : rel);
        current.grau.push(Number.isNaN(grau) ? 0 : grau);
      });

      const seededRows: MapaRow[] = Array.from(grouped.entries()).map(([conhecimento, data], index) => {
        const avgRel = data.relevancia.length ? data.relevancia.reduce((a, b) => a + b, 0) / data.relevancia.length : 0;
        const avgGrau = data.grau.length ? Math.round(data.grau.reduce((a, b) => a + b, 0) / data.grau.length) : 0;
        return {
          id: String(index + 1),
          conhecimento,
          tipo: data.tipo,
          relevancia: Math.round(avgRel),
          grauInstalado: avgGrau,
          metricaProposta: '',
        };
      });

      setRows(seededRows);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seededRows));
    };

    hydrate();
  }, []);

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const byTipo = tipoFiltro === 'Todos' || row.tipo === tipoFiltro;
      const byText = query.trim() === '' || row.conhecimento.toLowerCase().includes(query.toLowerCase());
      return byTipo && byText;
    });
  }, [rows, tipoFiltro, query]);

  const updateRow = (id: string, patch: Partial<MapaRow>) => {
    const next = rows.map((row) => (row.id === id ? { ...row, ...patch } : row));
    setRows(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const saveToSheet = async () => {
    const endpoint = getSheetEndpoint();
    setIsSaving(true);
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
    } catch (error) {
      setSaveMessage('Falha ao salvar na planilha. Os dados permanecem salvos localmente.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="module-intro">
        <div className="module-kicker">REFINAMENTO DO MAPA</div>
        <p className="module-lead">
          Este módulo consolida e refina os conhecimentos de apoio, essenciais e críticos, permitindo edição
          de métricas propostas e persistência simples para acompanhamento evolutivo.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar conhecimento..."
          className="px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-700"
        />
        <select
          value={tipoFiltro}
          onChange={(e) => setTipoFiltro(e.target.value as any)}
          className="px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-700"
        >
          <option value="Todos">Todos os tipos</option>
          <option value="Apoio">Apoio</option>
          <option value="Essencial">Essencial</option>
          <option value="Crítico">Crítico</option>
        </select>
        <button
          onClick={saveToSheet}
          disabled={isSaving}
          className="px-4 py-2 rounded-lg font-semibold text-white bg-orange-600 hover:bg-orange-700 disabled:opacity-60"
        >
          {isSaving ? 'Salvando...' : 'Salvar Mapa'}
        </button>
      </div>

      {saveMessage && (
        <p className="text-sm text-slate-600">{saveMessage}</p>
      )}

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-700">
            <tr>
              <th className="text-left px-4 py-3">Conhecimento</th>
              <th className="text-left px-4 py-3">Tipo</th>
              <th className="text-left px-4 py-3">Relevância (%)</th>
              <th className="text-left px-4 py-3">Grau Instalado (1-3)</th>
              <th className="text-left px-4 py-3">Métrica Proposta</th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.map((row) => (
              <tr key={row.id} className="border-t border-slate-100">
                <td className="px-4 py-3 align-top text-slate-800">{row.conhecimento}</td>
                <td className="px-4 py-3 align-top">
                  <select
                    value={row.tipo}
                    onChange={(e) => updateRow(row.id, { tipo: e.target.value as TipoConhecimento })}
                    className="px-2 py-1 rounded border border-slate-300"
                  >
                    <option value="Apoio">Apoio</option>
                    <option value="Essencial">Essencial</option>
                    <option value="Crítico">Crítico</option>
                  </select>
                </td>
                <td className="px-4 py-3 align-top">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={row.relevancia}
                    onChange={(e) => updateRow(row.id, { relevancia: Number.parseInt(e.target.value || '0', 10) })}
                    className="w-24 px-2 py-1 rounded border border-slate-300"
                  />
                </td>
                <td className="px-4 py-3 align-top">
                  <input
                    type="number"
                    min={1}
                    max={3}
                    value={row.grauInstalado}
                    onChange={(e) => updateRow(row.id, { grauInstalado: Number.parseInt(e.target.value || '1', 10) })}
                    className="w-24 px-2 py-1 rounded border border-slate-300"
                  />
                </td>
                <td className="px-4 py-3 align-top">
                  <input
                    value={row.metricaProposta}
                    onChange={(e) => updateRow(row.id, { metricaProposta: e.target.value })}
                    placeholder="Ex.: reduzir gap crítico para <= 10%"
                    className="w-full px-2 py-1 rounded border border-slate-300"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Mapa;
