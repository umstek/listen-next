import {
  DockviewReact,
  DockviewReadyEvent,
  IDockviewPanelProps,
} from 'dockview';

import { ExplorerView } from '~modules/explorer/ExplorerView';
import { FileLoaderView } from '~modules/fileLoader/FileLoaderView';
import { PlayerView } from '~modules/player/PlayerView';
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
  empty: (props: IDockviewPanelProps<{ title: string }>) => {
    return <div className="w-full h-full">Empty</div>;
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
      position: { referencePanel: 'explorer' },
    });

    const _emptyPanel = event.api.addPanel({
      id: 'empty',
      component: 'empty',
      title: 'Empty',
      position: { referencePanel: 'explorer' },
    });

    const _playerPanel = event.api.addPanel({
      id: 'player',
      component: 'player',
      title: 'Player',
      position: { referencePanel: 'explorer' },
    });

    const _tasksPanel = event.api.addPanel({
      id: 'tasks',
      component: 'tasks',
      title: 'Tasks',
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
