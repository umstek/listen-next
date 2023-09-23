import { useEffect } from 'react';
import { Button, Card, Flex } from '@radix-ui/themes';
import {
  ClockClockwise,
  ClockCounterClockwise,
  PlayPause,
  SkipBack,
  SkipForward,
} from '@phosphor-icons/react';

import usePlayer from '~hooks/usePlayer';

import { VolumeControl } from './VolumeControl';
import { PanControl } from './PanControl';
import { SeekBar } from './SeekBar';
import { PlaybackRateControl } from './PlaybackRateControl';

interface PlayerProps {
  url: string;
  onPrevious: () => void;
  onNext: () => void;
  settings: unknown | undefined;
  metadata: unknown | undefined;
}

export function Player({ url, onPrevious, onNext }: PlayerProps) {
  const {
    setSource,
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
  } = usePlayer();

  useEffect(() => {
    setSource(url);
  }, [setSource, url]);

  return (
    <Card>
      <Flex>
        <h3>Listen</h3>
        <p></p>
      </Flex>
      <Flex>
        <div className="flex flex-row w-full justify-evenly">
          <Button variant="ghost" onClick={onPrevious}>
            <SkipBack size={24} />
          </Button>
          <Button variant="ghost" onClick={() => rewind(10)}>
            <ClockCounterClockwise size={24} />
          </Button>
          <Button
            variant="solid"
            className="text-blue-600 hover:text-blue-400 active:text-blue-800"
            onClick={playPause}
          >
            <PlayPause size={24} weight="fill" />
          </Button>
          <Button variant="ghost" onClick={() => forward(10)}>
            <ClockClockwise size={24} />
          </Button>
          <Button variant="ghost" onClick={onNext}>
            <SkipForward size={24} />
          </Button>
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
      </Flex>
    </Card>
  );
}
