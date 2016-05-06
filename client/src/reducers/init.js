import { Map } from 'immutable'


const initialState = Map({
  value: 1
})


export default function user (state = initialState, action) {
  switch (action.type) {
  default:
    return state
  }
}
