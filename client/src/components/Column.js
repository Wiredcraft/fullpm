import React, { Component } from 'react'
import { connect } from 'react-redux'
import { DragSource, DropTarget } from 'react-dnd'

import Issue from 'components/Issue'
import 'styles/column'
import {
  calcColumnBodyHeight,
  calcColumnBodyMaxHeight
} from '../helpers/column'
import dropManager from 'helpers/dropManager'
import { spliceIssueInSync } from 'helpers/tickets'


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

const dragSource = {
  spec: {
    beginDrag(props) {
      return props
    },
    endDrag(props, monitor) {

    }
  },
  collect(connect, monitor) {
    return {
      connectDragSource: connect.dragSource(),
      isDragging: monitor.isDragging()
    }
  }
}

let intervalId

@connect(mapStateToProps)
@DropTarget('Issue', dragTarget.spec, dragTarget.collect)
@DragSource('Column', dragSource.spec, dragSource.collect)
export default class Column extends Component {
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
    const {
      connectDragSource,
      connectDropTarget,
      id,
      isOver,
      onSync,
      title
    } = this.props
    let { issues } = this.props
    const { bodyHeight, bodyMaxHeight } = this.state
    const { draggingItem, isHoveringIssue } = dropManager
    const placeHolderAreaHeight =
      (bodyMaxHeight - bodyHeight) < 0 ? 0 : bodyMaxHeight - bodyHeight

    const needClone = draggingItem && onSync
    const hasNewItemInSync = needClone && (id === dropManager.newCol)
    issues = spliceIssueInSync(hasNewItemInSync, issues, draggingItem)

    let count = issues.filter(d => !d.hide).length
    if (needClone) {
      const { col, newCol } = draggingItem
      const dropedToNewColumn = (col === id) && (newCol !== col)
      const dropedToSameColumn = newCol === col === id
      if (dropedToNewColumn || dropedToSameColumn) count -= 1
    }

    const appendToTail = isOver && (isHoveringIssue === false)

    return connectDragSource(
      <section className='column' id={`column${id}`}>
        <header className='header'>
          { title } <span className='count'>{ count }</span>
        </header>
        <div
          className='container'
          style={{ maxHeight: bodyMaxHeight, minHeight: bodyMaxHeight }}
        >
          <div className='body' >
          {
            issues.map((d, i) => {
              if (draggingItem && onSync && (d._id === draggingItem.id)) {
                return undefined
              }
              return (
                <Issue
                  assignees={d.assignees}
                  col={id}
                  comments={d.comments}
                  hide={d.hide}
                  id={d.id}
                  isPullRequest={d.isPullRequest}
                  key={i}
                  name={d.title || d.name}
                  number={d.number}
                  ranking={d.ranking}
                  url={d.htmlUrl || d.url}
                />
              )
            })
          }
          </div>
          {
            connectDropTarget(
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
