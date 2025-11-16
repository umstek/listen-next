import { z } from 'zod'

export const playLogEntrySchema = z.object({
  time: z
    .number()
    .int()
    .default(() => Date.now()),
  playlistId: z
    .string()
    .regex(/[A-Za-z0-9_-]{21}/)
    .optional(),
  fileId: z.string().regex(/[A-Za-z0-9_-]{21}/),
  fileName: z.string(),
  position: z.number().int().default(0),
  duration: z.number().int().default(0),
  title: z.string().default(''),
  artist: z.string().default(''),
  album: z.string().default(''),
})

export type PlayLogEntry = z.infer<typeof playLogEntrySchema>
