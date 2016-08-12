export function checkIsfiltered(filter, issue) {
  if (filter === '') return false
  filter = filter.trim().toLowerCase()

  const rules = []
  if (filter.indexOf('is:pr') !== -1) rules.push(() => issue.isPullRequest)
  if (filter.indexOf('is:issue') !== -1) {
    rules.push(() => !issue.isPullRequest)
  }
  const assigneePattern = /(assignee:\w*)/g
  if (assigneePattern.test(filter)) {
    const role = filter.match(assigneePattern)[0].replace('assignee:', '')
    rules.push(() => issue.assignees.some(d => d.login.toLowerCase() === role))
  }

  let isfiltered = false
  rules.forEach(foo => { if (!foo()) isfiltered = true })
  if (isfiltered) return true

  const patterns = [
    /(is:\w*)/g,
    assigneePattern
  ]
  patterns.forEach(p => filter = filter.replace(p, ''))
  filter = filter.trim()
  if (filter === '') return false

  return issue.title.toLowerCase().indexOf(filter) === -1
}
