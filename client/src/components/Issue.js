import React, { Component } from 'react'

import 'styles/Issue.scss'


export default class Issue extends Component {
  render() {
    const { name } = this.props

    return (
      <article className='Issue' onClick={ this.handleClick.bind(this) }>
        <span className='icon'/>
        <p className='text'>
          { name }
        </p>
      </article>
    )
  }

  handleClick () {
  }
}
