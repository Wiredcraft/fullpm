import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import request from 'superagent'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'

import Column from 'components/Column'
import { fetchIssues, clearIssues } from 'actions/ticketActions'
import { baseUrl } from 'setting'
import 'styles/main'
import ProgressBar from 'components/ProgressBar'
import { parserTickets } from 'helpers/tickets'


@connect(mapStateToProps, mapDispatchToProps)
@DragDropContext(HTML5Backend)
export default class AppComponent extends React.Component {
  constructor() {
    super()
    this.state = { orgName: undefined, repoName: undefined, onLoading: false }
  }

  componentWillMount() {
    this.setState({ ...this.props.params })
  }

  componentDidMount() {
    const { orgName, repoName } = this.state
    if (orgName && repoName) {
      this.enterBoard()
    }
  }

  enterBoard() {
    const {
      repoBtn,
      repo: {value : repoName},
      user: {value : userName}
    } = this.refs
    const { fetchIssues } = this.props

    if (!repoName) {
      alert('Please provide name of the repository')
    }
    if (!userName) {
      alert('Please provide name of the user or group')
    }

    this.setState({ onLoading: true })

    repoBtn.disabled = true
    const url = `${baseUrl}/api/repos/github/${userName}/${repoName}`
    request
      .get(url)
      .end((err, res) => {
        repoBtn.disabled = false
        if (!err) {
          const response = JSON.parse(res.text).data
          const cacheDbUrl = `${baseUrl}${response.cacheDB}`
          const metaDbUrl = `${baseUrl}${response.metaDB}`
          fetchIssues(cacheDbUrl, metaDbUrl, `${userName}/${repoName}`, () => this.setState({ onLoading: false }))
        }
      });
  }

  render() {
    const { sortedArr } = this.props
    const { orgName, repoName, onLoading } = this.state

    return (
      <div className='Main row'>
        <div className='small-8 small-centered column input-area'>
          <input
            className='small-6 column'
            defaultValue={ orgName || 'graphql' }
            placeholder='Name of user or group'
            ref='user'
            type='text'
          />
          <input
            className='small-6 column'
            defaultValue={ repoName || 'graphiql' }
            placeholder='Name of repositories'
            ref='repo'
            type='text'
          />
          <button
            className='button'
            onClick={::this.enterBoard}
            ref='repoBtn'
          >
            Change board
          </button>
          <ProgressBar hide={!onLoading} />
        </div>
        <div className='boards small-centered column'>
          <div ref='list'>
          {
            sortedArr.map((d, i) => {
              return (
                <Column
                  key={i}
                  id={d.id}
                  issues={d.issues}
                  title={d.name}
                />
              )
            })
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
    fetchIssues
  }, dispatch)
}

function mapStateToProps(state) {
  return {
    repos: state.repos.get('repos'),
    repoSelected: state.repos.get('repoSelected'),
    sortedArr: parserTickets(state.issues.get('tickets'))
  }
}
