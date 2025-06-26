import React, { useState } from 'react'
import {
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CButton,
  CForm,
  CFormInput,
  CFormLabel,
} from '@coreui/react'

const RegisterModal = ({ visible, onClose }) => {
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!username.trim()) {
      setError('Username is required')
      return
    }

    try {
      const response = await api.unauthorized.get(
        api.buildUrl('register', { username }),
        null
      )

      const data = await response.json()

      if (response.ok) {
        const activeUser = {
          googleId: data.extra.googleId,
          username: data.extra.username,
          profilePicture: data.extra.profilePicture,
          firstName: data.extra.firstName
        }

        localStorage.setItem('activeUser', JSON.stringify(activeUser))
        const url = new URL(window.location);
        url.searchParams.delete('register');
        window.history.replaceState({}, document.title, url.toString());

        onClose()

      } else if (!response.ok) {
        setError(data.message)
      }
    } catch (err) {
      setError('Network error')
    }
  }

  return (
    <CModal
      visible={visible}
      onClose={onClose}
      backdrop="static"
      keyboard={false}
    >
      <CModalHeader closeButton>Register</CModalHeader>
      <CModalBody>
        <CForm onSubmit={handleSubmit}>
          <CFormLabel htmlFor="username">Username</CFormLabel>
          <CFormInput
            id="username"
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          {error && <div className="text-danger mt-2">{error}</div>}
        </CForm>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={onClose}>
          Cancel
        </CButton>
        <CButton color="primary" onClick={handleSubmit}>
          Continue
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

export default RegisterModal
