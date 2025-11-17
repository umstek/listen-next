import {
  BookOpen,
  ClockClockwise,
  ClockCounterClockwise,
  MusicNote,
  Pause,
  Play,
  SkipBack,
  SkipForward,
} from '@phosphor-icons/react'
import { useEffect, useState } from 'react'
import { Avatar, AvatarFallback } from ':ui/avatar'
import { Button } from ':ui/button'
import { Card } from ':ui/card'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from ':ui/tooltip'
import { Flex } from ':layout/Flex'
import { IconButton } from ':layout/IconButton'
import { Text } from ':layout/Text'

import usePlayer, { PlayerState } from '~hooks/usePlayer'
import { type BasicAudioMetadata, getAudioMetadata } from '~lib/musicMetadata'
import { toHmmss } from '~util/time'

import { PanControl } from './PanControl'
import { PlaybackRateControl } from './PlaybackRateControl'
import { SeekBar } from './SeekBar'
import { VolumeControl } from './VolumeControl'

interface PlayerProps {
  url: string
  onPrevious: () => void
  onNext: () => void
  settings: unknown | undefined
  metadata: unknown | undefined
}

const VPR = ['v', 'p', 'r'] as const

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
  })

  const [metadata, setMetadata] = useState<BasicAudioMetadata | undefined>(
    undefined,
  )

  // TODO use db/move to store
  useEffect(() => {
    if (url) {
      getAudioMetadata(url).then(([metadata]) => setMetadata(metadata))
    }
  }, [url])

  useEffect(() => {
    setAudioSource(url)
  }, [setAudioSource, url])

  const [vpr, setVpr] = useState<'v' | 'p' | 'r'>('v')
  const [mb, setMb] = useState<'m' | 'b'>('m')

  return (
    <TooltipProvider>
      <Card>
        <Flex gap="4" align="center">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                className="rounded-full"
                size="sm"
                onClick={() => {
                  setVpr(VPR[(VPR.indexOf(vpr) + 1) % VPR.length])
                }}
              >
                {vpr.toUpperCase()}
              </Button>
            </TooltipTrigger>
            <TooltipContent>Volume / Pan / Playback Rate</TooltipContent>
          </Tooltip>

          <Flex direction="column" flexGrow="0" align="end" justify="center">
            {vpr === 'v' && <VolumeControl value={volume} onChange={setVolume} />}
            {vpr === 'p' && <PanControl value={pan} onChange={setPan} />}
            {vpr === 'r' && (
              <PlaybackRateControl
                value={playbackRate}
                onChange={setPlaybackRate}
              />
            )}
          </Flex>

          <Flex gap="3" flexGrow="1">
            <Avatar>
              <AvatarFallback>LP</AvatarFallback>
            </Avatar>
            <Flex flexGrow="1" direction="column">
              <Text as="div" size="sm" weight="medium">
                {metadata?.title}
              </Text>
              <Flex justify="between">
                <Text as="div" size="sm">
                  {metadata?.artists.join(' / ')} - {metadata?.album}
                </Text>
                <Text as="div" size="sm">
                  {toHmmss(position)} / {toHmmss(duration)}
                </Text>
              </Flex>
              <SeekBar duration={duration} position={position} onChange={seek} />
            </Flex>
          </Flex>

          <Flex flexGrow="0" align="center" justify="start" gap="3">
            {mb === 'm' && (
              <IconButton size="sm" variant="ghost" onClick={onPrevious}>
                <SkipBack size={20} />
              </IconButton>
            )}
            {mb === 'b' && (
              <IconButton size="sm" variant="ghost" onClick={() => rewind(10)}>
                <ClockCounterClockwise size={20} />
              </IconButton>
            )}
            <IconButton variant="default" className="rounded-full" onClick={playPause}>
              {state === PlayerState.PLAYING ? (
                <Pause size={24} weight="fill" />
              ) : (
                <Play size={24} weight="fill" />
              )}
            </IconButton>
            {mb === 'b' && (
              <IconButton size="sm" variant="ghost" onClick={() => forward(10)}>
                <ClockClockwise size={20} />
              </IconButton>
            )}
            {mb === 'm' && (
              <IconButton size="sm" variant="ghost" onClick={onNext}>
                <SkipForward size={20} />
              </IconButton>
            )}
          </Flex>

          <Tooltip>
            <TooltipTrigger asChild>
              <IconButton
                variant="outline"
                className="rounded-full"
                size="sm"
                onClick={() => setMb(mb === 'm' ? 'b' : 'm')}
              >
                {mb === 'm' ? <MusicNote size={16} /> : <BookOpen size={16} />}
              </IconButton>
            </TooltipTrigger>
            <TooltipContent>Music / Audio book</TooltipContent>
          </Tooltip>
        </Flex>
      </Card>
    </TooltipProvider>
  )
}
