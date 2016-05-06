import React, { Component } from 'react'
import Sortable from 'sortablejs'

import Issue from 'components/Issue'
import 'styles/column.scss'


export default class Column extends Component {
  constructor () {
    super()
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
    const { title, issues } = this.props

    return (
      <section className='Column'>
        <header className='drag-handle'>
          <span>{ title }</span>
        </header>
        <div ref='list' className='issue-list'>
          {
            issues.map((d, i) => {
              return (
                <Issue key={ i } col={ this.props.id } id={ d.x } name={ d.title } />
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
