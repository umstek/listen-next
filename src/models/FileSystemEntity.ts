import { nanoid } from 'nanoid';
import { z } from 'zod';

export const fileSystemEntitySchema = z.object({
  id: z
    .string()
    .regex(/[A-Za-z0-9_-]{21}/)
    .optional()
    .default(nanoid),
  name: z.string(),
  kind: z.enum(['file', 'folder']),
  source: z.enum(['local', 'private']),
  locator: z.unknown(),
  parentId: z
    .string()
    .regex(/[A-Za-z0-9_-]{21}/)
    .optional(),
});

export const folderSchema = fileSystemEntitySchema.extend({
  kind: z.literal('folder'),
});

export const fileSchema = fileSystemEntitySchema.extend({
  kind: z.literal('file'),
});

export type FileSystemEntity = z.infer<typeof fileSystemEntitySchema>;
export type Folder = z.infer<typeof folderSchema>;
export type File = z.infer<typeof fileSchema>;
