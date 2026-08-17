import indiaMap from '@svg-maps/india'
import { useMemo, useState, type CSSProperties } from 'react'
import { locations } from '../data/locations'
import { stateThemes } from '../data/stateThemes'
import type { LocationStory } from '../types'

type ArtMapProps = {
  activeId?: string
  onChoose: (location: LocationStory) => void
}

const tradeRoutes: [string, string][] = [
  ['ajanta', 'udaipur'], ['udaipur', 'jaipur'], ['jaipur', 'delhi'], ['delhi', 'srinagar'],
  ['delhi', 'varanasi'], ['varanasi', 'kolkata'], ['kolkata', 'santiniketan'], ['kolkata', 'puri'],
  ['ajanta', 'mumbai'], ['ajanta', 'hyderabad'], ['hyderabad', 'hampi'], ['hampi', 'mysuru'],
  ['mysuru', 'kochi'], ['hampi', 'thanjavur'], ['thanjavur', 'mamallapuram'],
]

function routePath(from: [number, number], to: [number, number]) {
  const midX = (from[0] + to[0]) / 2
  const midY = (from[1] + to[1]) / 2
  const curve = Math.min(58, 20 + Math.abs(from[0] - to[0]) * 0.22)
  return `M ${from[0]} ${from[1]} Q ${midX} ${midY - curve} ${to[0]} ${to[1]}`
}

export default function ArtMap({ activeId, onChoose }: ArtMapProps) {
  const [hoveredState, setHoveredState] = useState<string | undefined>()
  const [hoveredMarker, setHoveredMarker] = useState<string | undefined>()
  const activeLocation = locations.find((location) => location.id === activeId)
  const focusState = activeLocation?.state ?? hoveredState
  const byId = useMemo(() => new Map(locations.map((location) => [location.id, location])), [])
  const themeByState = useMemo(() => new Map(stateThemes.map((theme) => [theme.state, theme])), [])
  const focusTheme = focusState ? themeByState.get(focusState) : undefined
  const themeOnlyMarkers = useMemo(() => stateThemes.filter((theme) => !locations.some((location) => location.state === theme.state)), [])

  return (
    <section className="india-map-stage" aria-label="Interactive India map with state boundaries and art history locations">
      <div className="map-stage-header">
        <span>INDIA — STATES & UNION TERRITORIES</span>
        <strong>{focusState ? `${focusState} · ${focusTheme?.artwork ?? 'art tradition'}` : 'Choose a glowing art location'}</strong>
      </div>
      <div className="india-map-wrap">
        <svg className="india-map" viewBox={indiaMap.viewBox} role="img" aria-label="India states and union territories map">
          <defs>
            <pattern id="stateHatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="7" stroke="#f4bf65" strokeOpacity=".15" strokeWidth="2" />
            </pattern>
            <filter id="mapGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          <g className="state-layer">
            {indiaMap.locations.map((state, index) => {
              const isFocused = state.name === focusState
              const theme = themeByState.get(state.name)
              const hasStory = locations.some((location) => location.state === state.name)
              return (
                <path
                  key={state.id}
                  d={state.path}
                  className={`india-state ${isFocused ? 'india-state--focused' : ''} ${hasStory ? 'india-state--story' : ''} ${theme ? 'india-state--themed' : ''}`}
                  style={{ '--state-index': index } as CSSProperties}
                  onMouseEnter={() => setHoveredState(state.name)}
                  onMouseLeave={() => setHoveredState(undefined)}
                >
                  <title>{theme ? `${state.name} — ${theme.artwork}` : state.name}</title>
                </path>
              )
            })}
          </g>
          <g className="state-hatch-layer" pointerEvents="none">
            {indiaMap.locations.filter((state) => state.name === focusState).map((state) => <path key={state.id} d={state.path} fill="url(#stateHatch)" />)}
          </g>
          <g className="route-layer" pointerEvents="none">
            {tradeRoutes.map(([fromId, toId]) => {
              const from = byId.get(fromId)!
              const to = byId.get(toId)!
              return <path key={`${fromId}-${toId}`} d={routePath(from.mapPosition, to.mapPosition)} />
            })}
          </g>
          <g className="marker-layer">
            {locations.map((location) => {
              const active = location.id === activeId
              const hovering = location.id === hoveredMarker
              return (
                <g
                  key={location.id}
                  className={`map-marker ${active ? 'map-marker--active' : ''} ${hovering ? 'map-marker--hovered' : ''}`}
                  transform={`translate(${location.mapPosition[0]} ${location.mapPosition[1]})`}
                  tabIndex={0}
                  role="button"
                  aria-label={`Open the ${location.place} art story`}
                  onClick={() => onChoose(location)}
                  onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') onChoose(location) }}
                  onMouseEnter={() => { setHoveredMarker(location.id); setHoveredState(location.state) }}
                  onMouseLeave={() => { setHoveredMarker(undefined); setHoveredState(undefined) }}
                >
                  <circle className="marker-ring" r="7.8" />
                  <circle className="marker-core" r="4.2" fill={location.color} />
                  {(active || hovering) && (
                    <g className="marker-label" transform="translate(11 -13)">
                      <rect width="92" height="29" rx="1" />
                      <text x="7" y="12">{location.localLabel}</text>
                      <text x="7" y="23" className="marker-label__english">{location.place}</text>
                    </g>
                  )}
                </g>
              )
            })}
          </g>
          <g className="theme-marker-layer">
            {themeOnlyMarkers.map((theme) => {
              const hovering = theme.state === hoveredState
              return (
                <g
                  key={theme.state}
                  className={`theme-marker ${hovering ? 'theme-marker--hovered' : ''}`}
                  transform={`translate(${theme.position[0]} ${theme.position[1]})`}
                  onMouseEnter={() => setHoveredState(theme.state)}
                  onMouseLeave={() => setHoveredState(undefined)}
                >
                  <circle r="4.4" />
                  <circle className="theme-marker__dot" r="1.9" />
                  {hovering && (
                    <g className="theme-marker-label" transform="translate(8 -13)">
                      <rect width="123" height="31" rx="1" />
                      <text x="6" y="12">{theme.place} · {theme.localLabel}</text>
                      <text x="6" y="24">{theme.artwork}</text>
                    </g>
                  )}
                </g>
              )
            })}
          </g>
        </svg>
      </div>
      <div className="map-stage-footer">
        <span><i /> 18 art stories</span>
        <span><i className="theme-dot" /> 35 state / UT art points</span>
        <span><b /> Historic influence route</span>
        <span>Hover a state to reveal its boundary.</span>
      </div>
    </section>
  )
}
