import Immutable from 'immutable'

import { CHANGE_LOGIN_STATE } from 'actions/userActions'


const initialState = Immutable.fromJS({
  isLogin: false,
  userName: ''
})

export default function user (state = initialState, action) {
  switch (action.type) {
  case CHANGE_LOGIN_STATE:
    state = state.set('isLogin', action.payload.isLogin)
    state = state.set('userName', action.payload.userName)
    return state
  default:
    return state
  }
}
