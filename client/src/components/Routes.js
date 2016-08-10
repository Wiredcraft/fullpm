import React, { Component } from 'react'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'


import Main from './Main'
import NotFound from './NotFound'

export default class App extends Component {
  render() {
    return (
      <Router history={browserHistory}>
        <Route path="/">
          <IndexRoute component={ Main }/>
          <Route
            path="boards/:userName/:repoName"
            component={ Main }
          />
        </Route>
        <Route path="*" component={ NotFound } />
      </Router>
    )
  }
}
