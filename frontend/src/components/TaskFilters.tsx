export function TaskFilters({ setFilter }: { setFilter: (filter: string) => void }) {
  return (
    <div className="flex gap-2 mb-4">
      <button onClick={() => setFilter("all")} className="btn">Todas</button>
      <button onClick={() => setFilter("today")} className="btn">Hoje</button>
      <button onClick={() => setFilter("week")} className="btn">Semana</button>
    </div>
  );
}