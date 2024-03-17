import { nanoid } from 'nanoid';
import { z } from 'zod';

import { fseKinds, nanoidRegex, sources } from './constants';

export const fileSystemEntityMetadataSchema = z
  .object({
    id: z.string().regex(nanoidRegex).optional().default(nanoid),
    name: z.string(),
    kind: z.enum(fseKinds),
    source: z.enum(sources),
    locator: z.unknown(),
  })
  .describe('Reference to a file or directory in an external file system');

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
