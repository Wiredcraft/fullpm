import React, { Component } from 'react'

import '../styles/searchBar'


const TIPS_LIST = [
  [
    { label: 'is', isPrefix: true },
    { label: 'assignee', isPrefix: true }
  ]
]

// Using contains API from dom to check whether we should hide the dropdown
export default class SearchBar extends Component {
  constructor() {
    super()
    this.toggleDropdown = ::this.toggleDropdown
    this.state = { dropdownStage: 0 }
  }

  componentDidMount() {
    document.addEventListener('click', this.toggleDropdown)
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.toggleDropdown)
  }

  addHint(label, isPrefix) {
    const dom = this.refs.searchBar
    dom.value = dom.value.trim()
    const hint = `${label}${isPrefix ? ':' : ''}`
    // TODO trigger onChange of the input when needed
    if(dom.value.indexOf(hint) === -1) {
      dom.value = `${hint} ${dom.value}`
    }
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
    const { dropdownStage } = this.state
    const hintTips = TIPS_LIST[dropdownStage]

    return (
      <span
        ref='container'
        className='searchBar'
      >
        <input
          placeholder='Filter issues by title'
          ref='searchBar'
          onChange={e => onChange ? onChange(e.target.value) : ''}
          onClick={() => this.displayDropdown()}
          type='search'
        />
        <div className='dropdown' ref='dropdown'>
          {
            hintTips.map(d => (
              <span
                className='hint'
                onClick={() => this.addHint(d.label, d.isPrefix)}
              >
                { d.label }
              </span>
            ))
          }
        </div>
      </span>
    )
  }
}
