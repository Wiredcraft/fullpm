import { combineReducers } from 'redux'

import issues from './issues'
import repos from './repos'


export default combineReducers({
  issues,
  repos
})
