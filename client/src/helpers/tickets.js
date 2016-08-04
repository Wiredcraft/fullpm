import {
  ISSUE_TYPE_BACKLOG,
  ISSUE_TYPE_NEXT,
  ISSUE_TYPE_DOING,
  ISSUE_TYPE_DONE
} from 'helpers/constant'

// basic bubble sort
function sortTickets(tickets) {
  const { length } = tickets
  for (let i = 0; i < length - 1; i++) {
    for (let j = 0; j < length - 1 - i; j++) {
      if (tickets[j].ranking < tickets[j + 1].ranking) {
        const tmp = tickets[j]
        tickets[j] = tickets[j + 1]
        tickets[j + 1] = tmp
      }
    }
  }
}

export function parserTickets(tickets) {
  sortTickets(tickets)

  return [
    {
      id: ISSUE_TYPE_BACKLOG,
      name: 'Backlog',
      issues: tickets.filter(d => d.column === ISSUE_TYPE_BACKLOG)
    }, {
      id: ISSUE_TYPE_NEXT,
      name: 'Next',
      issues: tickets.filter(d => d.column === ISSUE_TYPE_NEXT)
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
