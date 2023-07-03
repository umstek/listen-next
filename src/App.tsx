import { useSelector } from 'react-redux';

import { PlayerView } from '~modules/player/PlayerView';
import { FileLoaderView } from '~modules/fileLoader/fileLoaderView';
import { selectPlaylistState } from '~modules/playlist/playlistSlice';

function App() {
  const playlistState = useSelector(selectPlaylistState);

  return (
    <div id="app">
      {playlistState.playlist.length > 0 ? <PlayerView /> : <FileLoaderView />}
    </div>
  );
}

export default App;
