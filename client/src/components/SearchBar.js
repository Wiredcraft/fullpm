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
        <Search />
      </span>
    )
  }
}
