import React, { Component } from 'react'

import '../styles/header'
import request from 'superagent'

export default class App extends Component {
  constructor() {
    super()
    this.state = { isLogin: false, userName: '' }
  }

  componentWillMount() {
    const url = `${API_BASE_URL}/auth/user`
    request
      .get(url)
      .withCredentials()
      .end((err, res) => {
        if (err) {
          console.error(err);
        } else {
          const result = JSON.parse(res.text)
          this.setState({ isLogin: true, userName: result.login })
        }
      })
  }

  // TODO: provide real avatar, provide real check log in
  render() {
    const { isLogin, userName } = this.state

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
              <button className='button float-right'>Log in</button>
            )
          }
        </div>
      </div>
    )
  }
}
