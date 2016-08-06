import Immutable from 'immutable'

import { CHANGE_TICKETS, CHANGE_FILTER } from 'actions/issueActions'
import { parserTickets } from 'helpers/tickets'


let initialState = Immutable.fromJS({
  tickets: [],
  filter: ''
})
initialState = initialState.set('tickets', parserTickets([]))

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
