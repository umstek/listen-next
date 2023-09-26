import { useSelector } from 'react-redux';

import { PlayerView } from '~modules/player/PlayerView';
import { FileLoaderView } from '~modules/fileLoader/fileLoaderView';
import { selectPlaylistState } from '~modules/playlist/playlistSlice';
import { Container } from '@radix-ui/themes';

function App() {
  const playlistState = useSelector(selectPlaylistState);

  return (
    <Container size="4" id="app">
      {playlistState.playlist.length > 0 ? <PlayerView /> : <FileLoaderView />}
    </Container>
  );
}

export default App;
