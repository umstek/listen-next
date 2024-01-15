import { Button, Container } from '@radix-ui/themes';
import { useState } from 'react';
import { useSelector } from 'react-redux';

import { FileLoaderView } from '~modules/fileLoader/FileLoaderView';
import { PlayerView } from '~modules/player/PlayerView';
import { selectPlaylistState } from '~modules/playlist/playlistSlice';

import { IndexPrompt } from ':Dialogs/IndexPrompt';
import { Task } from ':Tasks/Task';

function App() {
  const playlistState = useSelector(selectPlaylistState);
  const [show, onShow] = useState(false);

  return (
    <Container size="4" id="app">
      <Button variant="solid" onClick={() => onShow(!show)} />
      <IndexPrompt open={show} onOpenChange={() => onShow(!show)} />
      <Task progress={Math.floor(Math.random() * 100)} />
      {playlistState.playlist.length > 0 ? <PlayerView /> : <FileLoaderView />}
    </Container>
  );
}

export default App;
