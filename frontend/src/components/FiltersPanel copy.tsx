// src/components/FiltersPanel.tsx
interface FiltersPanelProps {
  reportType: 'all' | 'today' | 'week' | 'custom';
  setReportType: (type: 'all' | 'today' | 'week' | 'custom') => void;
  search: string;
  setSearch: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  startDate: string;
  setStartDate: (value: string) => void;
  endDate: string;
  setEndDate: (value: string) => void;
  onApplyFilter: () => void;        // mantido por compatibilidade, mas vamos usar melhor
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
}: FiltersPanelProps) {

  const clearAllFilters = () => {
    setReportType('all');
    setSearch('');
    setStatusFilter('');
    setStartDate('');
    setEndDate('');
  };

  return (
    <div className="bg-white rounded-3xl shadow p-6 mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Filtros e Relatórios</h2>
        <button
          onClick={clearAllFilters}
          className="text-sm text-gray-500 hover:text-red-600 transition"
        >
          Limpar tudo
        </button>
      </div>

      {/* Botões de Relatório Rápido */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={() => setReportType('all')}
          className={`px-6 py-3 rounded-2xl font-medium transition ${
            reportType === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          Todas as Tarefas
        </button>
        <button
          onClick={() => setReportType('today')}
          className={`px-6 py-3 rounded-2xl font-medium transition ${
            reportType === 'today' ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          Hoje
        </button>
        <button
          onClick={() => setReportType('week')}
          className={`px-6 py-3 rounded-2xl font-medium transition ${
            reportType === 'week' ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          Última Semana
        </button>
        <button
          onClick={() => setReportType('custom')}
          className={`px-6 py-3 rounded-2xl font-medium transition ${
            reportType === 'custom' ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          Período Customizado
        </button>
      </div>

      {/* Busca + Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <input
          type="text"
          placeholder="Buscar por título ou descrição..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todos os Status</option>
          <option value="pendente">Pendente</option>
          <option value="em-andamento">Em Andamento</option>
          <option value="concluido">Concluída</option>
        </select>
      </div>

      {/* Filtro por Data Customizado */}
      {reportType === 'custom' && (
        <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200">
          <p className="text-sm font-medium text-gray-700 mb-3">Filtrar por Período Específico</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Data Inicial</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Data Final</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}