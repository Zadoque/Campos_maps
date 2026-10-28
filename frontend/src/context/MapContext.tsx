import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Point } from '../types/route';
type MapContextValue = {
  origin: Point;
  destination: Point;
  stops: Point[];
  setOrigin: (point: Point) => void;
  setDestination: (point: Point) => void;
  addStop: () => void;
  removeStop: (index: number) => void;
};
const DEFAULT_ORIGIN: Point = { lat: -21.7523, lon: -41.3304 };
const DEFAULT_DESTINATION: Point = { lat: -21.7608, lon: -41.3202 };
const DEFAULT_STOP: Point = { lat: -21.755, lon: -41.326 };
const MapContext = createContext<MapContextValue | null>(null);
export function MapProvider({ children }: { children: ReactNode }) {
  const [origin, setOrigin] = useState<Point>(DEFAULT_ORIGIN);
  const [destination, setDestination] = useState<Point>(DEFAULT_DESTINATION);
  const [stops, setStops] = useState<Point[]>([]);
  return (
    <MapContext.Provider
      value={{
        origin,
        destination,
        stops,
        setOrigin,
        setDestination,
        addStop: () =>
          setStops((currentStops) => [...currentStops, DEFAULT_STOP]),
        removeStop: (index) =>
          setStops((currentStops) =>
            currentStops.filter((_, currentIndex) => currentIndex !== index),
          ),
      }}
    >
      {children}
    </MapContext.Provider>
  );
}
export function useMap() {
  const context = useContext(MapContext);
  if (!context) throw new Error('useMap deve ser usado dentro de MapProvider.');
  return context;
}
