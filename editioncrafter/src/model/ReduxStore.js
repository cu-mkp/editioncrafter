import { applyMiddleware, createStore } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { put } from 'redux-saga/effects'
import rootReducer from '../action/rootReducer'
import rootSaga from '../saga/rootSaga'

// Call this once to create a new redux store that is properly configured.
export function createReduxStore(config) {
  const sagaMiddleware = createSagaMiddleware()
  const store = createStore(
    rootReducer(config),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
    applyMiddleware(sagaMiddleware),
  )
  sagaMiddleware.run(rootSaga)
  return store
}

// Dispatch the action with the given parameters.
export function dispatchAction(props, action, ...params) {
  props.dispatch({ type: action, payload: { params, dispatcher: { dispatch: props.dispatch } } })
}

// Dispatch the action via Redux Saga.
export function* putResolveAction(action, ...params) {
  return yield put({ type: action, payload: { params } })
}

// Take the action and call it with the current redux state.
function reducer(state, actionFn, action) {
  const params = (action.payload && action.payload.params) ? action.payload.params : []
  return actionFn(state, ...params, action.payload.dispatcher)
}

function getActionFn(action, actionModule) {
  const parts = action.split('.')
  return actionModule[parts[1]]
}

// Create a reducer that only services actions in the action set.
export function createReducer(actionModuleName, actionModule, initialState) {
  // get the function keys from the module itself
  const actionNames = []
  for (const action of Object.keys(actionModule)) {
    actionNames.push(`${actionModuleName}.${action}`)
  }

  function scopedReducer(state = initialState, action, validActions = actionNames, mod = actionModule) {
    if (validActions.includes(action.type)) {
      return reducer(state, getActionFn(action.type, mod), action)
    }
    return { ...state }
  }

  return scopedReducer
}
