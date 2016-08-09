import React, { Component } from 'react'
import { DragSource, DropTarget } from 'react-dnd'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getEmptyImage } from 'react-dnd-html5-backend'

import { updateIssue } from 'actions/issueActions'
import dropManager from 'helpers/dropManager'
import { calcRanking } from 'helpers/ranking'
import { openPage } from '../helpers/webPage'
import 'styles/issue'

const dragSource = {
  spec: {
    beginDrag(props) {
      return props
    },

    endDrag(props, monitor) {
      const item = monitor.getItem()
      const dropResult = monitor.getDropResult()
      const { updateIssue, issueList, ranking } = props
      if (dropResult) {
        const { containerId } = dropResult
        const { hoveringIssueID } = dropManager
        const newRanking =
          calcRanking(hoveringIssueID, containerId, ranking, issueList)
        updateIssue(item.id, containerId, newRanking)
        // deep copy
        dropManager.draggingItem = {
          ...JSON.parse(JSON.stringify(props)),
          ranking: newRanking
        }
        dropManager.newCol = containerId
      }
      dropManager.clearhoveringIssue()
    }
  },
  collect(connect, monitor) {
    return {
      connectDragPreview: connect.dragPreview(),
      connectDragSource: connect.dragSource(),
      isDragging: monitor.isDragging()
    }
  }
}

const targetSpec = {
  drop({ id }) {
    dropManager.updatehoveringIssue(id)
    return undefined
  }
}

let intervalId

@connect(mapStateToProps, mapDispatchToProps)
@DropTarget('Issue', targetSpec, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver()
}))
@DragSource('Issue', dragSource.spec, dragSource.collect)
export default class Issue extends Component {
  constructor() {
    super()
    this.state = { forceUpdater : 0 }
  }

  componentWillMount() {
    this.props.connectDragPreview(getEmptyImage(), {
      captureDraggingState: true
    })
    intervalId = setInterval(() => {
      if (this.props.isDragging) {
        const { forceUpdater } = this.state
        this.setState({ forceUpdater: forceUpdater + 1 })
      }
    }, 200)
  }

  componentWillUnMount() {
    clearInterval(intervalId)
  }

  componentWillUpdate(props) {
    const { id, isDragging, isOver, col } = props
    if (!this.props.isOver && isOver) {
      dropManager.col = col
      dropManager.updatehoveringIssue(id)
    }
    if (this.props.isOver && !isOver) {
      dropManager.clearhoveringIssue(id)
    }
    if (!this.refs.ticket) return
    const { offsetHeight: height } = this.refs.ticket
    if (!this.props.isDragging && isDragging && !isOver) {
      dropManager.height = height
      dropManager.col = col
    }
  }

  render() {
    const {
      assignees,
      className,
      col,
      comments,
      connectDragSource,
      connectDropTarget,
      hide,
      id,
      isDragging,
      isOver,
      isPlaceHolder,
      name,
      number,
      url
    } = this.props

    const haveNotHoverIssue = isDragging && dropManager.hoveringIssueID === undefined

    return connectDragSource(connectDropTarget(
      <div>
        {
          (((isOver || haveNotHoverIssue) && (dropManager.col === col)) || isPlaceHolder) && (
            <div
              className='placeholder'
              style={{ height: dropManager.height }}
            />
          )
        }
        {
          !(isOver && isDragging) && !(isDragging) && !isPlaceHolder && (
            <article
              className={`${className} issue ${isDragging ? 'dragged' : ''}`}
              id={id}
              ref='ticket'
              style={{ display: hide ? 'none' : 'block' }}
            >
              <aside className='assignees'>
              {
                (assignees || []).map((d, i) => (
                  <a
                    href={`https://github.com/${d.login}`}
                    target='_blank'
                    title={d.login}
                  >
                    <img key={i} src={ d.avatar_url }/>
                  </a>
                ))
              }
              </aside>
              <span
                className='title'
                onClick={() => openPage(url)}
              >
                { name }
              </span>
              <span className='meta'>
                {`#${number} · ${comments ? comments : 0} comment${comments > 1 ? 's' : ''}`}
              </span>
            </article>
          )
        }
      </div>
    ))
  }
}

function mapStateToProps(state) {
  return {
    issueList: state.issues.get('tickets')
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({ updateIssue }, dispatch)
}
