import { useState } from 'react';
import { MapProvider, useMap } from '../context/MapContext';
import { MapView } from '../components/MapView';
import { RouteForm } from '../components/RouteForm';
import { RouteResults } from '../components/RouteResults';
import type { RouteResponse } from '../types/route';
import { SiteHeader } from '../components/SiteHeader';
function MapContent() {
  const map = useMap();
  const [data, setData] = useState<RouteResponse | null>(null);
  const [selectedRank, setSelectedRank] = useState(1);
  function onResult(result: RouteResponse) {
    setData(result);
    setSelectedRank(1);
  }
  return (
    <main className="min-h-screen bg-slate-100 font-sans text-slate-800">
      <SiteHeader compact />
      <div className="flex min-h-[calc(100dvh-3.5rem)] flex-col lg:grid lg:min-h-[calc(100vh-4rem)] lg:grid-cols-[minmax(0,1fr)_390px]">
        <div className="relative h-[52dvh] min-h-80 min-w-0 shrink-0 sm:h-[58dvh] lg:h-auto lg:min-h-0">
          <MapView
            origin={map.origin}
            destination={map.destination}
            stops={map.stops}
            routes={data}
            selectedRank={selectedRank}
          />
          <div className="pointer-events-none absolute bottom-3 left-3 z-[500] rounded-md bg-white/90 px-2.5 py-2 font-mono text-[9px] text-slate-500 shadow-md sm:bottom-5 sm:left-5 sm:px-3 sm:text-[10px]">
            Arraste para navegar · use dois dedos para zoom
          </div>
        </div>
        <div className="min-w-0 bg-slate-100 p-4 sm:p-5 lg:max-h-[calc(100vh-4rem)] lg:overflow-y-auto lg:p-6">
          <RouteForm onResult={onResult} />
          <RouteResults
            data={data}
            selectedRank={selectedRank}
            onSelect={setSelectedRank}
          />
        </div>
      </div>
    </main>
  );
}
export default function MapPage() {
  return (
    <MapProvider>
      <MapContent />
    </MapProvider>
  );
}
