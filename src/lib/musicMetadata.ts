import type { IAudioMetadata } from 'music-metadata-browser';

export interface BasicAudioMetadata {
  genre: string[];
  artists: string[];
  album?: string;
  title?: string;
  trackNumber?: number;
  trackCount?: number;
  duration: number;
  year?: number;
}

export async function getAudioMetadata(
  fileOrUrl: File | string,
): Promise<[BasicAudioMetadata, IAudioMetadata]> {
  const mmb = await import('music-metadata-browser');

  let metadata: IAudioMetadata;
  if (typeof fileOrUrl === 'string') {
    metadata = await mmb.fetchFromUrl(fileOrUrl, {
      duration: true,
      includeChapters: true,
    });
  } else {
    metadata = await mmb.parseBlob(fileOrUrl, {
      duration: true,
      includeChapters: true,
    });
  }

  const {
    common: {
      genre = [],
      artists = [],
      album = '',
      title = '',
      track: { no, of },
      year,
    },
    format: { duration = 0 },
  } = metadata;

  return [
    {
      genre,
      artists,
      album,
      trackNumber: no || undefined,
      trackCount: of || undefined,
      title,
      duration,
      year,
    },
    metadata,
  ];
}
