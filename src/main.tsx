import React from 'react';
import ReactDOM from 'react-dom/client';

import '@radix-ui/themes/styles.css';
import { Theme } from '@radix-ui/themes';
import { Provider } from 'react-redux';

import './main.css';

import App from './App';
import store from './store';
import { ExplorerView } from '~modules/explorer/ExplorerView';

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
