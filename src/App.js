import React from 'react'
import { Provider } from 'react-redux'
import { HashRouter } from 'react-router-dom'

import store from './store'
import Router from './router'

const App = () => {
  console.log('App')
  return (
    <React.StrictMode>
      <Provider store={store}>
        <HashRouter>
          <Router />
        </HashRouter>
      </Provider>
    </React.StrictMode>
  )
}

export default App
