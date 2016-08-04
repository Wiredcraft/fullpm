import React, { Component } from 'react'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'

import 'styles/app'
import Main from './Main'
import Header from './Header'
import NotFound from './NotFound'
import { isDevMode } from '../helper/dev'


class Container extends Component {
  render() {
    return (
      <div>
        { isDevMode && <Header /> }
        { this.props.children }
      </div>
    )
  }
}

export default class App extends Component {
  render() {
    return (
      <Router history={browserHistory}>
        <Route path="/" component={ Container }>
          <IndexRoute component={ Main }/>
          <Route
            path="boards/:orgName/:repoName"
            component={ Main }
          />
        </Route>
        <Route path="*" component={ NotFound } />
      </Router>
    )
  }
}
