import React, { Component } from 'react'

import '../styles/searchBar'
import Search from 'components/icons/Search'


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
        <Search />
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
