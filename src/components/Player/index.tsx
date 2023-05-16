import { useRef, useState } from 'react';

import AudioPlayer from '../../lib/AudioPlayer';
import sample51 from '../../assets/sample-5_1.mp3';

export function Player() {
  const playerRef = useRef<AudioPlayer | undefined>(undefined);
  const [volume, setVolume] = useState(1);
  const [pan, setPan] = useState(0);
  const [src, setSrc] = useState(sample51);

  return (
    <div>
      <input
        type="text"
        name="source"
        id="source"
        value={src}
        onChange={(e) => setSrc(e.target.value)}
      />
      <button
        className="bg-blue-500"
        onClick={() => {
          if (!playerRef.current) {
            playerRef.current = new AudioPlayer({
              analyserOutputInterval: 100,
            });
          }
          playerRef.current.setAudioSource(src);
          playerRef.current.play();
        }}
      >
        Play
      </button>
      <button
        onClick={() => {
          playerRef.current?.pause();
        }}
      >
        Pause
      </button>
      <button
        onClick={() => {
          playerRef.current?.stop();
        }}
      >
        Stop
      </button>
      Volume
      <input
        type="range"
        id="volume"
        min="0"
        max="2"
        value={volume}
        step="0.01"
        onChange={(e) => {
          playerRef.current?.setVolume(parseFloat(e.target.value));
          setVolume(parseFloat(e.target.value));
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
          playerRef.current?.setPan(parseFloat(e.target.value));
          setPan(parseFloat(e.target.value));
        }}
      />
    </div>
  );
}
