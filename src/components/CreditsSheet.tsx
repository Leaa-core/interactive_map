import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, X } from 'lucide-react'
import { locations } from '../data/locations'

export default function CreditsSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="credits-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.section className="credits-sheet" initial={{ opacity: 0, y: 36 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 36 }}>
            <button className="close-folio" onClick={onClose} aria-label="Close credits"><X size={19} /></button>
            <p className="eyebrow">ACKNOWLEDGEMENTS</p>
            <h2>Every image has a lineage.</h2>
            <p className="credits-intro">Rang Rekha pairs an illustrated state-boundary map with archival references. Story images are credited to their source; historical summaries are starting points for further study, not a substitute for local knowledge.</p>
            <a className="map-credit" href="https://github.com/VictorCazanave/svg-maps/tree/master/packages/india" target="_blank" rel="noreferrer">India state &amp; UT boundary geometry: svg-maps / CC BY 4.0 <ArrowUpRight size={13} /></a>
            <div className="credit-list">
              {locations.map((location) => (
                <article key={location.id}>
                  <div><span>{location.localLabel}</span><strong>{location.place}</strong></div>
                  {location.sources.map((source) => <a href={source.url} target="_blank" rel="noreferrer" key={source.url}>{source.label}<ArrowUpRight size={13} /></a>)}
                </article>
              ))}
            </div>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
