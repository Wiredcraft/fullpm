/* global API_BASE_URL */
import request from 'superagent'

import { dbManager } from '../helpers/pouchDb'


export const CHANGE_TICKETS = 'CHANGE_TICKETS'
export const CHANGE_FILTER = 'CHANGE_FILTER'
export const CHANGE_SYNC_MODE = 'CHANGE_SYNC_MODE'

export function fetchIssues(cacheDbUrl, metaDbUrl, name, next) {
  return dispatch => {
    dbManager.initDb(cacheDbUrl, metaDbUrl, name, tickets => {
      dispatch({ type: CHANGE_TICKETS, payload: tickets })
      dispatch({ type: CHANGE_SYNC_MODE,  payload: false })
      if (next) next()
    })
  }
}

export function fetchRepo(userName, repoName, next) {
  return dispatch => {
    const url = `${API_BASE_URL}/api/repos/github/${userName}/${repoName}`
    dispatch({ type: CHANGE_SYNC_MODE,  payload: true })
    request
      .get(url)
      .withCredentials()
      .end((err, res) => {
        if (err) {
          console.error(err)
          dispatch({ type: CHANGE_SYNC_MODE,  payload: false })
          next(true)
        } else {
          const response = JSON.parse(res.text).data
          dispatch(fetchIssues(
            `${API_BASE_URL}${response.cacheDB}`,
            `${API_BASE_URL}${response.metaDB}`,
            `${userName}/${repoName}`,
            next)
          )
        }
      })
  }
}

export function updateIssue(issueID, columnID, ranking) {
  return dispatch => {
    dbManager.updateMetaDb(issueID, columnID, ranking, () => {
      dispatch({ type: CHANGE_SYNC_MODE, payload: true })
    })
  }
}

export function clearIssues() {
  return { type: CHANGE_TICKETS, payload: [] }
}

export function changeFilter(filter) {
  return { type: CHANGE_FILTER, payload: filter }
}
