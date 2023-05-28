import { EventEmitter, Listener } from 'events';

function createAudioElement() {
  const audioElement = new Audio();
  audioElement.autoplay = false;
  audioElement.src = '';
  audioElement.crossOrigin = 'anonymous';
  return audioElement;
}

function createAnalyser(
  audioContext: AudioContext,
  analyserOutputInterval: number,
  callback: (data: Uint8Array) => void,
) {
  if (analyserOutputInterval <= 0) {
    return { analyserNode: undefined, analyserTimer: 0 };
  }

  const analyserNode = audioContext.createAnalyser();
  analyserNode.fftSize = 2048;
  const bufferLength = analyserNode.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  const analyserTimer = setInterval(() => {
    analyserNode.getByteFrequencyData(dataArray);
    callback(dataArray);
  }, analyserOutputInterval);

  return { analyserNode, analyserTimer };
}

interface AudioPlayerOptions {
  analyserOutputInterval?: number;
}

type EventMap = {
  loadedmetadata: [
    arg: {
      duration: number;
      seekable: TimeRanges;
      tracks: TextTrackList;
    },
  ];
  play: [];
  pause: [];
  timeupdate: [currentTime: number];
  ended: [];
};

export default class AudioPlayer {
  private eventEmitter: EventEmitter;

  private audioContext: AudioContext;

  private audioElement: HTMLAudioElement;
  private sourceNode: MediaElementAudioSourceNode;
  private analyserNode: AnalyserNode | undefined;
  private analyserTimer: number;
  private pannerNode: StereoPannerNode;
  private gainNode: GainNode;

  constructor({ analyserOutputInterval = 0 }: AudioPlayerOptions) {
    this.eventEmitter = new EventEmitter();

    this.audioContext = new AudioContext();

    this.audioElement = createAudioElement();
    this.audioElement.addEventListener('loadedmetadata', this.onLoadedMetadata);
    this.audioElement.addEventListener('play', this.onPlay);
    this.audioElement.addEventListener('pause', this.onPause);
    this.audioElement.addEventListener('timeupdate', this.onTimeUpdate);
    this.audioElement.addEventListener('ended', this.onEnded);
    this.sourceNode = this.audioContext.createMediaElementSource(
      this.audioElement,
    );

    const { analyserNode, analyserTimer } = createAnalyser(
      this.audioContext,
      analyserOutputInterval,
      this.eventEmitter.emit.bind(this, 'analyserdata'),
    );
    this.analyserNode = analyserNode;
    this.analyserTimer = analyserTimer;

    this.pannerNode = this.audioContext.createStereoPanner();
    this.gainNode = this.audioContext.createGain();

    const nodes = [
      this.sourceNode,
      this.analyserNode,
      this.pannerNode,
      this.gainNode,
      this.audioContext.destination,
    ].filter(Boolean) as AudioNode[];

    for (let i = 0; i < nodes.length - 1; i++) {
      nodes[i].connect(nodes[i + 1]);
    }
  }

  on = <K extends keyof EventMap>(
    type: K,
    listener: (...arg: EventMap[K]) => void,
  ): this => {
    this.eventEmitter.on(type, listener as Listener);
    return this;
  };

  once = <K extends keyof EventMap>(
    type: K,
    listener: (...arg: EventMap[K]) => void,
  ): this => {
    this.eventEmitter.once(type, listener as Listener);
    return this;
  };

  off = <K extends keyof EventMap>(
    type: K,
    listener: (...arg: EventMap[K]) => void,
  ): this => {
    this.eventEmitter.off(type, listener as Listener);
    return this;
  };

  dispose = async () => {
    try {
      clearInterval(this.analyserTimer);
      this.eventEmitter.removeAllListeners();
      this.audioElement.removeEventListener(
        'loadedmetadata',
        this.onLoadedMetadata,
      );
      this.audioElement.removeEventListener('play', this.onPlay);
      this.audioElement.removeEventListener('pause', this.onPause);
      this.audioElement.removeEventListener('timeupdate', this.onTimeUpdate);
      this.audioElement.removeEventListener('ended', this.onEnded);
      this.audioElement.src = '';
      this.audioElement.remove();
      await this.audioContext.close();
    } catch (error) {
      console.log(error);
    }
  };

  private onLoadedMetadata = () => {
    this.eventEmitter.emit('loadedmetadata', {
      duration: this.audioElement.duration,
      seekable: this.audioElement.seekable,
      tracks: this.audioElement.textTracks,
      // metadata: this.audioElement.metadata,
    });
  };

  private onPlay = () => {
    this.eventEmitter.emit('play');
  };

  private onPause = () => {
    this.eventEmitter.emit('pause');
  };

  private onTimeUpdate = () => {
    this.eventEmitter.emit('timeupdate', this.audioElement.currentTime);
  };

  private onEnded = () => {
    this.eventEmitter.emit('ended');
  };

  setAudioSource = (url: string) => {
    this.audioElement.src = url;
  };

  play = () => {
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    } else {
      this.audioElement.play();
    }
  };

  pause = () => {
    this.audioElement.pause();
  };

  setPlaybackRate = (rate: number) => {
    this.audioElement.playbackRate = rate;
  };

  setVolume = (volume: number) => {
    this.gainNode.gain.value = volume;
  };

  setPan = (pan: number) => {
    this.pannerNode.pan.value = pan;
  };

  seek = (seconds: number) => {
    this.audioElement.currentTime = seconds;
  };
}
