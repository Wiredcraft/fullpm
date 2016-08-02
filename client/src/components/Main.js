import React, { Component } from 'react'
import { connect } from 'react-redux'

import Board from './Board'


@connect(mapStateToProps)
export default class Main extends Component {
  constructor() {
    super()
    this.state = { prompt: '' }
    setTimeout(() => this.setState({ prompt: 'please login first' }), 1500)
  }

  render() {
    const { isLogin, params } = this.props
    const { prompt } = this.state

    return isLogin ? (<Board params={params}/>) : (
      <h1 style={{ textAlign: 'center' }}>
        { prompt }
      </h1>
    )
  }
}

function mapStateToProps(state) {
  return { isLogin: state.user.get('isLogin') }
}
