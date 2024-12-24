import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import { useState, useEffect, useContext, createContext } from 'react'
import { auth, db } from '../../firebase'
import { doc, getDoc } from 'firebase/firestore'

const AuthContext = createContext()

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  return useContext(AuthContext)
}

export const AuthProvider = (props) => {
  const { children } = props

  const [globalUser, setGlobalUser] = useState(null)
  const [globalData, setGlobalData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const signup = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password)
  }

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password)
  }

  const resetPassword = (email) => {
    return sendPasswordResetEmail(auth, email)
  }

  const logout = () => {
    setGlobalUser(null)
    setGlobalData(null)
    return signOut(auth)
  }

  const value = {
    globalUser,
    globalData,
    setGlobalData,
    isLoading,
    signup,
    login,
    logout,
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('CURRENT USER: ', user)
      setGlobalUser(user)

      // if no user return from listener
      if (!user) {
        console.log('No active user')
        return
      }

      // if user, check if user has data, if so, fetch data and update global state
      try {
        setIsLoading(true)

        // create a reference for the document (labelled json object), then get the doc
        // then snapshot it to see if there's data
        const docRef = doc(db, 'users', user.uid)
        const docSnap = await getDoc(docRef)

        let firebaseData = {}

        if (docSnap.exists()) {
          firebaseData = docSnap.data()
          console.log('Found user data', firebaseData)
        }

        setGlobalData(firebaseData)
      } catch (err) {
        console.error('Authentication error:', err)
      } finally {
        setIsLoading(false)
      }
    })

    return unsubscribe
  }, [])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
