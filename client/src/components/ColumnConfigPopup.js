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
    const { container, header, modal } = this.refs
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
      if(!modal.contains(e.target) && !header.contains(e.target)) {
        this.setState({ hideModal: true })
        closePopup()
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
        className='dropdown-options'
        ref='container'
        style={{ display: hide ? 'none' : '' }}
      >
        { !hideModal && (
          <header
            className='dropdown-header'
            onClick={closePopup}
            ref='header'
          >
            <button
              className='button-icon'
            >
              <svg
                aria-label='Close'
                className='icon'
                height='16'
                role='img'
                version='1.1'
                viewBox='0 0 12 16'
                width='12'
              >
                <path d='M7.48 8l3.75 3.75-1.48 1.48L6 9.48l-3.75 3.75-1.48-1.48L4.52 8 .77 4.25l1.48-1.48L6 6.52l3.75-3.75 1.48 1.48z'></path>
              </svg>
            </button>
            { isRenameMode ? 'Renaming' : 'Deleting' }
          </header>
        )}
        {
          !hideModal && (isRenameMode ? (
            <div className='dropdown-body' ref='modal'>
              <label>Name</label>
              <input type='text' ref='newName' />
              <button className='button primary' onClick={() => this.onRename()}>Save</button>
            </div>
          ) : (
            <div className='dropdown-body' ref='modal'>
              <p>This action can not be undone! To confirm, please fill in the name
              of the column you are trying to delete.</p>
              <input className='danger' type='text' placeholder='Column name' />
              <button className='button danger'>Delete</button>
            </div>
          ))
        }
        { hideModal && (
          <div className='dropdown-menu'>
            <a onClick={() => this.showModal(true)}>Rename</a>
            <a className='danger' onClick={() => this.showModal(false)}>Delete</a>
          </div>
        )}
      </div>
    )
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({ updateColumnName }, dispatch)
}
