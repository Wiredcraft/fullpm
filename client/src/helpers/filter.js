export function checkIsfiltered(filter, issue) {
  if (filter === '') return false
  filter = filter.trim().toLowerCase()

  const rules = []
  if (filter.indexOf('is:pr') !== -1) rules.push(() => issue.isPullRequest)
  if (filter.indexOf('is:issue') !== -1) {
    rules.push(() => !issue.isPullRequest)
  }

  let isfiltered = false
  rules.forEach(foo => { if (!foo()) isfiltered = true })
  if (isfiltered) return true
  
  const pattern = /(is:\w*)/g
  filter = filter.replace(pattern, '')
  return issue.title.toLowerCase().indexOf(filter) === -1
}
