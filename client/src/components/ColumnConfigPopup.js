import React, { Component } from 'react'

import '../styles/columnConfigPopup'


export default class ColumnConfigPopup extends Component {
  constructor() {
    super()
    this.state = { onRenaming: false }
  }

  closePopup() {

  }

  renameHandle() {

  }

  render() {
    const { hide } = this.props
    const { onRenaming } = this.state

    return (
      <div className='column-popup' style={{ display: hide ? 'none' : '' }}>
        <div className='line'>
        {
          onRenaming ? (
            <input type='text' />
          ) : (
            <p>Rename</p>
          )
        }
        </div>
        <div className='line'>
          <p>Delete</p>
        </div>
      </div>
    )
  }
}
