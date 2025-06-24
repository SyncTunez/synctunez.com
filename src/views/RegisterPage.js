import React, {useEffect, useState} from 'react'
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CButton,
  CFormInput,
  CForm
} from '@coreui/react'
import {useLocation, useNavigate} from 'react-router-dom'

const RegisterPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [visible, setVisible] = useState(true)
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const bg = location.state?.background?.pathname || '/'
    // Use backgroundLocation if passed another way
    navigate(bg, { replace: true })
  }, [navigate, location])



  const handleClose = () => {
    setVisible(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!username.trim()) {
      setError('Username is required')
      return
    }

    try {
      const response = await fetch('api/register?username=' + encodeURIComponent(username), {
        method: 'POST',
      })

      if (response.redirected) {
        // Redirect to the new page (like /hello or /register?error)
        window.location.href = response.url
      } else if (!response.ok) {
        setError('Registration failed')
      }
    } catch (err) {
      setError('Network error')
    }
  }

  return (
    <CModal
      visible={visible}
      onClose={handleClose}
      backdrop="static"  // disables closing on backdrop click
      keyboard={false}   // disables closing on Escape key
    >
      <CModalHeader onClose={handleClose}>
        <CModalTitle>Register</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm onSubmit={handleSubmit}>
          <CFormInput
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoFocus
          />
          {error && <p style={{ color: 'red', marginTop: '0.5rem' }}>{error}</p>}
          <CButton color="primary" type="submit" style={{ marginTop: '1rem' }}>
            Submit
          </CButton>
        </CForm>
      </CModalBody>
    </CModal>
  )
}

export default RegisterPage
