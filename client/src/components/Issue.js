import React, { Component } from 'react';

export default class Issue extends Component {
  constructor (props, context) {
    super(props, context)

    this.state = {
      secondsElapsed: 0
    }
  }

  tick () {
    this.setState({secondsElapsed: this.state.secondsElapsed + 1});
  }

  componentDidMount () {
    this.interval = setInterval(this.tick.bind(this), 1000);
  }

  componentWillUnmount () {
    clearInterval(this.interval);
  }

  render() {
    return (
      <article className='issue' onClick={ this.handleClick.bind(this) }>An Issue { this.props.id} (Column { this.props.col }) ({this.state.secondsElapsed})</article>
    )
  }

  handleClick () {
    console.log('CLICKED Issue ' + this.props.id + ' Column ' + this.props.col);
  }
}
