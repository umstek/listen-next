import {
  type FileSystemDirectoryHandle,
  getOriginPrivateDirectory,
} from 'native-file-system-adapter'

let rootDirHandle: FileSystemDirectoryHandle | undefined

try {
  rootDirHandle = await getOriginPrivateDirectory()
} catch (_error) {
  try {
    rootDirHandle = await getOriginPrivateDirectory(
      // @ts-expect-error This works anyway
      import('native-file-system-adapter/src/adapters/indexeddb'),
    )
  } catch (_error) {
    rootDirHandle = undefined
  }
}

export default rootDirHandle
