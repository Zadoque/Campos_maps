import { usePlaceSearch } from '../hooks/usePlaceSearch';
import type { Point } from '../types/route';

type PlaceInputProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onSelect: (point: Point, name: string) => void;
};

export function PlaceInput({
  label,
  value,
  onChange,
  onSelect,
}: PlaceInputProps) {
  const search = usePlaceSearch(value);
  return (
    <div className="relative">
      <label className="mt-3 block font-mono text-[11px] text-slate-500">
        {label}
        <input
          className="mt-1.5 min-h-11 w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-base text-slate-800 outline-none focus:border-lime-600 focus:ring-4 focus:ring-lime-100 sm:text-[13px]"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Digite uma rua ou endereço"
          autoComplete="off"
        />
      </label>
      {search.loading && (
        <span className="absolute bottom-3 right-2.5 font-mono text-[10px] text-slate-400">
          pesquisando…
        </span>
      )}
      {search.error && (
        <span className="mt-1 block text-[10px] text-red-700">
          {search.error}
        </span>
      )}
      {search.items.length > 0 && (
        <div className="absolute left-0 right-0 top-[58px] z-[1000] overflow-hidden rounded-md border border-slate-200 bg-white shadow-lg">
          {search.items.map((item) => (
            <button
              className="block w-full border-b border-slate-100 bg-white px-3 py-2.5 text-left text-xs text-slate-700 hover:bg-lime-50"
              type="button"
              key={item.place_id}
              onPointerDown={(event) => {
                event.preventDefault();
                onSelect({ lat: item.lat, lon: item.lon }, item.display_name);
                search.clear();
              }}
            >
              {item.display_name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
