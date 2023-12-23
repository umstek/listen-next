import React from 'react';
import ReactDOM from 'react-dom/client';

import '@radix-ui/themes/styles.css';
import { Theme } from '@radix-ui/themes';
import { Provider } from 'react-redux';

import './main.css';

import App from './App';
import store from './store';

const root = document.getElementById('root');
root &&
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <Provider store={store}>
        <Theme accentColor="lime" appearance="inherit" radius="large">
          <App />
        </Theme>
      </Provider>
    </React.StrictMode>,
  );
