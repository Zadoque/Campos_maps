import { describe, expect, it } from 'vitest';
import { PlaceSchema, PlaceSearchQuerySchema } from '../types/place';
import {
  PointSchema,
  RouteRequestSchema,
  RouteResponseSchema,
} from '../types/route';

const geometry = [
  { lat: -21.75, lon: -41.33 },
  { lat: -21.76, lon: -41.32 },
];

function route(rank: number, points = geometry) {
  return {
    rank,
    distanceKm: 2.4,
    durationMin: 5,
    geometry: points,
    streets: ['Rua real'],
    steps: [{ instruction: 'Siga em frente', geometry: points }],
  };
}

describe('contratos Zod da fronteira HTTP', () => {
  it('aceita uma resposta completa de rotas', () => {
    const result = RouteResponseSchema.safeParse({
      algorithm: 'Yen/Dijkstra',
      routes: [route(1)],
      explored: geometry,
    });
    expect(result.success).toBe(true);
  });

  it('rejeita geometrias de rota duplicadas', () => {
    const result = RouteResponseSchema.safeParse({
      algorithm: 'Yen/Dijkstra',
      routes: [route(1), route(2)],
      explored: geometry,
    });
    expect(result.success).toBe(false);
  });

  it('converte coordenadas textuais da busca em números', () => {
    const place = PlaceSchema.parse({
      place_id: 42,
      display_name: 'Avenida Pelinca',
      lat: '-21.752',
      lon: '-41.330',
    });
    expect(place.lat).toBe(-21.752);
    expect(place.lon).toBe(-41.33);
  });

  it('rejeita coordenada e consulta inválidas antes da requisição', () => {
    expect(PointSchema.safeParse({ lat: -91, lon: -41.33 }).success).toBe(
      false,
    );
    expect(
      RouteRequestSchema.safeParse({
        origin: { lat: -91, lon: -41.33 },
        destination: geometry[1],
        stops: [],
      }).success,
    ).toBe(false);
    expect(PlaceSearchQuerySchema.safeParse('ab').success).toBe(false);
  });
});
