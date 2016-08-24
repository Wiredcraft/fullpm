import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { deleteColumn, updateColumnName } from 'actions/issueActions'
import Close from 'components/icons/Close'
import '../styles/columnConfigPopup'


@connect(mapStateToProps, mapDispatchToProps)
export default class ColumnConfigPopup extends Component {
  constructor() {
    super()
    this.state = {
      deletingConfirmed: false,
      hideSettingPopup: true,
      isRenameMode: true
    }
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

  checkDeleting() {
    const { columnName } = this.refs
    const { columnId, tickets } = this.props
    const { deletingConfirmed } = this.state

    const columnRealName = tickets[columnId].name
    if(columnRealName.toLowerCase() === columnName.value.toLowerCase()) {
      this.setState({ deletingConfirmed: true })
    } else {
      if(deletingConfirmed) this.setState({ deletingConfirmed: false })
    }
  }

  onDelete() {
    const { columnId, deleteColumn } = this.props

    this.closeSettingPopup()
    deleteColumn(columnId)
  }

  render() {
    const { closePopup, hide } = this.props
    const { deletingConfirmed, hideSettingPopup, isRenameMode } = this.state

    return (
      <div
        className='dropdown-options'
        ref='container'
        style={{ display: hide ? 'none' : '' }}
      >
        { hideSettingPopup && (
          <div className='dropdown-menu'>
            <a onClick={() => this.showModal(true)}>Rename</a>
            <a className='danger' onClick={() => this.showModal(false)}>Delete</a>
          </div>
        )}
        { !hideSettingPopup && (
          <header
            className='dropdown-header'
            onClick={closePopup}
            ref='header'
          >
            <button className='button-icon'>
              <Close />
            </button>
            { isRenameMode ? 'Rename' : 'Delete' }
          </header>
        )}
        {
          !hideSettingPopup && (isRenameMode ? (
            <div className='dropdown-body' ref='modal'>
              <div className='field'>
                <label>Name</label>
                <input type='text' ref='newName'/>
              </div>
              <button
                className='button primary'
                onClick={() => this.onRename()}
              >
                Rename
              </button>
            </div>
          ) : (
            <div className='dropdown-body' ref='modal'>
              <p><b>This action can not be undone!</b> Type in the name of the column to
              confirm.</p>
              <div className='field'>
                <input
                  className='danger'
                  onChange={() => this.checkDeleting()}
                  placeholder='Column name'
                  ref='columnName'
                  type='text'
                />
              </div>
              <button
                className='button danger'
                style={{ cursor: deletingConfirmed ? '' : 'not-allowed' }}
                disabled={!deletingConfirmed}
                onClick={() => this.onDelete()}
              >
                Delete this column
              </button>
            </div>
          ))
        }
      </div>
    )
  }
}

function mapStateToProps(state) {
  const tickets = state.issues.get('tickets')

  return { tickets }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({ updateColumnName, deleteColumn }, dispatch)
}
