import { useEffect, useRef, useState } from 'react'
import stone from '../../intro-assets/stone.jpg'
import moss from '../../intro-assets/moss.jpg'
import diamond from '../../intro-assets/diamon ore.jpg'
import gold from '../../intro-assets/Gold ore.jpg'
import redstone from '../../intro-assets/redstone block.jpg'
import obsidian from '../../intro-assets/obsidian.jpg'
import cobblestone from '../../intro-assets/Minecraft Cobblestone Block Texture Pixel Art.jpg'
import emerald from '../../intro-assets/Minecraft Emerald Ore Block Pixel Art.jpg'
import stoneDig1 from '../../intro-assets/Sound/Stone_dig1.ogg'
import stoneDig2 from '../../intro-assets/Sound/Stone_dig2.ogg'
import stoneDig3 from '../../intro-assets/Sound/Stone_dig3.ogg'
import stoneDig4 from '../../intro-assets/Sound/Stone_dig4.ogg.mp3'

const textures = [
  { src: stone, weight: 60 },
  { src: moss, weight: 10 },
  { src: cobblestone, weight: 8 },
  { src: diamond, weight: 5 },
  { src: gold, weight: 5 },
  { src: redstone, weight: 5 },
  { src: obsidian, weight: 3 },
  { src: emerald, weight: 4 },
]

const soundUrls = [stoneDig1, stoneDig2, stoneDig3, stoneDig4]
const clamp = (value, min, max) => Math.max(min, Math.min(max, value))
const random = (min, max) => min + Math.random() * (max - min)

function chooseTexture(x, y, width, height) {
  const sample = Math.sin(x * 1.73 + y * 0.41) + Math.cos(y * 1.31 - x * 0.67)
  const pocket = Math.random() + sample * 0.16
  if (pocket > 1.02) return textures[3 + Math.floor(Math.random() * 5)]
  if (pocket < -0.72 && y < height * 0.68) return textures[1]

  const roll = Math.random() * textures.slice(0, 3).reduce((sum, item) => sum + item.weight, 0)
  let total = 0
  for (const texture of textures.slice(0, 3)) {
    total += texture.weight
    if (roll <= total) return texture
  }
  return textures[0]
}

function createWall() {
  const cellSize = clamp(Math.round(Math.min(window.innerWidth, window.innerHeight) / 8), 64, 128)
  const columns = Math.ceil(window.innerWidth / cellSize) + 1
  const rows = Math.ceil(window.innerHeight / cellSize) + 1
  const cells = []

  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < columns; x += 1) {
      const centerDistance = Math.hypot(x - columns / 2, y - rows / 2) / Math.hypot(columns / 2, rows / 2)
      const texture = chooseTexture(x, y, columns, rows)
      const order = clamp(centerDistance * 0.55 + Math.random() * 0.65 + ((x * 17 + y * 31) % 7) / 42, 0, 1)
      cells.push({
        id: `${x}-${y}`,
        src: texture.src,
        left: x * cellSize,
        top: y * cellSize,
        size: cellSize + 1,
        appearDelay: random(0, 0.62),
        revealDelay: 0.68 + order * 1.86,
        rotation: random(-5, 5),
      })
    }
  }
  return cells
}

function MinecraftIntro({ onComplete }) {
  const [wall, setWall] = useState(() => createWall())
  const [audioReady, setAudioReady] = useState(false)
  const audioCtxRef = useRef(null)
  const buffersRef = useRef([])
  const audioBusRef = useRef(null)
  const lastSoundRef = useRef(-1)
  const timersRef = useRef([])
  const unlockedRef = useRef(false)
  const activeSourcesRef = useRef(new Set())

  useEffect(() => {
    const handleResize = () => setWall(createWall())
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Decoding audio doesn't require a gesture - only playing it through the
  // AudioContext does - so we can prepare every clip the instant we mount.
  useEffect(() => {
    const Ctx = window.AudioContext || window.webkitAudioContext
    if (!Ctx) return undefined
    const ctx = new Ctx()
    audioCtxRef.current = ctx
    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = 6800
    filter.Q.value = 0.45
    const compressor = ctx.createDynamicsCompressor()
    compressor.threshold.value = -24
    compressor.knee.value = 18
    compressor.ratio.value = 3.2
    compressor.attack.value = 0.006
    compressor.release.value = 0.18
    const master = ctx.createGain()
    master.gain.value = 0.72
    filter.connect(compressor).connect(master).connect(ctx.destination)
    audioBusRef.current = filter
    // Attempt autoplay immediately. Browsers that allow it will start here;
    // browsers that suspend audio will be resumed by the first page gesture.
    ctx.resume().catch(() => {})
    let cancelled = false

    Promise.all(
      soundUrls.map((url) =>
        fetch(url)
          .then((response) => response.arrayBuffer())
          .then((data) => ctx.decodeAudioData(data))
      )
    )
      .then((decoded) => {
        if (!cancelled) buffersRef.current = decoded
      })
      .catch((error) => console.warn('Minecraft intro: could not decode sounds', error))

    return () => {
      cancelled = true
      ctx.close().catch(() => {})
      audioBusRef.current = null
    }
  }, [])

  const playSound = (phase, progress) => {
    const ctx = audioCtxRef.current
    const buffers = buffersRef.current
    const audioBus = audioBusRef.current
    if (!ctx || !audioBus || ctx.state !== 'running' || buffers.length < soundUrls.length) return

    let index = Math.floor(Math.random() * buffers.length)
    if (index === lastSoundRef.current) {
      index = (index + 1 + Math.floor(Math.random() * (buffers.length - 1))) % buffers.length
    }
    lastSoundRef.current = index

    const source = ctx.createBufferSource()
    source.buffer = buffers[index]
    source.playbackRate.value = phase === 'appear'
      ? random(0.95, 1.05)
      : random(1.0 + progress * 0.12, 1.1 + progress * 0.16)

    const gain = ctx.createGain()
    gain.gain.value = phase === 'appear' ? random(0.11, 0.17) : random(0.13, 0.21)

    source.connect(gain).connect(audioBus)
    activeSourcesRef.current.add(source)
    source.addEventListener('ended', () => activeSourcesRef.current.delete(source), { once: true })
    source.start(0)
  }

  useEffect(() => {
    if (!wall.length) return undefined

    let cancelled = false
    const startedAt = performance.now()
    const activeSources = activeSourcesRef.current

    const schedule = () => {
      const elapsed = (performance.now() - startedAt) / 1000
      // The visual lift begins at 2.72s, so leave a small clean gap before it.
      if (elapsed > 2.68 || cancelled) return
      const progress = clamp((elapsed - 0.68) / 2.25, 0, 1)
      const phase = elapsed < 0.72 ? 'appear' : 'reveal'
      // Mining energy peaks in the middle, then naturally thins as the last
      // pockets disappear instead of ending as an equally dense machine-gun.
      const energy = Math.sin(progress * Math.PI)
      const delay = phase === 'appear'
        ? random(78, 138)
        : random(54 - energy * 28, 96 - energy * 48)

      playSound(phase, progress)
      const t = window.setTimeout(schedule, delay)
      timersRef.current.push(t)
    }

    const unlockAudio = () => {
      if (unlockedRef.current) return
      unlockedRef.current = true
      const ctx = audioCtxRef.current
      if (ctx && ctx.state === 'suspended') {
        ctx.resume().then(() => {
          setAudioReady(true)
          // Do not wait for the next randomized timer after the user unlocks
          // audio; make the interaction audible immediately.
          playSound('appear', 0)
        }).catch(() => {})
      } else {
        setAudioReady(true)
        playSound('appear', 0)
      }
    }

    // Any real gesture (click, tap, keypress) anywhere on the page satisfies
    // the browser's autoplay requirement and unlocks the whole AudioContext
    // for the rest of the session - not just this one call.
    document.addEventListener('pointerdown', unlockAudio, true)
    document.addEventListener('keydown', unlockAudio, true)
    document.addEventListener('touchstart', unlockAudio, { once: true, passive: true, capture: true })

    const begin = window.setTimeout(schedule, 0)
    timersRef.current.push(begin)

    const soundCutoff = window.setTimeout(() => {
      activeSources.forEach((source) => {
        try { source.stop() } catch { /* already ended */ }
      })
      activeSources.clear()
    }, 2680)
    timersRef.current.push(soundCutoff)

    const finish = window.setTimeout(() => { if (!cancelled) onComplete?.() }, 3550)
    timersRef.current.push(finish)

    return () => {
      cancelled = true
      timersRef.current.forEach(window.clearTimeout)
      timersRef.current = []
      activeSources.forEach((source) => {
        try { source.stop() } catch { /* already ended */ }
      })
      activeSources.clear()
      document.removeEventListener('pointerdown', unlockAudio, true)
      document.removeEventListener('keydown', unlockAudio, true)
      document.removeEventListener('touchstart', unlockAudio, { capture: true })
    }
  }, [onComplete, wall.length])

  return (
    <div className="minecraft-intro" aria-label="Loading portfolio" role="status">
      <div className="minecraft-intro__shade" />
      <div className="minecraft-intro__wall">
        {wall.map((cell) => (
          <div
            className="minecraft-intro__block"
            key={cell.id}
            style={{
              backgroundImage: `url("${cell.src}")`,
              left: cell.left,
              top: cell.top,
              width: cell.size,
              height: cell.size,
              '--appear-delay': `${cell.appearDelay}s`,
              '--reveal-delay': `${cell.revealDelay}s`,
              '--rotation': `${cell.rotation}deg`,
            }}
          />
        ))}
      </div>
      <div className="minecraft-intro__mark">MINING PORTFOLIO</div>
      {!audioReady && <div className="minecraft-intro__hint">click / tap for sound</div>}
    </div>
  )
}

export default MinecraftIntro
