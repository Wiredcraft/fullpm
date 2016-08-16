/* global API_BASE_URL */
import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'

import Column from 'components/Column'
import {
  changeFilter,
  clearIssues,
  fetchIssues,
  fetchRepo
} from 'actions/issueActions'
import 'styles/board'
import ProgressBar from 'components/ProgressBar'
import { isDevMode } from '../helpers/dev'
import CustomDragLayer from './CustomDragLayer'
import { openPage } from '../helpers/webPage'
import { generateSortedIndexList } from '../helpers/ranking'


let intervalId

@DragDropContext(HTML5Backend)
@connect(mapStateToProps, mapDispatchToProps)
export default class Board extends React.Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  constructor() {
    super()
    this.state = {
      forceUpdater: 0,
      userName: undefined,
      repoName: undefined,
      onLoading: false,
      notFound: false
    }
  }

  componentWillMount() {
    this.setState({ ...this.props.params })

    intervalId = setInterval(() => {
      const { forceUpdater } = this.state
      this.setState({ forceUpdater: forceUpdater + 1 })
    }, 50)
  }

  componentDidMount() {
    const { userName, repoName } = this.state
    if (userName && repoName) {
      this.changeBoard(userName, repoName)
    }
  }

  componentWillUnMount() {
    clearInterval(intervalId)
  }

  changeBoard(userNameFromUrl, repoNameFromUrl) {
    const { repoBtn, repo, user } = this.refs
    const { clearIssues, fetchRepo } = this.props
    const { search } = location

    const userName = userNameFromUrl || (user ? user.value : undefined)
    const repoName = repoNameFromUrl || (repo ? repo.value : undefined)
    if (!repoName) alert('Please provide name of the repository')
    else if (!userName) alert('Please provide name of the user or group')

    clearIssues()
    this.setState({ onLoading: true })
    if (repoBtn) repoBtn.disabled = true

    this.context.router.push(`/boards/${userName}/${repoName}${search}`)

    fetchRepo(userName, repoName, (notFound) => {
      if (notFound) this.setState({ notFound: true })
      else this.setState({ notFound: false })
      this.setState({ onLoading: false })
      if (repoBtn) repoBtn.disabled = false
    })
    this.setState({ userName, repoName })
  }

  newIssue() {
    const { userName, repoName } = this.state
    openPage(`https://github.com/${userName}/${repoName}/issues/new`)
  }

  logout() {
    const url = `${API_BASE_URL}/auth/logout`
    window.location = url
    setTimeout(() => window.location.reload(), 500)
  }

  render() {
    const { changeFilter, onSync, tickets } = this.props
    const { userName, repoName, onLoading, notFound } = this.state

    const sortedIndexList = generateSortedIndexList(tickets)

    return (
      <div
        className={`board ${isDevMode ? 'dev': ''}`}
        style={{ pointerEvents: onSync ? 'none' : 'all' }}
      >
        { isDevMode && (
          <header className='toolbar'>
            <span className='logo'>FullPM</span>
            <input
              defaultValue={userName || 'Wiredcraft'}
              placeholder='Name of user or group'
              ref='user'
              type='text'
            />
            <input
              defaultValue={repoName || 'pipelines'}
              placeholder='Name of repositories'
              ref='repo'
              type='text'
            />
            <button
              className='button'
              onClick={() => this.changeBoard()}
              ref='repoBtn'
            >
              Change board
            </button>
            <button
              className='button danger'
              onClick={() => this.logout()}
            >
              Log out
            </button>
          </header>
        )}
        { notFound && <p>Repo not found</p> }
        <ProgressBar hide={!onLoading} />
        <header className='controls'>
          {
            userName && (
              <button
                className='button primary'
                onClick={() => this.newIssue()}
              >
                New issue
              </button>
            )
          }
          <input
            placeholder='Filter issues by title'
            onChange={e => changeFilter(e.target.value)}
            type='search'
          />
          { onSync && <span className='status'>Saving changes...</span>}
        </header>
        <div className='columns'>
        {
          sortedIndexList
            .map((d, i) => (
              <Column
                key={i}
                id={tickets[d].id}
                issues={tickets[d].issues}
                tickets={tickets}
                title={tickets[d].name}
              />
            ))
        }
        </div>
        <CustomDragLayer />
      </div>
    )
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    changeFilter,
    clearIssues,
    fetchIssues,
    fetchRepo
  }, dispatch)
}

function mapStateToProps(state) {
  const tickets = state.issues.get('tickets')

  return { onSync: state.issues.get('onSync'), tickets }
}
