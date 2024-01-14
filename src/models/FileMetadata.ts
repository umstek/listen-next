import { nanoid } from 'nanoid';
import { z } from 'zod';

export const fileSystemEntityMetadataSchema = z.object({
  id: z
    .string()
    .regex(/[A-Za-z0-9_-]{21}/)
    .optional()
    .default(nanoid),
  name: z.string(),
  kind: z.enum(['file', 'directory']),
  source: z.enum(['sandbox', 'local', 'remote']),
  locator: z.unknown(),
});

export const directoryMetadataSchema = fileSystemEntityMetadataSchema.extend({
  kind: z.literal('directory'),
});

export const fileMetadataSchema = fileSystemEntityMetadataSchema.extend({
  kind: z.literal('file'),
});

export type FileSystemEntityMetadata = z.infer<
  typeof fileSystemEntityMetadataSchema
>;
export type DirectoryMetadata = z.infer<typeof directoryMetadataSchema>;
export type FileMetadata = z.infer<typeof fileMetadataSchema>;
