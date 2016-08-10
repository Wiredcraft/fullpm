import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import 'normalize.css/normalize.css'
import 'styles/app'
import Routes from './components/Routes'
import store from 'stores'


ReactDOM.render((
  <Provider store={store}>
    <Routes />
  </Provider>
), document.getElementById('app'))
