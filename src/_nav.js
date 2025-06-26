import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilHome,
} from "@coreui/icons";
import { CNavItem } from '@coreui/react'
import {MdDashboard} from "react-icons/md";


const _nav = [
  {
    component: CNavItem,
    name: 'Home',
    to: '/home',
    icon: <CIcon icon={cilHome} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <MdDashboard/>,
  }
]


export default _nav
