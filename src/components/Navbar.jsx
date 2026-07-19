import React from 'react'
import './navbar.scss'
import DateTime from './DateTime'

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="left">
        <img src="/navbar-icons/apple.svg" alt="Apple" />
        <p>Celestial</p>
        <p>File</p>
        <p>Window</p>
        <p>Terminal</p>
      </div>
      <div className="right">
        <img src="/navbar-icons/wifi.svg" alt="Wi-Fi" />
        <DateTime />
      </div>
    </nav>
  )
}

export default Navbar