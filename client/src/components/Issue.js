import React, { Component } from 'react'

import 'styles/Issue.scss'


export default class Issue extends Component {
  constructor () {
    super()

    this.state = {
      secondsElapsed: 0
    }
  }

  componentDidMount () {
  }

  componentWillUnmount () {
  }

  render() {
    return (
      <article className='Issue' onClick={ this.handleClick.bind(this) }>An Issue { this.props.id} (Column { this.props.col }) </article>
    )
  }

  handleClick () {
  }
}
