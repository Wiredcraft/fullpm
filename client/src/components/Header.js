import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import '../styles/header'
import request from 'superagent'
import { updateUserLoginState } from 'actions/userActions'


@connect(mapStateToProps, mapDispatchToProps)
export default class App extends Component {
  constructor() {
    super()
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

function mapDispatchToProps (dispatch) {
  return bindActionCreators({ updateUserLoginState }, dispatch)
}

function mapStateToProps(state) {
  return {
    isLogin: state.user.get('isLogin'),
    userName: state.user.get('userName')
  }
}
