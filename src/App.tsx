import { Button, Container } from '@radix-ui/themes';
import {
  DockviewReact,
  DockviewReadyEvent,
  IDockviewPanelProps,
} from 'dockview';
import { useState } from 'react';
import { useSelector } from 'react-redux';

import { ExplorerView } from '~modules/explorer/ExplorerView';
import { FileLoaderView } from '~modules/fileLoader/FileLoaderView';
import { PlayerView } from '~modules/player/PlayerView';
import { selectPlaylistState } from '~modules/playlist/playlistSlice';

import { IndexPrompt } from ':Dialogs/IndexPrompt';
import { Task } from ':Tasks/Task';

const components = {
  explorer: (props: IDockviewPanelProps<{ title: string }>) => {
    return <ExplorerView />;
  },
  fileLoader: (props: IDockviewPanelProps<{ title: string }>) => {
    return <FileLoaderView />;
  },
  empty: (props: IDockviewPanelProps<{ title: string }>) => {
    return <div className="w-full h-full">Empty</div>;
  },
};

function App() {
  const playlistState = useSelector(selectPlaylistState);
  const [show, onShow] = useState(false);

  const onReady = (event: DockviewReadyEvent) => {
    const explorerPanel = event.api.addPanel({
      id: 'explorer',
      component: 'explorer',
      title: 'Explorer',
    });

    const fileLoaderPanel = event.api.addPanel({
      id: 'fileLoader',
      component: 'fileLoader',
      title: 'File Loader',
      position: { referencePanel: 'explorer' },
    });

    const emptyPanel = event.api.addPanel({
      id: 'empty',
      component: 'empty',
      title: 'Empty',
      position: { referencePanel: 'explorer' },
    });

    explorerPanel.api.setActive();
  };

  return <DockviewReact className='dockview-theme-light' components={components} onReady={onReady} />;

  return (
    <Container size="4" id="app">
      <Button variant="solid" onClick={() => onShow(!show)} />
      <IndexPrompt open={show} onOpenChange={() => onShow(!show)} />
      <Task
        id="1"
        display="Copying and indexing files..."
        partsCount={10}
        partsDone={3}
        status="paused"
        onPause={() => {
          console.log('paused');
        }}
        onAbort={() => {
          console.log('aborted');
        }}
      />
      {playlistState.playlist.length > 0 ? <PlayerView /> : <FileLoaderView />}
    </Container>
  );
}

export default App;
