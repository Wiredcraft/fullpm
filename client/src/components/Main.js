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
    // Prevent the flash of content
    setTimeout(() => this.setState({ promptLogin: true }), 1500)
  }

  componentWillMount() {
    const { updateUserLoginState } = this.props
    const url = `${API_BASE_URL}/auth/user`
    request
      .get(url)
      .withCredentials()
      .end((err, res) => {
        if (res.status === 401) return
        if (err) {
          console.error(err)
        } else {
          const result = JSON.parse(res.text)
          updateUserLoginState({ isLogin: true, userName: result.login })
        }
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
      <div className='login'>
        <h1>Just one more thing...</h1>
        <p>To use <a href='http://fullpm.com' target='_blank'>FullPM</a>, you need first to login with your GitHub account to allow
        us to read and display your issues on a board.</p>
        <button
          className='button primary'
          onClick={() => this.login()}
        >
          Login with GitHub
        </button>
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
