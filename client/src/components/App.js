import React, { Component } from 'react'

import 'styles/App'
import 'styles/Issue'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import Main from './Main'
import Header from './Header'
import NotFound from './NotFound'


class Container extends Component {
  render() {
    const { children } = this.props
    return (
      <div>
        <Header />
        { children }
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
