import React, { Component } from 'react'
import { DragSource } from 'react-dnd'

const cardSource = {
  beginDrag(props) {
    return {
      text: props.text
    }
  },

  endDrag(props, monitor, component) {
    const item = monitor.getItem();
    const dropResult = monitor.getDropResult();

    if (dropResult) {
      window.alert( // eslint-disable-line no-alert
        `You dropped ${item.text} into ${dropResult.name}!`
      );
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
