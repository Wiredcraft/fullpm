import Immutable from 'immutable'

import { CHANGE_SELECTED_REPO, CHANGE_REPOS } from 'actions/repoActions'


const initialState = Immutable.fromJS({
  repos: [{
    name: 'default',
    url: 'http://localhost:3000/proxy/meta'
  }],
  repoSelected: false
})


export default function user (state = initialState, action) {
  switch (action.type) {
  case CHANGE_SELECTED_REPO:
    state = state.set('repoSelected', action.payload)
    return state
  case CHANGE_REPOS:
    state = state.set('repos', action.payload)
    return state
  default:
    return state
  }
}
