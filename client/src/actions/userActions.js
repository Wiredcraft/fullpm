/* global API_BASE_URL */
import request from 'superagent'


export const CHANGE_LOGIN_STATE = 'CHANGE_LOGIN_STATE'

export function updateUserLoginState (payload) {
  return dispatch => {
    dispatch({ type: CHANGE_LOGIN_STATE, payload })
  }
}

export function checkIsUserLogged () {
  return dispatch => {
    const url = `${API_BASE_URL}/auth/user`
    request
      .get(url)
      .withCredentials()
      .end((err, res) => {
        // User haven't authenticated
        if (res.status === 401) return
        if (err) return console.error(err)

        const result = JSON.parse(res.text)
        dispatch(updateUserLoginState({ isLogin: true, userName: result.login }))
      })
  }
}

export function githubAuth() {
  const url = `${API_BASE_URL}/auth/github?redirect=${window.location.href}`
  window.location = url
}
