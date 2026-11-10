import camelCase from 'camelcase'
import { z } from 'zod'

const defaultSupportedExtensions =
  '.wave,.wav,.mp3,.m4a,.m4b,.m4p,.m4r,.aac,.oga,.ogg,.spx,.opus,.flac,.caf'

const Env = z.object({
  supportedExtensions: z.preprocess(
    (val) =>
      (typeof val === 'string' && val.length > 0
        ? val
        : defaultSupportedExtensions
      ).split(','),
    z.string().startsWith('.').array(),
  ),
})

const env = Env.parse(
  Object.fromEntries(
    Object.entries(import.meta.env).map(([key, value]) => [
      key.startsWith('VITE_') ? camelCase(key.slice(5)) : camelCase(key),
      value,
    ]),
  ),
)

export default env
export type EnvType = z.infer<typeof Env>
