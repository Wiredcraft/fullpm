import React, { Component } from 'react'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'

import 'normalize.css/normalize.css'
import 'styles/app'
import Main from './Main'
import NotFound from './NotFound'


class Container extends Component {
  render() {
    return (
      <div>
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
