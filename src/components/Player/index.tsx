import {
  BookOpen,
  ClockClockwise,
  ClockCounterClockwise,
  MusicNote,
  Pause,
  Play,
  SkipBack,
  SkipForward,
} from '@phosphor-icons/react';
import {
  Avatar,
  Button,
  Card,
  Flex,
  IconButton,
  Text,
  Tooltip,
} from '@radix-ui/themes';
import { useEffect, useState } from 'react';

import usePlayer, { PlayerState } from '~hooks/usePlayer';
import { BasicAudioMetadata, getAudioMetadata } from '~lib/musicMetadata';
import { toHmmss } from '~util/time';

import { PanControl } from './PanControl';
import { PlaybackRateControl } from './PlaybackRateControl';
import { SeekBar } from './SeekBar';
import { VolumeControl } from './VolumeControl';

interface PlayerProps {
  url: string;
  onPrevious: () => void;
  onNext: () => void;
  settings: unknown | undefined;
  metadata: unknown | undefined;
}

const VPR = ['v', 'p', 'r'] as const;

export function Player({ url, onPrevious, onNext }: PlayerProps) {
  const {
    setAudioSource,
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
  } = usePlayer({
    autoplay: true,
  });

  const [metadata, setMetadata] = useState<BasicAudioMetadata | undefined>(
    undefined,
  );

  // TODO use db/move to store
  useEffect(() => {
    if (url) {
      getAudioMetadata(url).then(([metadata]) => setMetadata(metadata));
    }
  }, [url]);

  useEffect(() => {
    setAudioSource(url);
  }, [setAudioSource, url]);

  const [vpr, setVpr] = useState<'v' | 'p' | 'r'>('v');
  const [mb, setMb] = useState<'m' | 'b'>('m');

  return (
    <Card variant="surface">
      <Flex gap="4" align="center">
        <Tooltip content="Volume / Pan / Playback Rate">
          <Button
            variant="surface"
            radius="full"
            size="1"
            onClick={() => {
              setVpr(VPR[(VPR.indexOf(vpr) + 1) % VPR.length]);
            }}
          >
            {vpr.toUpperCase()}
          </Button>
        </Tooltip>

        <Flex direction="column" grow="0" align="end" justify="center">
          {vpr === 'v' && <VolumeControl value={volume} onChange={setVolume} />}
          {vpr === 'p' && <PanControl value={pan} onChange={setPan} />}
          {vpr === 'r' && (
            <PlaybackRateControl
              value={playbackRate}
              onChange={setPlaybackRate}
            />
          )}
        </Flex>

        <Flex gap="3" grow="1">
          <Avatar variant="solid" fallback="LP" />
          <Flex grow="1" direction="column">
            <Text as="div" size="1" weight="medium">
              {metadata?.title}
            </Text>
            <Flex justify="between">
              <Text as="div" size="1">
                {metadata?.artists.join(' / ')} - {metadata?.album}
              </Text>
              <Text as="div" size="1">
                {toHmmss(position)} / {toHmmss(duration)}
              </Text>
            </Flex>
            <SeekBar duration={duration} position={position} onChange={seek} />
          </Flex>
        </Flex>

        <Flex grow="0" align="center" justify="start" gap="3">
          {mb === 'm' && (
            <IconButton size="1" variant="ghost" onClick={onPrevious}>
              <SkipBack size={20} />
            </IconButton>
          )}
          {mb === 'b' && (
            <IconButton size="1" variant="ghost" onClick={() => rewind(10)}>
              <ClockCounterClockwise size={20} />
            </IconButton>
          )}
          <IconButton variant="solid" radius="full" onClick={playPause}>
            {state === PlayerState.PLAYING ? (
              <Pause size={24} weight="fill" />
            ) : (
              <Play size={24} weight="fill" />
            )}
          </IconButton>
          {mb === 'b' && (
            <IconButton size="1" variant="ghost" onClick={() => forward(10)}>
              <ClockClockwise size={20} />
            </IconButton>
          )}
          {mb === 'm' && (
            <IconButton size="1" variant="ghost" onClick={onNext}>
              <SkipForward size={20} />
            </IconButton>
          )}
        </Flex>

        <Tooltip content="Music / Audio book">
          <IconButton
            variant="surface"
            radius="full"
            size="1"
            onClick={() => setMb(mb === 'm' ? 'b' : 'm')}
          >
            {mb === 'm' ? <MusicNote size={16} /> : <BookOpen size={16} />}
          </IconButton>
        </Tooltip>
      </Flex>
    </Card>
  );
}
