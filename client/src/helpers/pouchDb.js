import PouchDB from 'pouchdb'

import { docsToTickets } from './tickets'


class DbManager {
  constructor() {
    this.metaDb = undefined
    this.cacheDb = undefined
    this.metaDbName = ''
    this.cacheDbName = ''
  }

  initDb(cacheDbUrl, metaDbUrl, name, next) {
    name = name.toLowerCase()

    this.metaDbName = `meta${name}`
    this.cacheDbName = `cache${name}`
    this.metaDb = new PouchDB(this.metaDbName)
    this.cacheDb = new PouchDB(this.cacheDbName)

    let metaDBSynced = false
    let cacheDBSynced = false

    const handleDbUpdated = () => {
      if (!metaDBSynced || !cacheDBSynced) return

      this.cacheDb.allDocs({include_docs: true}).then(res => {
        const cacheDocs = res.rows.map(d => d.doc)
        this.metaDb.allDocs({include_docs: true}).then(metaRes => {
          const metaDocs = metaRes.rows.map(d => d.doc)
          const docs = docsToTickets(cacheDocs, metaDocs, name)

          if (next) next(docs)
        })
      })
    }

    PouchDB.sync(this.cacheDbName, cacheDbUrl).then(() => {
      metaDBSynced = true
      handleDbUpdated()
    })
    return PouchDB.sync(this.metaDbName, metaDbUrl).then(() => {
      cacheDBSynced = true
      handleDbUpdated()
      this.metaDb.changes({
        since: 'now',
        live: true
      }).on('change', function () {
        handleDbUpdated()
      })
    })
  }

  updateMetaDb(issueID, issueType, ranking, next) {
    this.metaDb.get(issueID).then(doc => {
      doc.column = issueType
      if (ranking) doc.ranking = ranking
      this.metaDb.put(doc)
      if (next) next()
    })
  }
}

export const dbManager = new DbManager()
