import React, { Component } from 'react'

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
      <article className='issue' onClick={ this.handleClick.bind(this) }>An Issue { this.props.id} (Column { this.props.col }) </article>
    )
  }

  handleClick () {
  }
}
