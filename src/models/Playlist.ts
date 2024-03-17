import { nanoid } from 'nanoid';
import { z } from 'zod';

import { nanoidRegex } from './constants';

export const playlistItemSchema = z.object({
  fileId: z
    .string()
    .regex(nanoidRegex)
    .optional()
    .describe('To fetch the metadata'),
  path: z.string().describe('To fetch the file'),
  duration: z.number().int().default(0),
  title: z.string().default(''),
  artist: z.string().default(''),
  album: z.string().default(''),
  createdAt: z.number().int().default(Date.now()),
});

export const playlistSchema = z.object({
  id: z.string().regex(nanoidRegex).default(nanoid),
  name: z.string().default(''),
  items: z.array(playlistItemSchema).default([]),
  activeIndex: z.number().int().default(0),
  createdAt: z.number().int().default(Date.now()),
  accessedAt: z.number().int().default(Date.now()),
});

export type PlaylistItem = z.infer<typeof playlistItemSchema>;

export type Playlist = z.infer<typeof playlistSchema>;
