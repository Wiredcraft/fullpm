import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import 'normalize.css/normalize.css'
import 'styles/app.scss'
import 'styles/main.scss'
import Column from 'components/Column'
import { fetchIssues, clearIssues } from 'actions/ticketActions'
import { updateRepoSelected } from 'actions/repoActions'
import {
  ISSUE_TYPE_BACKLOG,
  ISSUE_TYPE_DOING,
  ISSUE_TYPE_DONE
} from 'helper/constant'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'

@connect(mapStateToProps, mapDispatchToProps)
@DragDropContext(HTML5Backend)
export default class AppComponent extends React.Component {
  enterRepo(url) {
    const { fetchIssues, updateRepoSelected } = this.props
    fetchIssues(url)
    updateRepoSelected(true)
  }

  exitRepo() {
    const { clearIssues, updateRepoSelected } = this.props
    updateRepoSelected(false)
    clearIssues()
  }

  render() {
    const {
      repos,
      repoSelected,
      sortedArr
    } = this.props

    return (
      <div className='AppComponent'>
        { repoSelected ? (
          <div>
            <button className='back-btn' onClick={this.exitRepo.bind(this)}>
              Back
            </button>
            <div ref='list' className='board-area'>
              {
                sortedArr.map((d, i) => {
                  return (
                    <Column key={i} id={d.id} title={d.name} issues={d.issues} />
                  )
                })
              }
            </div>
          </div>
        ) : (
          <div>
            {
              repos.map(d => (
                <button onClick={this.enterRepo.bind(this, d.get('url'))}>
                  {d.get('name')}
                </button>
              ))
            }
          </div>
        )}
      </div>
    )
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    clearIssues,
    fetchIssues,
    updateRepoSelected
  }, dispatch)
}

function parserTickets(tickets) {
  return [
    { id: 1, name: 'Backlog', issues: tickets.filter(d => d.column === ISSUE_TYPE_BACKLOG) },
    { id: 2, name: 'Doing', issues: tickets.filter(d => d.column === ISSUE_TYPE_DOING) },
    { id: 3, name: 'Done', issues: tickets.filter(d => d.column === ISSUE_TYPE_DONE) }
  ]
}

function mapStateToProps(state) {
  return {
    repos: state.repos.get('repos'),
    repoSelected: state.repos.get('repoSelected'),
    sortedArr: parserTickets(state.issues.get('tickets'))
  }
}
