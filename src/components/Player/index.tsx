import { useEffect, useRef, useState } from 'react';

import AudioPlayer from ':AudioPlayer';

interface PlayerProps {
  url: string;
  settings: unknown | undefined;
  metadata: unknown | undefined;
}

export function Player({ url }: PlayerProps) {
  const playerRef = useRef<AudioPlayer | undefined>(undefined);
  const [volume, setVolume] = useState(1);
  const [pan, setPan] = useState(0);

  useEffect(() => {
    if (!url) return;

    if (!playerRef.current) {
      playerRef.current = new AudioPlayer({
        analyserOutputInterval: 100,
      });
    }
    playerRef.current.setAudioSource(url);
    playerRef.current.play();

    return () => playerRef.current?.dispose();
  }, [url]);

  return (
    <div>
      <button className="bg-blue-500" onClick={playerRef.current?.play}>
        Play
      </button>
      <button onClick={playerRef.current?.pause}>Pause</button>
      <button onClick={playerRef.current?.stop}>Stop</button>
      Volume
      <input
        type="range"
        id="volume"
        min="0"
        max="2"
        value={volume}
        step="0.01"
        onChange={(e) => {
          const value = parseFloat(e.target.value);
          playerRef.current?.setVolume(value);
          setVolume(value);
        }}
      />
      Pan
      <input
        type="range"
        id="pan"
        min="-1"
        max="1"
        value={pan}
        step="0.01"
        onChange={(e) => {
          const value = parseFloat(e.target.value);
          playerRef.current?.setPan(value);
          setPan(value);
        }}
      />
    </div>
  );
}
