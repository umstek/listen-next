# Listen-Next Development Roadmap

> **Project Status**: Functional MVP with core audio playback implemented. Many advanced features planned but not yet built.

**Related Resources:**
- Original Project: [umstek/listen](https://github.com/umstek/listen)
- Epic Issue: [#157 - Music Library Implementation](https://github.com/umstek/listen/issues/157)
- Project Board: [Listen Development](https://github.com/users/umstek/projects/9)

---

## Current State Summary

### ✅ What's Working
- **Audio Playback**: Full playback controls (play/pause, seek, volume, pan, playback rate)
- **File System Access**: Explorer, drag-drop, file picker with two storage modes
- **Metadata Reading**: Extracts title, artist, album, genre, duration from audio files
- **Database**: IndexedDB setup with Dexie, schemas defined for metadata, playlists, history
- **UI Framework**: Dockview panel system with 4 modules (Explorer, FileLoader, Player, Tasks)
- **State Management**: Redux Toolkit with playlist and tasks slices
- **Background Processing**: Web Worker for file copying and indexing

### ❌ What's Missing
- Playlist management UI (schema exists, no implementation)
- Search and filtering functionality
- Settings/preferences UI
- Play history tracking and statistics
- Keyboard shortcuts
- Import/export features
- Comprehensive testing
- Documentation

---

## Priority 1: Core Feature Completion

### 1.1 Playlist Management UI
**Related**: [#157](https://github.com/umstek/listen/issues/157), Subtask [#205 - Playlist Schema](https://github.com/umstek/listen/issues/205)

**Status**: Schema defined, UI not implemented

**Tasks**:
- [ ] Implement `PlaylistView` module (currently empty stub)
- [ ] Create playlist CRUD operations UI
  - [ ] Create new playlist
  - [ ] Rename playlist
  - [ ] Delete playlist
  - [ ] Switch between playlists
- [ ] Add playlist persistence using Dexie database
- [ ] Implement "Add to Playlist" context menu actions
- [ ] Add queue management features
  - [ ] Reorder tracks (drag-and-drop)
  - [ ] Remove individual tracks
  - [ ] Clear queue
  - [ ] Shuffle/repeat modes

**Files to Create/Modify**:
- `src/modules/playlist/PlaylistView.tsx` (currently empty)
- `src/lib/db.ts` (add playlist queries)
- `src/hooks/usePlaylist.ts` (new hook for playlist operations)

---

### 1.2 Search and Filtering
**Related**: [#157](https://github.com/umstek/listen/issues/157), Subtask [#207 - Metadata Schema](https://github.com/umstek/listen/issues/207)

**Status**: Not implemented

**Tasks**:
- [ ] Add search bar component to Explorer module
- [ ] Implement file name search
- [ ] Add metadata-based filtering
  - [ ] Filter by artist
  - [ ] Filter by album
  - [ ] Filter by genre
  - [ ] Filter by year
- [ ] Add filter UI with dropdown/chips
- [ ] Implement full-text search across metadata using Dexie

**Files to Create/Modify**:
- `src/components/SearchBar.tsx` (new)
- `src/modules/explorer/ExplorerView.tsx` (add search UI)
- `src/lib/db.ts` (add search queries with indexes)

---

### 1.3 Play History and Statistics
**Related**: [#157](https://github.com/umstek/listen/issues/157), Subtask [#206 - History Record Schema](https://github.com/umstek/listen/issues/206)

**Status**: Schema defined, not used

**Tasks**:
- [ ] Implement play logging in Player component
- [ ] Save play history to database using `PlayLogEntry` schema
- [ ] Create history view UI
  - [ ] Recent plays list
  - [ ] Play count statistics
  - [ ] Last played date
- [ ] Add "resume position" feature for audiobooks
- [ ] Implement "most played" / "recently played" sections
- [ ] Add statistics dashboard
  - [ ] Total listening time
  - [ ] Top artists/albums/tracks
  - [ ] Listening trends over time

**Files to Create/Modify**:
- `src/modules/player/Player.tsx` (add logging on play/pause/skip)
- `src/modules/history/HistoryView.tsx` (new module)
- `src/lib/db.ts` (add history queries)
- `src/hooks/usePlayHistory.ts` (new hook)

---

### 1.4 Settings and Preferences
**Status**: Not implemented

**Tasks**:
- [ ] Create Settings module
- [ ] Add preferences storage using localStorage or IndexedDB
- [ ] Implement settings UI
  - [ ] Default storage location preference
  - [ ] Audio format preferences
  - [ ] UI theme selection (light/dark/auto)
  - [ ] Default playback mode (music/audiobook)
  - [ ] Auto-resume audiobooks toggle
  - [ ] Volume persistence
- [ ] Add keyboard shortcuts configuration
- [ ] Implement settings import/export

**Files to Create**:
- `src/modules/settings/SettingsView.tsx` (new module)
- `src/lib/settings.ts` (settings persistence)
- `src/hooks/useSettings.ts` (new hook)

---

## Priority 2: User Experience Enhancements

### 2.1 Keyboard Shortcuts
**Status**: Placeholders exist in context menus, not functional

**Tasks**:
- [ ] Implement global keyboard event handler
- [ ] Add standard shortcuts:
  - [ ] Space: Play/Pause
  - [ ] ⌘/Ctrl+P: Play selected file
  - [ ] ⌘/Ctrl+A: Add to current playlist
  - [ ] ⌘/Ctrl+F: Focus search
  - [ ] Arrow keys: Navigate file list
  - [ ] ⌘/Ctrl+O: Open file picker
  - [ ] →/←: Skip next/previous track
  - [ ] ↑/↓: Volume up/down
- [ ] Add keyboard shortcuts help dialog (?)
- [ ] Make shortcuts configurable in settings

**Files to Create/Modify**:
- `src/hooks/useKeyboardShortcuts.ts` (new hook)
- `src/App.tsx` (register global shortcuts)
- `src/components/KeyboardShortcutsHelp.tsx` (new dialog)

---

### 2.2 Audio Visualization
**Status**: Infrastructure exists (AudioPlayer has analyser node), not rendered

**Tasks**:
- [ ] Create visualization component using Canvas API
- [ ] Implement visualization types:
  - [ ] Frequency bars (spectrum analyzer)
  - [ ] Waveform
  - [ ] Circular visualizer
- [ ] Add toggle to show/hide visualization
- [ ] Make visualization customizable (colors, sensitivity)
- [ ] Optimize rendering with requestAnimationFrame

**Files to Create**:
- `src/components/AudioVisualizer.tsx` (new)
- `src/modules/player/Player.tsx` (integrate visualizer)

---

### 2.3 Import/Export Features
**Status**: Not implemented

**Tasks**:
- [ ] Implement playlist export
  - [ ] Export to M3U format
  - [ ] Export to JSON format
  - [ ] Export with relative/absolute paths
- [ ] Implement playlist import
  - [ ] Import M3U files
  - [ ] Import JSON playlists
- [ ] Add metadata export (CSV/JSON)
- [ ] Implement settings backup/restore
- [ ] Add bulk operations UI

**Files to Create**:
- `src/lib/importExport.ts` (import/export utilities)
- `src/components/ImportExportDialog.tsx` (new)

---

### 2.4 Advanced File Operations
**Status**: Not implemented

**Tasks**:
- [ ] Add file deletion/removal UI
  - [ ] Remove from library (keep file)
  - [ ] Delete file (with confirmation)
- [ ] Implement file renaming
- [ ] Add move/copy between folders
- [ ] Implement "Favorite" / "Star" feature
- [ ] Add rating system (1-5 stars)
- [ ] Implement tag editing UI

**Files to Modify**:
- `src/modules/explorer/ExplorerView.tsx` (add context menu actions)
- `src/lib/Explorer.ts` (add file operation methods)
- `src/models/AudioMetadata.ts` (add rating, favorite fields)

---

## Priority 3: Technical Improvements

### 3.1 Database Optimization
**Related**: [#157](https://github.com/umstek/listen/issues/157)

**Status**: TODO comment exists in Player component

**Tasks**:
- [ ] Move metadata to Redux store instead of refetching on each track load
- [ ] Add database indexes for search performance
  - [ ] Index on artist, album, genre
  - [ ] Compound index on (artist, album, trackNumber)
- [ ] Implement metadata caching strategy
- [ ] Add database migration system for schema updates
- [ ] Optimize query performance for large libraries (10k+ tracks)
- [ ] Add database cleanup/maintenance utilities

**Files to Modify**:
- `src/modules/player/Player.tsx` (use store instead of direct db fetch)
- `src/lib/db.ts` (add indexes, optimization)
- `src/store.ts` (add metadata slice)

---

### 3.2 Battery and Performance Optimization
**Status**: TODO comment in IndexPrompt

**Tasks**:
- [ ] Check battery level and charging status using Battery API
- [ ] Decide default options based on device state
  - [ ] Disable background indexing on low battery
  - [ ] Reduce scan depth on battery power
- [ ] Implement lazy loading for large file lists
- [ ] Optimize Web Worker performance
- [ ] Add memory usage monitoring
- [ ] Implement service worker for offline support

**Files to Modify**:
- `src/modules/fileLoader/IndexPrompt.tsx` (add battery check)
- `src/workers/indexAndCopyTask.worker.ts` (optimize performance)

---

### 3.3 Testing Suite
**Status**: Only 1 test file exists with limited coverage

**Tasks**:
- [ ] Set up testing infrastructure
  - [ ] Configure Vitest/Jest
  - [ ] Add React Testing Library
  - [ ] Add Playwright for E2E tests
- [ ] Write unit tests for:
  - [ ] AudioPlayer class
  - [ ] Explorer class
  - [ ] Redux slices
  - [ ] Utility functions
- [ ] Write integration tests for:
  - [ ] File loading workflow
  - [ ] Playback controls
  - [ ] Playlist management
- [ ] Add E2E tests for critical user flows
- [ ] Set up CI/CD with automated testing
- [ ] Aim for >80% code coverage

**Files to Create**:
- `vitest.config.ts` or `jest.config.js`
- `tests/unit/**/*.test.ts`
- `tests/integration/**/*.test.ts`
- `tests/e2e/**/*.spec.ts`

---

### 3.4 Error Handling and Logging
**Status**: Basic logging with pino exists

**Tasks**:
- [ ] Implement global error boundary
- [ ] Add user-friendly error messages
- [ ] Improve error handling for:
  - [ ] File permission errors
  - [ ] Unsupported audio formats
  - [ ] Network failures
  - [ ] Database errors
- [ ] Add error reporting UI (toast notifications)
- [ ] Implement structured logging with log levels
- [ ] Add optional error reporting to external service

**Files to Create/Modify**:
- `src/components/ErrorBoundary.tsx` (new)
- `src/components/Toast.tsx` (new notification system)
- `src/util/logger.ts` (enhance logging)

---

### 3.5 TypeScript and Code Quality
**Status**: Multiple `@ts-expect-error` workarounds exist

**Tasks**:
- [ ] Fix polyfill type conflicts
  - [ ] Resolve FileSystemDirectoryHandle issues
  - [ ] Fix Redux selector types
- [ ] Remove all `@ts-expect-error` annotations
- [ ] Add strict TypeScript configuration
- [ ] Set up ESLint with recommended rules
- [ ] Add Prettier for code formatting
- [ ] Set up pre-commit hooks with Husky
- [ ] Add type guards for runtime validation
- [ ] Document complex type definitions

**Files to Modify**:
- `tsconfig.json` (enable strict mode)
- `.eslintrc.json` (new)
- `.prettierrc` (new)
- All files with `@ts-expect-error`

---

## Priority 4: Documentation and Developer Experience

### 4.1 Developer Guide
**Status**: Not created

**Tasks**:
- [ ] Create `DEVELOPER.md` with:
  - [ ] Project architecture overview
  - [ ] Technology stack explanation
  - [ ] Development setup instructions
  - [ ] Build and run commands
  - [ ] Testing guide
  - [ ] Debugging tips
  - [ ] Contribution guidelines
  - [ ] Code style guide
  - [ ] Common pitfalls and solutions

---

### 4.2 User Manual
**Status**: Not created

**Tasks**:
- [ ] Create `USER_MANUAL.md` with:
  - [ ] Installation instructions
  - [ ] Getting started guide
  - [ ] Feature walkthrough
  - [ ] Keyboard shortcuts reference
  - [ ] FAQ section
  - [ ] Troubleshooting guide
  - [ ] Browser compatibility information
  - [ ] Privacy and data storage explanation

---

### 4.3 API Documentation
**Status**: Not created

**Tasks**:
- [ ] Add JSDoc comments to all public APIs
- [ ] Document component props
- [ ] Document Redux actions and selectors
- [ ] Document database schema with examples
- [ ] Generate API documentation with TypeDoc
- [ ] Create architecture diagrams

---

## Priority 5: Future Enhancements

### 5.1 Advanced Features
- [ ] Cloud storage integration (Google Drive, Dropbox, OneDrive)
- [ ] Lyrics display with synchronization
- [ ] Album art fetching from online services
- [ ] Smart playlists (auto-generated based on rules)
- [ ] Equalizer with presets
- [ ] Crossfade between tracks
- [ ] Gapless playback
- [ ] ReplayGain support
- [ ] Podcast support with episode management
- [ ] Last.fm scrobbling integration
- [ ] Music recommendations

### 5.2 Mobile and PWA
- [ ] Responsive design for mobile devices
- [ ] Touch gesture support
- [ ] PWA manifest and service worker
- [ ] Install as app functionality
- [ ] Background audio playback on mobile
- [ ] Media session API integration (lock screen controls)

### 5.3 Accessibility
- [ ] ARIA labels for all interactive elements
- [ ] Keyboard navigation for all features
- [ ] Screen reader support
- [ ] High contrast mode
- [ ] Reduced motion support
- [ ] Focus management
- [ ] WCAG 2.1 AA compliance

---

## Immediate Next Steps (Post-Dependency Upgrade)

1. **Implement Playlist Management UI** (Priority 1.1)
   - Unblock core functionality
   - High user impact
   - Foundation for other features

2. **Add Search and Filtering** (Priority 1.2)
   - Essential for usability with large libraries
   - Relatively straightforward to implement
   - Uses existing metadata infrastructure

3. **Create Developer Guide and User Manual** (Priority 4.1, 4.2)
   - Improve onboarding
   - Document current state
   - Help future contributors

4. **Implement Play History** (Priority 1.3)
   - Use existing schema
   - Provides user value
   - Foundation for statistics features

5. **Add Testing Suite** (Priority 3.3)
   - Prevent regressions
   - Enable confident refactoring
   - Critical before adding more features

---

## Dependencies and Relationships

```
Priority 1.1 (Playlists) → Blocks → Priority 2.3 (Import/Export)
Priority 1.2 (Search) → Requires → Priority 3.1 (DB Optimization)
Priority 1.3 (History) → Enables → Priority 2.4 (Recommendations - Future)
Priority 1.4 (Settings) → Enables → Priority 2.1 (Keyboard Shortcuts Config)
Priority 3.1 (DB Optimization) → Required for → Large library support
Priority 3.3 (Testing) → Should precede → All new feature development
Priority 4 (Documentation) → Ongoing → Throughout all development
```

---

## Notes
- All schema definitions from Epic [#157](https://github.com/umstek/listen/issues/157) are complete (Playlist, History, Metadata, Metadata Proxy)
- MVP milestone is at 72.7% completion (as of Dec 2022)
- Core playback functionality is solid - focus on management and UX features
- Consider creating GitHub issues for each Priority 1 and Priority 2 item
- Link new issues to Epic [#157](https://github.com/umstek/listen/issues/157) and project board

---

**Last Updated**: 2025-11-16
