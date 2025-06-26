import React, { Suspense, useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { useSelector } from 'react-redux'
import {
  CSpinner,
  useColorModes,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CButton,
  CForm,
  CFormInput,
  CFormLabel,
} from '@coreui/react'
import './scss/style.scss'
import RegisterModal from "src/components/modals/RegisterModal";

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

const App = () => {
  const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
  const storedTheme = useSelector((state) => state.theme)
  const [showRegisterModal, setShowRegisterModal] = useState(false)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.href.split('?')[1])
    const theme = urlParams.get('theme')?.match(/^[A-Za-z0-9\s]+/)?.[0]

    if (theme) {
      setColorMode(theme)
    } else if (!isColorModeSet()) {
      setColorMode(storedTheme)
    }

    if (urlParams.has('register')) {
      setShowRegisterModal(true)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <div className="pt-3 text-center">
            <CSpinner color="primary" variant="grow" />
          </div>
        }
      >
        <Routes>
          <Route path="*" element={<DefaultLayout />} />
        </Routes>

        <RegisterModal visible={showRegisterModal} onClose={() => setShowRegisterModal(false)} />
      </Suspense>
    </BrowserRouter>
  )
}

export default App
