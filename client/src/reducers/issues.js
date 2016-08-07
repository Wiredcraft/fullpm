import { Map } from 'immutable'

import {
  CHANGE_FILTER,
  CHANGE_TICKETS
} from 'actions/issueActions'
import { parserTickets } from 'helpers/tickets'


let initialState = Map({
  tickets: parserTickets([]),
  filter: ''
})

export default function issues (state = initialState, action) {
  switch (action.type) {
  case CHANGE_TICKETS:
    state = state.set('tickets',
      parserTickets(action.payload, state.get('filter'), true))
    return state
  case CHANGE_FILTER:
    const tickets = state.get('tickets')
    state = state.set('tickets', parserTickets(tickets, action.payload, false))
    state = state.set('filter', action.payload)
    return state
  default:
    return state
  }
}
