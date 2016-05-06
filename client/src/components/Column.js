import React, { Component } from 'react'
import Sortable from 'sortablejs'

import Issue from 'components/Issue'
import 'styles/column.scss'


export default class Column extends Component {
  constructor () {
    super()

    let arr = [0, 1, 2, 3, 4]

    this.state = {
      arr: arr
    }
  }

  componentDidMount () {
    Sortable.create(this.refs.list, {
      group: 'issues',
      ghostClass: 'issueGhost',
      animation: 150,
      onStart: (e) => { console.log('onStart', e) },
      onEnd: (e) => { console.log('onEnd', e) },
      onAdd: (e) => { console.log('onAdd', e) },
      onRemove: (e) => { console.log('onRemove', e) }
    })
  }

  render() {
    const { arr } = this.state
    const { title } = this.props

    return (
      <section className='Column'>
        <header className='drag-handle'>
          <span>{ title }</span>
        </header>
        <div ref='list'>
          {
            arr.map((x) => {
              return (
                <Issue key={ x } col={ this.props.id } id={ x } />
              )
            })
          }
        </div>
      </section>
    )
  }

  handleAddIssue () {

  }
}
