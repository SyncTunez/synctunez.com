import React, { useContext, useEffect, useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CButton,
  CTooltip,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormInput,
  CAvatar,
  CListGroup,
  CListGroupItem,
  CSpinner,
  CAlert,
  CFormSelect, CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilUserPlus, cilUserX, cilShareAll, cilList } from '@coreui/icons'
import api from 'src/api/apiClient'
import { UserContext } from 'src/api/UserContext'

const FILTER_MODES = {
  ALL: 'all',
  RECENT: 'recent',
  FAVORITES: 'favorites',
  ALPHABETICAL: 'alphabetical',
}

const LOCAL_STORAGE_KEY = 'favoriteFriends'

const FriendsCard = () => {
  const [friends, setFriends] = useState(new Map())
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [friendName, setFriendName] = useState('')
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState(null)
  const [modalMode, setModalMode] = useState('add')
  const [shareLink, setShareLink] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterMode, setFilterMode] = useState(FILTER_MODES.ALL)
  const [favorites, setFavorites] = useState(() => {
    return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || []
  })
  // Context menu state: visible + position + friend targeted
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    friendName: null,
  })

  const { userAccount } = useContext(UserContext)

  useEffect(() => {
    fetchFriends()
  }, [])

  // Close context menu on global click
  useEffect(() => {
    const handleClick = () => {
      if (contextMenu.visible) {
        setContextMenu({ ...contextMenu, visible: false, friendName: null })
      }
    }
    window.addEventListener('click', handleClick)
    return () => window.removeEventListener('click', handleClick)
  }, [contextMenu])

  const fetchFriends = async () => {
    setLoading(true)
    try {
      const res = await api.authorized.get('account/friends')
      const friendsArray = res.data || [] // array of { username, addTime }

      const enrichedEntries = await Promise.all(
        friendsArray.map(async ({ username, addTime }) => {
          const profileUrl = await getProfilePictureUrl(username)
          return [username, { timestamp: addTime, profileUrl }]
        })
      )

      const friendsMap = new Map(enrichedEntries)
      setFriends(friendsMap)
    } catch (e) {
      console.error('Error fetching friends or profile pictures', e)
    } finally {
      setLoading(false)
    }
  }

  const getProfilePictureUrl = async (name) => {
    try {
      const res = await api.unauthorized.get(
        `account/profilePicture?profile=${encodeURIComponent(name)}`
      )
      return res.data
    } catch {
      return ''
    }
  }

  const openModal = (mode, defaultName = '') => {
    setModalMode(mode)
    setFriendName(defaultName)
    setError(null)

    if (mode === 'share') {
      const baseUrl = window.location.origin
      const link = `${baseUrl}/profile/${userAccount?.username || 'user'}`
      setShareLink(link)
    } else {
      setShareLink('')
    }

    setShowModal(true)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink)
    setShowModal(false)
  }

  const handleFriendAction = async () => {
    setError(null)
    const trimmed = friendName.trim()
    if (!trimmed) {
      setError('Please enter a friend name.')
      return
    }

    setProcessing(true)

    try {
      const endpoint =
        modalMode === 'add'
          ? `account/addFriend?friend=${encodeURIComponent(trimmed)}`
          : `account/removeFriend?friend=${encodeURIComponent(trimmed)}`

      await api.authorized.get(endpoint)
      setShowModal(false)
      setFriendName('')
      fetchFriends()
    } catch {
      setError(`Failed to ${modalMode} friend. Try again.`)
    } finally {
      setProcessing(false)
    }
  }

  const toggleFavorite = (name) => {
    const updated = favorites.includes(name)
      ? favorites.filter((n) => n !== name)
      : [...favorites, name]
    setFavorites(updated)
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated))
  }

  const handleContextMenu = (event, name) => {
    event.preventDefault()
    setContextMenu({
      visible: true,
      x: event.pageX,
      y: event.pageY,
      friendName: name,
    })
  }

  const filteredFriends = Array.from(friends.entries())
    .filter(([name]) => name.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter(([name, { timestamp }]) => {
      switch (filterMode) {
        case FILTER_MODES.RECENT:
          return true // All included, sorted below
        case FILTER_MODES.FAVORITES:
          return favorites.includes(name)
        case FILTER_MODES.ALPHABETICAL:
          return true // All included, sorted below
        default:
          return true
      }
    })
    .sort(([nameA, a], [nameB, b]) => {
      switch (filterMode) {
        case FILTER_MODES.RECENT:
          return b.timestamp - a.timestamp
        case FILTER_MODES.ALPHABETICAL:
          return nameA.localeCompare(nameB)
        default:
          return 0
      }
    })

  return (
    <CCol xs="12" md="4" lg="3" style={{ position: 'relative' }}>
      <CCard className="shadow-sm">
        <CCardHeader className="d-flex flex-column gap-2">
          <div className="d-flex justify-content-between align-items-center">
            <strong>Friends</strong>
            <div>
              <CButton color="primary" className="me-1" size="sm" onClick={() => openModal('add')}>
                <CIcon icon={cilUserPlus} />
              </CButton>
              <CButton
                color="info"
                size="sm"
                onClick={() => openModal('share')}
                title="Share Friends List"
              >
                <CIcon icon={cilShareAll} />
              </CButton>
            </div>
          </div>
          <CRow className="g-2">
            <CCol xs="7">
              <CFormInput
                size="sm"
                placeholder="Search friends..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </CCol>
            <CCol xs="5">
              <CFormSelect
                size="sm"
                value={filterMode}
                onChange={(e) => setFilterMode(e.target.value)}
              >
                <option value={FILTER_MODES.ALL}>All</option>
                <option value={FILTER_MODES.RECENT}>Recently Added</option>
                <option value={FILTER_MODES.FAVORITES}>Favorites</option>
                <option value={FILTER_MODES.ALPHABETICAL}>Alphabetical</option>
              </CFormSelect>
            </CCol>
          </CRow>
        </CCardHeader>
        <CCardBody className="p-0">
          {loading ? (
            <div className="text-center py-4">
              <CSpinner color="primary" />
              <p className="mt-2">Loading friends...</p>
            </div>
          ) : filteredFriends.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-muted">No friends found.</p>
              <CButton color="success" size="sm" onClick={() => openModal('add')}>
                Add Friend
              </CButton>
            </div>
          ) : (
            <CListGroup flush>
              {filteredFriends.map(([name, { profileUrl }]) => (
                <CListGroupItem
                  key={name}
                  className="d-flex align-items-center justify-content-between"
                  onContextMenu={(e) => handleContextMenu(e, name)}
                >
                  <div className="d-flex align-items-center gap-3">
                    <CAvatar src={profileUrl} size="md" />
                    <strong>{name}</strong>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <CButton
                      color={favorites.includes(name) ? 'warning' : 'light'}
                      size="sm"
                      onClick={() => toggleFavorite(name)}
                      title="Toggle Favorite"
                    >
                      ★
                    </CButton>
                    <CTooltip content="Compare">
                      <CButton color="info" size="sm" variant="ghost">
                        <CIcon icon={cilList} />
                      </CButton>
                    </CTooltip>
                  </div>
                </CListGroupItem>
              ))}
            </CListGroup>
          )}
        </CCardBody>
      </CCard>

      {/* Context Menu */}
      {contextMenu.visible && (
        <div
          style={{
            position: 'absolute',
            top: contextMenu.y,
            left: contextMenu.x,
            backgroundColor: 'white',
            border: '1px solid #ccc',
            boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
            zIndex: 1000,
            padding: '4px 8px',
            borderRadius: 4,
            userSelect: 'none',
            cursor: 'pointer',
          }}
          onClick={() => {
            openModal('remove', contextMenu.friendName)
            setContextMenu({ ...contextMenu, visible: false, friendName: null })
          }}
        >
          Remove "{contextMenu.friendName}"
        </div>
      )}

      <CModal visible={showModal} onClose={() => setShowModal(false)}>
        <CModalHeader closeButton>
          <CModalTitle>
            {modalMode === 'add'
              ? 'Add a Friend'
              : modalMode === 'remove'
                ? `Remove friend "${friendName}"?`
                : `Share ${friendName ? friendName + "'s profile" : 'Friends List'}`}
          </CModalTitle>
        </CModalHeader>
        <CModalBody className="text-center">
          {modalMode === 'add' && (
            <>
              <CFormInput
                placeholder={`Enter friend's username to add`}
                value={friendName}
                onChange={(e) => setFriendName(e.target.value)}
                disabled={processing}
              />
              {error && (
                <CAlert color="danger" className="mt-2 py-1">
                  {error}
                </CAlert>
              )}
            </>
          )}

          {modalMode === 'remove' && (
            <p>
              Are you sure you want to remove <strong>{friendName}</strong> from your friends?
            </p>
          )}

          {modalMode === 'share' && (
            <>
              <img
                alt="QR Code"
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                  shareLink,
                )}`}
                style={{ marginBottom: 12 }}
              />
              <p>{shareLink}</p>
              <CButton color="primary" onClick={copyToClipboard}>
                Copy Link
              </CButton>
            </>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowModal(false)} disabled={processing}>
            Cancel
          </CButton>

          {(modalMode === 'add' || modalMode === 'remove') && (
            <CButton
              color={modalMode === 'add' ? 'primary' : 'danger'}
              onClick={handleFriendAction}
              disabled={processing}
            >
              {processing
                ? modalMode === 'add'
                  ? 'Adding...'
                  : 'Removing...'
                : modalMode === 'add'
                  ? 'Add Friend'
                  : 'Yes, Remove'}
            </CButton>
          )}
        </CModalFooter>
      </CModal>
    </CCol>
  )
}

export default FriendsCard
