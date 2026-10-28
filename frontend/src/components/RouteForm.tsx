import { useState } from 'react';
import { useMap } from '../context/MapContext';
import { useRoutes } from '../hooks/useRoutes';
import type { RouteResponse } from '../types/route';
import { PlaceInput } from './PlaceInput';

type RouteFormProps = {
  onResult: (result: RouteResponse) => void;
};

export function RouteForm({ onResult }: RouteFormProps) {
  const map = useMap();
  const routes = useRoutes();
  const [originName, setOriginName] = useState('Centro, Campos dos Goytacazes');
  const [destinationName, setDestinationName] = useState('Parque Guarus');

  async function calculate() {
    const result = await routes.run(map.origin, map.destination, map.stops);
    if (result) onResult(result);
  }

  return (
    <section className="border-b border-slate-200 pb-5 sm:pb-6">
      <div className="font-mono text-[10px] tracking-[1.5px] text-slate-500">
        PLANEJADOR URBANO
      </div>
      <h1 className="mt-2 text-2xl font-bold leading-tight text-slate-800 sm:text-[27px]">
        Rotas de Campos
      </h1>
      <p className="mb-4 mt-2 text-[13px] leading-relaxed text-slate-500 sm:mb-5">
        Pesquise ruas, bairros ou endereços e compare os três caminhos.
      </p>
      <PlaceInput
        label="Origem"
        value={originName}
        onChange={setOriginName}
        onSelect={(point, name) => {
          map.setOrigin(point);
          setOriginName(name);
        }}
      />
      <PlaceInput
        label="Destino"
        value={destinationName}
        onChange={setDestinationName}
        onSelect={(point, name) => {
          map.setDestination(point);
          setDestinationName(name);
        }}
      />
      {map.stops.map((_, index) => (
        <div
          className="mt-2 flex min-h-11 items-center justify-between rounded-md bg-lime-50 px-3 py-2 text-xs text-slate-700"
          key={index}
        >
          <span>Parada {index + 1}</span>
          <button
            type="button"
            aria-label={`Remover parada ${index + 1}`}
            className="min-h-11 min-w-11 border-0 bg-transparent text-lg leading-none text-slate-500 hover:text-red-600"
            onClick={() => map.removeStop(index)}
          >
            ×
          </button>
        </div>
      ))}
      <div className="mt-4 grid grid-cols-1 gap-2 sm:mt-5 sm:grid-cols-[auto_1fr]">
        <button
          type="button"
          className="min-h-11 rounded-md bg-slate-200 px-3 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-300"
          onClick={map.addStop}
        >
          ＋ Adicionar parada
        </button>
        <button
          type="button"
          className="min-h-11 rounded-md bg-emerald-950 px-3 py-2.5 text-xs font-semibold text-white hover:bg-emerald-900 disabled:opacity-60"
          onClick={calculate}
          disabled={routes.loading}
        >
          {routes.loading ? 'Calculando…' : 'Calcular 3 rotas'}
        </button>
      </div>
      {routes.error && (
        <p className="mt-3 text-xs text-red-700">{routes.error}</p>
      )}
    </section>
  );
}
