import { useState } from 'react';
import { calculateRoute } from '../services/api';
import type { Point } from '../types/route';
export function useRoutes() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  async function run(a: Point, b: Point, s: Point[]) {
    setLoading(true);
    setError('');
    try {
      const result = await calculateRoute(a, b, s);
      return result;
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : 'Não foi possível calcular as rotas.',
      );
      return null;
    } finally {
      setLoading(false);
    }
  }
  return { loading, error, run };
}
