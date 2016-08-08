import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { DropTarget } from 'react-dnd'

import Issue from 'components/Issue'
import 'styles/column'
import { updateIssue } from 'actions/issueActions'
import { calcColumnBodyHeight } from '../helper/column'


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

@connect(mapStateToProps, mapDispatchToProps)
@DropTarget('Issue', targetSpec, collect)
export default class Column extends Component {
  constructor() {
    super()
    this.state = { bodyMaxHeight: 0 }
  }

  componentWillMount() {
    const { id } = this.props
    setInterval(() => {
      const { bodyMaxHeight } = this.state
      const newHeight = calcColumnBodyHeight(id)
      if (newHeight !== bodyMaxHeight) {
        this.setState({ bodyMaxHeight: newHeight })
      }
    }, 50)
  }

  render() {
    const { connectDropTarget, title, issues, id, isOver, onSync } = this.props
    const { bodyMaxHeight } = this.state

    const count = issues.filter(d => !d.hide).length
    return connectDropTarget(
      <section className='column' id={`column${id}`}>
        <header className='header'>{ title } <span className='count'>{ count }</span></header>
        <div
          className='body'
          id={id}
          ref='list'
          style={{ maxHeight: bodyMaxHeight }}
        >
          {
            issues.map((d, i) => (
              <Issue
                assignees={d.assignees}
                col={this.props.id}
                comments={d.comments}
                hide={d.hide}
                id={d._id}
                key={i}
                name={d.title}
                number={d.number}
                ranking={d.ranking}
                url={d.htmlUrl}
              />
            ))
          }
          {
            issues.length === 0 && isOver && (
              <Issue isPlaceHolder={true} />
            )
          }
        </div>
      </section>
    )
  }
}

function mapStateToProps(state) {
  return {
    onSync: state.issues.get('onSync')
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({ updateIssue }, dispatch)
}
