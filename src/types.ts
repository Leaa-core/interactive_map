export type Source = {
  label: string
  url: string
  license?: string
}

export type LocationStory = {
  id: string
  place: string
  state: string
  localLabel: string
  language: string
  era: string
  movement: string
  mapPosition: [number, number]
  color: string
  image?: string
  imageAlt: string
  imageCredit?: string
  kicker: string
  narrative: string
  featured: string
  timeline: string
  sources: Source[]
}
