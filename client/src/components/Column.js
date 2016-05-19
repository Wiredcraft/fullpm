import React, { Component } from 'react'
import Sortable from 'sortablejs'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import Issue from 'components/Issue'
import 'styles/column.scss'
import { updateIssue } from 'actions/ticketActions'

let draggingItemID

export class Column extends Component {
  componentDidMount () {
    const { updateIssue } = this.props
    Sortable.create(this.refs.list, {
      group: { name: 'issues', put: false },
      ghostClass: 'issueGhost',
      animation: 150,
      onStart: (e) => {
        draggingItemID = e.item.id
      },
      onEnd: (e) => {
        setTimeout(() => {
          const hoveredItems = document.querySelectorAll(':hover')
          const pattern = /^column[1-9]$/
          for (let i = 0; i < hoveredItems.length; i++) {
            if (pattern.test(hoveredItems[i].id)) {
              const targetID = hoveredItems[i].id.replace('column', '')
              if (targetID !== e.from.id) {
                updateIssue(draggingItemID, targetID)
              }
            }
          }
        }, 500)
      }
    })
  }

  render() {
    const { title, issues, id } = this.props
    return (
      <section
        id={`column${id}`}
        className='Column'
      >
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
