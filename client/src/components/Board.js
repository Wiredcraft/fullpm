import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'

import Column from 'components/Column'
import { fetchIssues, clearIssues, fetchRepo } from 'actions/issueActions'
import 'styles/board'
import ProgressBar from 'components/ProgressBar'
import { parserTickets } from 'helpers/tickets'
import { isDevMode } from '../helper/dev'


@connect(mapStateToProps, mapDispatchToProps)
@DragDropContext(HTML5Backend)
export default class Board extends React.Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  constructor() {
    super()
    this.state = {
      orgName: undefined,
      repoName: undefined,
      onLoading: false,
      notFound: false
    }
  }

  componentWillMount() {
    this.setState({ ...this.props.params })
  }

  componentDidMount() {
    const { orgName, repoName } = this.state
    if (orgName && repoName) {
      this.changeBoard(orgName, repoName)
    }
  }

  changeBoard(userNameFromUrl, repoNameFromUrl) {
    const { repoBtn, repo, user } = this.refs
    const { clearIssues, fetchRepo } = this.props
    const { search } = location

    const userName = userNameFromUrl || (user ? user.value : undefined)
    const repoName = repoNameFromUrl || (repo ? repo.value : undefined)
    if (!repoName) {
      alert('Please provide name of the repository')
    } else if (!userName) {
      alert('Please provide name of the user or group')
    }

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
  }

  render() {
    const { sortedArr } = this.props
    const { orgName, repoName, onLoading, notFound } = this.state

    return (
      <div className={`board ${isDevMode ? 'dev': ''}`}>
        { isDevMode && (
          <header className='toolbar'>
            <span className='logo'>FullPM</span>
            <input
              defaultValue={ orgName || 'Wiredcraft' }
              placeholder='Name of user or group'
              ref='user'
              type='text'
            />
            <input
              defaultValue={ repoName || 'pipelines' }
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
          </header>
        )}
        { notFound && <p>Repo not found</p> }
        <ProgressBar hide={!onLoading} />
        <header className='controls'>
          <button className='button primary'>New issue</button>
          <input
            placeholder='Filter issues by title'
            type='search'
          />
        </header>
        <div className='columns'>
        {
          sortedArr.map((d, i) => (
            <Column
              key={i}
              id={d.id}
              issues={d.issues}
              title={d.name}
            />
          ))
        }
        </div>
      </div>
    )
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    clearIssues,
    fetchIssues,
    fetchRepo
  }, dispatch)
}

function mapStateToProps(state) {
  return {
    sortedArr: state.issues.get('tickets')
  }
}
