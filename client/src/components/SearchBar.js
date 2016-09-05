import React, { Component } from 'react'

import '../styles/searchBar'


const TIPS_LIST = [
  [
    { label: 'is', isPrefix: true },
    { label: 'assignee', isPrefix: true }
  ]
]

export default class SearchBar extends Component {
  constructor() {
    super()
    this.domClickHandler = ::this.domClickHandler

    // There should be some further instuction in stage 1,
    // Such as "pr", "issue" for "is:", user names for "assignee:".
    this.state = { dropdownStage: 0 }
  }

  componentDidMount() {
    document.addEventListener('click', this.domClickHandler)
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.domClickHandler)
  }

  addHint(label, isPrefix) {
    const { onChange } = this.props

    const dom = this.refs.searchBar
    dom.value = dom.value.trim()
    const hint = `${label}${isPrefix ? ':' : ''}`

    // The hint already exist in search area.
    if(dom.value.indexOf(hint) !== -1) return

    dom.value = `${hint} ${dom.value}`
    onChange(dom.value)
  }

  domClickHandler(e) {
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
        className='search'
      >
        <input
          placeholder='Filter issues by title'
          ref='searchBar'
          onChange={e => onChange ? onChange(e.target.value) : ''}
          onClick={() => this.displayDropdown()}
          type='search'
        />
        <svg aria-hidden='true'
          className='icon'
          height='16'
          version='1.1'
          viewBox='0 0 16 16'
          width='16'
        >
          <path d='M15.7 13.3l-3.81-3.83A5.93 5.93 0 0 0 13 6c0-3.31-2.69-6-6-6S1 2.69 1 6s2.69 6 6 6c1.3 0 2.48-.41 3.47-1.11l3.83 3.81c.19.2.45.3.7.3.25 0 .52-.09.7-.3a.996.996 0 0 0 0-1.41v.01zM7 10.7c-2.59 0-4.7-2.11-4.7-4.7 0-2.59 2.11-4.7 4.7-4.7 2.59 0 4.7 2.11 4.7 4.7 0 2.59-2.11 4.7-4.7 4.7z'></path>
        </svg>
        <div className='dropdown' ref='dropdown'>
          {
            hintTips.map((d, i) => (
              <span
                className='hint'
                key={i}
                onClick={() => this.addHint(d.label, d.isPrefix)}
              >
                { d.label }
              </span>
            ))
          }
          <a
            className='link'
            target='_blank'
            href='https://help.github.com/articles/searching-issues/'
          >
            View the search syntax at Github
          </a>
        </div>
      </span>
    )
  }
}
