import { z } from 'zod';

import { nanoidRegex } from './constants';

export const playLogEntrySchema = z.object({
  time: z
    .number()
    .int()
    .default(() => Date.now())
    .describe('When this was played'),
  playlistId: z
    .string()
    .regex(nanoidRegex)
    .optional()
    .describe('To load the playlist'),
  fileId: z.string().regex(nanoidRegex).describe('To fetch the metadata'),
  path: z.string().describe('To fetch the file'),
  position: z.number().int().default(0),
  duration: z.number().int().default(0),
  title: z.string().default(''),
  artist: z.string().default(''),
  album: z.string().default(''),
});

export type PlayLogEntry = z.infer<typeof playLogEntrySchema>;
