import React from 'react'
import Sortable from 'sortablejs'
import { connect } from 'react-redux'

import 'normalize.css/normalize.css'
import 'styles/app.scss'
import 'styles/main.scss'
import Column from 'components/Column'
import PouchDB from 'pouchdb'
const kenhqDb = new PouchDB('kenhq_meta')

export class AppComponent extends React.Component {
  constructor () {
    super()

    const initArr = [
      { id: 1, name: 'Backlog', issues: [] },
      { id: 2, name: 'Doing', issues: [] },
      { id: 3, name: 'Done', issues: [] }
    ]

    this.state = { arr: initArr }
  }

  componentWillMount () {
    const { arr } = this.state
    let data = []
    PouchDB.sync('kenhq_meta', 'http://localhost:3000/proxy/meta').then(() => {
      kenhqDb.allDocs({include_docs: true}).then(res => {
        data = res.rows.map(d => d.doc)
        arr[0].issues = data
        this.setState(arr)
      })
    })
  }

  componentDidMount () {
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
                <Column key={ i } id={ d.id } title={ d.name } issues={ d.issues } />
              )
            })
          }
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    value: state.init.get('value')
  }
}

export default connect(mapStateToProps)(AppComponent)
