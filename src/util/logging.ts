import pino from 'pino'

const pi = pino({
  level: 'debug',
  browser: {
    asObject: true,
  },
})

export default function createLogger(module: string) {
  return pi.child({ module })
}
