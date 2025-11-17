import { type Temporal, toTemporalInstant } from '@js-temporal/polyfill'

import { useThemePreference } from ':ThemeSwitcher'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import App from './App'
import './main.css'
import store from './store'

declare global {
  interface Date {
    toTemporalInstant(): Temporal.Instant
  }
}

Date.prototype.toTemporalInstant = toTemporalInstant

function ThemedApp() {
  const [theme] = useThemePreference()

  React.useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')

    if (theme === 'auto') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light'
      root.classList.add(systemTheme)
    } else {
      root.classList.add(theme)
    }
  }, [theme])

  return (
    <div className="w-full h-full">
      <App />
    </div>
  )
}

const root = document.getElementById('root')
root &&
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <Provider store={store}>
        <ThemedApp />
      </Provider>
    </React.StrictMode>,
  )
