import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { updateColumnName } from 'actions/issueActions'
import '../styles/columnConfigPopup'


@connect(null, mapDispatchToProps)
export default class ColumnConfigPopup extends Component {
  constructor() {
    super()
    this.state = { hideModal: true, isRenameMode: true }
    this.domClickHandler = ::this.domClickHandler
  }

  componentDidMount() {
    document.addEventListener('click', this.domClickHandler)
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.domClickHandler)
  }

  domClickHandler(e) {
    const { container, modal } = this.refs
    const { closePopup, columnId, switcherClassName } = this.props
    const { hideModal } = this.state

    if(hideModal) {
      if(e.target.classList.contains(switcherClassName)) {
        if(document.querySelector(`#column${columnId}`).contains(e.target)) return
      }
      if(!container.contains(e.target)) {
        closePopup()
      }
    } else {
      if(!modal.contains(e.target)) {
        this.setState({ hideModal: true })
      }
    }
  }

  showModal(isRenameMode) {
    setTimeout(() => this.setState({ hideModal: false, isRenameMode }), 5)
  }

  closeModal() {
    this.setState({ hideModal: true })
  }

  onRename() {
    const { closePopup, columnId, updateColumnName } = this.props

    const { newName } = this.refs
    const str = newName.value.trim()
    if(str === '') return
    this.closeModal()
    closePopup()
    updateColumnName(columnId, str)
  }

  render() {
    const { closePopup, hide } = this.props
    const { hideModal, isRenameMode } = this.state

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
          style={{ display: hideModal ? 'none' : 'block' }}
        >
          <div className='modal' ref='modal'>
            <div
              className='popup-switcher'
              onClick={() => this.closeModal()}
            >
              X
            </div>
            {
              isRenameMode ? (
                <div>
                  <h4>Name</h4>
                  <input type='text' ref='newName' />
                  <button onClick={() => this.onRename()}>Confirm</button>
                </div>
              ) : (
                <h4>Delete</h4>
              )
            }
          </div>
        </div>
        <div className='line' onClick={() => this.showModal(true)}>
          <p>Rename</p>
        </div>
        <div className='line' onClick={() => this.showModal(false)}>
          <p>Delete</p>
        </div>
      </div>
    )
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({ updateColumnName }, dispatch)
}
