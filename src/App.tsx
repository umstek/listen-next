import { PlayerView } from '~modules/player/PlayerView';
import { FileLoaderView } from '~modules/fileLoader/fileLoaderView';

function App() {
  return (
    <div id="app">
      <PlayerView />
      <FileLoaderView />
    </div>
  );
}

export default App;
