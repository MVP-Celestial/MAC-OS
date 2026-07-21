import React from 'react'
import { Rnd } from 'react-rnd'
import { motion } from 'framer-motion'
import './macwindow.scss'

const Macwindow = ({ children, width = "40vw", height = "65vh", onClose }) => {
  const maxWidth = typeof window !== 'undefined' ? Math.max(320, window.innerWidth - 24) : 700

  return (
    <Rnd
      default={{ x: 554, y: 124, width: width, height: height }}
      minWidth={320}
      maxWidth={maxWidth}
      minHeight={320}
      bounds="window"
    >
      <motion.div
        className="window"
        initial={{ opacity: 0, scale: 0.85, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.85, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
        style={{ transformOrigin: "center bottom" }}
      >
        <div className="nav">
          <div className="dots">
            <div className="dot red" onClick={onClose}></div>
            <div className="dot yellow"></div>
            <div className="dot green"></div>
          </div>

          <div className="title">Celestial -zsh</div>
        </div>
        <div className="main-content">
          {children}
        </div>
      </motion.div>
    </Rnd>
  )
}

export default Macwindow