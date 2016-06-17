import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import request from 'superagent'

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
import 'styles/main.scss'

@connect(mapStateToProps, mapDispatchToProps)
@DragDropContext(HTML5Backend)
export default class AppComponent extends React.Component {
  componentDidMount() {
    // const { repos } = this.props
    // this.enterRepo(repos.first().get('url'))
  }

  enterRepo(cacheDbUrl, metaDbUrl) {
    const { fetchIssues, updateRepoSelected } = this.props
    fetchIssues(cacheDbUrl, metaDbUrl)
    updateRepoSelected(true)
  }

  exitRepo() {
    const { clearIssues, updateRepoSelected } = this.props
    updateRepoSelected(false)
    clearIssues()
  }

  enterBoard() {
    const { repo: {value : repoName}, user: {value : userName} } = this.refs
    if (!repoName || !userName) {
      alert('Please enter some text in input box')
    }
    const url = `http://localhost:3000/api/repos/github/${userName}/${repoName}`
    request
      .get(url)
      .end((err, res) => {
        if (!err) {
          const response = JSON.parse(res.text).data
          const cacheDbUrl = `http://localhost:3000${response.cacheDB}`
          const metaDbUrl = `http://localhost:3000${response.metaDB}`
          this.enterRepo(cacheDbUrl, metaDbUrl)
        }
      });
  }

  render() {
    const {
      sortedArr
    } = this.props

    return (
      <div className='Main row'>
        <div className='small-8 small-centered column input-area'>
          <input
            className='small-6 column'
            placeholder='Name of user or group'
            ref='user'
            type='text'
            value='graphql'
          />
          <input
            className='small-6 column'
            placeholder='Name of repositories'
            ref='repo'
            type='text'
            value='graphiql'
          />
          <button
            className='button'
            onClick={::this.enterBoard}
          >
            Go to board
          </button>
        </div>
        <div className='boards small-centered column'>
          <div>
            <div ref='list'>
            {
              sortedArr.map((d, i) => {
                return (
                  <Column key={i} id={d.id} title={d.name} issues={d.issues} />
                )
              })
            }
            </div>
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
