import { z } from 'zod';
import camelCase from 'camelcase';

const Env = z.object({
  supportedExtensions: z.preprocess(
    (val) => (val as string | '').split(','),
    z.string().startsWith('.').array(),
  ),
});
const env = Env.parse(
  Object.fromEntries(
    Object.entries(import.meta.env).map(([key, value]) => [
      key.startsWith('VITE_') ? camelCase(key.slice(5)) : camelCase(key),
      value,
    ]),
  ),
);

export default env;
export type EnvType = z.infer<typeof Env>;
