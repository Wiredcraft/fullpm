import React, { Component } from 'react'

import Gear from 'components/icons/Gear'


export default class BoardSetting extends Component {
  constructor() {
    super()
    this.state = { hideDropdown: true }

    this.domClickHandler = ::this.domClickHandler
  }

  componentDidMount() {
    document.addEventListener('click', this.domClickHandler)
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.domClickHandler)
  }

  domClickHandler(e) {
    const { container } = this.refs
    const { hideDropdown } = this.state

    if(!container.contains(e.target) && !hideDropdown) {
      this.setState({ hideDropdown: true })
    }
  }

  toggleDropdown() {
    const { hideDropdown } = this.state

    this.setState({ hideDropdown: !hideDropdown })
  }

  render() {
    const { hideDropdown } = this.state

    return (
      <span className='dropdown' ref='container'>
        <button
          className='button small'
          onClick={() => this.toggleDropdown()}
        >
          <Gear />
        </button>
        <div
          className='dropdown-options'
          style={{ display: hideDropdown ? 'none' : 'block' }}
        >
          <div className='dropdown-menu'>
            <a>Add a column</a>
            <a>Board settings</a>
          </div>
        </div>
      </span>
    )
  }
}
