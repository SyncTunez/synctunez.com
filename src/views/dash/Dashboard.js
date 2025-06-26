import React, {useContext, useEffect, useState} from "react";

import {
  CButton,
  CCard,
  CCardBody, CCardFooter, CCardHeader,
  CCol, CModal, CModalBody, CModalFooter, CModalHeader,
  CRow, CWidgetStatsF,
} from "@coreui/react";
import {
  cibSpotify,
  cibTidal, cilUser
} from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import { youtube } from "src/assets/brand/other/youtube";
import { AppleLogo } from "src/assets/brand/other/apple";
import {UserContext} from "src/api/UserContext";
import SecureContent from "src/components/SecureContent";
import FriendsCard from "src/views/dash/impl/FriendsCard";
import api from 'src/api/apiClient'

const DashboardContent = () => {
  const { userAccount } = useContext(UserContext);
  const isLinkedSpotify = userAccount?.hasSpotify === true;
  const [visible, setVisible] = useState(false);

  const [spotifyName, setSpotifyName] = useState(null);
  const [spotifyID, setSpotifyID] = useState(null);

  useEffect(() => {
    if (isLinkedSpotify) {
      api.authorized.get("spotify/account","json")
        .then((res) => {
          if (res.data?.display_name) {
            setSpotifyName(res.data.display_name);
            setSpotifyID(res.data.id);
          }
        })
        .catch((err) => {
          console.error("Error fetching Spotify account:", err);
        });
    }
  }, [isLinkedSpotify]);

  return (
    <>
      <CRow>
        <CCol xs={3}>
          <CWidgetStatsF
            className="mb-3"
            icon={<CIcon icon={cibSpotify} height={36} style={{ color: '#1DB954' }} />}
            title={spotifyName}
            value="Spotify"
            footer={
              isLinkedSpotify ? (
                <div className="d-flex gap-2">
                  <CButton
                    color="secondary"
                    style={{ width: "50%" }}
                    href={`https://open.spotify.com/user/${spotifyID}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <CIcon icon={cilUser} className="me-1" />
                    Profile
                  </CButton>
                  <CButton
                    color="danger"
                    style={{ width: "50%" }}
                    onClick={() => setVisible(true)}
                  >
                    Unlink
                  </CButton>
                </div>
              ) : (
                <CButton
                  style={{ width: "100%" }}
                  href={api.buildUrl("link/spotify")}
                  color="primary"
                >
                  Link
                </CButton>
              )
            }
          />
        </CCol>

        <CCol xs={3}>
          <CWidgetStatsF
            className="mb-3"
            icon={<AppleLogo />}
            title="?"
            value="Apple Music"
            footer={
              <CButton style={{ width: "100%" }} color="primary" >
                Link
              </CButton>
            }
          >
            <CButton color="link" href="https://music.apple.com" >Link</CButton>
          </CWidgetStatsF>
        </CCol>

        <CCol xs={3}>
          <CWidgetStatsF
            className="mb-3"
            icon={<CIcon icon={youtube} className="float-end" width={36} />}
            title="?"
            value="YouTube"
            footer={
              <CButton style={{ width: "100%" }} color="primary" >
                Link
              </CButton>
            }
          >
            <CButton color="link" href="https://youtube.com" >Link</CButton>
          </CWidgetStatsF>
        </CCol>

        <CCol xs={3}>
          <CWidgetStatsF
            className="mb-3"
            icon={<CIcon icon={cibTidal} height={36} style={{ color: '#FFFFFF' }} />}
            title="?"
            value="Tidal"
            footer={
              <CButton style={{ width: "100%" }} color="primary" >
                Link
              </CButton>
            }
          >
            <CButton color="link" href="https://tidal.com" >Link</CButton>
          </CWidgetStatsF>
        </CCol>
      </CRow>

      <CCard className="mb-4">
        <CCardBody>
          <CRow>
            <CCol sm={5}>
              <h4 id="traffic" className="card-title mb-0">Home</h4>
              <div className="small text-body-secondary"></div>
            </CCol>
          </CRow>
          Content Here
        </CCardBody>
      </CCard>

      <CRow>
        <FriendsCard/>

        <CCol xs="12" md="9">
          <CCard>
            <CCardHeader>Full Width Card</CCardHeader>
            <CCardBody>
              <blockquote className="blockquote mb-0">
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>
                <footer className="blockquote-footer">
                  Someone famous in <cite title="Source Title">Source Title</cite>
                </footer>
              </blockquote>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CModal visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader>Are you sure?</CModalHeader>
        <CModalBody>
          Do you really want to unlink your Spotify account? You will need to re-link it later if needed.
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>Cancel</CButton>
          <CButton
            color="danger"
            onClick={async () => {
              try {
                await api.authorized.get("spotify/unlink")
                window.location.reload() // Refresh the page
              } catch (error) {
                console.error("Unlink failed", error)
              }
            }}
          >
            Unlink
          </CButton>
        </CModalFooter>
      </CModal>

    </>
  );
};

const Dashboard = () => {
  return (
    <SecureContent fallback={<>Hmm NA</>}>
      <DashboardContent />
    </SecureContent>
  );
};

export default Dashboard;
