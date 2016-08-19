import React, { Component } from 'react'

import '../styles/searchBar'


export default class SearchBar extends Component {
  constructor() {
    super()
    this.toggleDropdown = ::this.toggleDropdown
  }

  componentDidMount() {
    document.addEventListener('click', this.toggleDropdown)
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.toggleDropdown)
  }

  toggleDropdown(e) {
    const container = this.refs.container
    const dropdown = this.refs.dropdown
    if(!container.contains(e.target)) {
      dropdown.style.display = 'none'
    }
  }

  displayDropdown() {
    const dom = this.refs.dropdown
    dom.style.display = 'block'
  }

  render() {
    const { onChange } = this.props

    return (
      <span
        ref='container'
        className='searchBar'
      >
        <input
          placeholder='Filter issues by title'
          onChange={e => onChange ? onChange(e.target.value) : ''}
          onClick={() => this.displayDropdown()}
          type='search'
        />
        <div className='dropdown' ref='dropdown'>
          dropdown area
        </div>
      </span>
    )
  }
}
