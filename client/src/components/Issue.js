import React, { Component } from 'react'
import { DragSource } from 'react-dnd'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { updateIssue } from 'actions/ticketActions'
import 'styles/Issue'

const source = {
  beginDrag({ id }) {
    return {
      id
    }
  },

  endDrag(props, monitor) {
    const item = monitor.getItem()
    const dropResult = monitor.getDropResult()
    const { updateIssue } = props

    if (dropResult) {
      updateIssue(item.id, dropResult.id)
    }
  }
}

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  }
}

@connect(null, mapDispatchToProps)
@DragSource('Issue', source, collect)
export default class Issue extends Component {
  render() {
    const { url, name, id, connectDragSource } = this.props

    return connectDragSource(
      <article className='Issue' id={id}>
        <span className='icon'/>
        <a className='text' href={url}>
          { name }
        </a>
      </article>
    )
  }

  handleClick () {
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({ updateIssue }, dispatch)
}
