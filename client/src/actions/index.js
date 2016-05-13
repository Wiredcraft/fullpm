import PouchDB, { kenhqDb } from 'helper/pouchDb'


export const CHANGE_TICKETS = 'CHANGE_TICKETS'

export function fetchIssues() {
  return dispatch => {
    return PouchDB.sync('kenhq_meta', 'http://localhost:3000/proxy/meta').then(() => {
      kenhqDb.allDocs({include_docs: true}).then(res => {
        const tickets = res.rows.map(d => d.doc)
        return dispatch({ type: CHANGE_TICKETS, payload: tickets })
      })
    })
  }
}
