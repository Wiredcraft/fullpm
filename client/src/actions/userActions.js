export const CHANGE_LOGIN_STATE = 'CHANGE_LOGIN_STATE'

export function updateUserLoginState (payload) {
  return dispatch => (
    dispatch({ type: CHANGE_LOGIN_STATE, payload })
  )
}
