import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { DropTarget } from 'react-dnd'

import Issue from 'components/Issue'
import 'styles/column'
import { updateIssue } from 'actions/ticketActions'


const targetSpec = {
  drop({ id }) {
    return { id }
  }
}

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  }
}

@connect(mapStateToProps, mapDispatchToProps)
@DropTarget('Issue', targetSpec, collect)
export default class Column extends Component {
  render() {
    const { connectDropTarget, title, issues, id } = this.props
    return connectDropTarget(
      <section className='Column' id={`column${id}`}>
        <header className='drag-handle'>
          <span>{ title }</span>
        </header>
        <div ref='list' className='issue-list' id={id}>
          {
            issues.map((d, i) => (
              <Issue
                key={i}
                col={this.props.id}
                id={d._id}
                name={d.title}
                number={d.number}
                url={d.htmlUrl}
              />
            ))
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
  return { tickets: state.issues.get('tickets') }
}
