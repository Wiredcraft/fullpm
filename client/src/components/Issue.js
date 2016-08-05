import React, { Component } from 'react'
import { DragSource, DropTarget } from 'react-dnd'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getEmptyImage } from 'react-dnd-html5-backend'

import { updateIssue } from 'actions/issueActions'
import DropManager from 'helper/dropManager'
import { calcRanking } from 'helper/ranking'
import 'styles/issue'

//TODO move this to redux store
const dropManager = new DropManager()
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
        dropManager.clearhoveringIssue()
      }
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

@connect(mapStateToProps, mapDispatchToProps)
@DropTarget('Issue', targetSpec, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver()
}))
@DragSource('Issue', dragSource.spec, dragSource.collect)
export default class Issue extends Component {
  componentWillMount() {
    this.props.connectDragPreview(getEmptyImage(), {
      captureDraggingState: true
    })
  }

  render() {
    const {
      assignees,
      className,
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
      <article className={`${className} issue ${isDragging ? 'dragged' : ''}`} id={id}>
        <aside className='assignees'>
          { (assignees || []).map((d, i) => (
              <img key={i} src={ d.avatar_url }/>
            ))
          }
          <span className='tooltip'> Assigned to
            { (assignees || []).map((d, i) => (
                <span key={i}>{ d.login }</span>
              ))
            }
          </span>
        </aside>
        <a className='title' href={url} target='_blank'>{ name }</a>
        <span className='meta'>
          #{ number } · {comments ? comments : 0} comment{ comments > 1 ? 's' : ''}
        </span>
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
