import React from 'react'
import '../src/app.scss'
import Dock from './components/Dock'
import Navbar from './components/Navbar'
import Github from './components/windows/Github'
import { Note } from "./components/Note"
import  Resume  from './components/windows/Resume'
import Spotify from './components/windows/Spotify'
import Cli from './components/windows/Cli'

const App = () => {
  return (
    <main>
      <video className="wallpaper" autoPlay muted loop playsInline>
        <source src="/cherry-blossom-lake-house-minecraft-moewalls-com.mp4" type="video/mp4" />
      </video>

      {/* <Navbar />
      <Dock />
      <Github />
      <Note />
      <Resume /> */}
      {/* <Spotify/> */}
      <Cli/>
    </main>
  )
}

export default App