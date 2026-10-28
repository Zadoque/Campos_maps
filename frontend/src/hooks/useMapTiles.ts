import { useState } from 'react';

type TileProvider = 'primary' | 'fallback';
type TileState = 'loading' | 'ready' | 'error';

const TILE_URLS: Record<TileProvider, string> = {
  primary: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  fallback: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
};

export function useMapTiles() {
  const [provider, setProvider] = useState<TileProvider>('primary');
  const [state, setState] = useState<TileState>('loading');

  function handleError() {
    if (provider === 'primary') {
      setProvider('fallback');
      setState('loading');
      return;
    }
    setState('error');
  }

  return {
    provider,
    state,
    url: TILE_URLS[provider],
    handleLoad: () => setState('ready'),
    handleError,
  };
}
