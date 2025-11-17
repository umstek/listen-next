# Listen-Next Developer Guide

**A modern, browser-based audio player built with React 19, TypeScript, and Web APIs**

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Project Architecture](#project-architecture)
4. [Development Setup](#development-setup)
5. [Build and Run](#build-and-run)
6. [Project Structure](#project-structure)
7. [Core Concepts](#core-concepts)
8. [State Management](#state-management)
9. [Database Schema](#database-schema)
10. [Web Workers](#web-workers)
11. [Testing](#testing)
12. [Debugging](#debugging)
13. [Code Style and Conventions](#code-style-and-conventions)
14. [Common Pitfalls](#common-pitfalls)
15. [Contributing](#contributing)

---

## Project Overview

Listen-Next is a client-side music player that runs entirely in the browser using modern Web APIs. It provides:

- **Audio playback** with full controls (play/pause, seek, volume, pan, playback rate)
- **File system access** via the File System Access API
- **Metadata extraction** from audio files
- **IndexedDB storage** for metadata and file references
- **Dockview-based UI** with 4 resizable panels (Explorer, FileLoader, Player, Tasks)

**MVP Status**: Core playback and file management features are complete. Advanced features (playlists, search, history) are planned but not yet implemented. See [TODO.md](./TODO.md) for the full roadmap.

---

## Technology Stack

### Frontend Framework
- **React 19.2** - UI library
- **TypeScript 5.9** - Type safety
- **Vite 7.2** - Build tool and dev server

### UI Components
- **shadcn/ui** - Component library built on Radix UI primitives (see [CLAUDE.md](./CLAUDE.md))
- **Tailwind CSS 4.1** - Utility-first styling with OKLCH colors
- **Phosphor Icons 2.1** - Icon library
- **Dockview 4.11** - Panel layout system

### State Management
- **Redux Toolkit 2.10** - Global state (playlist, tasks)

### Data Tables
- **TanStack React Table 8.21** - Table component
- **TanStack React Virtual 3.13** - Virtualization

### Storage and Metadata
- **Dexie 4.2** - IndexedDB wrapper
- **music-metadata 10.9** - Audio metadata extraction
- **Zod 4.1** - Schema validation

### Web APIs
- **Web Audio API** - Audio playback and processing
- **File System Access API** - Local file access
- **IndexedDB** - Client-side database
- **Drag and Drop API** - File/folder drag-drop
- **Web Workers** - Background file processing

### Development Tools
- **ESLint 9.39** - Linting
- **Prettier 3.6** - Code formatting
- **Vitest 4.0** - Testing framework

---

## Project Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Dockview Layout                          │
│  ┌──────────────┬──────────────┬────────────┬─────────────┐ │
│  │  Explorer    │ FileLoader   │  Player    │   Tasks     │ │
│  │              │              │            │             │ │
│  └──────────────┴──────────────┴────────────┴─────────────┘ │
└─────────────────────────────────────────────────────────────┘
                           │
          ┌────────────────┼────────────────┐
          │                │                │
    ┌─────▼─────┐   ┌──────▼──────┐  ┌─────▼──────┐
    │  Redux    │   │  IndexedDB  │  │ Web Workers│
    │  Store    │   │   (Dexie)   │  │            │
    └───────────┘   └─────────────┘  └────────────┘
          │                │                │
    ┌─────▼────────────────▼────────────────▼─────┐
    │        Browser Web APIs                     │
    │  • Web Audio API                            │
    │  • File System Access API                   │
    │  • IndexedDB                                │
    └─────────────────────────────────────────────┘
```

### Module Structure

- **App.tsx** - Root component, Dockview setup with 4 panels + theme management
- **modules/** - Feature modules (explorer, player, fileLoader, playlist, tasks)
- **components/** - Reusable UI components (including ThemeSwitcher)
- **lib/** - Core utilities (AudioPlayer, Explorer, db, musicMetadata)
- **hooks/** - Custom React hooks (usePlayer)
- **models/** - Data schemas (AudioMetadata, FileMetadata, Playlist, PlayLogEntry)
- **util/** - Helper functions (time, math, styles, logging)
- **workers/** - Web Workers for background processing

---

## Development Setup

### Prerequisites

- **Node.js** 18+ (recommended: use nvm or fnm)
- **pnpm** 8+ (package manager)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/umstek/listen-next.git
   cd listen-next
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Approve build scripts (if prompted):
   ```bash
   pnpm approve-builds
   ```

### Environment Configuration

No environment variables required. All configuration is in `src/config.ts`.

---

## Build and Run

### Development Mode

Start the Vite dev server with hot module replacement:

```bash
pnpm dev
```

The app will be available at `http://localhost:5173` (or next available port).

The `--host` flag allows access from other devices on your network.

### Production Build

Build the app for production:

```bash
pnpm build
```

Output will be in the `dist/` directory.

### Preview Production Build

Test the production build locally:

```bash
pnpm serve
```

### Other Commands

- **Format code**: `pnpm format` (Prettier)
- **Lint code**: `pnpm lint` (ESLint with auto-fix)
- **Run tests**: `pnpm test` (Vitest)
- **Clean build**: `pnpm clean` (removes `dist/`)

---

## Project Structure

```
listen-next/
├── src/
│   ├── App.tsx                    # Root component (Dockview setup)
│   ├── main.tsx                   # Entry point
│   ├── store.ts                   # Redux store configuration
│   ├── config.ts                  # App configuration
│   │
│   ├── components/                # UI components
│   │   ├── ui/                    # shadcn/ui registry components
│   │   ├── layout/                # Layout primitives (Flex, Box, Text, etc.)
│   │   ├── Breadcrumbs/           # Path navigation with dropdowns
│   │   ├── Dialogs/               # Alert dialogs
│   │   ├── ExplorerTileBody/      # File/folder thumbnail with context menu (Play, Delete)
│   │   ├── FileLoader/            # File upload/drag-drop UI with checkboxes
│   │   ├── Player/                # Playback controls and metadata display
│   │   ├── ThemeSwitcher.tsx      # Light/Dark/Auto theme toggle
│   │   └── TileView/              # Grid layout with drag-to-select
│   │
│   ├── modules/                   # Feature modules
│   │   ├── explorer/              # File system browser
│   │   ├── fileLoader/            # File/folder loader
│   │   ├── player/                # Audio player
│   │   ├── playlist/              # Playlist management (Redux slice)
│   │   └── tasks/                 # Background task display
│   │
│   ├── lib/                       # Core libraries
│   │   ├── AudioPlayer.ts         # Web Audio API wrapper
│   │   ├── Explorer.ts            # File system navigation
│   │   ├── db.ts                  # Dexie database setup
│   │   ├── fileLoader.ts          # File/folder loading logic
│   │   └── musicMetadata.ts       # Metadata extraction
│   │
│   ├── hooks/                     # Custom React hooks
│   │   └── usePlayer.ts           # Audio playback hook
│   │
│   ├── models/                    # Data models (Zod schemas)
│   │   ├── AudioMetadata.ts       # Audio file metadata
│   │   ├── FileMetadata.ts        # File system entity metadata
│   │   ├── Playlist.ts            # Playlist schema
│   │   └── PlayLogEntry.ts        # Play history schema
│   │
│   ├── util/                      # Utility functions
│   │   ├── logger.ts              # Pino logging
│   │   ├── math.ts                # Math helpers
│   │   ├── styles.ts              # Tailwind utilities
│   │   └── time.ts                # Time formatting
│   │
│   └── workers/                   # Web Workers
│       └── indexAndCopyTask.worker.ts  # File copying and indexing
│
├── dist/                          # Build output (generated)
├── public/                        # Static assets
├── vite.config.ts                 # Vite configuration
├── tsconfig.json                  # TypeScript configuration
├── postcss.config.js              # PostCSS configuration
├── tailwind.config.ts             # Tailwind configuration
├── package.json                   # Dependencies and scripts
└── TODO.md                        # Development roadmap
```

---

## Core Concepts

### 1. File System Access

The app uses the [File System Access API](https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API) with a polyfill for broader browser support.

**Two storage modes:**

1. **Copy to Browser** (Sandbox):
   - Copies files to the browser's origin-private file system (OPFS)
   - Files persist across sessions
   - No permission prompts after initial access
   - Isolated from the user's file system

2. **Store as Links**:
   - Stores references to the original files
   - Requires permission each time files are accessed
   - Changes to original files are reflected
   - Uses `FileSystemFileHandle` and `FileSystemDirectoryHandle`

See `src/lib/Explorer.ts` for file system navigation logic.

### 2. Audio Playback

The `AudioPlayer` class (src/lib/AudioPlayer.ts) wraps the Web Audio API:

- **Audio Context** - Manages audio processing graph
- **Source Node** - Loads audio from URL or ArrayBuffer
- **Gain Node** - Controls volume (0-2x)
- **Stereo Panner Node** - Controls left/right balance (-1 to 1)
- **Analyser Node** - Enables visualization (not yet used in UI)

Usage:
```typescript
import { usePlayer } from '~hooks/usePlayer';

function MyComponent() {
  const { play, pause, stop, seek, setVolume } = usePlayer();

  play({ url: 'blob:...', seek: 0 });
  setVolume(0.8);
}
```

### 3. Metadata Extraction

The `music-metadata` library extracts metadata from audio files:

- **Supported formats**: WAV, MP3, M4A, M4B, AAC, OGA, OGG, OPUS, FLAC
- **Metadata fields**: title, artist, album, genre, year, track number, duration
- **Chapters**: For audiobooks (M4B)

See `src/lib/musicMetadata.ts` for the wrapper function.

### 4. Background Processing

Web Workers handle CPU-intensive tasks without blocking the UI:

- **indexAndCopyTask.worker.ts** - Copies files and extracts metadata
- **Communication** - Uses `postMessage` and message listeners
- **Progress tracking** - Updates Redux store with task status

### 5. Theme Management

The app supports three theme modes via `ThemeSwitcher` component:

- **Light Mode**: Forces light theme
- **Dark Mode**: Forces dark theme
- **Auto Mode**: Follows system preference

**Implementation Details:**
- Theme preference stored in localStorage
- Applied to both main app and individual dockview panels via `PanelWrapper`
- Dockview theme class changes dynamically (`dockview-theme-light` / `dockview-theme-dark`)

See `src/components/ThemeSwitcher.tsx` and `src/App.tsx` for implementation.

### 6. File Selection and Smart Copying

FileLoader supports selective file operations:

- **Checkboxes**: Select individual files or all files
- **Smart Directory Filtering**: Only copies parent directories of selected files
- **Selection Count**: Shows feedback on number of selected items

When files are selected, `getRelevantDirectories()` filters directories to include only ancestors of selected files, preventing empty folder creation.

See `src/components/FileLoader/index.tsx:55-72` for implementation.

### 7. Delete Functionality

Explorer supports deleting files and directories:

- **Recursive Deletion**: Directories deleted with all contents
- **Link Cleanup**: Deletes database entries for linked files
- **Immediate Refresh**: Explorer updates after deletion

Implementation uses `Explorer.remove()` with `{ recursive: true }` option.

See `src/modules/explorer/ExplorerView.tsx:127-142` for delete handler.

---

## State Management

### Redux Store Structure

```typescript
{
  playlist: {
    items: string[],        // Array of audio URLs
    activeIndex: number     // Currently playing track (or -1)
  },
  tasks: {
    items: TaskStatusDefinition[]  // Background task queue
  }
}
```

### Playlist Slice (src/modules/playlist/playlistSlice.ts)

**Actions:**
- `setItems(urls: string[])` - Replace entire playlist
- `appendItems(urls: string[])` - Add to end of playlist
- `clearItems()` - Remove all tracks
- `setActiveIndex(index: number)` - Set currently playing track

**Selectors:**
- `selectPlaylist(state)` - Get full playlist state
- `selectPlaylistItems(state)` - Get array of URLs
- `selectActiveIndex(state)` - Get active track index

### Tasks Slice (src/modules/tasks/tasksSlice.ts)

**Actions:**
- `addTask(task)` - Add new background task
- `updateTask({ id, changes })` - Update task status/progress
- `removeTask(id)` - Remove completed task

**Task Status:**
- `pending` - Waiting to start
- `in_progress` - Currently running
- `completed` - Finished successfully
- `failed` - Encountered error

---

## Database Schema

### IndexedDB Tables (Dexie)

#### 1. **audioMetadata**
Stores complete metadata for each audio file.

**Schema (src/models/AudioMetadata.ts):**
```typescript
{
  id: string,              // Unique ID (nanoid)
  title: string,
  artists: string[],
  album: string,
  genre: string[],
  year: number,
  trackNumber: number,
  trackCount: number,
  duration: number,       // Seconds
  // ... additional fields
}
```

**Indexes:**
- `++id` (auto-incrementing primary key)
- None yet (see TODO.md for planned indexes on artist, album, genre)

#### 2. **fileSystemEntities**
Stores references to file system entries (sandbox or linked files).

**Schema (src/models/FileMetadata.ts):**
```typescript
{
  id: string,                         // Unique ID
  name: string,                       // File/folder name
  kind: 'file' | 'directory',
  source: 'sandbox' | 'local',
  handle?: FileSystemHandle,          // For linked files
  metadata?: AudioMetadata            // Embedded metadata
}
```

#### 3. **playlists**
Stores user-created playlists (not yet used in UI).

**Schema (src/models/Playlist.ts):**
```typescript
{
  id: string,
  name: string,
  items: string[],        // Array of audioMetadata IDs
  createdAt: Date,
  updatedAt: Date
}
```

#### 4. **playHistory**
Stores play log entries (not yet used).

**Schema (src/models/PlayLogEntry.ts):**
```typescript
{
  id: string,
  audioMetadataId: string,
  playedAt: Date,
  duration: number,       // How long was played
  completed: boolean      // Did playback finish?
}
```

### Database Queries

Example queries in `src/lib/db.ts`:

```typescript
import { db } from '~lib/db';

// Add metadata
await db.audioMetadata.add(metadata);

// Query by ID
const track = await db.audioMetadata.get(id);

// Query all
const all = await db.audioMetadata.toArray();

// Delete
await db.audioMetadata.delete(id);
```

---

## Web Workers

### indexAndCopyTask Worker

**Purpose**: Copies files to sandbox and extracts metadata in the background.

**Location**: `src/workers/indexAndCopyTask.worker.ts`

**Message Interface**:

```typescript
// From main thread → worker
{
  id: string,
  files: File[],
  directories: FileSystemDirectoryHandle[]
}

// From worker → main thread
{
  type: 'progress' | 'complete' | 'error',
  id: string,
  progress?: number,      // 0-100
  result?: { ... },       // Completion data
  error?: string          // Error message
}
```

**Usage in main thread**:

```typescript
import worker from '~workers/indexAndCopyTask.worker.ts?worker';

const taskWorker = new worker();

taskWorker.postMessage({
  id: nanoid(),
  files: [file1, file2],
  directories: []
});

taskWorker.addEventListener('message', (e) => {
  const { type, progress } = e.data;
  if (type === 'progress') {
    console.log(`Progress: ${progress}%`);
  }
});
```

---

## Testing

### Test Setup

- **Framework**: Vitest 4.0
- **Location**: `src/**/*.test.ts`
- **Current Coverage**: Minimal (only 1 test file exists)

### Running Tests

```bash
pnpm test        # Run all tests
pnpm test:watch  # Watch mode
pnpm test:ui     # Interactive UI
```

### Example Test (src/lib/Explorer.test.ts)

```typescript
import { describe, it, expect } from 'vitest';
import { Explorer } from './Explorer';

describe('Explorer', () => {
  it('should initialize', () => {
    const explorer = new Explorer();
    expect(explorer).toBeDefined();
  });
});
```

### Testing Best Practices

1. **Unit tests** for pure functions (util/, lib/)
2. **Integration tests** for Redux slices and database operations
3. **Component tests** with React Testing Library
4. **E2E tests** with Playwright (not set up yet)

**Note**: Tests are currently stateful (see Explorer.test.ts comment). This is technical debt that should be addressed.

---

## Debugging

### Browser DevTools

1. **React DevTools** - Install the React DevTools browser extension
2. **Redux DevTools** - Install the Redux DevTools extension
   - Already integrated via Redux Toolkit

3. **IndexedDB Inspector** - Use browser DevTools → Application → Storage → IndexedDB

4. **Web Audio Inspector** - Chrome: chrome://webaudio-internals/

### Logging

The app uses Pino for structured logging:

```typescript
import logger from '~util/logger';

logger.info({ foo: 'bar' }, 'Message');
logger.error({ err }, 'Error occurred');
```

### Common Debug Scenarios

#### Audio not playing?
1. Check browser console for autoplay policy errors
2. Verify URL is a valid blob or file URL
3. Check AudioPlayer state in Redux DevTools
4. Verify file format is supported

#### Files not loading?
1. Check File System Access API permissions
2. Verify file extensions match config.supportedExtensions
3. Check IndexedDB for stored metadata
4. Look for errors in worker console logs

#### UI not updating?
1. Check Redux state in DevTools
2. Verify component is subscribed to correct slice
3. Check React DevTools for re-render issues
4. Look for console errors/warnings

---

## Code Style and Conventions

### TypeScript

- **Strict mode**: Enabled in tsconfig.json
- **Prefer interfaces** over types for object shapes
- **Use Zod** for runtime validation
- **Avoid `any`** - use `unknown` if type is truly unknown

### React

- **Functional components** only (no class components)
- **Hooks** for state and side effects
- **Props destructuring** in function signature
- **Named exports** for components (not default exports)

### File Naming

- **Components**: PascalCase (e.g., `Player.tsx`)
- **Utilities**: camelCase (e.g., `musicMetadata.ts`)
- **Hooks**: camelCase with `use` prefix (e.g., `usePlayer.ts`)
- **Types/Models**: PascalCase (e.g., `AudioMetadata.ts`)

### Imports

Use path aliases defined in tsconfig.json:

```typescript
import { db } from '~lib/db';                // ~* = src/*
import { Player } from ':Player';            // :* = src/components/*
```

### Formatting

- **Prettier** enforces consistent formatting
- **Tabs**: 2 spaces
- **Quotes**: Single quotes for strings
- **Semicolons**: Required
- **Trailing commas**: ES5 (objects, arrays)

Run `pnpm format` before committing.

### Linting

- **ESLint 9** with flat config (eslint.config.js)
- **Rules**: React, TypeScript, Prettier integration
- **Auto-fix**: `pnpm lint` (fixes automatically where possible)

---

## Common Pitfalls

### 1. File System Access API Permissions

**Issue**: Permission prompts on every file access with "Store as Links" mode.

**Solution**: This is by design for security. Use "Copy to Browser" for persistent access without prompts.

### 2. Polyfill Type Conflicts

**Issue**: TypeScript errors with `FileSystemDirectoryHandle` due to polyfill.

**Current Workaround**: Using `@ts-expect-error` in ExplorerView (lines 40-44).

**TODO**: Clean up type definitions (see TODO.md).

### 3. IndexedDB Quota Limits

**Issue**: Browser may limit IndexedDB storage (typically 50% of available disk).

**Mitigation**: Use "Store as Links" for large libraries. Monitor quota usage.

### 4. Web Audio Autoplay Policy

**Issue**: Browsers block autoplay without user interaction.

**Solution**: App requires user interaction (e.g., clicking play button) to start audio.

### 5. Metadata Parsing Failures

**Issue**: Some audio files may have corrupt or non-standard metadata.

**Handling**: Wrapped in try-catch. Falls back to filename if metadata extraction fails.

### 6. Worker Communication Timing

**Issue**: Race conditions between worker messages and Redux updates.

**Solution**: Use unique task IDs and atomic state updates.

### 7. Theme Application to Dockview Panels

**Issue**: Radix UI Theme doesn't automatically propagate to dockview panels.

**Solution**: Wrap each panel component with `PanelWrapper` that applies Theme component. Also set dockview theme class dynamically based on current theme.

See `src/App.tsx` for implementation pattern.

---

## Contributing

### Workflow

1. **Create a branch** from `main`:
   ```bash
   git checkout -b feature/my-feature
   ```

2. **Make changes** and test locally

3. **Format and lint**:
   ```bash
   pnpm format
   pnpm lint
   ```

4. **Run tests**:
   ```bash
   pnpm test
   ```

5. **Build** to verify no errors:
   ```bash
   pnpm build
   ```

6. **Commit** with descriptive message:
   ```bash
   git add .
   git commit -m "feat: add playlist management UI"
   ```

7. **Push** and create pull request:
   ```bash
   git push origin feature/my-feature
   ```

### Commit Message Format

Follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `refactor:` - Code restructuring
- `test:` - Adding tests
- `chore:` - Maintenance (deps, config)

Examples:
```
feat: implement playlist management UI
fix: resolve metadata parsing error for M4A files
docs: update developer guide with testing section
```

### Code Review Guidelines

- **Keep PRs focused** - One feature/fix per PR
- **Write tests** for new features
- **Update documentation** if behavior changes
- **Follow existing patterns** in the codebase
- **Address review feedback** promptly

### Recent Contributions

Recent features implemented:

1. ✅ **Theme Switcher** - Light/Dark/Auto mode with localStorage persistence
2. ✅ **File Selection** - Checkbox-based selection in FileLoader
3. ✅ **Delete Functionality** - Remove files/folders from Explorer
4. ✅ **Smart Directory Copying** - Only copy folders containing selected files

### Areas Needing Contribution

See [TODO.md](./TODO.md) for prioritized list. High-value areas:

1. **Playlist Management UI** (Priority 1.1)
2. **Search and Filtering** (Priority 1.2)
3. **Testing Suite** (Priority 3.3)
4. **Keyboard Shortcuts** (Priority 2.1)
5. **Audio Visualization** (Priority 2.2)

---

## Additional Resources

- **React 19 Docs**: https://react.dev/
- **TypeScript Handbook**: https://www.typescriptlang.org/docs/
- **Vite Guide**: https://vite.dev/
- **shadcn/ui**: https://ui.shadcn.com/
- **Radix UI**: https://www.radix-ui.com/
- **Tailwind CSS**: https://tailwindcss.com/
- **Dexie.js**: https://dexie.org/
- **Web Audio API**: https://developer.mozilla.org/en-docs/Web/API/Web_Audio_API
- **File System Access API**: https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API

---

## License

[Specify license here]

---

## Support

- **Issues**: https://github.com/umstek/listen-next/issues
- **Discussions**: https://github.com/umstek/listen-next/discussions

---

**Last Updated**: 2025-11-17
