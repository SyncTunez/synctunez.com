import React, { useContext } from "react";

import {
  CButton,
  CCard,
  CCardBody, CCardFooter, CCardHeader,
  CCol,
  CRow, CWidgetStatsF,
} from "@coreui/react";
import {
  cibSpotify,
  cibTidal,
  cilUserPlus,
  cilUserX,
} from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import { youtube } from "../../assets/brand/other/youtube";
import { AppleLogo } from "../../assets/brand/other/apple";
import {UserContext} from "src/api/UserContext";
import SecureContent from "src/components/SecureContent";
import FriendsCard from "src/views/dash/impl/FriendsCard";

const DashboardContent = () => {
  const { userAccount } = useContext(UserContext);

  const url = typeof userAccount?.hasSpotify === "boolean"
    ? String(userAccount.hasSpotify)
    : "unknown";

  return (
    <>
      <CRow>
        <CCol xs={3}>
          <CWidgetStatsF
            className="mb-3"
            icon={<CIcon icon={cibSpotify} height={36} style={{ color: '#1DB954' }} />}
            title="?"
            value="Spotify"
            footer={
              <CButton style={{ width: "100%" }} href={"api/link/spotify/"} color="primary" >
                Link {url}
              </CButton>
            }
          >
            <CButton color="link" href="https://spotify.com" >Link</CButton>
          </CWidgetStatsF>
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
