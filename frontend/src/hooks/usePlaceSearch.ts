import { useEffect, useState } from 'react';
import { searchPlaces } from '../services/api';
import type { Place } from '../types/place';

export function usePlaceSearch(query: string) {
  const [items, setItems] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (query.trim().length < 3) {
      setItems([]);
      setError('');
      return;
    }
    let active = true;
    const timer = window.setTimeout(async () => {
      setLoading(true);
      setError('');
      try {
        const places = await searchPlaces(query);
        if (active) {
          setItems(places);
        }
      } catch (caught) {
        if (active) {
          setItems([]);
          setError(
            caught instanceof Error ? caught.message : 'Erro na pesquisa',
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }, 350);
    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [query]);

  return { items, loading, error, clear: () => setItems([]) };
}
