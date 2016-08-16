import { Map } from 'immutable'

import {
  CHANGE_COLUMN_RANKING,
  CHANGE_FILTER,
  CHANGE_TICKETS,
  CHANGE_SYNC_MODE
} from 'actions/issueActions'
import { parserTickets } from 'helpers/tickets'


let initialState = Map({
  filter: '',
  onSync: false,
  tickets: parserTickets([])
})

export default function issues (state = initialState, action) {
  switch (action.type) {
  case CHANGE_TICKETS:
    state = state.set('tickets',
      parserTickets(action.payload, state.get('filter'), true))
    state = state.set('onSync', false)
    return state
  case CHANGE_FILTER:
    let tickets = state.get('tickets')
    state = state.set('tickets', parserTickets(tickets, action.payload, false))
    state = state.set('filter', action.payload)
    return state
  case CHANGE_SYNC_MODE:
    state = state.set('onSync', action.payload)
    return state
  case CHANGE_COLUMN_RANKING:
    tickets = state.get('tickets')
    const { columnId, ranking } = action.payload
    tickets[columnId].ranking = ranking
    state = state.set('tickets', tickets)
    return state
  default:
    return state
  }
}
