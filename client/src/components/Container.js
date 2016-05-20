import React, { Component } from 'react'
import { DropTarget } from 'react-dnd'

const targetSpec = {
}

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  }
}

class Container extends Component {
  render() {
    const { connectDropTarget, isOver } = this.props
    return connectDropTarget(
      <div style={{ width: '500px', height: '500px', background: !isOver ? '#363636' : '#fff' }}>
      </div>
    )
  }
}


export default DropTarget('card', targetSpec, collect)(Container)
