import { z } from 'zod';

export const PointSchema = z.object({
  lat: z.number().finite().min(-90).max(90),
  lon: z.number().finite().min(-180).max(180),
});

export const RouteRequestSchema = z.object({
  origin: PointSchema,
  destination: PointSchema,
  stops: z.array(PointSchema).max(20),
});

export const RouteStepSchema = z.object({
  instruction: z.string().trim().min(1),
  geometry: z.array(PointSchema).min(2),
});

export const RouteSchema = z.object({
  rank: z.number().int().positive(),
  distanceKm: z.number().finite().nonnegative(),
  durationMin: z.number().int().nonnegative(),
  geometry: z.array(PointSchema).min(2),
  streets: z.array(z.string()),
  steps: z.array(RouteStepSchema),
});

export const RouteResponseSchema = z
  .object({
    algorithm: z.string().trim().min(1),
    routes: z.array(RouteSchema).min(1).max(3),
    explored: z.array(PointSchema).min(2),
  })
  .superRefine((response, context) => {
    const signatures = new Set(
      response.routes.map((route) => JSON.stringify(route.geometry)),
    );
    if (signatures.size !== response.routes.length) {
      context.addIssue({
        code: 'custom',
        path: ['routes'],
        message: 'A API retornou geometrias de rota duplicadas',
      });
    }
  });

export type Point = z.infer<typeof PointSchema>;
export type RouteRequest = z.infer<typeof RouteRequestSchema>;
export type RouteStep = z.infer<typeof RouteStepSchema>;
export type Route = z.infer<typeof RouteSchema>;
export type RouteResponse = z.infer<typeof RouteResponseSchema>;
