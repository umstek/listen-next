# Listen-Next User Manual

**Your personal audio player, running entirely in your browser**

---

## Table of Contents

1. [Welcome](#welcome)
2. [Getting Started](#getting-started)
3. [User Interface Overview](#user-interface-overview)
4. [Adding Music](#adding-music)
5. [Playing Music](#playing-music)
6. [Browsing Your Library](#browsing-your-library)
7. [Storage Options Explained](#storage-options-explained)
8. [Playback Controls](#playback-controls)
9. [Music vs Audiobook Mode](#music-vs-audiobook-mode)
10. [Background Tasks](#background-tasks)
11. [Keyboard Shortcuts](#keyboard-shortcuts)
12. [Troubleshooting](#troubleshooting)
13. [FAQ](#faq)
14. [Privacy and Data](#privacy-and-data)
15. [Browser Compatibility](#browser-compatibility)

---

## Welcome

Listen-Next is a modern, privacy-focused audio player that runs entirely in your web browser. Unlike traditional music players:

- **No installation required** - Just open in your browser
- **Your data stays local** - All files and metadata remain on your device
- **Works offline** - Once files are loaded, no internet connection needed
- **Cross-platform** - Works on any device with a modern browser

---

## Getting Started

### System Requirements

- **Browser**: Chrome 86+, Edge 86+, or Safari 15.2+ (see [Browser Compatibility](#browser-compatibility))
- **Storage**: Varies based on your music library size
- **RAM**: 4GB+ recommended for large libraries

### First Launch

1. Open Listen-Next in your browser
2. You'll see a 4-panel layout:
   - **Explorer** (left) - Browse your music library
   - **FileLoader** (center-left) - Add new music
   - **Player** (center-right) - Playback controls
   - **Tasks** (right) - Background operations

3. Start by adding music in the FileLoader panel

---

## User Interface Overview

```text
┌─────────────────────────────────────────────────────────────────┐
│  Listen-Next              [Theme: Light/Dark/Auto]               │
├───────────┬──────────────┬──────────────┬─────────────────────┤
│ Explorer  │ File Loader  │   Player     │       Tasks         │
│           │              │              │                     │
│  Browse   │  Add Files/  │  ▶ ⏸ ⏹ ⏮ ⏭  │  Copying files...   │
│  folders  │  Folders     │              │  Indexing...        │
│  & files  │  ☑ Select    │  Volume/Pan  │  [Progress bars]    │
│           │  [Drop zone] │  Seek bar    │                     │
│  [Tree]   │  [File list] │  Metadata    │                     │
└───────────┴──────────────┴──────────────┴─────────────────────┘
```

### Panel Descriptions

1. **Explorer Panel**
   - Browse files and folders in your library
   - Navigate using breadcrumb trail
   - Tile view with file/folder icons
   - Right-click for context menu (Play, Delete, etc.)

2. **File Loader Panel**
   - Drag and drop files or folders
   - Browse for files using the file picker
   - Preview files in a list with checkboxes
   - Select specific files to add
   - Choose storage method

3. **Player Panel**
   - Playback controls (play/pause, skip, rewind/forward)
   - Volume, pan, and playback rate controls
   - Seek bar to scrub through track
   - Displays track metadata (title, artist, album)
   - Music/Audiobook mode toggle

4. **Tasks Panel**
   - Shows background operations
   - Progress indicators for copying/indexing
   - Task status badges

### Resizing Panels

- Drag panel borders to resize
- Double-click border to reset size
- Collapse panels you don't need

---

## Adding Music

### Method 1: Drag and Drop

1. Open the **FileLoader** panel
2. Drag audio files or folders from your computer
3. Drop them onto the drop zone
4. Files will appear in the file list with checkboxes

### Method 2: Browse for Files

1. Click the file browse button in FileLoader
2. Select audio files or folders
3. Click "Open"

### Selecting Files

- **Select All**: Click the checkbox in the header row
- **Select Individual Files**: Click checkboxes next to specific files
- **Selection Count**: Shows "X selected" when files are selected
- All actions (Play Now, Copy, Store as Links) work on selected files only
- If no files are selected, actions apply to all files

### Supported Audio Formats

- **WAV** (.wav, .wave)
- **MP3** (.mp3)
- **M4A/AAC** (.m4a, .m4b, .m4p, .m4r, .aac)
- **OGG Vorbis** (.oga, .ogg)
- **Opus** (.opus)
- **Speex** (.spx)
- **FLAC** (.flac)
- **CAF** (.caf)

### Storage Options

After adding files (or selecting specific ones), choose how to store them:

1. **Play Now** - Play immediately without storing
2. **Copy to Browser** - Create a sandboxed copy in your browser (only selected files and their parent folders)
3. **Store as Links** - Keep links to original files

**Note**: When files are selected, only those files and their necessary parent directories are copied, avoiding empty folder clutter.

See [Storage Options Explained](#storage-options-explained) for details.

---

## Playing Music

### Quick Play

1. In the Explorer panel, double-click a file to play
2. Or select files in FileLoader and click "Play Now"

### Playback Basics

- **Play/Pause**: Click the play button in the Player panel
- **Stop**: Click the stop button
- **Skip**: Use next/previous buttons (music mode)
- **Seek**: Drag the seek bar or click a position

### Queue Management (Coming Soon)

Currently, Listen-Next plays individual tracks. Playlist management is planned for a future update. See [TODO.md](./TODO.md) for roadmap.

---

## Browsing Your Library

### Explorer Panel Navigation

1. **Breadcrumb Trail**: Shows current path, click to navigate back
2. **Up Button**: Go to parent folder
3. **Back/Forward**: Navigate history (coming soon)

### File/Folder Display

- **Tile View**: Grid layout with thumbnails
- **Open**: Double-click to open folder or play file
- **Context Menu**: Right-click for options:
  - **Play**: Start playback (files only)
  - **Add to current playlist**: Coming soon
  - **Favorite**: Coming soon
  - **Hide**: Coming soon
  - **Re-index**: Coming soon
  - **Delete**: Remove file/folder permanently

### File Source Indicators

Small icons show where files are stored:
- **Browser icon**: Sandboxed copy in browser
- **Hard drive icon**: Linked to local file system
- **Planet icon**: Remote file (future feature)

---

## Storage Options Explained

### Option 1: Play Now

**Best for**: Quick listening, testing files

- ✅ Instant playback
- ✅ No storage used
- ❌ Files not indexed
- ❌ Not available after closing tab

**How it works**: Files are loaded into memory temporarily.

### Option 2: Copy to Browser

**Best for**: Building a permanent library

- ✅ Files persist across sessions
- ✅ No permission prompts
- ✅ Works offline
- ✅ Fast access
- ❌ Uses browser storage quota
- ❌ Duplicates files

**How it works**: Files are copied to your browser's private file system (OPFS). Original files can be deleted.

**Storage limits**: Typically 50% of available disk space, varies by browser.

### Option 3: Store as Links

**Best for**: Large libraries, avoiding duplication

- ✅ No duplication
- ✅ Changes to original files reflected
- ✅ Minimal storage used
- ❌ Permission prompts on access
- ❌ Requires original files to exist
- ❌ Won't work if files are moved/deleted

**How it works**: Stores references to files using the File System Access API. Browser will ask permission to access files.

### Choosing the Right Option

| Scenario | Recommended Option |
|----------|-------------------|
| Trying out the app | Play Now |
| Small-medium library (<10GB) | Copy to Browser |
| Large library (>10GB) | Store as Links |
| Don't want to duplicate files | Store as Links |
| Want fastest performance | Copy to Browser |
| Portable library (works anywhere) | Copy to Browser |
| Files frequently updated | Store as Links |

---

## Playback Controls

### Basic Controls

- **Play/Pause** (Space): Start or pause playback
- **Stop**: Stop and reset position
- **Next Track**: Skip to next (music mode only)
- **Previous Track**: Skip to previous (music mode only)
- **Rewind** (-10s): Jump back 10 seconds (audiobook mode)
- **Forward** (+10s): Jump forward 10 seconds (audiobook mode)

### Advanced Controls

#### Volume (V)

- Click "V" button to show volume slider
- Range: 0% to 200%
- Default: 100%

**Tip**: Volume above 100% may cause distortion. Use with caution.

#### Pan (P)

- Click "P" button to show pan slider
- Range: Left (-100%) to Right (+100%)
- Default: Center (0%)

**Use case**: Adjust stereo balance if your headphones/speakers are unbalanced.

#### Playback Rate (R)

- Click "R" button to show rate slider
- Range: 0.25x to 4x
- Default: 1x (normal speed)

**Use cases**:
- Speed up audiobooks (1.5x - 2x)
- Slow down for transcription (0.5x - 0.75x)
- Time-stretching music (maintains pitch)

### Seek Bar

- **Click**: Jump to position
- **Drag**: Scrub through track
- **Scroll** (coming soon): Fine-tune position

Shows current time / total duration.

---

## Music vs Audiobook Mode

Listen-Next has two playback modes optimized for different content:

### Music Mode (M)

**Best for**: Songs, albums, playlists

Features:
- ◀◀ Previous track button
- ▶▶ Next track button
- Album artwork (if available)
- Track position in album

### Audiobook Mode (A)

**Best for**: Audiobooks, podcasts, long-form audio

Features:
- ⏪ Rewind 10 seconds
- ⏩ Forward 10 seconds
- Chapter markers (if available)
- Resume position (coming soon)

### Switching Modes

Click the "M" or "A" button in the Player panel to toggle.

**Tip**: The mode affects which buttons are shown, not the audio itself.

---

## Background Tasks

The Tasks panel shows background operations:

### Task Types

1. **Copying Files**
   - Copying to browser storage
   - Progress bar shows percentage
   - Status: Pending → In Progress → Completed

2. **Indexing Metadata**
   - Extracting title, artist, album, etc.
   - Runs concurrently with copying
   - Can be CPU-intensive for large files

### Task Status Badges

- 🔵 **Pending**: Waiting to start
- 🟡 **In Progress**: Currently running
- 🟢 **Completed**: Finished successfully
- 🔴 **Failed**: Encountered error

### Performance Tips

- **Large batches**: Add files in smaller groups (50-100 at a time)
- **Battery saver**: Disable indexing on battery power (coming soon)
- **Background tabs**: Tasks continue when tab is not active

---

## Keyboard Shortcuts

### Planned Shortcuts

**Note**: Keyboard shortcuts are currently being developed. The following will be available in a future update:

| Shortcut | Action |
|----------|--------|
| **Space** | Play/Pause |
| **⌘/Ctrl+O** | Open file picker |
| **⌘/Ctrl+P** | Play selected file |
| **⌘/Ctrl+A** | Add to current playlist |
| **⌘/Ctrl+F** | Focus search |
| **→** | Next track (music) / Forward 10s (audiobook) |
| **←** | Previous track (music) / Rewind 10s (audiobook) |
| **↑** | Volume up |
| **↓** | Volume down |
| **?** | Show keyboard shortcuts help |

See [TODO.md](./TODO.md) - Priority 2.1 for development status.

---

## Troubleshooting

### Audio Not Playing

**Issue**: Clicking play does nothing or shows error.

**Solutions**:
1. **Check format**: Ensure file is a supported audio format
2. **Browser autoplay**: Click play button (browsers block autoplay without user interaction)
3. **File access**: If using "Store as Links", grant file access permission
4. **Console errors**: Open browser DevTools (F12) and check console for errors

### Files Not Showing

**Issue**: Added files don't appear in Explorer.

**Solutions**:
1. **Check storage**: Ensure you chose "Copy to Browser" or "Store as Links" (not "Play Now")
2. **Wait for indexing**: Check Tasks panel for progress
3. **Refresh**: Reload the page
4. **Check IndexedDB**: DevTools → Application → IndexedDB → listen-db

### Permission Prompts Every Time

**Issue**: Browser asks permission to access files repeatedly.

**Explanation**: This is expected when using "Store as Links" mode for security.

**Solution**: Use "Copy to Browser" to avoid permission prompts.

### Slow Performance

**Issue**: App is sluggish or unresponsive.

**Solutions**:
1. **Reduce file count**: Add files in smaller batches
2. **Close other tabs**: Free up browser memory
3. **Check Tasks panel**: Wait for background tasks to finish
4. **Clear browser cache**: May help with large libraries

### Storage Quota Exceeded

**Issue**: Error message about storage quota.

**Solutions**:
1. **Check usage**: DevTools → Application → Storage
2. **Clear data**: Delete unused files from library
3. **Use "Store as Links"**: Avoids duplicating files
4. **Increase quota** (Advanced): Some browsers allow requesting more storage

### Metadata Not Showing

**Issue**: Track plays but shows no title/artist/album.

**Possible causes**:
1. **No metadata**: File doesn't have embedded metadata
2. **Unsupported tags**: Some tag formats not supported
3. **Indexing failed**: Check Tasks panel for errors

**Workaround**: Manually edit tags using a desktop app (e.g., MusicBrainz Picard, Mp3tag) before adding to Listen-Next.

---

## FAQ

### Is my music uploaded to the cloud?

**No.** Listen-Next runs entirely in your browser. All files and metadata stay on your device. Nothing is uploaded to any server.

### Can I use Listen-Next offline?

**Yes.** Once files are added (using "Copy to Browser"), they work offline. The app itself can be installed as a PWA (coming soon) for offline access.

### Does Listen-Next work on mobile?

**Partially.** The app works on mobile browsers, but:
- File System Access API support varies
- Touch gestures are limited
- Performance may be slower

**Recommendation**: Use on desktop for best experience. Mobile optimization is planned (see TODO.md - Priority 5.2).

### Can I access my library from multiple devices?

**Currently, no.** Libraries are stored locally in each browser. Cloud sync is a future enhancement.

**Workaround**: Use "Store as Links" and keep files in a synced folder (Dropbox, Google Drive, etc.).

### How do I back up my library?

**For "Copy to Browser"**: No easy way currently. Export feature is planned (TODO.md - Priority 2.3).

**For "Store as Links"**: Back up your original files.

### Can I create playlists?

**Not yet.** Playlist management is the top priority for the next update (TODO.md - Priority 1.1).

### Does Listen-Next support gapless playback?

**Not yet.** This is planned for a future update (TODO.md - Priority 5.1).

### Can I see lyrics?

**Not yet.** Lyrics display is planned (TODO.md - Priority 5.1).

### Can I edit metadata in Listen-Next?

**Not yet.** Metadata editing is planned (TODO.md - Priority 2.4).

### Is there a dark mode?

**Yes.** Listen-Next has a theme switcher in the header with three options:
- **Light**: Force light theme
- **Dark**: Force dark theme
- **Auto**: Follow system theme

Your preference is saved and persists across sessions. Default is Light mode.

### Can I use Listen-Next with my streaming service?

**No.** Listen-Next only works with local audio files. It's designed as an alternative to streaming services, not an integration.

---

## Privacy and Data

### What Data is Collected?

**None.** Listen-Next does not collect, transmit, or store any data outside your device.

### Where is My Data Stored?

- **"Copy to Browser"**: Files stored in your browser's Origin Private File System (OPFS)
  - Location: Browser-managed, opaque to user
  - Persistence: Permanent (unless you clear browser data)

- **"Store as Links"**: References stored in IndexedDB
  - Location: Browser-managed IndexedDB
  - Actual files remain at original location

- **Metadata**: Stored in IndexedDB in your browser
  - Location: Browser-managed IndexedDB
  - Accessible via DevTools → Application → IndexedDB

### How to Delete All Data

1. **Chrome/Edge**: Settings → Privacy → Clear browsing data → Cookies and site data
2. **Firefox**: Options → Privacy → Clear Data → Cookies and Site Data
3. **Safari**: Preferences → Privacy → Manage Website Data → Remove

**Warning**: This deletes all data for Listen-Next. Cannot be undone.

### Third-Party Dependencies

Listen-Next uses open-source libraries (React, Dexie, etc.) loaded from CDN. No analytics, tracking, or advertising libraries are included.

---

## Browser Compatibility

### Fully Supported

- **Chrome** 86+ (Windows, Mac, Linux, ChromeOS)
- **Edge** 86+ (Windows, Mac)
- **Opera** 72+

### Partial Support

- **Safari** 15.2+ (Mac, iOS)
  - File System Access API requires polyfill
  - "Store as Links" may not work

- **Firefox** 111+
  - File System Access API behind flag (about:config)
  - Use "Copy to Browser" mode

### Not Supported

- **Internet Explorer** (all versions)
- **Older browsers** (Chrome <86, Safari <15.2)

### Feature Availability by Browser

| Feature | Chrome/Edge | Safari | Firefox |
|---------|-------------|--------|---------|
| Play Now | ✅ | ✅ | ✅ |
| Copy to Browser | ✅ | ✅ | ✅ |
| Store as Links | ✅ | ⚠️ | ❌* |
| Web Audio API | ✅ | ✅ | ✅ |
| IndexedDB | ✅ | ✅ | ✅ |
| Web Workers | ✅ | ✅ | ✅ |

*Requires enabling experimental flag

### Checking Compatibility

Open Listen-Next in your browser. If critical features are missing, you'll see a warning message.

---

## Tips and Tricks

1. **Batch Processing**: Add entire music folders at once for faster library building

2. **Volume Normalization**: Use "Copy to Browser" + playback rate to normalize loud/quiet tracks

3. **Audiobook Chapters**: Listen-Next reads chapter markers from M4B files

4. **Drag-to-Select**: In Explorer, click and drag to select multiple files (Shift/Ctrl modifiers work too)

5. **Breadcrumb Shortcuts**: Click breadcrumb items to quickly navigate to parent folders

6. **Task Management**: Close the browser tab during indexing - tasks continue in background (if tab remains open in another window)

7. **Storage Planning**: Calculate library size before choosing storage mode. Use "Store as Links" for libraries >50GB.

8. **Backup Original Files**: If using "Copy to Browser", keep your original files as backup until you're sure everything copied correctly.

---

## Getting Help

### Resources

- **GitHub Issues**: https://github.com/umstek/listen/issues
- **Discussions**: https://github.com/umstek/listen/discussions
- **Developer Guide**: [DEVELOPER.md](./DEVELOPER.md)
- **Roadmap**: [TODO.md](./TODO.md)

### Reporting Bugs

When reporting bugs, include:
1. Browser name and version
2. Operating system
3. Steps to reproduce
4. Expected vs actual behavior
5. Console errors (if any)

### Feature Requests

Feature requests are welcome! Check [TODO.md](./TODO.md) first to see if it's already planned.

---

## Recently Added Features

- ✅ **Theme Switcher** - Light/Dark/Auto mode toggle
- ✅ **File Selection** - Checkboxes for selecting specific files
- ✅ **Delete Files** - Remove files/folders from Explorer
- ✅ **Smart Directory Copying** - Only copies folders containing selected files

## Coming Soon

The following features are in active development:

- **Playlist Management** (Priority 1.1)
- **Search and Filtering** (Priority 1.2)
- **Play History** (Priority 1.3)
- **Settings/Preferences** (Priority 1.4)
- **Keyboard Shortcuts** (Priority 2.1)
- **Audio Visualization** (Priority 2.2)

See [TODO.md](./TODO.md) for the complete roadmap.

---

**Enjoy your music!** 🎵

---

**Last Updated**: 2025-11-16
**Version**: 0.4.0
