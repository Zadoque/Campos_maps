import { z } from 'zod';
import {
  PlaceSearchQuerySchema,
  PlacesSchema,
  type Place,
} from '../types/place';
import {
  RouteRequestSchema,
  RouteResponseSchema,
  type Point,
  type RouteResponse,
} from '../types/route';

// Em produção/ngrok, o frontend e a API usam o mesmo domínio.
// Em desenvolvimento, o Vite encaminha /api para o backend local.
const API = import.meta.env.VITE_API_URL || '/api';

async function parseResponse<T>(
  response: Response,
  schema: z.ZodType<T>,
  requestError: string,
): Promise<T> {
  if (!response.ok) {
    throw new Error(requestError);
  }
  const payload: unknown = await response.json();
  const result = schema.safeParse(payload);
  if (!result.success) {
    throw new Error('A API retornou dados em um formato inválido', {
      cause: result.error,
    });
  }
  return result.data;
}

export async function calculateRoute(
  origin: Point,
  destination: Point,
  stops: Point[],
): Promise<RouteResponse> {
  const request = RouteRequestSchema.parse({ origin, destination, stops });
  const response = await fetch(`${API}/routes/alternatives`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
  return parseResponse(
    response,
    RouteResponseSchema,
    'Não foi possível calcular as rotas',
  );
}

export async function searchPlaces(query: string): Promise<Place[]> {
  const validQuery = PlaceSearchQuerySchema.parse(query);
  const response = await fetch(
    `${API}/map/search?q=${encodeURIComponent(validQuery)}`,
  );
  return parseResponse(
    response,
    PlacesSchema,
    'Não foi possível pesquisar o endereço',
  );
}
