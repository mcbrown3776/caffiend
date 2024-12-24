import ReactDom from 'react-dom'

const Modal = (props) => {
  const { children, handleCloseModal } = props

  return ReactDom.createPortal(
    <div className='modal-container'>
      <button className='modal-underlay' onClick={handleCloseModal} />
      <div className='modal-content'>{children}</div>
    </div>,
    document.getElementById('portal')
  )
}

export default Modal
