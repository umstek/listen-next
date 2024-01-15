import { IAudioMetadata } from 'music-metadata-browser';

export interface BasicAudioMetadata {
  genre: string[];
  artists: string[];
  album: string;
  title: string;
  trackNumber: number;
  duration: number;
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
      track: { no },
    },
    format: { duration = 0 },
  } = metadata;

  return [
    {
      genre,
      artists,
      album,
      trackNumber: no || 0,
      title,
      duration,
    },
    metadata,
  ];
}


// TODO: Dialog
// Index now, in background, when playing
// Browser power save