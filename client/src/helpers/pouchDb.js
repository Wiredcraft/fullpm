import PouchDB from 'pouchdb'

// TODO: use seperate repo DB for every repo.
export const metaDb = new PouchDB('kenhq_meta')
export const cacheDb = new PouchDB('kenhq_cache')

export default PouchDB
