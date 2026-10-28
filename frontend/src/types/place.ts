import { z } from 'zod';

export const PlaceSearchQuerySchema = z.string().trim().min(3).max(200);

export const PlaceSchema = z.object({
  place_id: z.number().int().nonnegative(),
  display_name: z.string().trim().min(1),
  lat: z.coerce.number().finite().min(-90).max(90),
  lon: z.coerce.number().finite().min(-180).max(180),
});

export const PlacesSchema = z.array(PlaceSchema).max(5);

export type Place = z.infer<typeof PlaceSchema>;
