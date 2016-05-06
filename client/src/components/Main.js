import React from 'react';
import Sortable from 'sortablejs';
import { connect } from 'react-redux'

import 'normalize.css/normalize.css'
import 'styles/App.scss'
import Column from 'components/Column'
import PouchDB from 'pouchdb'




export class AppComponent extends React.Component {
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
    const db = new PouchDB('http://localhost:5984/test')
    db.info().then(info => {
      console.log(info)
    })
    Sortable.create(this.refs.list, {
      group: 'columns',
      ghostClass: 'columnGhost',
      handle: '.drag-handle',
      animation: 150
    });
  }

  render() {
    let { arr } = this.state;
    let { value } = this.props;

    return (
      <div>
        <button
          className='button primary'
          onClick={ this.handleAddColumn.bind(this) }
        >
          Add Column
        </button>
        <p>
          From store: { value }
        </p>
        <div ref='list'>
          {
            arr.map((x, i) => {
              return (
                <Column key={ i } id={ x } />
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

function mapStateToProps(state) {
  return {
    value: state.init.get('value')
  }
}

export default connect(mapStateToProps)(AppComponent)
