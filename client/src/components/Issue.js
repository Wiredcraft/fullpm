import React, { Component } from 'react'
import { DragSource, DropTarget } from 'react-dnd'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { updateIssue } from 'actions/issueActions'
import DropManager from 'helper/dropManager'
import { calcRanking } from 'helper/ranking'
import 'styles/issue'

//TODO move this to redux store
const dropManager = new DropManager()
const dragSource = {
  spec: {
    beginDrag({ id }) {
      return { id }
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
        dropManager.clearhoveringIssue()
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

const targetSpec = {
  drop({ id }) {
    dropManager.updatehoveringIssue(id)
    return undefined
  }
}

@connect(mapStateToProps, mapDispatchToProps)
@DropTarget('Issue', targetSpec, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver()
}))
@DragSource('Issue', dragSource.spec, dragSource.collect)
export default class Issue extends Component {
  render() {
    const {
      assignees,
      comments,
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
        <div>
          { assignees.map((d, i) => (
              <img key={i} src={ d.avatar_url }/>
            ))
          }
        </div>
        <span>comments: {comments}</span>
      </article>
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
