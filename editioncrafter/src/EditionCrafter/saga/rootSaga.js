import { all } from 'redux-saga/effects'

import routeListenerSaga from './RouteListenerSaga'

export default function* rootSaga() {
  yield all([
    routeListenerSaga(),
  ])
}
