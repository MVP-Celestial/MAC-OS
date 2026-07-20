import React from 'react'
import Macwindow from './Macwindow'
import './resume.scss'

const Resume = () => {
  return (
    <Macwindow>
      <div className="resume-window">
        
        <iframe src="/resume.pdf" frameBorder="0" title="Resume" width="100%" height="100%" style={{ border: 'none' }}></iframe>
      </div>
    </Macwindow>
  )
}

export default Resume