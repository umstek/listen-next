import { Temporal, toTemporalInstant } from '@js-temporal/polyfill';
import { Theme } from '@radix-ui/themes';
import '@radix-ui/themes/styles.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';

import { useThemePreference } from ':ThemeSwitcher';
import App from './App';
import './main.css';
import store from './store';

declare global {
  interface Date {
    toTemporalInstant(): Temporal.Instant;
  }
}

Date.prototype.toTemporalInstant = toTemporalInstant;

function ThemedApp() {
  const [theme] = useThemePreference();

  const appearance = theme === 'auto' ? 'inherit' : theme;

  return (
    <Theme
      className="w-full h-full"
      accentColor="indigo"
      appearance={appearance}
      radius="large"
    >
      <App />
    </Theme>
  );
}

const root = document.getElementById('root');
root &&
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <Provider store={store}>
        <ThemedApp />
      </Provider>
    </React.StrictMode>,
  );
