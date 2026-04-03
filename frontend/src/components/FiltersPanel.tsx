import type { Dispatch, SetStateAction } from "react";


interface FiltersPanelProps {
  reportType: 'all' | 'today' | 'week' | 'custom';
  setReportType: Dispatch<SetStateAction<'all' | 'today' | 'week' | 'custom'>>;
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  statusFilter: string;
  setStatusFilter: Dispatch<SetStateAction<string>>;
  startDate: string;
  setStartDate: Dispatch<SetStateAction<string>>;
  endDate: string;
  setEndDate: Dispatch<SetStateAction<string>>;
  onApplyFilter: () => void;
}

export default function FiltersPanel({
  reportType,
  setReportType,
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  onApplyFilter,
}: FiltersPanelProps) {
  const loadAll = () => setReportType('all');
  const loadToday = () => setReportType('today');
  const loadLastWeek = () => setReportType('week');
  const loadCustom = () => setReportType('custom');

  return (
    <div className="mb-8 bg-gray-50 p-6 rounded-3xl border border-gray-100">
      <h4 className="font-semibold text-gray-700 mb-4">Relatórios e Filtros</h4>

      <div className="flex flex-wrap gap-3 mb-6">
        <button onClick={loadAll} className="px-6 py-2.5 bg-white border border-gray-300 rounded-2xl hover:bg-gray-100 transition font-medium">Todas as Tarefas</button>
        <button onClick={loadToday} className="px-6 py-2.5 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition">Hoje</button>
        <button onClick={loadLastWeek} className="px-6 py-2.5 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition">Última Semana</button>
        <button onClick={loadCustom} className="px-6 py-2.5 bg-amber-500 text-white rounded-2xl hover:bg-amber-600 transition">Período Customizado</button>
      </div>

      {reportType === 'custom' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-white rounded-2xl border mb-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Data Inicial</label>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full px-4 py-3 border rounded-2xl" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Data Final</label>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full px-4 py-3 border rounded-2xl" />
          </div>
          <div className="flex items-end">
            <button onClick={onApplyFilter} className="w-full bg-emerald-600 text-white py-3 rounded-2xl hover:bg-emerald-700">Aplicar Filtro</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Buscar por título ou descrição..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded-2xl"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded-2xl"
        >
          <option value="">Todos os status</option>
          <option value="pendente">Pendente</option>
          <option value="em-andamento">Em andamento</option>
          <option value="concluido">Concluído</option>
        </select>
      </div>
    </div>
  );
}