import { useCallback, useEffect, useRef, useState } from 'react';

import AudioPlayer from '~lib/AudioPlayer';

export enum PlayerState {
  STOPPED = 'STOPPED',
  PAUSED = 'PAUSED',
  PLAYING = 'PLAYING',
}

function usePlayer({ autoplay }: { autoplay?: boolean } = {}) {
  const playerRef = useRef<AudioPlayer | null>(null);

  const getPlayer = useCallback(() => {
    if (playerRef.current) {
      return playerRef.current;
    }
    const player = new AudioPlayer();
    playerRef.current = player;
    return player;
  }, []);

  useEffect(() => {
    return () => {
      const currentPlayer = playerRef.current;
      playerRef.current = null;
      currentPlayer?.dispose();
    };
  }, []);

  useEffect(() => {
    getPlayer().setAutoplay(autoplay);
  }, [getPlayer, autoplay]);

  const {
    setAudioSource,
    play,
    pause,
    playPause,
    stop,
    seek,
    rewind,
    forward,
  } = getPlayer();

  // Outputs from AudioPlayer
  const [url, setUrl] = useState('');
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [state, setState] = useState(PlayerState.STOPPED);

  // Inputs to AudioPlayer
  const [volume, setVolume] = useState(1);
  const [pan, setPan] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);

  useEffect(() => {
    // Collect outputs from AudioPlayer
    getPlayer().on('trackset', (url) => {
      setUrl(url);
    });
    getPlayer().on('loadedmetadata', ({ duration, seekable, tracks }) => {
      setDuration(duration);
    });
    getPlayer().on('play', () => {
      setState(PlayerState.PLAYING);
    });
    getPlayer().on('pause', () => {
      setState(PlayerState.PAUSED);
    });
    getPlayer().on('timeupdate', (time) => {
      setPosition(time);
    });
    getPlayer().on('ended', () => {
      setState(PlayerState.STOPPED);
    });
    getPlayer().on('emptied', () => {
      setState(PlayerState.STOPPED);
    });
  }, [getPlayer]);

  // Sends inputs to AudioPlayer
  useEffect(() => {
    getPlayer().setVolume(volume);
  }, [getPlayer, volume]);
  useEffect(() => {
    getPlayer().setPan(pan);
  }, [getPlayer, pan]);
  useEffect(() => {
    getPlayer().setPlaybackRate(playbackRate);
  }, [getPlayer, playbackRate]);

  return {
    url,
    setAudioSource,
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
