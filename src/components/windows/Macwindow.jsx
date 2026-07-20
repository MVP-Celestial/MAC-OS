import React from 'react'
import {Rnd} from 'react-rnd'
import './macwindow.scss'

const Macwindow = ({children}) => {
  const maxWidth = typeof window !== 'undefined' ? Math.max(320, window.innerWidth - 24) : 700

  return (
    <Rnd
      default={{ x: 654, y: 224, width: 700, height: 500 }}
      minWidth={320}
      maxWidth={maxWidth}
      minHeight={320}
      bounds="window"
    >
        <div className="window">
            <div className="nav">
                <div className="dots">
                    <div className="dot red"></div>
                    <div className="dot yellow"></div>
                    <div className="dot green"></div>
                </div>

                <div className="title">Celestial -zsh</div>
            </div>
            <div className="main-content">
                {children}
            </div>
        </div>
    </Rnd>
  )
}

export default Macwindow