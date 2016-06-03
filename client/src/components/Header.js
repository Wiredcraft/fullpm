import React, { Component } from 'react'
import { findDOMNode } from 'react-dom'

import '../styles/header.scss'


export default class App extends Component {
  constructor() {
    super()
    this.onDefocus = ::this.onDefocus
  }

  componentDidMount() {
    ['onclick', 'click'].forEach(e =>
      document.addEventListener(e, this.onDefocus, false))
  }

  componentWillUnmount() {
    ['onclick', 'click'].forEach(e =>
      document.removeEventListener(e, this.onDefocus, false))
  }

  onDefocus(event) {
    let { style } = this.refs.dropdown
    if (findDOMNode(this.refs.button).contains(event.target)) {
      style.display = style.display === 'none' ? 'block' : 'none'
      return
    }
    style.display = 'none'
  }

  render() {
    return (
      <div className='Header row'>
        <div className="small-11 small-centered column">
          <span>Ken</span>
          <button className="dropdown button" ref='button'>Default</button>
          <ul className='drop-items' ref='dropdown'>
            <li>Default</li>
          </ul>
        </div>
      </div>
    )
  }
}
