import { type Temporal, toTemporalInstant } from '@js-temporal/polyfill';
import { Theme } from '@radix-ui/themes';
import '@radix-ui/themes/styles.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';

import App from './App';
import './main.css';
import store from './store';

declare global {
  interface Date {
    toTemporalInstant(): Temporal.Instant;
  }
}

Date.prototype.toTemporalInstant = toTemporalInstant;

const root = document.getElementById('root');
root &&
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <Provider store={store}>
        <Theme
          className="h-full w-full"
          accentColor="indigo"
          appearance="inherit"
          radius="large"
        >
          <App />
        </Theme>
      </Provider>
    </React.StrictMode>,
  );
