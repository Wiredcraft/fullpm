import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { updateColumnName } from 'actions/issueActions'
import Close from 'components/icons/Close'
import '../styles/columnConfigPopup'


@connect(null, mapDispatchToProps)
export default class ColumnConfigPopup extends Component {
  constructor() {
    super()
    this.state = { hideSettingPopup: true, isRenameMode: true }
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
    const { hideSettingPopup } = this.state

    if(hideSettingPopup) {
      if(e.target.classList.contains(switcherClassName)) {
        if(document.querySelector(`#column${columnId}`).contains(e.target))
          return
      }
      if(!container.contains(e.target)) closePopup()
    } else {
      if(!modal.contains(e.target) && !header.contains(e.target)) {
        this.closeSettingPopup()
      }
    }
  }

  showModal(isRenameMode) {
    setTimeout(() => this.setState({ hideSettingPopup: false, isRenameMode }), 5)
  }

  closeSettingPopup() {
    const { closePopup } = this.props

    this.setState({ hideSettingPopup: true })
    closePopup()
  }

  onRename() {
    const { columnId, updateColumnName } = this.props

    const { newName } = this.refs
    const str = newName.value.trim()
    if(str === '') return
    this.closeSettingPopup()
    updateColumnName(columnId, str)
  }

  render() {
    const { closePopup, hide } = this.props
    const { hideSettingPopup, isRenameMode } = this.state

    return (
      <div
        className='dropdown-options'
        ref='container'
        style={{ display: hide ? 'none' : '' }}
      >
        { !hideSettingPopup && (
          <header
            className='dropdown-header'
            onClick={closePopup}
            ref='header'
          >
            <button className='button-icon'>
              <Gear />
            </button>
            { isRenameMode ? 'Renaming' : 'Deleting' }
          </header>
        )}
        {
          !hideSettingPopup && (isRenameMode ? (
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
        { hideSettingPopup && (
          <div className='dropdown-menu'>
            <a onClick={() => this.showModal(true)}>Rename</a>
          <a className='danger' onClick={() => this.showModal(false)}>ZHIDelete</a>
          </div>
        )}
      </div>
    )
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({ updateColumnName }, dispatch)
}
