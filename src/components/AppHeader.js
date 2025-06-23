import React, {useEffect, useRef, useState} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  CContainer,
  CHeader,
  CHeaderNav,
  CHeaderToggler,
  CNavLink,
  CNavItem,
  useColorModes,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem, CButton,
} from "@coreui/react";
import {
  cilBell,
  cilList,
  cilEnvelopeOpen,
  cilMenu,
  cilMoon,
  cilContrast,
  cilSun,
} from "@coreui/icons";
import { CIcon } from "@coreui/icons-react";


const GoogleIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 533.5 544.3"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill="#4285f4"
      d="M533.5 278.4c0-17.7-1.5-34.8-4.4-51.4H272v97.4h146.9c-6.3 34-25.4 62.9-54.2 82.3v68.4h87.5c51.2-47.2 81.3-116.5 81.3-196.7z"
    />
    <path
      fill="#34a853"
      d="M272 544.3c73.8 0 135.7-24.5 180.9-66.6l-87.5-68.4c-24.3 16.3-55.5 26-93.3 26-71.6 0-132.3-48.3-154.1-113.3H26.8v71.2C71.7 486.4 164.5 544.3 272 544.3z"
    />
    <path
      fill="#fbbc04"
      d="M117.9 321.9c-5.1-15.4-8-31.9-8-48.9s2.9-33.5 8-48.9v-71.2H26.8c-17.4 34.7-27.3 73.9-27.3 120.1s9.9 85.4 27.3 120.1l91.1-71.2z"
    />
    <path
      fill="#ea4335"
      d="M272 107.7c39.8 0 75.5 13.7 103.6 40.6l77.8-77.8C404.5 25.4 342.5 0 272 0 164.5 0 71.7 57.9 26.8 144.8l91.1 71.2c21.8-65 82.5-113.3 154.1-113.3z"
    />
  </svg>
)


const AppHeader = ({ removeMargins = false }) => { // Accept removeMargins prop with a default value of false
  const headerRef = useRef();
  const { colorMode, setColorMode } = useColorModes('coreui-free-react-admin-template-theme');
  const dispatch = useDispatch();
  const sidebarShow = useSelector((state) => state.sidebarShow);
  const [modalVisible, setModalVisible] = useState(false)

  useEffect(() => {
    document.addEventListener('scroll', () => {
      headerRef.current &&
      headerRef.current.classList.toggle('shadow-sm', document.documentElement.scrollTop > 0);
    });
  }, []);

  return (
    <CHeader position="sticky" className={`${removeMargins ? 'mb-0 p-0' : 'mb-4 p-0'}`} ref={headerRef}>
      {/* Set margin based on the removeMargins prop */}
      <CContainer className="border-bottom px-4" fluid>
        <CHeaderToggler
          onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
          style={{ marginInlineStart: '-14px' }}
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>

        <CHeaderNav>
          <li className="nav-item py-1">
            <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
          </li>
          <CDropdown variant="nav-item" placement="bottom-end">
            <CDropdownToggle caret={false}>
              {colorMode === 'dark' ? (
                <CIcon icon={cilMoon} size="lg"/>
              ) : colorMode === 'auto' ? (
                <CIcon icon={cilContrast} size="lg"/>
              ) : (
                <CIcon icon={cilSun} size="lg"/>
              )}
            </CDropdownToggle>
            <CDropdownMenu>
              <CDropdownItem
                active={colorMode === 'light'}
                className="d-flex align-items-center"
                as="button"
                type="button"
                onClick={() => setColorMode('light')}
              >
                <CIcon className="me-2" icon={cilSun} size="lg"/> Light
              </CDropdownItem>
              <CDropdownItem
                active={colorMode === 'dark'}
                className="d-flex align-items-center"
                as="button"
                type="button"
                onClick={() => setColorMode('dark')}
              >
                <CIcon className="me-2" icon={cilMoon} size="lg"/> Dark
              </CDropdownItem>
              <CDropdownItem
                active={colorMode === 'auto'}
                className="d-flex align-items-center"
                as="button"
                type="button"
                onClick={() => setColorMode('auto')}
              >
                <CIcon className="me-2" icon={cilContrast} size="lg"/> Auto
              </CDropdownItem>
            </CDropdownMenu>
          </CDropdown>
          <li className="nav-item py-1">
            <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
          </li>
          <CButton color="primary" onClick={() => setModalVisible(true)}>  <GoogleIcon /> Login</CButton>
        </CHeaderNav>
      </CContainer>
    </CHeader>
  );
};


export default AppHeader;
