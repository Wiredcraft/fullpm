import thunkMiddleware from 'redux-thunk'
import { createStore, applyMiddleware } from 'redux'
import createLogger from 'redux-logger'
import rootReducer from 'reducers'

const logger = createLogger()
const store = createStore(
  rootReducer,
  process.env.NODE_ENV === 'dev' ?
    applyMiddleware(thunkMiddleware, logger) :
    applyMiddleware(thunkMiddleware)
)

export default store
