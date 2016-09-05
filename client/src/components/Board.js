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
import SearchBar from './SearchBar'


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
          <SearchBar onChange={value => changeFilter(value)}/>
          {
            userName && (
              <button
                className='button primary small'
                onClick={() => this.newIssue()}
              >
                New issue
              </button>
            )
          }
          <button
            className='button dropdown small'
          >
            Settings
          </button>
          <a
            className='credit'
            href='https://wirecraft.com/products/fullpm'
            target='_blank'
          >
            Powered by
            <svg
              height='10'
              version='1.1'
              viewBox='0 0 42 10'
              width='42'>
              <path d='M6.15427083,5.80729167 L2.57354167,5.80729167 L2.57354167,9.765625 L0.36,9.765625 L0.36,0 L6.54489583,0 L6.54489583,2.13541667 L2.57354167,2.13541667 L2.57354167,3.65885417 L6.15427083,3.65885417 L6.15427083,5.80729167 Z M12.3261458,9.765625 L12.2610417,9.55729167 C11.9659013,9.70486185 11.6360435,9.81553783 11.2714583,9.88932292 C10.9068732,9.96310801 10.5639947,10 10.2428125,10 C9.73065716,10 9.30748431,9.93272637 8.97328125,9.79817708 C8.63907819,9.6636278 8.37432389,9.48133796 8.17901042,9.25130208 C7.98369694,9.02126621 7.84697956,8.75000156 7.76885417,8.4375 C7.69072878,8.12499844 7.65166667,7.78646016 7.65166667,7.421875 L7.65166667,3.25520833 L9.74802083,3.25520833 L9.74802083,7.3046875 C9.74802083,7.53038307 9.80878411,7.70399245 9.9303125,7.82552083 C10.0518409,7.94704922 10.238471,8.0078125 10.4902083,8.0078125 C10.6117367,8.0078125 10.7354334,7.99913203 10.8613021,7.98177083 C10.9871708,7.96440964 11.102187,7.9470487 11.2063542,7.9296875 C11.3105214,7.9123263 11.397326,7.89279525 11.4667708,7.87109375 C11.5362156,7.84939225 11.5839582,7.8298612 11.61,7.8125 L11.61,3.25520833 L13.7063542,3.25520833 L13.7063542,9.765625 L12.3261458,9.765625 Z M17.313125,9.86979167 C17.0353458,9.86979167 16.7749318,9.83289967 16.531875,9.75911458 C16.2888182,9.68532949 16.0761467,9.57465352 15.8938542,9.42708333 C15.7115616,9.27951315 15.5683339,9.08854284 15.4641667,8.85416667 C15.3599995,8.61979049 15.3079167,8.34635573 15.3079167,8.03385417 L15.3079167,0 L17.3782292,0 L17.3782292,7.48697917 C17.3782292,7.60850755 17.4151212,7.70399271 17.4889063,7.7734375 C17.5626913,7.84288229 17.703749,7.87760417 17.9120833,7.87760417 L17.9120833,9.86979167 L17.313125,9.86979167 Z M21.4797917,9.86979167 C21.2020125,9.86979167 20.9415984,9.83289967 20.6985417,9.75911458 C20.4554849,9.68532949 20.2428134,9.57465352 20.0605208,9.42708333 C19.8782283,9.27951315 19.7350005,9.08854284 19.6308333,8.85416667 C19.5266661,8.61979049 19.4745833,8.34635573 19.4745833,8.03385417 L19.4745833,0 L21.5448958,0 L21.5448958,7.48697917 C21.5448958,7.60850755 21.5817878,7.70399271 21.6555729,7.7734375 C21.729358,7.84288229 21.8704156,7.87760417 22.07875,7.87760417 L22.07875,9.86979167 L21.4797917,9.86979167 Z M25.82875,4.27083333 L26.9225,4.27083333 C27.1742374,4.27083333 27.3782284,4.23828158 27.5344792,4.17317708 C27.6907299,4.10807259 27.8100864,4.02343802 27.8925521,3.91927083 C27.9750178,3.81510365 28.0314408,3.70008743 28.0618229,3.57421875 C28.092205,3.44835007 28.1073958,3.32465339 28.1073958,3.203125 C28.1073958,3.08159661 28.092205,2.95789993 28.0618229,2.83203125 C28.0314408,2.70616257 27.9750178,2.59114635 27.8925521,2.48697917 C27.8100864,2.38281198 27.6907299,2.29817741 27.5344792,2.23307292 C27.3782284,2.16796842 27.1742374,2.13541667 26.9225,2.13541667 L25.82875,2.13541667 L25.82875,4.27083333 Z M25.82875,9.765625 L23.6021875,9.765625 L23.6021875,0 L26.9094792,0 C27.5605241,0 28.1095637,0.0889748047 28.5566146,0.266927083 C29.0036654,0.444879362 29.366075,0.681422135 29.6438542,0.9765625 C29.9216333,1.27170286 30.1212841,1.61241126 30.2428125,1.99869792 C30.3643409,2.38498457 30.4251042,2.78645625 30.4251042,3.203125 C30.4251042,3.62847435 30.3643409,4.03428626 30.2428125,4.42057292 C30.1212841,4.80685957 29.9216333,5.14756797 29.6438542,5.44270833 C29.366075,5.7378487 29.0036654,5.97439147 28.5566146,6.15234375 C28.1095637,6.33029603 27.5605241,6.41927083 26.9094792,6.41927083 L25.82875,6.41927083 L25.82875,9.765625 Z M36.844375,8.59375 L35.281875,8.59375 L33.6152083,4.77864583 L33.6803125,9.765625 L31.4928125,9.765625 L31.4928125,0 L33.7844792,0 L36.063125,5.3125 L38.3417708,0 L40.6334375,0 L40.6334375,9.765625 L38.4459375,9.765625 L38.5110417,4.765625 L36.844375,8.59375 Z'></path>
            </svg>
          </a>
          { onSync && <span className='status'>Saving changes...</span> }
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
