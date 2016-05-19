export const CHANGE_REPO_SELECTED = 'CHANGE_REPO_SELECTED'
export const CHANGE_REPOS = 'CHANGE_REPOS'

export function updateRepoSelected (selectedRepo) {
  return dispatch => (
    dispatch({ type: CHANGE_REPO_SELECTED, payload: selectedRepo })
  )
}
