import { Theme } from '@radix-ui/themes';
import '@radix-ui/themes/styles.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';

import { ExplorerView } from '~modules/explorer/ExplorerView';

import { IndexPrompt } from ':Dialogs/IndexPrompt';

import App from './App';
import './main.css';
import store from './store';

const root = document.getElementById('root');
root &&
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <Provider store={store}>
        <Theme accentColor="indigo" appearance="inherit" radius="large">
          <App />
          <ExplorerView />
        </Theme>
      </Provider>
    </React.StrictMode>,
  );
