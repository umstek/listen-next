import { IAudioMetadata } from 'music-metadata-browser';

interface BasicAudioMetadata {
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
  file: File,
): Promise<[BasicAudioMetadata, IAudioMetadata]> {
  const mmb = await import('music-metadata-browser');
  const metadata = await mmb.parseBlob(file, {
    duration: true,
    includeChapters: true,
  });

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
