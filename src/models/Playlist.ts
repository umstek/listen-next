import { nanoid } from 'nanoid';
import { z } from 'zod';

export const playlistItemSchema = z.object({
  fileId: z.string().regex(/[A-Za-z0-9_-]{21}/),
  fileName: z.string(),
  duration: z.number().int().default(0),
  title: z.string().default(''),
  artist: z.string().default(''),
  album: z.string().default(''),
});

export const playlistSchema = z.object({
  id: z
    .string()
    .regex(/[A-Za-z0-9_-]{21}/)
    .default(nanoid),
  name: z.string(),
  items: z.array(playlistItemSchema),
});
