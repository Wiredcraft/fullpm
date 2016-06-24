import PouchDB from 'pouchdb'


export const metaDb = new PouchDB('kenhq_meta')
export const cacheDb = new PouchDB('kenhq_cache')

export default PouchDB
