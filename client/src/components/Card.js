import React, { Component } from 'react'
import { DragSource } from 'react-dnd'

const cardSource = {
  beginDrag(props) {
    return {
      text: props.text
    }
  }
}

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  }
}

class Card extends Component {
  render() {
    const { isDragging, connectDragSource, text } = this.props
    return connectDragSource(
      <div style={{ opacity: isDragging ? 0.5 : 1 }}>
        { text }
      </div>
    )
  }
}

export default DragSource('card', cardSource, collect)(Card)
