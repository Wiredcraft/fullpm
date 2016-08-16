import React, { Component } from 'react'
import { connect } from 'react-redux'
import { DropTarget } from 'react-dnd'

import Issue from 'components/Issue'
import 'styles/column'
import {
  calcColumnBodyHeight,
  calcColumnBodyMaxHeight
} from '../helpers/column'
import dropManager from 'helpers/dropManager'


const dragTarget = {
  spec: {
    drop({ id }) {
      return { containerId: id }
    }
  },
  collect: function (connect, monitor) {
    return {
      connectDropTarget: connect.dropTarget(),
      isOver: monitor.isOver()
    }
  }
}

let intervalId

@connect(mapStateToProps)
@DropTarget('Issue', dragTarget.spec, dragTarget.collect)
export default class IssuesDropTarget extends Component {
  constructor() {
    super()
    this.state = { bodyHeight: 0, bodyMaxHeight: 0, forceUpdater: 0 }
  }

  componentWillMount() {
    intervalId = setInterval(() => {
      const { id, isOver, onSync } = this.props
      const { bodyHeight, bodyMaxHeight, forceUpdater } = this.state

      // Restrict column contained in page without vertical scroll
      const maxHeight = calcColumnBodyMaxHeight(id)
      if (maxHeight !== bodyMaxHeight) {
        this.setState({ bodyMaxHeight: maxHeight })
      }
      const height = calcColumnBodyHeight(id)
      if (height !== bodyHeight) {
        this.setState({ bodyHeight: height })
      }

      if (isOver || onSync) this.setState({ forceUpdater: forceUpdater + 1 })
    }, 50)
  }

  componentWillUnMount() {
    clearInterval(intervalId)
  }

  render() {
    const { connectDropTarget, isOver } = this.props
    let { issues } = this.props
    const { bodyHeight, bodyMaxHeight } = this.state
    const placeHolderAreaHeight =
      (bodyMaxHeight - bodyHeight) < 0 ? 0 : bodyMaxHeight - bodyHeight

    const { isHoveringIssue } = dropManager
    const appendToTail = isOver && (isHoveringIssue === false)

    return connectDropTarget(
      <div
        className='placeholder-area'
        style={{ height: placeHolderAreaHeight }}
      >
      {
        ((issues.length === 0 && isOver) || appendToTail) && (
          <Issue isPlaceHolder={true} />
        )
      }
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    onSync: state.issues.get('onSync')
  }
}
