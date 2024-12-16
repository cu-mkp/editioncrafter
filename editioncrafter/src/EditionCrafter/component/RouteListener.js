/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import { useLocation } from 'react-router'
import { dispatchAction } from '../model/ReduxStore'

function RouteListener(props) {
  const listening = useRef(false)

  const { pathname } = useLocation()

  const userNavigated = () => {
    dispatchAction(props, 'RouteListenerSaga.userNavigation', pathname)
  }

  useEffect(() => {
    if (!listening.current) {
      userNavigated()
      listening.current = true
    }
  }, [])

  useEffect(() => {
    userNavigated()
  }, [pathname])

  return null
}

function mapStateToProps(state) {
  return {
  }
}

export default connect(mapStateToProps)(RouteListener)
