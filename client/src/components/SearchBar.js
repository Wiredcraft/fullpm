import React, { Component } from 'react'

import '../styles/searchBar'
import Search from 'components/icons/Search'


export default class SearchBar extends Component {
  render() {
    const { onChange } = this.props

    return (
      <span
        ref='container'
        className='search'
      >
        <input
          placeholder='Filter issues by title'
          ref='searchBar'
          onChange={e => onChange ? onChange(e.target.value) : ''}
          type='search'
        />
        <div className='dropdown-options'>
          <div className='dropdown-menu'>
            <a>Open issues and pull requests</a>
            <a>Your issues</a>
            <a>Your pull requests</a>
            <a>Everything assigned to you</a>
            <a>Everything mentioning you</a>
            <a>
              <svg
                aria-hidden='true'
                className='icon'
                height='16'
                version='1.1'
                viewBox='0 0 12 16'
                width='12'>
                <path d='M11 10h1v3c0 .55-.45 1-1 1H1c-.55 0-1-.45-1-1V3c0-.55.45-1 1-1h3v1H1v10h10v-3zM6 2l2.25 2.25L5 7.5 6.5 9l3.25-3.25L12 8V2H6z'></path>
              </svg>
              <b>View advanced search syntax</b>
            </a>
          </div>
        </div>
        <Search />
      </span>
    )
  }
}
