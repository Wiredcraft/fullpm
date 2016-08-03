/* global API_BASE_URL */
import React, { Component } from 'react'
import { connect } from 'react-redux'

import '../styles/header'


@connect(mapStateToProps)
export default class App extends Component {
  login() {
    const url = `${API_BASE_URL}/auth/github?redirect=${window.location.href}`
    window.location = url
  }

  render() {
    const { isLogin, userName } = this.props

    return (
      <div className='Header row'>
        <div className='small-11 small-centered column'>
          <span className='title'>Ken</span>
          {
            isLogin ? (
              <span className='avatar float-right'>
                { userName.length > 0 ? userName[0] : 'K' }
              </span>
            ) : (
              <button
                className='button float-right'
                onClick={() => this.login()}
              >
                Log in
              </button>
            )
          }
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    isLogin: state.user.get('isLogin'),
    userName: state.user.get('userName')
  }
}
