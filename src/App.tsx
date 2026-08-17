import { AnimatePresence, motion } from 'framer-motion'
import { Compass, Info, Music2, Pause, Play, Route, Volume2, VolumeX } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import ArtMap from './components/ArtMap'
import CreditsSheet from './components/CreditsSheet'
import StoryFolio from './components/StoryFolio'
import { locations, odyssey } from './data/locations'
import { useAmbientSound } from './hooks/useAmbientSound'
import type { LocationStory } from './types'

export default function App() {
  const [hasEntered, setHasEntered] = useState(false)
  const [activeId, setActiveId] = useState<string | undefined>()
  const [journeyActive, setJourneyActive] = useState(false)
  const [journeyStep, setJourneyStep] = useState(0)
  const [creditsOpen, setCreditsOpen] = useState(false)
  const { isPlaying, volume, toggle, setVolume } = useAmbientSound()
  const activeLocation = useMemo(() => locations.find((location) => location.id === activeId), [activeId])
  const activeIndex = Math.max(0, locations.findIndex((location) => location.id === activeId))

  const chooseLocation = useCallback((location: LocationStory) => {
    setActiveId(location.id)
    setJourneyActive(false)
  }, [])

  const stepLocation = useCallback((direction: number) => {
    const next = (activeIndex + direction + locations.length) % locations.length
    setActiveId(locations[next].id)
    setJourneyActive(false)
  }, [activeIndex])

  const moveOdyssey = useCallback((direction: number) => {
    const next = (journeyStep + direction + odyssey.length) % odyssey.length
    setJourneyStep(next)
    setActiveId(odyssey[next])
    setJourneyActive(true)
  }, [journeyStep])

  const beginOdyssey = useCallback(() => {
    setJourneyStep(0)
    setActiveId(odyssey[0])
    setJourneyActive(true)
  }, [])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setActiveId(undefined); setCreditsOpen(false) }
      if (event.key === 'ArrowRight') stepLocation(1)
      if (event.key === 'ArrowLeft') stepLocation(-1)
      if (event.key.toLowerCase() === 'j') beginOdyssey()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [beginOdyssey, stepLocation])

  return (
    <main className="atlas-shell">
      <ArtMap activeId={activeId} onChoose={chooseLocation} />
      <div className="paper-grain" aria-hidden="true" />
      <header className="atlas-header">
        <button className="brand" onClick={() => { setActiveId(undefined); setJourneyActive(false) }} aria-label="Return to map overview">
          <span className="brand-mark">रं</span>
          <span><strong>RANG REKHA</strong><small>An atlas of Indian art</small></span>
        </button>
        <nav>
          <button className="nav-button" onClick={beginOdyssey}><Route size={16} /> Art Odyssey</button>
          <button className="nav-button" onClick={() => setCreditsOpen(true)}><Info size={16} /> Sources</button>
        </nav>
      </header>

      <section className="atlas-intro" aria-live="polite">
        <p className="eyebrow">FROM CAVE WALL TO CONTEMPORARY STUDIO</p>
        <h1>India,<br /><em>drawn in a thousand</em><br />ways.</h1>
        <p className="intro-copy">Follow the glowing dots through 2,000 years of image-making. Each one opens a story shaped by a place, a people and a way of seeing.</p>
        <div className="intro-instruction"><Compass size={18} /><span>HOVER A STATE TO TRACE ITS BORDER<br />SELECT A LUMINOUS DOT TO ENTER</span></div>
      </section>

      <aside className="map-legend">
        <span>18 LOCATIONS</span>
        <div><i className="legend-dot legend-dot--warm" /> Court & sacred art</div>
        <div><i className="legend-dot legend-dot--cool" /> Living & modern art</div>
      </aside>

      <section className="sound-control">
        <button onClick={toggle} aria-label={isPlaying ? 'Pause ambient soundscape' : 'Play ambient soundscape'} className={isPlaying ? 'sound-toggle sound-toggle--active' : 'sound-toggle'}>
          {isPlaying ? <Pause size={17} fill="currentColor" /> : <Music2 size={17} />}
          <span>{isPlaying ? 'SOUND ON' : 'SOUND OFF'}</span>
        </button>
        <div className="volume-line">
          {isPlaying ? <Volume2 size={14} /> : <VolumeX size={14} />}
          <input aria-label="Ambient sound volume" type="range" min="0" max="0.4" step="0.01" value={volume} onChange={(event) => setVolume(Number(event.target.value))} />
        </div>
      </section>

      <AnimatePresence>
        {journeyActive && (
          <motion.section className="journey-ribbon" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}>
            <div><span>ART ODYSSEY</span><strong>{String(journeyStep + 1).padStart(2, '0')} — {locations.find((location) => location.id === odyssey[journeyStep])?.place}</strong></div>
            <div className="journey-controls"><button onClick={() => moveOdyssey(-1)}>Back</button><button onClick={() => moveOdyssey(1)}>Continue <Play size={12} fill="currentColor" /></button></div>
            <button className="journey-close" onClick={() => setJourneyActive(false)} aria-label="Close art odyssey">×</button>
          </motion.section>
        )}
      </AnimatePresence>

      <StoryFolio
        location={activeLocation}
        index={activeIndex}
        total={locations.length}
        onClose={() => setActiveId(undefined)}
        onPrevious={() => stepLocation(-1)}
        onNext={() => stepLocation(1)}
      />
      <CreditsSheet open={creditsOpen} onClose={() => setCreditsOpen(false)} />

      <AnimatePresence>
        {!hasEntered && (
          <motion.div className="welcome-curtain" initial={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.035 }} transition={{ duration: 0.7 }}>
            <div className="curtain-pattern" aria-hidden="true" />
            <motion.div className="welcome-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <p>एक देश · अनेक कलाएँ</p>
              <h2>Rang<br /><em>Rekha</em></h2>
              <span>An interactive atlas of Indian art</span>
              <button onClick={() => setHasEntered(true)}>Open the atlas <span>→</span></button>
              <small>Sound begins only when you choose it.</small>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
