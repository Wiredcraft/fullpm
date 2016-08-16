import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { DragSource, DropTarget } from 'react-dnd'

import { updateColumnRanking } from 'actions/issueActions'
import Issue from 'components/Issue'
import 'styles/column'
import { calcColumnBodyMaxHeight } from '../helpers/column'
import dropManager from 'helpers/dropManager'
import { spliceIssueInSync } from 'helpers/tickets'
import IssuesDropTarget from './IssuesDropTarget'
import { calcColumnRanking } from 'helpers/ranking'


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
      dropManager.draggingColumnId = props.id
      dropManager.isDraggingColumn = true
      return props
    },
    endDrag() {
      dropManager.draggingColumnId = undefined
      dropManager.isDraggingColumn = false
      // The magic number here shall be larger than count of columns
      dropManager.draggingFinished = 5
    }
  },
  collect(connect) {
    return {
      connectDragSource: connect.dragSource()
    }
  }
}

let intervalId

@connect(mapStateToProps, mapDispatchToProps)
@DragSource('Column', dragSource.spec, dragSource.collect)
@DropTarget('Column', dragTarget.spec, dragTarget.collect)
export default class Column extends Component {
  constructor() {
    super()
    this.state = { bodyMaxHeight: 0, forceUpdater: 0 }
  }

  componentWillMount() {
    intervalId = setInterval(() => {
      const { id, isDragging, isOver, onSync } = this.props
      const { bodyMaxHeight, forceUpdater } = this.state

      // Restrict column contained in page without vertical scroll
      const maxHeight = calcColumnBodyMaxHeight(id)
      if (maxHeight !== bodyMaxHeight) {
        this.setState({ bodyMaxHeight: maxHeight })
      }

      if (isDragging || isOver || onSync)
        this.setState({ forceUpdater: forceUpdater + 1 })
      if (dropManager.draggingFinished) {
        this.setState({ forceUpdater: forceUpdater + 1 })
        dropManager.draggingFinished--
      }
    }, 50)
  }

  componentWillUpdate(props) {
    const { id, isOver, tickets, updateColumnRanking } = props
    if (dropManager.draggingColumnId === id) return
    if (dropManager.lastHoverdColumnId === id) return
    if (!this.props.isOver && isOver) {
      dropManager.lastHoverdColumnId = id
      const newRanking = calcColumnRanking(tickets, id)
      updateColumnRanking(dropManager.draggingColumnId, newRanking)
    }
  }

  componentWillUnMount() {
    clearInterval(intervalId)
  }

  render() {
    const {
      connectDragSource,
      connectDropTarget,
      id,
      onSync,
      title
    } = this.props
    let { issues } = this.props

    const { bodyMaxHeight } = this.state
    const { draggingItem } = dropManager

    const needClone = draggingItem && onSync
    const hasNewItemInSync = needClone && (id === dropManager.newCol)
    issues = spliceIssueInSync(hasNewItemInSync, issues, draggingItem)
    const isDragging = dropManager.draggingColumnId === id

    let count = issues.filter(d => !d.hide).length
    if (needClone) {
      const { col, newCol } = draggingItem
      const dropedToNewColumn = (col === id) && (newCol !== col)
      const dropedToSameColumn = newCol === col === id
      if (dropedToNewColumn || dropedToSameColumn) count -= 1
    }

    return connectDropTarget(connectDragSource(
      <section className='column' id={`column${id}`}>
        <div
          className='col-placeholder'
          style={{ display: isDragging ? 'block' : '' }}
        />
        <header className='header'>
          { title } <span className='count'>{ count }</span>
        </header>
        <div
          className='container'
          style={{ maxHeight: bodyMaxHeight, minHeight: bodyMaxHeight }}
        >
          <div className='body'>
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
          <IssuesDropTarget id={id} issues={issues} />
        </div>
      </section>
    ))
  }
}

function mapStateToProps(state) {
  return {
    onSync: state.issues.get('onSync')
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({ updateColumnRanking }, dispatch)
}
