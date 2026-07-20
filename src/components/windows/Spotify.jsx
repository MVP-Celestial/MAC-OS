import React from 'react'
import Macwindow from './Macwindow'
import './spotify.scss'

const Spotify = ({onClose}) => {
  return (
    <Macwindow width="25vw" onClose={onClose}>
        <div className="spotify-window">
            <iframe data-testid="embed-iframe" style={{ borderRadius: '0' }} src="https://open.spotify.com/embed/playlist/06tCWiOWTnuTfoKwHB8Byl?utm_source=generator&si=b5bf637b09234bbf" width="100%" height="352" frameBorder="0" allowFullScreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
        </div>
    </Macwindow>
  )
}

export default Spotify