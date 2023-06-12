import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { Player } from ':Player';
import { selectPlayerState, setUrl } from './playerSlice';

import sample from '~assets/sample-5_1.mp3';

export function PlayerView() {
  const playerState = useSelector(selectPlayerState);
  const dispatch = useDispatch();
  const [src, setSrc] = useState('');

  return (
    <div>
      <h2>
        Currently, you can only enter a URL (which must allow anonymous CORS)
      </h2>
      <p>Sample URL:</p>
      <pre>{sample}</pre>
      <input
        className="outline-none bg-gray-100 p-2 rounded-md focus:ring-1 focus:ring-p-500"
        type="text"
        value={src}
        onChange={(e) => setSrc(e.target.value)}
      />
      <button
        className="transition bg-p-500 p-2 rounded-md active:bg-p-700"
        onClick={() => dispatch(setUrl(src))}
      >
        OK
      </button>
      <Player url={playerState.url} settings metadata />
    </div>
  );
}
