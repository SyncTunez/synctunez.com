import React, { useState } from 'react'
import {
  CContainer, CRow, CCol, CCard, CCardBody, CCardHeader, CForm, CFormInput, CFormTextarea, CFormCheck, CFormSelect, CButton, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CBadge, CTooltip, CSpinner, CAlert, CDropdown, CDropdownToggle, CDropdownMenu, CDropdownItem
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilFilter, cilSwapVertical, cilUserPlus, cilOptions, cilMusicNote, cibSpotify, cibApple, cibYoutube, cibTidal, cilReload } from '@coreui/icons'
import { youtube } from '../assets/brand/other/youtube';
import { AppleLogo } from '../assets/brand/other/apple';
import { MusicPlatforms, platformIcons } from '../api/data/MusicPlatforms';

// Mock data for demonstration
const mockYourPlaylists = [
  { id: 1, name: 'Summer Vibes 2025', songs: 32, duration: '1h 45m', platform: MusicPlatforms.SPOTIFY },
  { id: 2, name: 'Workout Mix', songs: 24, duration: '1h 12m', platform: MusicPlatforms.SPOTIFY },
  { id: 3, name: 'Chill Evening', songs: 18, duration: '1h 5m', platform: MusicPlatforms.SPOTIFY },
]
const mockFriendsPlaylists = [
  { id: 4, name: 'Party Hits', songs: 45, duration: '2h 30m', platform: MusicPlatforms.SPOTIFY, owner: 'Jamie' },
  { id: 5, name: 'Road Trip Mix', songs: 28, duration: '1h 35m', platform: MusicPlatforms.APPLE_MUSIC, owner: 'Taylor' },
]
const mockPreviewSongs = [
  { title: 'Die With A Smile', artist: 'Lady Gaga, Bruno Mars', album: 'Die With A Smile', source: 'Your Playlist', duration: '3:42' },
  { title: 'BIRDS OF A FEATHER', artist: 'Billie Eilish', album: 'HIT ME HARD AND SOFT', source: "Alex's Playlist", duration: '3:30' },
  { title: 'Fortnight', artist: 'Taylor Swift', album: 'The Tortured Poets Department', source: "Taylor's Playlist", duration: '3:05' },
  { title: 'Taste', artist: 'Sabrina Carpenter', album: 'Short n\' Sweet', source: 'Your Playlist', duration: '2:37' },
  { title: 'APT.', artist: 'ROSÉ, Bruno Mars', album: 'APT.', source: "Alex's Playlist", duration: '2:49' },
]

const platformOptions = [
  { label: 'All', value: 'All' },
  { label: MusicPlatforms.SPOTIFY, value: MusicPlatforms.SPOTIFY },
  { label: MusicPlatforms.APPLE_MUSIC, value: MusicPlatforms.APPLE_MUSIC },
  { label: MusicPlatforms.YOUTUBE, value: MusicPlatforms.YOUTUBE },
  { label: MusicPlatforms.TIDAL, value: MusicPlatforms.TIDAL },
]

const PlaylistList = ({ playlists, title }) => {
  const [selectedPlatform, setSelectedPlatform] = useState('All')
  const handlePlatformFilter = (platform) => {
    setSelectedPlatform(platform)
    // TODO: implement actual filtering logic
  }
  return (
    <CCard className="mb-4">
      <CCardHeader className="d-flex justify-content-between align-items-center">
        <strong>{title}</strong>
        <div className="d-flex align-items-center">
          <CFormInput size="sm" placeholder="Search" className="me-2" style={{ width: 140 }} />
          <CDropdown alignment="end">
            <CDropdownToggle color="secondary" size="sm">
              <CIcon icon={cilFilter} className="me-1" />
              {selectedPlatform !== 'All' && <span>{selectedPlatform}</span>}
            </CDropdownToggle>
            <CDropdownMenu>
              {platformOptions.map(opt => (
                <CDropdownItem
                  key={opt.value}
                  active={selectedPlatform === opt.value}
                  onClick={() => handlePlatformFilter(opt.value)}
                  style={opt.value === 'All' ? { color: 'black !important' } : {}}
                >
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    {platformIcons[opt.value] && React.cloneElement(platformIcons[opt.value], { height: 16, width: 16 })}
                    <span>{opt.label}</span>
                  </span>
                </CDropdownItem>
              ))}
            </CDropdownMenu>
          </CDropdown>
        </div>
      </CCardHeader>
      <CCardBody style={{ maxHeight: 260, overflowY: 'auto', padding: 0 }}>
        {playlists.map((pl) => (
          <div key={pl.id} className="d-flex align-items-center px-3 py-2 border-bottom">
            <CFormCheck className="me-3 custom-checkbox" style={{ transform: 'scale(1.4)', accentColor: '#1DB954', minWidth: 28, minHeight: 28 }} />
            <div className="flex-grow-1" style={{ padding: '8px 0', marginLeft: 20 }}>
              <div style={{ fontWeight: 500 }}>{pl.name}</div>
              <div style={{ fontSize: 12, color: '#888' }}>{pl.songs} songs • {pl.duration}</div>
            </div>
            <CBadge color="primary" className="ms-2" style={{ fontSize: 14, padding: '4px 10px' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                {platformIcons[pl.platform] && React.cloneElement(platformIcons[pl.platform], { height: 16, width: 16 })}
                <span>{pl.platform}</span>
              </span>
            </CBadge>
          </div>
        ))}
      </CCardBody>
      <div className="px-3 py-2">
        <CTooltip content="Load more playlists" placement="top" trigger="hover focus">
          <CButton color="link" className="p-0 d-flex align-items-center">
            <CIcon icon={cilReload} className="me-1" />+ Load more playlists
          </CButton>
        </CTooltip>
      </div>
    </CCard>
  )
}

const FriendsList = ({ playlists }) => {
  const [selectedPlatform, setSelectedPlatform] = useState('All')
  const handlePlatformFilter = (platform) => {
    setSelectedPlatform(platform)
    // TODO: implement actual filtering logic
  }
  return (
    <CCard>
      <CCardHeader className="d-flex justify-content-between align-items-center">
        <strong>Friends' Playlists</strong>
        <div className="d-flex align-items-center">
          <CFormInput size="sm" placeholder="Search" className="me-2" style={{ width: 140 }} />
          <CDropdown alignment="end">
            <CDropdownToggle color="secondary" size="sm">
              <CIcon icon={cilFilter} className="me-1" />
              {selectedPlatform !== 'All' && <span>{selectedPlatform}</span>}
            </CDropdownToggle>
            <CDropdownMenu>
              {platformOptions.map(opt => (
                <CDropdownItem
                  key={opt.value}
                  active={selectedPlatform === opt.value}
                  onClick={() => handlePlatformFilter(opt.value)}
                  style={opt.value === 'All' ? { color: 'black !important' } : {}}
                >
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    {platformIcons[opt.value] && React.cloneElement(platformIcons[opt.value], { height: 16, width: 16 })}
                    <span>{opt.label}</span>
                  </span>
                </CDropdownItem>
              ))}
            </CDropdownMenu>
          </CDropdown>
        </div>
      </CCardHeader>
      <div className="px-3 py-2 d-flex justify-content-between align-items-center">
        <div>
          <CBadge color="info" className="me-2">Jamie</CBadge>
          <CBadge color="info" className="me-2">Taylor</CBadge>
        </div>
        <CTooltip content="Add a friend" placement="top" trigger="hover focus">
          <CButton color="link" size="sm" className="d-flex align-items-center">
            <CIcon icon={cilUserPlus} className="me-1" />+ Add friend
          </CButton>
        </CTooltip>
      </div>
      <CCardBody style={{ maxHeight: 260, overflowY: 'auto', padding: 0 }}>
        {playlists.map((pl) => (
          <div key={pl.id} className="d-flex align-items-center px-3 py-2 border-bottom">
            <CFormCheck className="me-3 custom-checkbox" style={{ transform: 'scale(1.4)', accentColor: '#1DB954', minWidth: 28, minHeight: 28 }} />
            <div className="flex-grow-1" style={{ padding: '8px 0', marginLeft: 20 }}>
              <div style={{ fontWeight: 500 }}>{pl.name}</div>
              <div style={{ fontSize: 12, color: '#888' }}>{pl.songs} songs • {pl.duration} • {pl.owner}</div>
            </div>
            <CBadge color="primary" className="ms-2" style={{ fontSize: 14, padding: '4px 10px' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                {platformIcons[pl.platform] && React.cloneElement(platformIcons[pl.platform], { height: 16, width: 16 })}
                <span>{pl.platform}</span>
              </span>
            </CBadge>
          </div>
        ))}
      </CCardBody>
      <div className="px-3 py-2">
        <CTooltip content="Load more playlists" placement="top" trigger="hover focus">
          <CButton color="link" className="p-0 d-flex align-items-center text-decoration-line-through">
            <CIcon icon={cilReload} className="me-1" />+ Load more playlists
          </CButton>
        </CTooltip>
      </div>
    </CCard>
  )
}

const PlaylistMergePage = () => {
  const [playlistTitle, setPlaylistTitle] = useState('Summer + Workout Mix')
  const [playlistDesc, setPlaylistDesc] = useState('')
  const [mergeMethod, setMergeMethod] = useState('union')
  const [removeDuplicates, setRemoveDuplicates] = useState(true)
  const [smartOrdering, setSmartOrdering] = useState(false)
  const [includeCredits, setIncludeCredits] = useState(false)
  const [exportTo, setExportTo] = useState('Spotify')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  return (
    <CContainer fluid className="py-4 bg-transparent" style={{ minHeight: '100vh' }}>
      <div className="mb-4">
        <h2 className="fw-bold">Import & Merge Playlists</h2>
        <p className="text-muted mb-0">Combine playlists from multiple platforms and friends into a new custom playlist.</p>
      </div>
      {loading && (
        <CAlert color="info" className="d-flex align-items-center">
          <CSpinner size="sm" className="me-2" />
          Loading...
        </CAlert>
      )}
      {error && <CAlert color="danger">{error}</CAlert>}
      <CRow className="g-4">
        {/* Left: Playlists */}
        <CCol md={8}>
          <PlaylistList playlists={mockYourPlaylists} title="Your Playlists" />
          <FriendsList playlists={mockFriendsPlaylists} />
        </CCol>
        {/* Right: Output Settings */}
        <CCol md={4}>
          <CCard className="shadow-sm bg-transparent border-0">
            <CCardHeader className="bg-transparent border-0">
              <h6 className="mb-0 fw-bold">Output Playlist Settings</h6>
            </CCardHeader>
            <CCardBody>
              <CForm>
                <div className="mb-3">
                  <CFormInput
                    label="Playlist Title"
                    value={playlistTitle}
                    onChange={e => setPlaylistTitle(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <CFormTextarea
                    label="Description (Optional)"
                    value={playlistDesc}
                    onChange={e => setPlaylistDesc(e.target.value)}
                    rows={2}
                  />
                </div>
                <div className="mb-3">
                  <div className="form-label fw-bold">Merge Method</div>
                  <CFormCheck
                    type="radio"
                    name="mergeMethod"
                    label="All songs (union)"
                    checked={mergeMethod === 'union'}
                    onChange={() => setMergeMethod('union')}
                  />
                  <CFormCheck
                    type="radio"
                    name="mergeMethod"
                    label="Common songs (intersection)"
                    checked={mergeMethod === 'intersection'}
                    onChange={() => setMergeMethod('intersection')}
                  />
                </div>
                <div className="mb-3">
                  <div className="form-label fw-bold">Additional Options</div>
                  <CFormCheck
                    type="checkbox"
                    label="Remove duplicate songs"
                    checked={removeDuplicates}
                    onChange={() => setRemoveDuplicates(v => !v)}
                  />
                  <CFormCheck
                    type="checkbox"
                    label="Smart ordering (based on BPM and mood)"
                    checked={smartOrdering}
                    onChange={() => setSmartOrdering(v => !v)}
                  />
                  <CFormCheck
                    type="checkbox"
                    label="Include contributor credits in description"
                    checked={includeCredits}
                    onChange={() => setIncludeCredits(v => !v)}
                  />
                </div>
                <div className="mb-3">
                  <CFormSelect
                    label="Export To"
                    value={exportTo}
                    onChange={e => setExportTo(e.target.value)}
                  >
                    <option value={MusicPlatforms.SPOTIFY}>{MusicPlatforms.SPOTIFY}</option>
                    <option value={MusicPlatforms.APPLE_MUSIC}>{MusicPlatforms.APPLE_MUSIC}</option>
                    <option value={MusicPlatforms.YOUTUBE}>{MusicPlatforms.YOUTUBE}</option>
                    <option value={MusicPlatforms.TIDAL}>{MusicPlatforms.TIDAL}</option>
                  </CFormSelect>
                </div>
                <div className="mb-3 text-muted">
                  <div>Playlist Summary</div>
                  <div>~89 songs • ~4h 30m</div>
                  <CBadge color="secondary">3 playlists selected</CBadge>
                </div>
                <CButton color="dark" className="w-100 fw-bold" size="lg">+ Create Merged Playlist</CButton>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      {/* Playlist Preview */}
      <CCard className="mt-4 shadow-sm bg-transparent border-0">
        <CCardHeader className="bg-transparent border-0 d-flex justify-content-between align-items-center">
          <h6 className="mb-0 fw-bold">Playlist Preview (87 songs)</h6>
          <div className="d-flex gap-2">
            <CTooltip content="Filter songs">
              <CButton color="outline-secondary" size="sm">
                <CIcon icon={cilFilter} />
              </CButton>
            </CTooltip>
            <CTooltip content="Sort songs">
              <CButton color="outline-secondary" size="sm">
                <CIcon icon={cilSwapVertical} />
              </CButton>
            </CTooltip>
          </div>
        </CCardHeader>
        <CCardBody className="p-0 bg-transparent">
          <CTable hover responsive align="middle" className="mb-0">
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col" style={{ width: 30 }}>#</CTableHeaderCell>
                <CTableHeaderCell scope="col">Title</CTableHeaderCell>
                <CTableHeaderCell scope="col">Artist</CTableHeaderCell>
                <CTableHeaderCell scope="col">Album</CTableHeaderCell>
                <CTableHeaderCell scope="col">Source</CTableHeaderCell>
                <CTableHeaderCell scope="col">Duration</CTableHeaderCell>
                <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {mockPreviewSongs.map((song, idx) => (
                <CTableRow key={idx}>
                  <CTableDataCell>{idx + 1}</CTableDataCell>
                  <CTableDataCell>{song.title}</CTableDataCell>
                  <CTableDataCell>{song.artist}</CTableDataCell>
                  <CTableDataCell>{song.album}</CTableDataCell>
                  <CTableDataCell>{song.source}</CTableDataCell>
                  <CTableDataCell>{song.duration}</CTableDataCell>
                  <CTableDataCell>
                    <CDropdown alignment="end">
                      <CDropdownToggle color="light" size="sm">
                        <CIcon icon={cilOptions} />
                      </CDropdownToggle>
                      <CDropdownMenu>
                        <CDropdownItem>View Details</CDropdownItem>
                        <CDropdownItem>Remove from Playlist</CDropdownItem>
                      </CDropdownMenu>
                    </CDropdown>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </CCardBody>
        <div className="d-flex justify-content-between align-items-center p-3 border-top bg-transparent">
          <small className="text-muted">Showing 5 of 87 songs</small>
          <div className="d-flex gap-1">
            <CButton color="outline-secondary" size="sm">{'<'}</CButton>
            <CButton color="primary" size="sm" className="fw-bold">1</CButton>
            <CButton color="outline-secondary" size="sm">2</CButton>
            <CButton color="outline-secondary" size="sm">3</CButton>
            <CButton color="outline-secondary" size="sm">{'>'}</CButton>
          </div>
        </div>
      </CCard>
    </CContainer>
  )
}

export default PlaylistMergePage 