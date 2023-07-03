import {
  PlayPause,
  ClockCounterClockwise,
  ClockClockwise,
} from '@phosphor-icons/react';

import usePlayer from '~hooks/usePlayer';

import { VolumeControl } from './VolumeControl';
import { PanControl } from './PanControl';
import { SeekBar } from './SeekBar';
import { PlaybackRateControl } from './PlaybackRateControl';

interface PlayerProps {
  url: string;
  settings: unknown | undefined;
  metadata: unknown | undefined;
}

export function Player({ url }: PlayerProps) {
  const {
    playPause,
    rewind,
    forward,
    seek,
    setVolume,
    volume,
    setPan,
    pan,
    setPlaybackRate,
    playbackRate,
    duration,
    position,
    state,
  } = usePlayer(url);

  return (
    <div className="flex flex-col w-full p-4">
      <div className="flex flex-row w-full justify-evenly">
        <button onClick={() => rewind(10)}>
          <ClockCounterClockwise size={24} />
        </button>
        <button
          className="text-blue-600 hover:text-blue-400 active:text-blue-800"
          onClick={playPause}
        >
          <PlayPause size={24} weight="fill" />
        </button>
        <button onClick={() => forward(10)}>
          <ClockClockwise size={24} />
        </button>
      </div>
      <div className="px-2">
        <div className="py-4">
          <VolumeControl value={volume} onChange={setVolume} />
        </div>
        <div className="py-4">
          <PanControl value={pan} onChange={setPan} />
        </div>
        <div className="py-4">
          <PlaybackRateControl
            value={playbackRate}
            onChange={setPlaybackRate}
          />
        </div>
        <div className="py-4">
          <SeekBar duration={duration} position={position} onChange={seek} />
        </div>
      </div>
    </div>
  );
}
