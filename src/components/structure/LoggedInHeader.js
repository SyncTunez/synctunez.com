import React, {createContext, useContext} from 'react'
import {
  CAvatar,
  CBadge,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CButton,
} from '@coreui/react'
import {
  cilBell,
  cilCreditCard,
  cilCommentSquare,
  cilEnvelopeOpen,
  cilFile,
  cilLockLocked,
  cilSettings,
  cilTask,
  cilUser, cilAccountLogout,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import {UserContext} from "src/api/UserContext";
import api from "src/api/apiClient";

const ProfileHeaderButton = () => {

  const { userAccount } = useContext(UserContext);

  return (
    <CButton className="d-flex align-items-center profile-header-button" style={{ width: '100%', minWidth: 0, padding: '0.3rem 0.5rem', justifyContent: 'flex-start', marginTop: '0.5rem' }}>
      <CAvatar src={userAccount.profilePicture} size="md" />
      <div className="d-flex flex-column align-items-start" style={{ marginLeft: '0.5rem', minWidth: 0 }}>
        <span style={{ fontWeight: 500, fontSize: '1rem' }}>{userAccount.username}</span>
        <span className="profile-status-text" style={{ fontSize: '0.85rem' }}>Free</span>
      </div>
    </CButton>
  )
}

export default ProfileHeaderButton
