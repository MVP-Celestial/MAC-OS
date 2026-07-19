import React from 'react'
import '../src/app.scss'
import Dock from './components/Dock'
import Navbar from './components/Navbar'
import Macwindow from './components/windows/Macwindow'

const App = () => {
  return (
    <main>
      <video className="wallpaper" autoPlay muted loop playsInline>
        <source src="/cherry-blossom-lake-house-minecraft-moewalls-com.mp4" type="video/mp4" />
      </video>

      <Navbar />
      <Dock />
      <Macwindow>
        <h1>HEYY</h1>
      </Macwindow>
    </main>
  )
}

export default App