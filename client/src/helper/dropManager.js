class DropManager {
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

//TODO move this to redux store
export default new DropManager()
