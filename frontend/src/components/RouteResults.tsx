import type { RouteResponse } from '../types/route';
export function RouteResults({
  data,
  selectedRank,
  onSelect,
}: {
  data: RouteResponse | null;
  selectedRank: number;
  onSelect: (rank: number) => void;
}) {
  if (!data)
    return (
      <aside className="px-1 pt-5 text-center text-slate-500">
        <span className="block text-4xl text-lime-600">⌁</span>
        <h2 className="mt-2 text-[17px] font-semibold text-slate-800">
          Pronto para explorar
        </h2>
        <p className="mt-2 text-xs leading-relaxed">
          Defina origem, destino e paradas para visualizar alternativas no mapa.
        </p>
        <div className="mt-6 flex items-center justify-center gap-2 font-mono text-[10px]">
          <i className="h-2 w-2 rounded-full bg-blue-500" />
          Mais rápida <i className="ml-2 h-2 w-2 rounded-full bg-amber-500" />
          Alternativa 2 <i className="ml-2 h-2 w-2 rounded-full bg-red-500" />
          Alternativa 3
        </div>
      </aside>
    );
  return (
    <aside className="pt-5">
      <div className="flex justify-between">
        <span className="font-mono text-[10px] tracking-[1.5px] text-slate-500">
          ALGORITMO TRANSPARENTE
        </span>
        <small className="font-mono text-[10px] text-slate-500">
          {data.algorithm}
        </small>
      </div>
      <h2 className="my-3 text-xl font-semibold text-slate-800">
        {data.routes.length}{' '}
        {data.routes.length === 1 ? 'rota encontrada' : 'rotas encontradas'}
      </h2>
      {data.routes.map((r, i) => (
        <button
          type="button"
          className={`block w-full cursor-pointer rounded-lg border bg-white p-3 text-left transition hover:border-lime-500 ${r.rank === selectedRank ? 'border-2 border-lime-600 p-[11px]' : 'border-slate-200'}`}
          key={r.rank}
          onClick={() => onSelect(r.rank)}
        >
          <div className="flex justify-between text-[13px]">
            <b>
              <i
                className={`mr-2 inline-block h-2 w-2 rounded-full ${i === 0 ? 'bg-blue-500' : i === 1 ? 'bg-amber-500' : 'bg-red-500'}`}
              />
              {i === 0 ? 'Mais rápida' : `Alternativa ${i + 1}`}
            </b>
            <strong className="text-[15px]">{r.durationMin} min</strong>
          </div>
          <div className="mt-2 font-mono text-[10px] text-slate-500">
            {r.distanceKm.toFixed(1)} km · {r.streets.slice(0, 2).join(' · ')}
          </div>
          {r.rank === selectedRank && r.steps?.length > 0 && (
            <ol className="mt-2 border-t border-slate-100 pl-5 pt-2 text-[11px] leading-7 text-slate-600">
              {r.steps.map((step, index) => (
                <li key={index}>{step.instruction}</li>
              ))}
            </ol>
          )}
        </button>
      ))}
      <div className="mt-4 rounded-lg bg-emerald-50 p-3 text-[11px] leading-relaxed text-slate-600">
        <b>Como funciona?</b>
        <p className="mt-1">
          Selecione uma alternativa para destacá-la no mapa. O Neo4j recalcula
          caminhos evitando segmentos da rota anterior.
        </p>
      </div>
    </aside>
  );
}
