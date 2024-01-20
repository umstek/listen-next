import { nanoid } from 'nanoid';
import { z } from 'zod';

import { nanoidRegex, sources } from './constants';

export const audioMetadataSchema = z.object({
  id: z.string().regex(nanoidRegex).optional().default(nanoid),
  source: z.enum(sources),
  name: z.string(),
  path: z.string(),
  genre: z.array(z.string()).optional().default([]),
  artists: z.array(z.string()).optional().default([]),
  album: z.string().optional(),
  title: z.string().optional(),
  trackNumber: z.number().int().optional(),
  trackCount: z.number().int().optional(),
  duration: z.number().optional(),
  year: z.number().int().optional(),
});

export type AudioMetadata = z.infer<typeof audioMetadataSchema>;
