import { useState } from 'react'
import Authentication from './Authentication'
import Modal from './Modal'
import { useAuth } from '../context/AuthContext'

const Layout = (props) => {
  const { children } = props

  const [showModal, setShowModal] = useState(false)

  const { globalUser, logout } = useAuth()

  const header = (
    <header>
      <div>
        <h1 className='text-gradient'>CAFFIEND</h1>
        <p>For Coffee Insatiates</p>
      </div>

      {globalUser ? (
        <button onClick={logout}>
          <p>Logout</p>
          <i className='fa-solid fa-arrow-right-from-bracket' />
        </button>
      ) : (
        <button
          onClick={() => {
            setShowModal(true)
          }}
        >
          <p>Sign up for free</p>
          <i className='fa-solid fa-mug-hot' />
        </button>
      )}
    </header>
  )

  const footer = (
    <footer>
      <p>
        <span className='text-gradient'>Caffiend</span> was created by{' '}
        <a href='https://github.com/mcbrown3776/caffiend.git' target='_blank'>
          Michael Brown
        </a>{' '}
        &copy; 2024
        {/* <br />
        using the{' '}
        <a href='https://www.fantacss.smoljames.com' target='_blank'>
          FantaCSS
        </a>{' '}
        design library. <br /> Credit to{' '}
        <a href='https://www.smoljames.com' target='_blank'>
          SmolJames
        </a>
        . */}
      </p>
    </footer>
  )

  const handleCloseModal = () => {
    setShowModal(false)
  }

  return (
    <>
      {showModal && (
        <Modal handleCloseModal={handleCloseModal}>
          <Authentication handleCloseModal={handleCloseModal} />
        </Modal>
      )}
      {header}
      <main>{children}</main>
      {footer}
    </>
  )
}

export default Layout
