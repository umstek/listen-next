import { PlayerView } from '~modules/player/PlayerView';

import { FileLoader } from ':FileLoader';

function App() {
  return (
    <div id="app">
      <PlayerView />
      <FileLoader></FileLoader>
    </div>
  );
}

export default App;
