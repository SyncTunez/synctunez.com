import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import {
  CButton,
  CCloseButton, CContainer, CLink, CNavbarBrand,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'

import { AppSidebarNav } from './AppSidebarNav'

import { logo } from 'src/assets/brand/logo'
import { sygnet } from 'src/assets/brand/sygnet'

// sidebar nav config
import navigation from '../_nav'
import {cibSpotify, cibTidal, cibYoutube} from "@coreui/icons";

const AppSidebar = (({ forceUnfoldable = false }) => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)

  return (
    <>

      <CSidebar
        className="border-end"
        colorScheme="dark"
        position="fixed"
        unfoldable={forceUnfoldable || sidebarShow}
        visible={true}
      >
        <CSidebarHeader className="border-bottom">
          <CSidebarBrand to="/">
            <CIcon customClassName="sidebar-brand-full" icon={logo} height={32}/>
            <CIcon customClassName="sidebar-brand-narrow" icon={sygnet} height={32}/>
          </CSidebarBrand>
          <CCloseButton
            className="d-lg-none"
            dark
            onClick={() => dispatch({type: 'set', sidebarShow: false})}
          />
        </CSidebarHeader>
        <AppSidebarNav items={navigation}/>

        <hr className="my-1"/>
        <CSidebarFooter className="pt-3">
          <CContainer fluid className="text-center">
            <small>
              &copy; {new Date().getFullYear()} SyncTunz | <CLink href="/tos" className="ml-2">TOS</CLink>
            </small>
            <br />
            <small>

            </small>
          </CContainer>
        </CSidebarFooter>
      </CSidebar>
    </>
  )
});

export default React.memo(AppSidebar)
