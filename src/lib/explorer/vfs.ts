import {
  type FileSystemDirectoryHandle,
  getOriginPrivateDirectory,
} from 'native-file-system-adapter';

let rootDirHandle: FileSystemDirectoryHandle | undefined;

try {
  rootDirHandle = await getOriginPrivateDirectory();
} catch (error) {
  try {
    rootDirHandle = await getOriginPrivateDirectory(
      // @ts-expect-error This works anyway
      import('native-file-system-adapter/src/adapters/indexeddb'),
    );
  } catch (error) {
    rootDirHandle = undefined;
  }
}

export default rootDirHandle;
