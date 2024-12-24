import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

const Authentication = (props) => {
  const { handleCloseModal } = props

  const [isRegistration, setIsRegistration] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [error, setError] = useState(null)

  const { signup, login } = useAuth()

  const handleAuthenticate = async () => {
    if (
      !email ||
      !email.includes('@') ||
      !password ||
      password.lenth < 6 ||
      isAuthenticating
    )
      return

    try {
      setIsAuthenticating(true)
      setError(null)

      if (isRegistration) {
        // register user
        await signup(email, password)
      } else {
        // login user
        await login(email, password)
      }

      handleCloseModal()
    } catch (err) {
      console.error('Authentication error:', err)
      setError(err.message)
    } finally {
      setIsAuthenticating(false)
    }
  }

  return (
    <>
      <h2 className='sign-up-text'>{isRegistration ? 'Sign Up' : 'Login'}</h2>
      <p>
        {isRegistration ? 'Create an account.' : 'Sign in to your account.'}
      </p>

      {error && <p>❌ {error}</p>}

      <input
        type='text'
        placeholder='Email'
        value={email}
        onChange={(e) => {
          setEmail(e.target.value)
        }}
      />
      <input
        type='password'
        placeholder='**********'
        value={password}
        onChange={(e) => {
          setPassword(e.target.value)
        }}
      />
      <button onClick={handleAuthenticate}>
        <p>{isAuthenticating ? 'Authenticating...' : 'Submit'}</p>
      </button>
      <hr />
      <div className='register-content'>
        <p>
          {isRegistration
            ? 'Already have an account?'
            : "Don't have an account?"}
        </p>
        <button
          onClick={() => {
            setIsRegistration(!isRegistration)
          }}
        >
          <p>{isRegistration ? 'Login' : 'Sign up'}</p>
        </button>
      </div>
    </>
  )
}

export default Authentication
