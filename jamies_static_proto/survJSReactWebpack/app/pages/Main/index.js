import React, { Component } from 'react';
import Sortable from 'sortablejs';
import Column from '../../components/Column';

import styles from '../../app.scss';
import CSSModules from 'react-css-modules';
@CSSModules(styles)
export default class Main extends Component {
  constructor (props, context) {
    super(props, context)

    let arr = [];
    let seq = 1;

    for (let i = 0; i < 4; i++) {
      arr.push(seq++)
    };

    this.state = {
      seq: seq,
      arr: arr
    }
  }

  componentDidMount () {
    Sortable.create(this.refs.list, {
      group: 'columns',
      ghostClass: 'columnGhost',
      handle: '.drag-handle',
      animation: 150
    });
  }

  render() {
    let { arr } = this.state;

    return (
      <div>
        <button className='button primary' onClick={ this.handleAddColumn.bind(this) }>Add Column</button>
        <div ref='list'>
          {
            arr.map((x) => {
              return (
                <Column key={ x } id={ x } />
              )
            })
          }
        </div>
      </div>
    )
  }

  handleAddColumn () {
    let { seq, arr } = this.state;

    arr.push(seq++);

    this.setState({
      seq: seq,
      arr: arr
    });
  }
}
