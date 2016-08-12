import {
  ISSUE_TYPE_BACKLOG,
  ISSUE_TYPE_NEXT,
  ISSUE_TYPE_DOING,
  ISSUE_TYPE_DONE
} from 'helpers/constant'

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

export function docsToTickets(cacheDocs, metaDocs, name) {
  const metaTicketsMap = {}
  metaDocs.forEach(d => {
    metaTicketsMap[d.id] = d
  })
  return cacheDocs.filter(d => d.url.toLowerCase().indexOf(name) !== -1)
    .map(d => {
      d.column = metaTicketsMap[d.id].column
      d.ranking = metaTicketsMap[d.id].ranking
      d.isPullRequest = d.htmlUrl.indexOf('/pull/') !== -1
      return d
    })
}

export function parserTickets(tickets, filter, isRawTickets) {
  let ticketList
  if (isRawTickets) {
    sortTickets(tickets)

    // tickets = tickets.filter(d => d.htmlUrl.indexOf('/pull/') === -1)

    ticketList = [
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

  return (ticketList || tickets).map(d => {
    d.issues = d.issues.map(issue => {
      if (filter === '') issue.hide = false
      else issue.hide = !(issue.title.toLowerCase()
        .indexOf(filter.toLowerCase()) !== -1)

      return issue
    })
    return d
  })
}

export function spliceIssueInSync(hasNew, issues, newItem) {
  if (!hasNew) return issues
  let spliced = false
  for (let i = 0; i < issues.length; i++) {
    if (issues[i].ranking < newItem.ranking) {
      spliced = true
      issues = issues.slice(0, i).concat(newItem).concat(issues.slice(i))
      break
    }
  }
  if (!spliced) issues = issues.concat(newItem)
  return issues
}
