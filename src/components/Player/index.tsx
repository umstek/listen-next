import { useEffect } from 'react';
import {
  Avatar,
  Box,
  Card,
  Flex,
  Heading,
  IconButton,
  Text,
} from '@radix-ui/themes';
import {
  ClockClockwise,
  ClockCounterClockwise,
  SkipBack,
  SkipForward,
  Play,
  Pause,
} from '@phosphor-icons/react';

import usePlayer, { PlayerState } from '~hooks/usePlayer';

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
    <Card variant="surface">
      <Flex gap="5" p="1" align="center">
        <Flex direction="column" grow="0" align="end" justify="center">
          <VolumeControl value={volume} onChange={setVolume} />
          <PanControl value={pan} onChange={setPan} />
        </Flex>
        <PlaybackRateControl value={playbackRate} onChange={setPlaybackRate} />
        <Flex gap="3" grow="1">
          <Avatar variant="solid" fallback="LP" />
          <Flex grow="1" direction="column">
            <Text as="div" size="1" weight="medium">
              In The End
            </Text>
            <Flex justify="between">
              <Text as="div" size="1">
                Linkin Park - Hybrid Theory
              </Text>
              <Text as="div" size="1">
                00:54 / 04:30
              </Text>
            </Flex>
            <SeekBar duration={duration} position={position} onChange={seek} />
          </Flex>
        </Flex>
        <Flex grow="0" align="center" justify="start" gap="3">
          <IconButton size="1" variant="ghost" onClick={onPrevious}>
            <SkipBack size={20} />
          </IconButton>
          <IconButton size="1" variant="ghost" onClick={() => rewind(10)}>
            <ClockCounterClockwise size={20} />
          </IconButton>
          <IconButton variant="solid" radius="full" onClick={playPause}>
            {state === PlayerState.PLAYING ? (
              <Pause size={24} weight="fill" />
            ) : (
              <Play size={24} weight="fill" />
            )}
          </IconButton>
          <IconButton size="1" variant="ghost" onClick={() => forward(10)}>
            <ClockClockwise size={20} />
          </IconButton>
          <IconButton size="1" variant="ghost" onClick={onNext}>
            <SkipForward size={20} />
          </IconButton>
        </Flex>
      </Flex>
    </Card>
  );
}
