/* global API_BASE_URL */
import PouchDB from 'pouchdb'

import request from 'superagent'

export const CHANGE_TICKETS = 'CHANGE_TICKETS'
export const CHANGE_FILTER = 'CHANGE_FILTER'

function generateTickets(githubTickets, metaTickets, name) {
  const metaTicketsMap = {}
  metaTickets.forEach(d => {
    metaTicketsMap[d.id] = d
  })
  return githubTickets.filter(d => d.url.toLowerCase().indexOf(name) !== -1)
    .map(d => {
      d.column = metaTicketsMap[d.id].column
      d.ranking = metaTicketsMap[d.id].ranking
      return d
    })
}

let metaDb
let cacheDb
export function fetchIssues(cacheDbUrl, metaDbUrl, name, next) {
  let metaDBSynced = false
  let cacheDBSynced = false
  name = name.toLowerCase()
  metaDb = new PouchDB(`meta${name}`)
  cacheDb = new PouchDB(`cache${name}`)
  const changeTickets = (dispatch) => {
    if (!metaDBSynced || !cacheDBSynced) {
      return
    }
    cacheDb.allDocs({include_docs: true}).then(res => {
      const githubTickets = res.rows.map(d => d.doc)
      metaDb.allDocs({include_docs: true}).then(metaRes => {
        const metaTickets = metaRes.rows.map(d => d.doc)
        const tickets = generateTickets(githubTickets, metaTickets, name)

        dispatch({ type: CHANGE_TICKETS, payload: tickets })
        if (next) next()
      })
    })
  }

  return dispatch => {
    PouchDB.sync(`cache${name}`, cacheDbUrl).then(() => {
      metaDBSynced = true
      changeTickets(dispatch)
    })
    return PouchDB.sync(`meta${name}`, metaDbUrl).then(() => {
      cacheDBSynced = true
      changeTickets(dispatch)
      metaDb.changes({
        since: 'now',
        live: true
      }).on('change', function () {
        changeTickets(dispatch)
      })
    })
  }
}

export function fetchRepo(userName, repoName, next) {
  return dispatch => {
    const url = `${API_BASE_URL}/api/repos/github/${userName}/${repoName}`

    request
      .get(url)
      .withCredentials()
      .end((err, res) => {
        if (err) {
          console.error(err)
          next(true)
        } else {
          const response = JSON.parse(res.text).data
          const cacheDbUrl = `${API_BASE_URL}${response.cacheDB}`
          const metaDbUrl = `${API_BASE_URL}${response.metaDB}`
          dispatch(fetchIssues(cacheDbUrl, metaDbUrl, `${userName}/${repoName}`,
            next))
        }
      })
  }
}

export function updateIssue(issueID, columnID, ranking) {
  return () => {
    const issueType = columnID
    return metaDb.get(issueID).then(function (doc) {
      doc.column = issueType
      if (ranking) doc.ranking = ranking
      return metaDb.put(doc)
    })
  }
}

export function clearIssues() {
  return dispatch => {
    return dispatch({ type: CHANGE_TICKETS, payload: [] })
  }
}

export function changeFilter(filter) {
  return dispatch => {
    return dispatch({ type: CHANGE_FILTER, payload: filter })
  }
}
