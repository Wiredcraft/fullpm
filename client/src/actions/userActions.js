export const CHANGE_LOGIN_STATE = 'CHANGE_LOGIN_STATE'

export function updateUserLoginState (payload) {
  return dispatch => (
    dispatch({ type: CHANGE_LOGIN_STATE, payload })
  )
}

export function githubAuth() {
  const url = `${API_BASE_URL}/auth/github?redirect=${window.location.href}`
  window.location = url
}
