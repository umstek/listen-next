import { EventEmitter } from 'events';

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

export default class AudioPlayer extends EventEmitter {
  private audioContext: AudioContext;

  private audioElement: HTMLAudioElement;
  private sourceNode: MediaElementAudioSourceNode;
  private analyserNode: AnalyserNode | undefined;
  private analyserTimer: number;
  private pannerNode: StereoPannerNode;
  private gainNode: GainNode;

  constructor({ analyserOutputInterval = 0 }: AudioPlayerOptions) {
    super();

    this.audioContext = new AudioContext();

    this.audioElement = createAudioElement();
    this.audioElement.addEventListener('ended', this.onEnded);
    this.sourceNode = this.audioContext.createMediaElementSource(
      this.audioElement,
    );

    const { analyserNode, analyserTimer } = createAnalyser(
      this.audioContext,
      analyserOutputInterval,
      this.emit.bind(this, 'analyserData'),
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

  dispose = async () => {
    try {
      clearInterval(this.analyserTimer);
      this.audioElement.removeEventListener('ended', this.onEnded);
      this.audioElement.src = '';
      this.audioElement.remove();
      await this.audioContext.close();
    } catch (error) {
      console.log(error);
    }
  };

  private onEnded = () => {
    this.emit('ended');
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
    this.emit('started');
  };

  pause = () => {
    this.audioElement.pause();
    this.emit('paused');
  };

  stop = () => {
    this.audioElement.pause();
    this.audioElement.currentTime = 0;
    this.emit('stopped');
  };

  setPlaybackRate = (rate: number) => {
    this.audioElement.playbackRate = rate;
    this.emit('playbackRateChanged', rate);
  };

  setVolume = (volume: number) => {
    this.gainNode.gain.value = volume;
    this.emit('volumeChanged', volume);
  };

  setPan = (pan: number) => {
    this.pannerNode.pan.value = pan;
    this.emit('panChanged', pan);
  };

  rewind = (seconds: number) => {
    this.audioElement.currentTime -= seconds;
    this.emit('rewound', seconds);
  };

  forward = (seconds: number) => {
    this.audioElement.currentTime += seconds;
    this.emit('forwarded', seconds);
  };

  seek = (seconds: number) => {
    this.audioElement.currentTime = seconds;
    this.emit('seeked', seconds);
  };
}
