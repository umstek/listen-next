import type { IAudioMetadata } from 'music-metadata'

export interface BasicAudioMetadata {
  genre: string[]
  artists: string[]
  album?: string
  title?: string
  trackNumber?: number
  trackCount?: number
  duration: number
  year?: number
}

export async function getAudioMetadata(
  fileOrUrl: File | string,
): Promise<[BasicAudioMetadata, IAudioMetadata]> {
  const mm = await import('music-metadata')

  let metadata: IAudioMetadata
  if (typeof fileOrUrl === 'string') {
    // Fetch URL and convert to Blob for parsing
    try {
      const response = await fetch(fileOrUrl)

      if (!response.ok) {
        throw new Error(
          `Failed to fetch audio file: ${response.status} ${response.statusText}`,
        )
      }

      const blob = await response.blob()
      metadata = await mm.parseBlob(blob, {
        duration: true,
        includeChapters: true,
      })
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error)
      throw new Error(`Failed to load audio metadata from URL: ${errorMessage}`)
    }
  } else {
    metadata = await mm.parseBlob(fileOrUrl, {
      duration: true,
      includeChapters: true,
    })
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
  } = metadata

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
  ]
}
