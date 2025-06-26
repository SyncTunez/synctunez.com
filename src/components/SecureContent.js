import React, { useState, useEffect, useRef } from 'react'
import { UserContext } from '../api/UserContext'
import {UserAccount} from "src/api/data/UserAccount";

const getCookie = (name) => {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return decodeURIComponent(parts.pop().split(';').shift())
  return null
}

const parseUserAccount = () => {
  try {
    const cookieValue = getCookie('UserAccount')
    const rawData = cookieValue ? JSON.parse(cookieValue) : {}
    return new UserAccount(rawData)
  } catch {
    return null
  }
}
const SecureContent = ({ fallback, children }) => {
  const [userSession, setUserSession] = useState(getCookie('UserSession'))
  const [userAccount, setUserAccount] = useState(parseUserAccount())
  const intervalRef = useRef(null)

  useEffect(() => {
    const checkForUpdates = () => {
      const currentUserSession = getCookie('UserSession')
      const currentUserAccount = parseUserAccount()

      if (currentUserSession && currentUserSession !== userSession) {
        setUserSession(currentUserSession)
      }

      if (
        currentUserAccount &&
        JSON.stringify(currentUserAccount) !== JSON.stringify(userAccount)
      ) {
        setUserAccount(currentUserAccount)
      }

      if (currentUserSession && currentUserAccount) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    if (!(userSession && userAccount)) {
      intervalRef.current = setInterval(checkForUpdates, 200)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [userSession, userAccount])

  if (userSession && userAccount) {
    return (
      <UserContext.Provider value={{ userAccount, userSession }}>
        {children}
      </UserContext.Provider>
    )
  }

  return <>{fallback}</>
}

export default SecureContent
