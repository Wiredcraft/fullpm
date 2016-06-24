import {
  ISSUE_TYPE_BACKLOG,
  ISSUE_TYPE_DOING,
  ISSUE_TYPE_DONE
} from 'helpers/constant'


export function parserTickets(tickets) {
  return [
    {
      id: ISSUE_TYPE_BACKLOG,
      name: 'Backlog',
      issues: tickets.filter(d => d.column === ISSUE_TYPE_BACKLOG)
    }, {
      id: ISSUE_TYPE_DOING,
      name: 'Doing',
      issues: tickets.filter(d => d.column === ISSUE_TYPE_DOING)
    }, {
      id: ISSUE_TYPE_DONE,
      name: 'Done',
      issues: tickets.filter(d => d.column === ISSUE_TYPE_DONE)
    }
  ]
}
