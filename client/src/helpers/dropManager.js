class DropManager {
  constructor() {
    this.lastHoverdIssueId = undefined
    this.isHoveringIssue = false
  }

  clearLastHoverdIssueId() {
    this.lastHoverdIssueId = undefined
  }
}

export default new DropManager()
