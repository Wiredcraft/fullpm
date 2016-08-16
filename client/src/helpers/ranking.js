export function calcIssueRanking(lastHoverdIssueId, containerId, ranking, issueList) {
  const { issues } = issueList[containerId]
  const { length } = issues
  if (length === 0) {
    return ranking
  } else {
    if (!lastHoverdIssueId) {
      return issueList[containerId].issues[length - 1].ranking - 1
    }
    for (let i = 0; i < issues.length; i++) {
      if (issues[i].id === lastHoverdIssueId) {
        if (i === 0) return issues[i].ranking + 1
        return (issues[i].ranking + issues[i - 1].ranking) / 2
      }
    }
    return ranking
  }
}

export function calcColumnRanking(tickets, hoveringCoumnId) {
  const columnRankingMap = {}
  tickets.forEach((d, i) => {
    columnRankingMap[i] = d.ranking
  })
  let hoveringCoumnRanking = columnRankingMap[hoveringCoumnId]
  let smallerRanking = hoveringCoumnRanking
  for (let i = 0; i < tickets.length; i++) {
    if (tickets[i].ranking < smallerRanking) {
      smallerRanking = tickets[i].ranking
      break
    }
  }
  if (smallerRanking === hoveringCoumnRanking) return hoveringCoumnRanking - 1
  return (hoveringCoumnRanking + smallerRanking) / 2
}

export function generateSortedIndexList(tickets) {
  let sortedIndexList = []
  var largest = Number.MIN_VALUE
  var largestIndex = 0
  for (let i = 0; i < tickets.length; i++) {
    for (let j = 0; j < tickets.length; j++) {
      if (sortedIndexList.some(d => d === j)) continue
      if (tickets[j].ranking > largest) {
        largest = tickets[j].ranking
        largestIndex = j
      }
    }
    sortedIndexList.push(largestIndex)
    largest = Number.MIN_VALUE
  }
  return sortedIndexList
}
