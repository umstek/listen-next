import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';

import '@radix-ui/themes/styles.css';

import store from './store';
import App from './App';

import './index.css';
import { Theme } from '@radix-ui/themes';

const root = document.getElementById('root');
root &&
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <Provider store={store}>
        <Theme>
          <App />
        </Theme>
      </Provider>
    </React.StrictMode>,
  );
