export function calcRanking(hoveringIssueID, containerId, ranking, issueList) {
  const { issues } = issueList[containerId]
  const { length } = issues
  if (length === 0) {
    return ranking
  } else {
    if (!hoveringIssueID) {
      return issueList[containerId].issues[length - 1].ranking - 1
    }
    for (let i = 0; i < issues.length; i++) {
      if (issues[i].id === hoveringIssueID) {
        if (i === 0) return issues[i].ranking + 1
        return (issues[i].ranking + issues[i - 1].ranking) / 2
      }
    }
    return ranking
  }
}
