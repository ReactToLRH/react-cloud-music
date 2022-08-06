import React, { Suspense } from 'react'
import { Provider } from 'react-redux'
import { HashRouter } from 'react-router-dom'

import ResetCss from '@/assets/styles/reset-css'
import IconStyle from '@/assets/iconfont/iconfont'

import store from './store'
import Router from './router'

const App = () => (
  <Provider store={store}>
    <HashRouter>
      <ResetCss />
      <IconStyle />
      <Suspense fallback={null}>
        <Router />
      </Suspense>
    </HashRouter>
  </Provider>
)

export default App
