import { EventEmitter, type Listener } from 'events'

import createLogger from '../util/logging'

const logger = createLogger('AudioPlayer')

// Read https://medium.com/@nathan5x/event-lifecycle-of-html-video-element-part-2-d1c1dec60a98
const AUDIO_ELEMENT_EVENTS = {
  emptied: 'onEmptied',
  loadstart: 'onLoadStart', // inconsistent
  durationchange: 'onDurationChange',
  loadedmetadata: 'onLoadedMetadata',
  canplay: 'onCanPlay',
  canplaythrough: 'onCanPlayThrough',
  play: 'onPlay',
  playing: 'onPlaying',
  suspend: 'onSuspend', // inconsistent
  timeupdate: 'onTimeUpdate',
  waiting: 'onWaiting',
  stalled: 'onStalled', // inconsistent
  pause: 'onPause',
  ended: 'onEnded',
} as const

interface AudioOptions {
  autoplay?: boolean
  preload?: HTMLMediaElement['preload']
  src?: string
  crossOrigin?: 'anonymous' | 'use-credentials' | null
}

function createAudioElement(options: AudioOptions = {}) {
  const {
    autoplay = false,
    preload = 'auto',
    src = '',
    crossOrigin = 'anonymous',
  } = options

  const audioElement = new Audio()
  audioElement.preload = preload
  audioElement.autoplay = autoplay
  audioElement.src = src
  audioElement.crossOrigin = crossOrigin
  return audioElement
}

function createAnalyser(
  audioContext: AudioContext,
  analyserOutputInterval: number = 0,
  callback: (data: Uint8Array) => void,
) {
  if (analyserOutputInterval <= 0 || audioContext.state === 'suspended') {
    return { analyserNode: undefined, analyserTimer: 0 }
  }

  const analyserNode = audioContext.createAnalyser()
  analyserNode.fftSize = 2048
  const bufferLength = analyserNode.frequencyBinCount
  const dataArray = new Uint8Array(bufferLength)

  const analyserTimer = setInterval(() => {
    analyserNode.getByteFrequencyData(dataArray)
    callback(dataArray)
  }, analyserOutputInterval)

  return { analyserNode, analyserTimer }
}

interface AudioPlayerOptions {
  analyserOutputInterval?: number
  autoplay?: boolean
}

type EventMap = {
  trackset: [url: string]
  loadedmetadata: [
    arg: {
      duration: number
      seekable: TimeRanges
      tracks: TextTrackList
    },
  ]
  play: []
  pause: []
  timeupdate: [currentTime: number]
  ended: []
  emptied: []
}

export default class AudioPlayer {
  private eventEmitter: EventEmitter

  private audioContext: AudioContext

  private audioElement: HTMLAudioElement
  private sourceNode: MediaElementAudioSourceNode
  private analyserNode: AnalyserNode | undefined
  private analyserTimer: number
  private pannerNode: StereoPannerNode
  private gainNode: GainNode

  constructor({ analyserOutputInterval, autoplay }: AudioPlayerOptions = {}) {
    this.eventEmitter = new EventEmitter()

    this.audioContext = new AudioContext()

    this.audioElement = createAudioElement({ autoplay })
    for (const eventName in AUDIO_ELEMENT_EVENTS) {
      this.audioElement.addEventListener(
        eventName,
        this[
          AUDIO_ELEMENT_EVENTS[eventName as keyof typeof AUDIO_ELEMENT_EVENTS]
        ],
      )
    }
    this.sourceNode = this.audioContext.createMediaElementSource(
      this.audioElement,
    )

    const { analyserNode, analyserTimer } = createAnalyser(
      this.audioContext,
      analyserOutputInterval,
      this.eventEmitter.emit.bind(this, 'analyserdata'),
    )
    this.analyserNode = analyserNode
    this.analyserTimer = analyserTimer

    this.pannerNode = this.audioContext.createStereoPanner()
    this.gainNode = this.audioContext.createGain()

    const nodes = [
      this.sourceNode,
      this.analyserNode,
      this.pannerNode,
      this.gainNode,
      this.audioContext.destination,
    ].filter(Boolean) as AudioNode[]

    for (let i = 0; i < nodes.length - 1; i++) {
      nodes[i].connect(nodes[i + 1])
    }
  }

  on = <K extends keyof EventMap>(
    type: K,
    listener: (...arg: EventMap[K]) => void,
  ): this => {
    this.eventEmitter.on(type, listener as Listener)
    return this
  }

  once = <K extends keyof EventMap>(
    type: K,
    listener: (...arg: EventMap[K]) => void,
  ): this => {
    this.eventEmitter.once(type, listener as Listener)
    return this
  }

  off = <K extends keyof EventMap>(
    type: K,
    listener: (...arg: EventMap[K]) => void,
  ): this => {
    this.eventEmitter.off(type, listener as Listener)
    return this
  }

  dispose = async () => {
    try {
      this.stop()
      clearInterval(this.analyserTimer)
      this.eventEmitter.removeAllListeners()
      for (const eventName in AUDIO_ELEMENT_EVENTS) {
        this.audioElement.removeEventListener(
          eventName,
          this[
            AUDIO_ELEMENT_EVENTS[eventName as keyof typeof AUDIO_ELEMENT_EVENTS]
          ],
        )
      }
      this.audioElement.src = ''
      this.audioElement.remove()
      await this.audioContext.close()
    } catch (error) {
      console.error(error)
    }
  }

  private onEmptied = () => {
    logger.debug({ event: 'emptied' })
    this.eventEmitter.emit('emptied')
  }

  private onLoadStart = () => {
    logger.debug({ event: 'loadstart' })
  }

  private onDurationChange = () => {
    logger.debug({ event: 'durationchange' })
  }

  private onLoadedMetadata = () => {
    logger.debug({ event: 'loadedmetadata' })
    this.eventEmitter.emit('loadedmetadata', {
      duration: this.audioElement.duration,
      seekable: this.audioElement.seekable,
      tracks: this.audioElement.textTracks,
      // metadata: this.audioElement.metadata,
    })
  }

  private onCanPlay = () => {
    logger.debug({ event: 'canplay' })
  }

  private onCanPlayThrough = () => {
    logger.debug({ event: 'canplaythrough' })
  }

  private onPlay = () => {
    logger.debug({ event: 'play' })
    this.eventEmitter.emit('play')
  }

  private onPlaying = () => {
    logger.debug({ event: 'playing' })
  }

  private onSuspend = () => {
    logger.debug({ event: 'suspend' })
  }

  private onTimeUpdate = () => {
    logger.debug({ event: 'timeupdate' })
    this.eventEmitter.emit('timeupdate', this.audioElement.currentTime)
  }

  private onWaiting = () => {
    logger.debug({ event: 'waiting' })
  }

  private onStalled = () => {
    logger.debug({ event: 'stalled' })
  }

  private onPause = () => {
    logger.debug({ event: 'pause' })
    this.eventEmitter.emit('pause')
  }

  private onEnded = () => {
    logger.debug({ event: 'ended' })
    this.eventEmitter.emit('ended')
  }

  setAudioSource = (url: string) => {
    if (!url || this.audioElement.src === url) {
      return
    }
    this.audioElement.src = url
    this.audioElement.load()
    this.eventEmitter.emit('trackset', url)
  }

  play = ({ url, seek }: { url?: string; seek?: number } = {}) => {
    if (url) {
      this.setAudioSource(url)
    }
    this.audioElement.currentTime = seek ?? this.audioElement.currentTime
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume()
    } else {
      this.audioElement.play()
    }
  }

  pause = () => {
    this.audioElement.pause()
  }

  playPause = () => {
    if (this.audioElement.paused) {
      this.play()
    } else {
      this.pause()
    }
  }

  stop = () => {
    this.audioElement.pause()
    this.audioElement.currentTime = 0
  }

  setPlaybackRate = (rate: number) => {
    this.audioElement.playbackRate = rate
  }

  setVolume = (volume: number) => {
    if (volume < 0 || volume > 2) {
      return
    }
    this.gainNode.gain.value = volume
  }

  setPan = (pan: number) => {
    if (pan < -1 || pan > 1) {
      return
    }
    this.pannerNode.pan.value = pan
  }

  seek = (seconds: number) => {
    this.audioElement.currentTime = seconds
  }

  rewind = (seconds: number) => {
    this.audioElement.currentTime -= seconds
  }

  forward = (seconds: number) => {
    this.audioElement.currentTime += seconds
  }
}
