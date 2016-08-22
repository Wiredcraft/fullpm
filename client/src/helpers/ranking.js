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
  let hoveringColumnRanking = columnRankingMap[hoveringCoumnId]

  // If hovering column is the last column, do nothing
  let smallestRanking = Number.MAX_VALUE
  for (let i = 0; i < tickets.length; i++) {
    if (tickets[i].ranking < smallestRanking) {
      smallestRanking = tickets[i].ranking
    }
  }
  if(hoveringColumnRanking === smallestRanking) return null

  let smallerRanking = hoveringColumnRanking
  for (let i = 0; i < tickets.length; i++) {
    if (tickets[i].ranking < smallerRanking) {
      smallerRanking = tickets[i].ranking
      break
    }
  }
  if (smallerRanking === hoveringColumnRanking) return hoveringColumnRanking - 1
  return (hoveringColumnRanking + smallerRanking) / 2
}

// Input: list of ticket array
// Output: An array of sorted array which indicate sorting result
export function generateSortedIndexList(tickets) {
  let sortedIndexList = []

  for (let i = 0; i < tickets.length; i++) {
    let largestIndex = 0
    let largest = Number.MIN_VALUE
    for (let j = 0; j < tickets.length; j++) {
      if (sortedIndexList.every(d => d !== j)) {
        if (tickets[j].ranking > largest) {
          largest = tickets[j].ranking
          largestIndex = j
        }
      }
    }
    sortedIndexList.push(largestIndex)
  }

  return sortedIndexList
}
