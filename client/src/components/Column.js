import React, { Component } from 'react'
import Sortable from 'sortablejs'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import Issue from 'components/Issue'
import 'styles/column.scss'
import { updateIssue } from 'actions'

export class Column extends Component {
  componentDidMount () {
    const { updateIssue } = this.props

    Sortable.create(this.refs.list, {
      group: 'issues',
      ghostClass: 'issueGhost',
      animation: 150,
      // onEnd, onAdd, onRemove
      onAdd: (e) => {
        if (e.item.id) {
          updateIssue(e.item.id, e.to.id)
        }
      }
    })
  }

  render() {
    const { title, issues, id } = this.props
    return (
      <section className='Column'>
        <header className='drag-handle'>
          <span>{title}</span>
        </header>
        <div ref='list' className='issue-list' id={id}>
          {
            issues.map((d, i) => {
              return (
                <Issue key={i} col={this.props.id} id={d._id} name={d.title} />
              )
            })
          }
        </div>
      </section>
    )
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({ updateIssue }, dispatch)
}

function mapStateToProps(state) {
  return {
    tickets: state.issues.get('tickets')
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Column)
