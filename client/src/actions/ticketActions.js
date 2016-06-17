import PouchDB, { metaDb, cacheDb } from 'helper/pouchDb'
import _ from 'lodash'

import {
  ISSUE_TYPE_BACKLOG,
  ISSUE_TYPE_DOING,
  ISSUE_TYPE_DONE
} from 'helper/constant'


export const CHANGE_TICKETS = 'CHANGE_TICKETS'

const ISSUE_TYPE_DICTIONARY = {
  1: ISSUE_TYPE_BACKLOG,
  2: ISSUE_TYPE_DOING,
  3: ISSUE_TYPE_DONE
}

function generateTickets(githubTickets, metaTickets) {
  const metaTicketsMap = {}
  metaTickets.forEach(d => {
    metaTicketsMap[d.id] = d
  })
  return githubTickets.map(d => {
    d.column = metaTicketsMap[d.id].column
    d.ranking = metaTicketsMap[d.id].ranking
    return d
  })
}

export function fetchIssues(cacheDbUrl, metaDbUrl) {
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
        const tickets = generateTickets(githubTickets, metaTickets)
        dispatch({ type: CHANGE_TICKETS, payload: tickets })
      })
    })
  }
  //
  // return dispatch => {
  //   return PouchDB.sync('kenhq_meta', url).then(() => {
  //     kenhqDb.changes({
  //       since: 'now',
  //       live: true
  //     }).on('change', function () {
  //       changeTickets(dispatch)
  //     })
  //     changeTickets(dispatch)
  //   })
  // }


  return dispatch => {
    PouchDB.sync('kenhq_cache', cacheDbUrl).then(() => {
      metaDBSynced = true
      changeTickets(dispatch)
    })
    return PouchDB.sync('kenhq_meta', metaDbUrl).then(() => {
      cacheDBSynced = true
      changeTickets(dispatch)
    })
  }
}

export function updateIssue(issueID, columnID) {
  return () => {
    const issueType = ISSUE_TYPE_DICTIONARY[columnID]
    return kenhqDb.get(issueID).then(function (doc) {
      doc.column = issueType
      return kenhqDb.put(doc)
    })
  }
}

export function clearIssues() {
  return (dispatch) => {
    dispatch({ type: CHANGE_TICKETS, payload: [] })
  }
}
