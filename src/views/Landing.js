import React from 'react'

import {
  CCard,
  CCardBody,
  CCol,
  CRow, CWidgetStatsC
} from "@coreui/react";
import { cilChartPie } from "@coreui/icons";
import CIcon from "@coreui/icons-react";


const Landing = () => {


  return (
    <>

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
    </>
  )
}

export default Landing
