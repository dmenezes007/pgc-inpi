import React, { useEffect, useMemo, useState } from 'react';
import * as XLSX from 'xlsx';
import baseCapacitacoesUrl from '../base-capacitacoes.xlsx?url';

interface CapacitacaoRow {
  servidor: string;
  conhecimento: string;
  curso: string;
  cargaHoraria: string;
}

interface ServidorRow {
  servidor: string;
  matricula: string;
  unidade: string;
  cargo: string;
}

interface JoinedRow {
  servidor: string;
  conhecimento: string;
  curso: string;
  cargaHoraria: string;
  matricula: string;
  unidade: string;
  cargo: string;
}

const normalize = (value: unknown): string => String(value ?? '').trim();

const getCell = (obj: Record<string, any>, candidates: string[]): string => {
  for (const key of Object.keys(obj)) {
    const lower = key.toLowerCase();
    if (candidates.some((c) => lower.includes(c))) {
      return normalize(obj[key]);
    }
  }
  return '';
};

const Detentores: React.FC = () => {
  const [rows, setRows] = useState<JoinedRow[]>([]);
  const [queryConhecimento, setQueryConhecimento] = useState('');
  const [queryServidor, setQueryServidor] = useState('');
  const [queryUnidade, setQueryUnidade] = useState('');

  useEffect(() => {
    const load = async () => {
      const resp = await fetch(baseCapacitacoesUrl);
      const buffer = await resp.arrayBuffer();
      const wb = XLSX.read(buffer, { type: 'array' });

      const capacitacoesSheet = wb.Sheets[wb.SheetNames[0]];
      const servidoresSheet = wb.Sheets[wb.SheetNames[1]];

      const capRaw = XLSX.utils.sheet_to_json<Record<string, any>>(capacitacoesSheet, { defval: '' });
      const srvRaw = XLSX.utils.sheet_to_json<Record<string, any>>(servidoresSheet, { defval: '' });

      const capacitacoes: CapacitacaoRow[] = capRaw.map((row) => ({
        servidor: getCell(row, ['servidor', 'nome']),
        conhecimento: getCell(row, ['conhecimento', 'tema', 'assunto', 'capacita']),
        curso: getCell(row, ['curso', 'acao', 'capacita']),
        cargaHoraria: getCell(row, ['carga', 'hor']),
      })).filter((r) => r.servidor && (r.conhecimento || r.curso));

      const servidores: ServidorRow[] = srvRaw.map((row) => ({
        servidor: getCell(row, ['servidor', 'nome']),
        matricula: getCell(row, ['matricula', 'siape']),
        unidade: getCell(row, ['unidade', 'lotacao', 'lotação']),
        cargo: getCell(row, ['cargo', 'funcao', 'função']),
      })).filter((r) => r.servidor);

      const srvMap = new Map<string, ServidorRow>();
      servidores.forEach((s) => srvMap.set(s.servidor.toLowerCase(), s));

      const joined: JoinedRow[] = capacitacoes.map((c) => {
        const srv = srvMap.get(c.servidor.toLowerCase());
        return {
          servidor: c.servidor,
          conhecimento: c.conhecimento,
          curso: c.curso,
          cargaHoraria: c.cargaHoraria,
          matricula: srv?.matricula || '',
          unidade: srv?.unidade || '',
          cargo: srv?.cargo || '',
        };
      });

      setRows(joined);
    };

    load();
  }, []);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      const byConhecimento = !queryConhecimento || r.conhecimento.toLowerCase().includes(queryConhecimento.toLowerCase()) || r.curso.toLowerCase().includes(queryConhecimento.toLowerCase());
      const byServidor = !queryServidor || r.servidor.toLowerCase().includes(queryServidor.toLowerCase());
      const byUnidade = !queryUnidade || r.unidade.toLowerCase().includes(queryUnidade.toLowerCase());
      return byConhecimento && byServidor && byUnidade;
    });
  }, [rows, queryConhecimento, queryServidor, queryUnidade]);

  return (
    <div className="space-y-6">
      <div className="module-intro">
        <div className="module-kicker">BANCO DE DETENTORES</div>
        <p className="module-lead">
          Pesquisa estruturada de detentores de conhecimento instalada no INPI, combinando registros de
          capacitações e dados funcionais para apoiar consulta, mobilização e sucessão.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          value={queryConhecimento}
          onChange={(e) => setQueryConhecimento(e.target.value)}
          placeholder="Buscar por conhecimento/curso"
          className="px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-700"
        />
        <input
          value={queryServidor}
          onChange={(e) => setQueryServidor(e.target.value)}
          placeholder="Buscar por servidor"
          className="px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-700"
        />
        <input
          value={queryUnidade}
          onChange={(e) => setQueryUnidade(e.target.value)}
          placeholder="Buscar por unidade"
          className="px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-700"
        />
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-700">
            <tr>
              <th className="text-left px-4 py-3">Servidor</th>
              <th className="text-left px-4 py-3">Matrícula</th>
              <th className="text-left px-4 py-3">Unidade</th>
              <th className="text-left px-4 py-3">Cargo</th>
              <th className="text-left px-4 py-3">Conhecimento</th>
              <th className="text-left px-4 py-3">Capacitação</th>
              <th className="text-left px-4 py-3">Carga Horária</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row, index) => (
              <tr key={`${row.servidor}-${row.conhecimento}-${index}`} className="border-t border-slate-100">
                <td className="px-4 py-3 text-slate-800">{row.servidor}</td>
                <td className="px-4 py-3 text-slate-700">{row.matricula || '-'}</td>
                <td className="px-4 py-3 text-slate-700">{row.unidade || '-'}</td>
                <td className="px-4 py-3 text-slate-700">{row.cargo || '-'}</td>
                <td className="px-4 py-3 text-slate-700">{row.conhecimento || '-'}</td>
                <td className="px-4 py-3 text-slate-700">{row.curso || '-'}</td>
                <td className="px-4 py-3 text-slate-700">{row.cargaHoraria || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Detentores;
