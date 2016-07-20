import PouchDB, { metaDb, cacheDb } from 'helpers/pouchDb'

import { updateRepoSelected } from 'actions/repoActions'
import { baseUrl } from 'setting'
import request from 'superagent'

export const CHANGE_TICKETS = 'CHANGE_TICKETS'

function generateTickets(githubTickets, metaTickets, name) {
  const metaTicketsMap = {}
  metaTickets.forEach(d => {
    metaTicketsMap[d.id] = d
  })
  return githubTickets.filter(d => d.url.indexOf(name) !== -1)
    .map(d => {
      d.column = metaTicketsMap[d.id].column
      d.ranking = metaTicketsMap[d.id].ranking
      return d
    })
}

export function fetchIssues(cacheDbUrl, metaDbUrl, name, next) {
  let metaDBSynced = false
  let cacheDBSynced = false
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
        dispatch(updateRepoSelected(true))
        if (next) {
          next()
        }
      })
    })
  }

  return dispatch => {
    PouchDB.sync('kenhq_cache', cacheDbUrl).then(() => {
      metaDBSynced = true
      changeTickets(dispatch)
    })
    return PouchDB.sync('kenhq_meta', metaDbUrl).then(() => {
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
    const url = `${baseUrl}/api/repos/github/${userName}/${repoName}`
    request
      .get(url)
      .end((err, res) => {
        if (!err) {
          const response = JSON.parse(res.text).data
          const cacheDbUrl = `${baseUrl}${response.cacheDB}`
          const metaDbUrl = `${baseUrl}${response.metaDB}`
          dispatch(fetchIssues(cacheDbUrl, metaDbUrl, `${userName}/${repoName}`,
            next))
        }
      })
  }
}

export function updateIssue(issueID, columnID) {
  return dispatch => {
    const issueType = columnID
    return metaDb.get(issueID).then(function (doc) {
      doc.column = issueType
      dispatch(updateRepoSelected(true))
      return metaDb.put(doc)
    })
  }
}

export function clearIssues() {
  return dispatch => {
    dispatch(updateRepoSelected(false))
    return dispatch({ type: CHANGE_TICKETS, payload: [] })
  }
}
