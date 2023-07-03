import { useEffect, useRef, useState } from 'react';

import AudioPlayer from '~lib/AudioPlayer';

export enum PlayerState {
  STOPPED = 'STOPPED',
  PAUSED = 'PAUSED',
  PLAYING = 'PLAYING',
}

function usePlayer({ autoPlay = false }: { autoPlay?: boolean } = {}) {
  const playerRef = useRef<AudioPlayer | undefined>(undefined);

  // Outputs from AudioPlayer
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [state, setState] = useState(PlayerState.STOPPED);

  // Inputs to AudioPlayer
  const [url, setUrl] = useState('');
  const [volume, setVolume] = useState(1);
  const [pan, setPan] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);

  useEffect(() => {
    playerRef.current = new AudioPlayer({
      analyserOutputInterval: 100,
    });

    // Collect outputs from AudioPlayer
    playerRef.current.on('loadedmetadata', ({ duration, seekable, tracks }) => {
      setDuration(duration);
      if (autoPlay || state === PlayerState.PLAYING) {
        playerRef.current?.play();
      }
    });
    playerRef.current.on('play', () => {
      setState(PlayerState.PLAYING);
    });
    playerRef.current.on('pause', () => {
      setState(PlayerState.PAUSED);
    });
    playerRef.current.on('timeupdate', (time) => {
      setPosition(time);
    });
    playerRef.current.on('ended', () => {
      setState(PlayerState.STOPPED);
    });

    return () => {
      playerRef.current?.dispose();
      playerRef.current = undefined;
    };
  }, [autoPlay, state]);

  // Sends inputs to AudioPlayer
  useEffect(() => {
    playerRef.current?.setAudioSource(url);
  }, [url]);
  useEffect(() => {
    playerRef.current?.setVolume(volume);
  }, [volume]);
  useEffect(() => {
    playerRef.current?.setPan(pan);
  }, [pan]);
  const setSource = (src: string) => {
    if (src !== url) {
      setUrl(src);
    }
  };
  const play = () => {
    playerRef.current?.play();
  };
  const pause = () => {
    playerRef.current?.pause();
  };
  const playPause = () => {
    if (state === PlayerState.PLAYING) {
      pause();
    } else {
      play();
    }
  };
  const stop = () => {
    playerRef.current?.pause();
    playerRef.current?.seek(0);
  };
  const rewind = (seconds: number) => {
    playerRef.current?.seek(position - seconds);
  };
  const forward = (seconds: number) => {
    playerRef.current?.seek(position + seconds);
  };
  const seek = (seconds: number) => {
    playerRef.current?.seek(seconds);
  };

  return {
    setSource,
    play,
    pause,
    playPause,
    stop,
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
  };
}

export default usePlayer;
