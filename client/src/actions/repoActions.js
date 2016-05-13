export const CHANGE_SELECTED_REPO = 'CHANGE_SELECTED_REPO'
export const CHANGE_REPOS = 'CHANGE_REPOS'

export function updateRepoSelected (selectedRepo) {
  return dispatch => (
    dispatch({ type: CHANGE_SELECTED_REPO, payload: selectedRepo })
  )
}
