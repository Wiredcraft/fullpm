import React from 'react';
import Sortable from 'sortablejs';

import 'normalize.css/normalize.css'
import 'styles/App.scss'
import Column from 'components/Column'


export default class AppComponent extends React.Component {
  constructor (props, context) {
    super(props, context)

    let arr = [];
    let seq = 1;

    for (let i = 0; i < 4; i++) {
      arr.push(seq++)
    }

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
