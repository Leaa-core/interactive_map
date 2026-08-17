import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, BookOpen, ChevronLeft, ChevronRight, Landmark, X } from 'lucide-react'
import { useState } from 'react'
import type { LocationStory } from '../types'

type StoryFolioProps = {
  location?: LocationStory
  index: number
  total: number
  onClose: () => void
  onPrevious: () => void
  onNext: () => void
}

function Artwork({ location }: { location: LocationStory }) {
  const [failed, setFailed] = useState(false)

  return (
    <figure className={`artwork-frame ${failed ? 'artwork-frame--fallback' : ''}`}>
      {!failed && location.image && <img src={location.image} alt={location.imageAlt} onError={() => setFailed(true)} />}
      <div className="artwork-frame__wash" aria-hidden="true" />
      <figcaption>
        <span>ARCHIVE IMAGE</span>
        <strong>{location.imageCredit ?? 'Cultural archive source'}</strong>
      </figcaption>
      {failed && <div className="artwork-fallback"><span>{location.localLabel}</span><strong>{location.place}</strong></div>}
    </figure>
  )
}

export default function StoryFolio({ location, index, total, onClose, onPrevious, onNext }: StoryFolioProps) {
  return (
    <AnimatePresence>
      {location && (
        <motion.aside
          className="story-folio"
          initial={{ opacity: 0, x: 48, rotate: 1.2 }}
          animate={{ opacity: 1, x: 0, rotate: 0 }}
          exit={{ opacity: 0, x: 48, rotate: 1.2 }}
          transition={{ type: 'spring', stiffness: 240, damping: 28 }}
          aria-label={`${location.place} art history folio`}
        >
          <div className="folio-window" aria-hidden="true"><i /><i /><i /><i /><i /></div>
          <button className="close-folio" onClick={onClose} aria-label="Close art folio"><X size={19} /></button>
          <header className="folio-heading">
            <p>{location.kicker}</p>
            <h2>{location.place}</h2>
            <div className="folio-local"><span>{location.localLabel}</span><small>{location.language}</small></div>
          </header>
          <Artwork location={location} />
          <div className="folio-meta">
            <span>{location.era}</span>
            <span>{location.state}</span>
          </div>
          <section className="folio-copy">
            <p className="folio-movement"><Landmark size={14} /> {location.movement}</p>
            <p>{location.narrative}</p>
          </section>
          <section className="folio-highlight">
            <div><BookOpen size={16} /><span>In this atlas</span></div>
            <strong>{location.featured}</strong>
            <p>{location.timeline}</p>
          </section>
          <section className="folio-sources">
            <span>STORY SOURCES & IMAGE CREDIT</span>
            {location.sources.map((source) => (
              <a href={source.url} target="_blank" rel="noreferrer" key={source.url}>
                <span>{source.label}{source.license ? ` · ${source.license}` : ''}</span><ArrowUpRight size={13} />
              </a>
            ))}
          </section>
          <footer className="folio-nav">
            <button onClick={onPrevious} aria-label="Previous location"><ChevronLeft size={18} /> Previous</button>
            <span>{String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
            <button onClick={onNext} aria-label="Next location">Next <ChevronRight size={18} /></button>
          </footer>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
