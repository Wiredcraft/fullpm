import React, { Component } from 'react'

import '../styles/columnConfigPopup'


export default class ColumnConfigPopup extends Component {
  constructor() {
    super()
    this.state = { onRenaming: false }
    this.domClickHandler = ::this.domClickHandler
  }

  componentDidMount() {
    document.addEventListener('click', this.domClickHandler)
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.domClickHandler)
  }

  closePopup() {

  }

  renameHandle() {

  }

  domClickHandler(e) {
    const container = this.refs.container
    const { closePopup, columnId, switcherClassName } = this.props
    if(e.target.classList.contains(switcherClassName)) {
      if(document.querySelector(`#column${columnId}`).contains(e.target)) return
    }
    if(!container.contains(e.target)) {
      closePopup()
    }
  }

  render() {
    const { hide } = this.props
    const { onRenaming } = this.state

    return (
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
