import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import request from 'superagent'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'

import Column from 'components/Column'
import { fetchIssues, clearIssues } from 'actions/ticketActions'
import { updateRepoSelected } from 'actions/repoActions'
import { baseUrl } from 'setting'
import 'styles/main'
import { parserTickets } from 'helpers/tickets'


@connect(mapStateToProps, mapDispatchToProps)
@DragDropContext(HTML5Backend)
export default class AppComponent extends React.Component {
  constructor() {
    super()
    this.state = { orgName: undefined, repoName: undefined }
  }

  componentWillMount() {
    this.setState({ ...this.props.params })
  }

  componentDidMount() {
    if (this.state.orgName) {
      document.querySelector('#submitBtn').click()
    }
  }

  enterRepo(cacheDbUrl, metaDbUrl, name) {
    const { fetchIssues, updateRepoSelected } = this.props
    fetchIssues(cacheDbUrl, metaDbUrl, name)
    updateRepoSelected(true)
  }

  exitRepo() {
    const { clearIssues, updateRepoSelected } = this.props
    updateRepoSelected(false)
    clearIssues()
  }

  enterBoard() {
    const {
      progrssArea,
      progrssBar,
      repoBtn,
      repo: {value : repoName},
      user: {value : userName}
    } = this.refs
    if (!repoName || !userName) {
      alert('Please enter some text in input box')
    }
    let progress = 0
    repoBtn.disabled = true
    progrssArea.style.display = 'block'
    const intervalID = setInterval(() => {
      if (++progress === 100) progress = 0
      progrssBar.style.width=`${progress}%`
    }, 30)
    const url = `${baseUrl}/api/repos/github/${userName}/${repoName}`
    request
      .get(url)
      .end((err, res) => {
        repoBtn.disabled = false
        progrssArea.style.display = 'none'
        clearInterval(intervalID)
        if (!err) {
          const response = JSON.parse(res.text).data
          const cacheDbUrl = `${baseUrl}${response.cacheDB}`
          const metaDbUrl = `${baseUrl}${response.metaDB}`
          this.enterRepo(cacheDbUrl, metaDbUrl, `${userName}/${repoName}`)
        }
      });
  }

  render() {
    const { sortedArr } = this.props
    const { orgName, repoName } = this.state

    return (
      <div className='Main row'>
        <div className='small-8 small-centered column input-area'>
          <input
            className='small-6 column'
            placeholder='Name of user or group'
            ref='user'
            type='text'
            defaultValue={ orgName || 'graphql' }
          />
          <input
            className='small-6 column'
            placeholder='Name of repositories'
            ref='repo'
            type='text'
            defaultValue={ repoName || 'graphiql' }
          />
          <button
            className='button'
            id='submitBtn'
            onClick={::this.enterBoard}
            ref='repoBtn'
          >
            Change board
          </button>
          <div
            className="success progress"
            ref='progrssArea'
            style={{ display: 'none' }}
          >
            <div
              className="progress-meter"
              ref='progrssBar'
              style={{ width: '0%' }}
            />
          </div>
        </div>
        <div className='boards small-centered column'>
          <div>
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

function mapStateToProps(state) {
  return {
    repos: state.repos.get('repos'),
    repoSelected: state.repos.get('repoSelected'),
    sortedArr: parserTickets(state.issues.get('tickets'))
  }
}
