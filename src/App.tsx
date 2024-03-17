import {
  DockviewReact,
  type DockviewReadyEvent,
  type IDockviewPanelProps,
} from 'dockview';

import { ExplorerView } from '~modules/explorer/ExplorerView';
import { FileLoaderView } from '~modules/fileLoader/FileLoaderView';
import { PlayerView } from '~modules/player/PlayerView';
import { PlaylistView } from '~modules/playlist/PlaylistView';
import { TasksView } from '~modules/tasks/TasksView';

const components = {
  explorer: (props: IDockviewPanelProps<{ title: string }>) => {
    return <ExplorerView />;
  },
  fileLoader: (props: IDockviewPanelProps<{ title: string }>) => {
    return <FileLoaderView />;
  },
  player: (props: IDockviewPanelProps<{ title: string }>) => {
    return <PlayerView />;
  },
  tasks: (props: IDockviewPanelProps<{ title: string }>) => {
    return <TasksView />;
  },
  playlist: (props: IDockviewPanelProps<{ title: string }>) => {
    return <PlaylistView />;
  },
  empty: (props: IDockviewPanelProps<{ title: string }>) => {
    return <div className="w-full h-full bg-accent-3">Empty</div>;
  },
};

function App() {
  const onReady = (event: DockviewReadyEvent) => {
    const explorerPanel = event.api.addPanel({
      id: 'explorer',
      component: 'explorer',
      title: 'Explorer',
    });

    const _fileLoaderPanel = event.api.addPanel({
      id: 'fileLoader',
      component: 'fileLoader',
      title: 'File Loader',
      position: { referencePanel: explorerPanel },
    });

    const _emptyPanel = event.api.addPanel({
      id: 'empty',
      component: 'empty',
      title: 'Empty',
      position: { referencePanel: explorerPanel },
    });

    const _playerPanel = event.api.addPanel({
      id: 'player',
      component: 'player',
      title: 'Player',
      position: { referencePanel: explorerPanel, direction: 'above' },
    });

    const _tasksPanel = event.api.addPanel({
      id: 'tasks',
      component: 'tasks',
      title: 'Tasks',
      position: { referencePanel: explorerPanel, direction: 'below' },
    });

    const _playlistPanel = event.api.addPanel({
      id: 'playlist',
      component: 'playlist',
      title: 'Playlist',
      position: { referencePanel: explorerPanel, direction: 'right' },
    });

    explorerPanel.api.setActive();
  };

  return (
    <DockviewReact
      className="dockview-theme-light"
      components={components}
      onReady={onReady}
    />
  );
}

export default App;
