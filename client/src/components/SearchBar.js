import React, { Component } from 'react'

import '../styles/searchBar'


export default class SearchBar extends Component {
  render() {
    const { onChange } = this.props

    return (
      <span className='searchBar'>
        <input
          placeholder='Filter issues by title'
          onChange={e => onChange ? onChange(e.target.value) : ''}
          type='search'
        />
      </span>
    )
  }
}
