export default class DropManager {
  constructor() {
    this.hoveringIssueID = undefined
  }

  updatehoveringIssue(id) {
    this.hoveringIssueID = id
  }

  clearhoveringIssue() {
    this.hoveringIssueID = undefined
  }
}
