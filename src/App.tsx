import { PlayerView } from '~modules/player/PlayerView';

import { DropZone } from ':DropZone';

function App() {
  return (
    <div id="app">
      <PlayerView />
      <DropZone></DropZone>
    </div>
  );
}

export default App;
