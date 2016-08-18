import {
  ISSUE_TYPE_BACKLOG,
  ISSUE_TYPE_NEXT,
  ISSUE_TYPE_DOING,
  ISSUE_TYPE_DONE
} from './constant'
import { checkIsfiltered } from './filter'
import { sort } from './sort'


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
    sort(tickets, 'ranking')
    ticketList = [
      {
        id: ISSUE_TYPE_BACKLOG,
        name: 'Backlog',
        issues: tickets.filter(d => d.column === ISSUE_TYPE_BACKLOG),
        ranking: 4
      }, {
        id: ISSUE_TYPE_NEXT,
        name: 'Next',
        issues: tickets.filter(d => d.column === ISSUE_TYPE_NEXT),
        ranking: 3
      }, {
        id: ISSUE_TYPE_DOING,
        name: 'Doing',
        issues: tickets.filter(d => d.column === ISSUE_TYPE_DOING),
        ranking: 2
      }, {
        id: ISSUE_TYPE_DONE,
        name: 'Done',
        issues: tickets.filter(d => d.column === ISSUE_TYPE_DONE),
        ranking: 1
      }
    ]
  }

  return (ticketList || tickets).map(d => {
    sort(d, 'ranking')
    d.issues = d.issues.map(issue => {
      return {...issue, hide: checkIsfiltered(filter, issue)}
    })
    return d
  })
}

// For adding issue clone
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
