import React, { Component } from 'react'

import 'styles/ProgressBar'

export default class ProgressBar extends Component {
  render() {
    const { hide } = this.props
    console.log(hide);
    const display = hide ? 'none' : 'block'
    return (
      <div className='ProgressBar' style={{ display }}>
        <div className='progrss' />
      </div>
    )
  }
}
