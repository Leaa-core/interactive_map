declare module '@svg-maps/india' {
  type IndiaState = {
    id: string
    name: string
    path: string
  }

  const india: {
    label: string
    viewBox: string
    locations: IndiaState[]
  }

  export default india
}
