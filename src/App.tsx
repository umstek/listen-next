import { DropZone } from ':DropZone';
import { PlayerView } from ':player/PlayerView';

function App() {
  return (
    <div id="app">
      <PlayerView />
      <DropZone></DropZone>
    </div>
  );
}

export default App;
