import { useEffect } from 'react';
import {
  MapContainer,
  TileLayer,
  Polyline,
  CircleMarker,
  Popup,
  useMap as useLeafletMap,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useMapTiles } from '../hooks/useMapTiles';
import type { Point, RouteResponse } from '../types/route';
function ResizeHandler() {
  const map = useLeafletMap();
  useEffect(() => {
    const resize = () => map.invalidateSize({ pan: false, animate: false });
    const observer = new ResizeObserver(resize);
    observer.observe(map.getContainer());
    window.addEventListener('resize', resize);
    const timer = window.setTimeout(resize, 100);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', resize);
      window.clearTimeout(timer);
    };
  }, [map]);
  return null;
}
export function MapView({
  origin,
  destination,
  stops,
  routes,
  selectedRank,
}: {
  origin: Point;
  destination: Point;
  stops: Point[];
  routes: RouteResponse | null;
  selectedRank: number;
}) {
  const colors = ['#3b82f6', '#f59e0b', '#ef4444'];
  const tiles = useMapTiles();
  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={[-21.7523, -41.3304]}
        zoom={13}
        minZoom={9}
        maxZoom={19}
        zoomControl
        className="h-full w-full"
        preferCanvas
        scrollWheelZoom
        touchZoom
        doubleClickZoom
        dragging
        bounceAtZoomLimits={false}
      >
        <ResizeHandler />
        <TileLayer
          key={tiles.provider}
          attribution="&copy; OpenStreetMap contributors"
          url={tiles.url}
          maxZoom={19}
          maxNativeZoom={19}
          updateWhenIdle={false}
          updateWhenZooming
          keepBuffer={3}
          eventHandlers={{
            load: tiles.handleLoad,
            tileerror: tiles.handleError,
          }}
        />
        {routes?.routes.map((r, i) => (
          <Polyline
            key={r.rank}
            positions={r.geometry.map(
              (p) => [p.lat, p.lon] as [number, number],
            )}
            pathOptions={{
              color: colors[i],
              weight: r.rank === selectedRank ? 7 : 3,
              opacity: r.rank === selectedRank ? 1 : 0.35,
            }}
          />
        ))}
        <CircleMarker
          center={[origin.lat, origin.lon]}
          radius={9}
          pathOptions={{
            color: '#fff',
            weight: 3,
            fillColor: '#2563eb',
            fillOpacity: 1,
          }}
        >
          <Popup>Origem</Popup>
        </CircleMarker>
        <CircleMarker
          center={[destination.lat, destination.lon]}
          radius={9}
          pathOptions={{
            color: '#fff',
            weight: 3,
            fillColor: '#dc493d',
            fillOpacity: 1,
          }}
        >
          <Popup>Destino</Popup>
        </CircleMarker>
        {stops.map((p, i) => (
          <CircleMarker
            key={i}
            center={[p.lat, p.lon]}
            radius={8}
            pathOptions={{
              color: '#fff',
              weight: 3,
              fillColor: '#f59e0b',
              fillOpacity: 1,
            }}
          >
            <Popup>Parada {i + 1}</Popup>
          </CircleMarker>
        ))}
      </MapContainer>
      {tiles.state === 'loading' && tiles.provider === 'primary' && (
        <div className="absolute left-1/2 top-4 z-[500] -translate-x-1/2 rounded-md bg-white px-3 py-2 font-mono text-[11px] text-slate-500 shadow-md">
          Carregando mapa…
        </div>
      )}
      {tiles.state === 'loading' && tiles.provider === 'fallback' && (
        <div className="absolute left-1/2 top-4 z-[500] -translate-x-1/2 rounded-md bg-white px-3 py-2 font-mono text-[11px] text-slate-500 shadow-md">
          Tentando uma fonte alternativa para o mapa…
        </div>
      )}
      {tiles.state === 'error' && (
        <div className="absolute left-1/2 top-4 z-[500] -translate-x-1/2 rounded-md bg-white px-3 py-2 font-mono text-[11px] text-red-700 shadow-md">
          Tiles indisponíveis. Verifique sua conexão.
        </div>
      )}
    </div>
  );
}
