import React, { Component } from 'react'

import '../styles/columnConfigPopup'


export default class ColumnConfigPopup extends Component {
  constructor() {
    super()
    this.state = { hidePopup: true }
    this.domClickHandler = ::this.domClickHandler
  }

  componentDidMount() {
    document.addEventListener('click', this.domClickHandler)
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.domClickHandler)
  }

  startRename() {
    setTimeout(() => this.setState({ hidePopup: false }), 5) 
  }

  domClickHandler(e) {
    const { container, modal } = this.refs
    const { closePopup, columnId, switcherClassName } = this.props
    const { hidePopup } = this.state

    if(hidePopup) {
      if(e.target.classList.contains(switcherClassName)) {
        if(document.querySelector(`#column${columnId}`).contains(e.target)) return
      }
      if(!container.contains(e.target)) {
        closePopup()
      }
    } else {
      if(!modal.contains(e.target)) {
        this.setState({ hidePopup: true })
      }
    }
  }

  render() {
    const { closePopup, hide } = this.props
    const { hidePopup } = this.state

    return (
      <div
        className='column-popup'
        ref='container'
        style={{ display: hide ? 'none' : '' }}
      >
        <div
          className='dropdown-switcher'
          onClick={closePopup}
        >
          X
        </div>
        <div
          className='modal-container'
          style={{ display: hidePopup ? 'none' : 'block' }}
        >
          <div className='modal' ref='modal'>
            Hello world
          </div>
        </div>
        <div className='line'>
          <p onClick={() => this.startRename()}>Rename</p>
        </div>
        <div className='line'>
          <p>Delete</p>
        </div>
      </div>
    )
  }
}
