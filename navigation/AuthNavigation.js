import { NavigationContainer } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { firebaseAuth } from '../config/firebase.config'
import { onAuthStateChanged } from 'firebase/auth'
import { SignedInStack, SignedOutStack } from './Navigation'

const AuthNavigation = () => {
  const [currentUser, setCurrentUser] = useState(null)

  const userHandler = user => {
    user ? setCurrentUser(user) : setCurrentUser(null)
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, user => {
      userHandler(user)
    })

    // Clean up subscription on unmount
    return unsubscribe
  }, [])

  return (
    <NavigationContainer>
      {currentUser ? <SignedInStack /> : <SignedOutStack />}
    </NavigationContainer>
  )
}

export default AuthNavigation
