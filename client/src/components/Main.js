/* global API_BASE_URL */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import request from 'superagent'
import { bindActionCreators } from 'redux'

import Board from './Board'
import '../styles/main'
import { updateUserLoginState } from 'actions/userActions'


@connect(mapStateToProps, mapDispatchToProps)
export default class Main extends Component {
  constructor() {
    super()
    this.state = { promptLogin: false }
  }

  componentWillMount() {
    // Prevent the flash of content
    setTimeout(() => this.setState({ promptLogin: true }), 700)

    const { updateUserLoginState } = this.props
    const url = `${API_BASE_URL}/auth/user`
    request
      .get(url)
      .withCredentials()
      .end((err, res) => {
        // User haven't authenticated
        if (res.status === 401) return
        if (err) return console.error(err)

        const result = JSON.parse(res.text)
        updateUserLoginState({ isLogin: true, userName: result.login })
      })
  }

  login() {
    const url = `${API_BASE_URL}/auth/github?redirect=${window.location.href}`
    window.location = url
  }

  render() {
    const { isLogin, params } = this.props
    const { promptLogin } = this.state

    return isLogin ? (<Board params={params} />) : promptLogin && (
      <div className='anonymous'>
        <div className='wrapper'>
          <h1>Sign in to FullPM</h1>
          <div className='login'>
            <p>To use <a href='https://wiredcraft.com/products/fullpm' target='_blank'>FullPM</a>, you
            first need to login with your GitHub account to allow us to display your
            issues on a board.</p>
            <button
              className='button primary'
              onClick={this.login}
            >
              Login with GitHub
            </button>
          </div>
          <p className='more'><a href='https://wiredcraft.com/products/fullpm' target='_blank'>Learn more about FullPM</a> or <a href='https://github.com/Wiredcraft/fullpm' target='_blank'>fork it on GitHub</a>.</p>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return { isLogin: state.user.get('isLogin') }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({ updateUserLoginState }, dispatch)
}
