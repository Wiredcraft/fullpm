import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { DropTarget } from 'react-dnd'

import Issue from 'components/Issue'
import 'styles/column'
import { updateIssue } from 'actions/issueActions'
import { calcColumnBodyHeight } from '../helpers/column'
import dropManager from 'helpers/dropManager'

const targetSpec = {
  drop({ id }) {
    return { containerId: id }
  }
}

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  }
}

let intervalId

@connect(mapStateToProps, mapDispatchToProps)
@DropTarget('Issue', targetSpec, collect)
export default class Column extends Component {
  constructor() {
    super()
    this.state = { bodyMaxHeight: 0, forceUpdater: 0 }
  }

  componentWillMount() {
    intervalId = setInterval(() => {
      const { id, isOver, onSync } = this.props
      const { bodyMaxHeight, forceUpdater } = this.state
      const newHeight = calcColumnBodyHeight(id)
      if (newHeight !== bodyMaxHeight) {
        this.setState({ bodyMaxHeight: newHeight })
      }
      if (isOver || onSync) {
        this.setState({ forceUpdater: forceUpdater + 1 })
      }
    }, 50)
  }

  componentWillUnMount() {
    clearInterval(intervalId)
  }

  render() {
    const { connectDropTarget, title, id, isOver, onSync } = this.props
    let { issues } = this.props
    const { bodyMaxHeight } = this.state
    const { draggingItem } = dropManager

    const isSync = draggingItem && onSync
    const newItemSync = isSync && (id === dropManager.newCol)
    if (newItemSync) {
      let spliced = false
      for (let i = 0; i < issues.length; i++) {
        if (issues[i].ranking < draggingItem.ranking) {
          spliced = true
          issues = issues.slice(0, i).concat(draggingItem)
            .concat(issues.slice(i))
          break
        }
      }
      if (!spliced) issues = issues.concat(draggingItem)
    }

    const dropedToNewColumn = isSync && (draggingItem.col === id)
      && (draggingItem.newCol !== draggingItem.col)
    const dropedToSameColumn = isSync && draggingItem
      && (dropManager.newCol === draggingItem.col)
    const count =
      issues.filter(d => !d.hide).length -
      ((dropedToNewColumn || dropedToSameColumn) ? 1 : 0)
    const appendToTail = isOver && (dropManager.hoveringIssueID === undefined)

    return connectDropTarget(
      <section className='column' id={`column${id}`}>
        <header className='header'>{ title } <span className='count'>{ count }</span></header>
        <div className='body' style={{ maxHeight: bodyMaxHeight }} >
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
                  key={i}
                  name={d.title || d.name}
                  number={d.number}
                  ranking={d.ranking}
                  url={d.htmlUrl || d.url}
                />
              )
            })
          }
          {
            (issues.length === 0 || appendToTail) && isOver && (
              <Issue isPlaceHolder={true} />
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

function mapDispatchToProps (dispatch) {
  return bindActionCreators({ updateIssue }, dispatch)
}
