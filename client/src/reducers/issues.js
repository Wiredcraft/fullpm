import Immutable from 'immutable'

import { CHANGE_TICKETS } from 'actions/ticketActions'


const initialState = Immutable.fromJS({
  tickets: []
})

export default function issues (state = initialState, action) {
  switch (action.type) {
  case CHANGE_TICKETS:
    state = state.set('tickets', action.payload)
    return state
  default:
    return state
  }
}
