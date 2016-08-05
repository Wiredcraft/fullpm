import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { DropTarget } from 'react-dnd'

import Issue from 'components/Issue'
import 'styles/column'
import { updateIssue } from 'actions/issueActions'


const targetSpec = {
  drop({ id }) {
    return { containerId: id }
  }
}

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  }
}

@connect(null, mapDispatchToProps)
@DropTarget('Issue', targetSpec, collect)
export default class Column extends Component {
  render() {
    const { connectDropTarget, title, issues, id } = this.props
    return connectDropTarget(
      <section className='column' id={`column${id}`}>
        <header className='header'>{ title }</header>
        <div ref='list' className='body' id={id}>
          {
            issues.map((d, i) => (
              <Issue
                key={i}
                col={this.props.id}
                id={d._id}
                name={d.title}
                number={d.number}
                ranking={d.ranking}
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
