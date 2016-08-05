import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { DropTarget } from 'react-dnd'

import Issue from 'components/Issue'
import 'styles/column'
import { updateIssue } from 'actions/issueActions'
import { checkIsColumnNeedScroll } from '../helper/column'


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
  constructor() {
    super()
    this.state = { needScroll: false }
  }

  componentWillMount() {
    const { id } = this.props
    setInterval(() => {
      this.setState({ needScroll: checkIsColumnNeedScroll(id) })
    }, 50)
  }

  render() {
    const { connectDropTarget, title, issues, id } = this.props
    const { needScroll } = this.state

    return connectDropTarget(
      <section className='column' id={`column${id}`}>
        <header className='header'>{ title }</header>
        <div ref='list' className='body' id={id}>
          {
            issues.map((d, i) => (
              <Issue
                key={i}
                assignees={d.assignees}
                col={this.props.id}
                comments={d.comments}
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
