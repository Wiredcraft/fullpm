import { combineReducers } from 'redux'

import issues from './issues'
import repos from './repos'
import user from './user'


export default combineReducers({
  issues,
  repos,
  user
})
