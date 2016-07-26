import React, { Component } from 'react'

import '../styles/header'


export default class App extends Component {
  checkIsLogin() {
    return false
  }

  // TODO: provide real avatar, provide real check log in
  render() {
    const isLogin = this.checkIsLogin()

    return (
      <div className='Header row'>
        <div className='small-11 small-centered column'>
          <span className='title'>Ken</span>
          {
            !isLogin ? (
              <span className='avatar float-right'>G</span>
            ) : (
              <button className='button float-right'>Log in</button>
            )
          }
        </div>
      </div>
    )
  }
}
