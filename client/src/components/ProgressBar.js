import React, { Component } from 'react'

import 'styles/progressBar'


export default class ProgressBar extends Component {
  render() {
    const { hide } = this.props
    const display = hide ? 'none' : 'block'
    return (
      <div className='loader' style={{ display }}></div>
    )
  }
}
