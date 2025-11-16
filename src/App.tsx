import {
  DockviewReact,
  DockviewReadyEvent,
  IDockviewPanelProps,
} from 'dockview';
import { Theme } from '@radix-ui/themes';

import { ThemeSwitcher, useThemePreference } from ':ThemeSwitcher';
import { ExplorerView } from '~modules/explorer/ExplorerView';
import { FileLoaderView } from '~modules/fileLoader/FileLoaderView';
import { PlayerView } from '~modules/player/PlayerView';
import { TasksView } from '~modules/tasks/TasksView';

const PanelWrapper = ({ children }: { children: React.ReactNode }) => {
  const [theme] = useThemePreference();
  const appearance = theme === 'auto' ? 'inherit' : theme;
  return (
    <Theme appearance={appearance} className="w-full h-full">
      {children}
    </Theme>
  );
};

const components = {
  explorer: (props: IDockviewPanelProps<{ title: string }>) => {
    return (
      <PanelWrapper>
        <ExplorerView />
      </PanelWrapper>
    );
  },
  fileLoader: (props: IDockviewPanelProps<{ title: string }>) => {
    return (
      <PanelWrapper>
        <FileLoaderView />
      </PanelWrapper>
    );
  },
  player: (props: IDockviewPanelProps<{ title: string }>) => {
    return (
      <PanelWrapper>
        <PlayerView />
      </PanelWrapper>
    );
  },
  tasks: (props: IDockviewPanelProps<{ title: string }>) => {
    return (
      <PanelWrapper>
        <TasksView />
      </PanelWrapper>
    );
  },
  empty: (props: IDockviewPanelProps<{ title: string }>) => {
    return (
      <PanelWrapper>
        <div className="w-full h-full">Empty</div>
      </PanelWrapper>
    );
  },
};

function App() {
  const [theme] = useThemePreference();

  // Determine dockview theme class
  const dockviewTheme = theme === 'dark' ? 'dockview-theme-dark' : 'dockview-theme-light';

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
    <div className="w-full h-full flex flex-col overflow-hidden">
      <div className="flex justify-between items-center px-4 py-1 border-b border-gray-6 bg-gray-2 shrink-0">
        <h1 className="text-sm font-semibold">Listen-Next</h1>
        <ThemeSwitcher />
      </div>
      <div className="flex-1 min-h-0">
        <DockviewReact
          className={dockviewTheme}
          components={components}
          onReady={onReady}
        />
      </div>
    </div>
  );
}

export default App;
