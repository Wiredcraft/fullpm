import React, { Component } from 'react'
import { DragSource, DropTarget } from 'react-dnd'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { updateIssue } from 'actions/issueActions'
import 'styles/issue'


const dragSource = {
  spec: {
    beginDrag({ id }) {
      return { id }
    },

    endDrag(props, monitor) {
      const item = monitor.getItem()
      const dropResult = monitor.getDropResult()
      const { updateIssue } = props

      if (dropResult) {
        updateIssue(item.id, dropResult.id)
      }
    }
  },
  collect(connect, monitor) {
    return {
      connectDragSource: connect.dragSource(),
      isDragging: monitor.isDragging()
    }
  }
}

@connect(null, mapDispatchToProps)
@DropTarget('Issue', {}, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver()
}))
@DragSource('Issue', dragSource.spec, dragSource.collect)
export default class Issue extends Component {
  render() {
    const {
      connectDragSource,
      connectDropTarget,
      id,
      isDragging,
      isOver,
      name,
      number,
      url
    } = this.props

    return connectDragSource(connectDropTarget(
      <article className={`issue ${isDragging ? 'dragged' : ''}`} id={id}>
        <a className='title' href={url} target='_blank'>{ name }</a>
        <span className='meta'>#{ number }</span>
      </article>
    ))
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({ updateIssue }, dispatch)
}
