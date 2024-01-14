/**
 * Generates a regular expression pattern based on the accepted file types.
 *
 * @param types An array of file picker accept types.
 * @returns a regular expression pattern matching the accepted file types, or undefined if no types are provided.
 */
export function filePickerAcceptTypeExtToRegex(types: FilePickerAcceptType[]) {
  const extensions = types
    .flatMap((t) => Object.values(t.accept || {}))
    .flat()
    .map((a) => a.slice(1));
  return extensions.length > 0
    ? new RegExp(`\\.(${extensions.join('|')})$`)
    : undefined;
}

/**
 * Checks if the provided handle is a file system file handle.
 *
 * @param handle The handle to check.
 * @returns true if the handle is a file system file handle, false otherwise.
 */
export function isAFile(
  handle: FileSystemHandle,
): handle is FileSystemFileHandle;
export function isAFile(handle: FileSystemEntry): handle is FileSystemFileEntry;
/**
 * Checks if the given handle is a file.
 *
 * @param handle The handle to check.
 * @returns true if the handle is a file, false otherwise.
 */
export function isAFile(
  handle: FileSystemHandle | FileSystemEntry,
): handle is FileSystemFileHandle | FileSystemFileEntry {
  if (!handle) {
    return false;
  }
  if ('kind' in handle) {
    return handle.kind === 'file';
  }
  return handle.isFile;
}

/**
 * Checks if the provided handle is a directory.
 *
 * @param handle The handle to check.
 * @return Returns true if the handle is a directory, false otherwise.
 */
export function isADirectory(
  handle: FileSystemHandle,
): handle is FileSystemDirectoryHandle;
/**
 * Checks if the given handle is a directory.
 *
 * @param handle The handle to check.
 * @returns true if the handle is a directory, false otherwise.
 */
export function isADirectory(
  handle: FileSystemEntry,
): handle is FileSystemDirectoryEntry;
/**
 * Checks whether the given handle is a directory or not.
 *
 * @param handle The handle to check.
 * @returns true if the handle is a directory, false otherwise.
 */
export function isADirectory(
  handle: FileSystemHandle | FileSystemEntry,
): handle is FileSystemDirectoryHandle | FileSystemDirectoryEntry {
  if (!handle) {
    return false;
  }
  if ('kind' in handle) {
    return handle.kind === 'directory';
  }
  return handle.isDirectory;
}
