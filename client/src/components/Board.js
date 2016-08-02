import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'

import Column from 'components/Column'
import { fetchIssues, clearIssues, fetchRepo } from 'actions/ticketActions'
import 'styles/main'
import ProgressBar from 'components/ProgressBar'
import { parserTickets } from 'helpers/tickets'


@connect(mapStateToProps, mapDispatchToProps)
@DragDropContext(HTML5Backend)
export default class Board extends React.Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  constructor() {
    super()
    this.state = { orgName: undefined, repoName: undefined, onLoading: false }
  }

  componentWillMount() {
    this.setState({ ...this.props.params })
  }

  componentDidMount() {
    const { orgName, repoName } = this.state
    console.log('!!!');
    if (orgName && repoName) {
      this.changeBoard()
    }
  }

  changeBoard() {
    const {
      repoBtn,
      repo: {value : repoName},
      user: {value : userName}
    } = this.refs
    const { fetchRepo } = this.props

    if (!repoName) {
      alert('Please provide name of the repository')
    } else if (!userName) {
      alert('Please provide name of the user or group')
    }

    this.setState({ onLoading: true })
    repoBtn.disabled = true
    this.context.router.push(`/boards/${userName}/${repoName}`)
    fetchRepo(userName, repoName, () => {
      this.setState({ onLoading: false })
      repoBtn.disabled = false
    })
  }

  render() {
    const { sortedArr } = this.props
    const { orgName, repoName, onLoading } = this.state

    return (
      <div className='Main row'>
        <div className='small-8 small-centered column input-area'>
          <input
            className='small-6 column'
            defaultValue={ orgName || 'Wiredcraft' }
            placeholder='Name of user or group'
            ref='user'
            type='text'
          />
          <input
            className='small-6 column'
            defaultValue={ repoName || 'pipelines' }
            placeholder='Name of repositories'
            ref='repo'
            type='text'
          />
          <button
            className='button'
            onClick={::this.changeBoard}
            ref='repoBtn'
          >
            Change board
          </button>
          <ProgressBar hide={!onLoading} />
        </div>
        <div className='boards small-centered column'>
          <div ref='list'>
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
    repos: state.repos.get('repos'),
    repoSelected: state.repos.get('repoSelected'),
    sortedArr: parserTickets(state.issues.get('tickets'))
  }
}
