import React from 'react'
import Sortable from 'sortablejs'
import { connect } from 'react-redux'

import 'normalize.css/normalize.css'
import 'styles/app.scss'
import 'styles/main.scss'
import Column from 'components/Column'
// import PouchDB from 'pouchdb'


export class AppComponent extends React.Component {
  constructor () {
    super()

    let initArr = [
      { id: 1, name: 'Backlog' },
      { id: 2, name: 'Doing' },
      { id: 3, name: 'Done' }
    ]
    let seq = initArr.length

    this.state = {
      seq: seq,
      arr: initArr
    }
  }

  componentDidMount () {
    // const db = new PouchDB('http://localhost:5984/test')
    Sortable.create(this.refs.list, {
      group: 'columns',
      ghostClass: 'columnGhost',
      handle: '.drag-handle',
      animation: 150
    })
  }

  render() {
    let { arr } = this.state

    return (
      <div className='AppComponent'>
        <div ref='list' className='board-area'>
          {
            arr.map((d, i) => {
              return (
                <Column key={ i } id={ d.id } title={ d.name } />
              )
            })
          }
        </div>
      </div>
    )
  }

  handleAddColumn () {
    let { seq, arr } = this.state

    arr.push(seq++)

    this.setState({
      seq: seq,
      arr: arr
    })
  }
}

function mapStateToProps(state) {
  return {
    value: state.init.get('value')
  }
}

export default connect(mapStateToProps)(AppComponent)
