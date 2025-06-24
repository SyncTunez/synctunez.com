import React from 'react'

import {
  CButton,
  CCard,
  CCardBody, CCardFooter, CCardHeader,
  CCol, CLink,
  CRow, CWidgetStatsC, CWidgetStatsF
} from "@coreui/react";
import {
  cibAppleMusic,
  cibSpotify,
  cibTidal,
  cibYoutube,
  cilArrowRight,
  cilChartPie,
  cilMusicNote,
  cilUserPlus, cilUserX
} from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import { youtube } from "../assets/brand/other/youtube";
import { AppleLogo } from "../assets/brand/other/apple";


const Landing = () => {


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
              <CButton style={{width: '100%'}} color="primary" block>
                Link
              </CButton>
            }
          >
            <CButton color="link" href="https://spotify.com" block>Link</CButton>
          </CWidgetStatsF>
        </CCol>

        <CCol xs={3}>
          <CWidgetStatsF
            className="mb-3"
            icon={<AppleLogo/>}
            inverse
            title="?"
            value="Apple Music"
            footer={
              <CButton style={{width: '100%'}} color="primary" block>
                Link
              </CButton>
            }
          >
            <CButton color="link" href="https://music.apple.com" block>Link</CButton>
          </CWidgetStatsF>
        </CCol>

        <CCol xs={3}>
          <CWidgetStatsF
            className="mb-3"
            icon={
              <CIcon icon={youtube} className="float-end" width={36} />
            }
            inverse
            title="?"
            value="YouTube"
            footer={
              <CButton style={{width: '100%'}} color="primary" block>
                Link
              </CButton>
            }
          >
            <CButton color="link" href="https://youtube.com" block>Link</CButton>
          </CWidgetStatsF>
        </CCol>

        <CCol xs={3}>
          <CWidgetStatsF
            className="mb-3"
            icon={<CIcon icon={cibTidal} height={36} style={{ color: '#FFFFFF' }} />}
            inverse
            title="?"
            value="Tidal"
            footer={
              <CButton style={{width: '100%'}} color="primary" block>
                Link
              </CButton>
            }
          >
            <CButton color="link" href="https://tidal.com" block>Link</CButton>
          </CWidgetStatsF>
        </CCol>


      </CRow>
      <CCard className="mb-4">
        <CCardBody>
          <CRow>
            <CCol sm={5}>
              <h4 id="traffic" className="card-title mb-0">
                Home
              </h4>
              <div className="small text-body-secondary"></div>
            </CCol>

          </CRow>
          Content Here
        </CCardBody>
      </CCard>


      <CRow>
        <CCol xs="12" md="3">
          <CCard>
            <CCardHeader className="d-flex justify-content-between align-items-center">
              <span>Friends</span>
              <div>
                {/* Invite button */}
                <CButton color="primary" className="m-1" title="Invite" size="sm">
                  <CIcon icon={cilUserPlus} style={{ fontSize: '1.2rem' }} />
                </CButton>
                {/* Remove button */}
                <CButton color="danger" className="m-1" title="Remove" size="sm">
                  <CIcon icon={cilUserX} style={{ fontSize: '1.2rem' }} />
                </CButton>
              </div>
            </CCardHeader>
            <CCardBody>
              <blockquote className="blockquote mb-0">
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.
                </p>
                <footer className="blockquote-footer">
                  Someone famous in <cite title="Source Title">Source Title</cite>
                </footer>
              </blockquote>
            </CCardBody>
          </CCard>
        </CCol>


        <CCol xs="12" md="9">
          <CCard>
            <CCardHeader>Full Width Card</CCardHeader>
            <CCardBody>
              <blockquote className="blockquote mb-0">
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.
                </p>
                <footer className="blockquote-footer">
                  Someone famous in <cite title="Source Title">Source Title</cite>
                </footer>
              </blockquote>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default Landing
