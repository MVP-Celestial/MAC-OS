import React from 'react'
import '../src/app.scss'
import Dock from './components/Dock'
import Navbar from './components/Navbar'
import Github from './components/windows/Github'
import { Note } from "./components/Note"
import  Resume  from './components/windows/Resume'
import Spotify from './components/windows/Spotify'
import Cli from './components/windows/Cli'
import MinecraftIntro from './components/MinecraftIntro'
import './components/minecraft-intro.scss'

import { useState } from 'react'

const App = () => {

  const [windows, setWindowsState] = useState({
    github: false,
    note: false,
    resume: false,
    spotify: false,
    cli: false,
  })
  const [showIntro, setShowIntro] = useState(true)


  return (
    <main>
      {showIntro && <MinecraftIntro onComplete={() => setShowIntro(false)} />}
      <video className="wallpaper" autoPlay muted loop playsInline>
        <source src="/cherry-blossom-lake-house-minecraft-moewalls-com.mp4" type="video/mp4" />
      </video>

       <Navbar />
      <Dock windowsState={windows} setWindowsState={setWindowsState} />
      {windows.github && <Github onClose={() => setWindowsState(s => ({...s, github: false}))} />}
      {windows.note && <Note onClose={() => setWindowsState(s => ({...s, note: false}))} />}
      {windows.resume && <Resume onClose={() => setWindowsState(s => ({...s, resume: false}))} />}
      {windows.spotify && <Spotify onClose={() => setWindowsState(s => ({...s, spotify: false}))} />}
      {windows.cli && <Cli onClose={() => setWindowsState(s => ({...s, cli: false}))} />}
    </main>
  )
}

export default App
