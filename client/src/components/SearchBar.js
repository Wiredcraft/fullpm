// TODO: implement dropdown toggle
import React, { Component } from 'react'

import '../styles/searchBar'
import Search from 'components/icons/Search'
import View from 'components/icons/View'


export default class SearchBar extends Component {
  constructor() {
    super()

    this.domClickHandler = ::this.domClickHandler
  }

  componentDidMount() {
    document.addEventListener('click', this.domClickHandler)
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.domClickHandler)
  }

  domClickHandler(e) {
    const { container, dropdown, searchInput } = this.refs

    if(!container.contains(e.target)) {
      dropdown.style.display = 'none'
    } else {
      if(searchInput.value.trim() === '') {
        dropdown.style.display = 'block'
      }
    }
  }

  onSearchInputChange(value) {
    const { onChange } = this.props
    if(onChange) onChange(value)

    const { dropdown } = this.refs
    dropdown.style.display = value.trim() === '' ? 'block' : 'none'
  }

  render() {
    return (
      <span
        ref='container'
        className='search'
      >
        <input
          placeholder='Filter issues by title'
          ref='searchInput'
          onChange={e => this.onSearchInputChange(e.target.value)}
          type='search'
        />
        <div className='dropdown-options' ref='dropdown'>
          <div className='dropdown-menu'>
            <a>Open issues and pull requests</a>
            <a>Your issues</a>
            <a>Your pull requests</a>
            <a>Everything assigned to you</a>
            <a>Everything mentioning you</a>
            <a>
              <View />
              <b>View advanced search syntax</b>
            </a>
          </div>
        </div>
        <Search />
      </span>
    )
  }
}
