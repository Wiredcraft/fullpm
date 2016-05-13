import React, { Component } from 'react'

import 'styles/Issue.scss'


export default class Issue extends Component {
  render() {
    const { name, id } = this.props

    return (
      <article className='Issue' id={id} onClick={this.handleClick.bind(this)}>
        <span className='icon'/>
        <p className='text'>
          {name}
        </p>
      </article>
    )
  }

  handleClick () {
  }
}
