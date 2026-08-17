import { Html, Line, OrbitControls, Sparkles } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { locations } from '../data/locations'
import type { LocationStory } from '../types'

type ArtMapProps = {
  activeId?: string
  onChoose: (location: LocationStory) => void
}

const indiaOutline: [number, number][] = [
  [-0.4, 7.75], [-1.25, 7.55], [-1.92, 6.68], [-2.35, 5.5], [-1.74, 4.83],
  [-2.25, 3.92], [-2.78, 2.83], [-3.08, 1.55], [-2.38, 0.57], [-2.74, -0.45],
  [-2.14, -1.12], [-1.58, -2.36], [-1.4, -3.9], [-0.7, -5.46], [-0.18, -7.22],
  [0.38, -5.78], [0.95, -4.55], [1.08, -3.14], [1.5, -2.08], [1.27, -0.88],
  [1.9, 0.13], [2.45, 1.32], [2.8, 2.5], [2.56, 3.6], [3.15, 4.27],
  [2.7, 5.3], [1.8, 5.67], [1.0, 6.42], [0.42, 7.28],
]

const northEastOutline: [number, number][] = [
  [2.46, 4.67], [3.65, 5.28], [4.62, 5.02], [4.92, 4.52], [4.28, 4.09],
  [3.48, 4.02], [2.72, 3.6], [2.58, 3.98],
]

const tradeRoutes: [string, string][] = [
  ['ajanta', 'udaipur'], ['udaipur', 'jaipur'], ['jaipur', 'delhi'], ['delhi', 'srinagar'],
  ['delhi', 'varanasi'], ['varanasi', 'kolkata'], ['kolkata', 'santiniketan'], ['kolkata', 'puri'],
  ['ajanta', 'mumbai'], ['ajanta', 'hyderabad'], ['hyderabad', 'hampi'], ['hampi', 'mysuru'],
  ['mysuru', 'kochi'], ['hampi', 'thanjavur'], ['thanjavur', 'mamallapuram'],
]

function makeShape(points: [number, number][]) {
  const shape = new THREE.Shape()
  shape.moveTo(points[0][0], points[0][1])
  points.slice(1).forEach(([x, y]) => shape.lineTo(x, y))
  shape.closePath()
  return shape
}

function CameraDirector({ activeId }: { activeId?: string }) {
  const { camera } = useThree()

  useFrame((_, delta) => {
    const active = locations.find((location) => location.id === activeId)
    const goal = active
      ? new THREE.Vector3(active.mapPosition[0] * 0.23, active.mapPosition[1] * 0.18, 14)
      : new THREE.Vector3(0.25, 0.2, 17)
    camera.position.lerp(goal, 1 - Math.exp(-delta * 2.4))
    camera.lookAt(active?.mapPosition[0] ?? 0, active?.mapPosition[1] ?? 0, 0)
  })

  return null
}

function IndiaRelief() {
  const geometry = useMemo(() => new THREE.ExtrudeGeometry(makeShape(indiaOutline), {
    depth: 0.33,
    bevelEnabled: true,
    bevelSegments: 3,
    bevelSize: 0.07,
    bevelThickness: 0.08,
    curveSegments: 12,
  }), [])
  const northEastGeometry = useMemo(() => new THREE.ExtrudeGeometry(makeShape(northEastOutline), {
    depth: 0.33,
    bevelEnabled: true,
    bevelSegments: 3,
    bevelSize: 0.07,
    bevelThickness: 0.08,
  }), [])

  return (
    <group>
      <mesh geometry={geometry} position={[0, 0, -0.1]} receiveShadow castShadow>
        <meshStandardMaterial color="#c45338" roughness={0.82} metalness={0.13} />
      </mesh>
      <mesh geometry={northEastGeometry} position={[0, 0, -0.1]} receiveShadow castShadow>
        <meshStandardMaterial color="#c45338" roughness={0.82} metalness={0.13} />
      </mesh>
      <mesh position={[0, 0, 0.245]}>
        <shapeGeometry args={[makeShape(indiaOutline)]} />
        <meshBasicMaterial color="#dc6a42" transparent opacity={0.42} />
      </mesh>
      <mesh position={[0, 0, 0.245]}>
        <shapeGeometry args={[makeShape(northEastOutline)]} />
        <meshBasicMaterial color="#dc6a42" transparent opacity={0.42} />
      </mesh>
    </group>
  )
}

function EngravedLines() {
  const lines = useMemo(() => {
    const result: THREE.Vector3[][] = []
    for (let index = 0; index < 13; index += 1) {
      const y = -4.9 + index * 0.86
      result.push([
        new THREE.Vector3(-2.15 + Math.sin(index) * 0.25, y, 0.35),
        new THREE.Vector3(-0.6 + Math.cos(index * 1.8) * 0.7, y + 0.24, 0.37),
        new THREE.Vector3(1.65 + Math.sin(index * 2.1) * 0.42, y + 0.06, 0.35),
      ])
    }
    return result
  }, [])

  return <>{lines.map((points, index) => <Line key={index} points={points} color="#f3c26b" transparent opacity={0.15} lineWidth={0.7} />)}</>
}

function RouteLines() {
  return <>
    {tradeRoutes.map(([fromId, toId]) => {
      const from = locations.find((location) => location.id === fromId)!
      const to = locations.find((location) => location.id === toId)!
      const midpoint = new THREE.Vector3(
        (from.mapPosition[0] + to.mapPosition[0]) / 2,
        (from.mapPosition[1] + to.mapPosition[1]) / 2 + 0.55,
        0.5,
      )
      return <Line
        key={`${fromId}-${toId}`}
        points={[
          new THREE.Vector3(from.mapPosition[0], from.mapPosition[1], 0.45),
          midpoint,
          new THREE.Vector3(to.mapPosition[0], to.mapPosition[1], 0.45),
        ]}
        color="#f7c96b"
        transparent
        opacity={0.29}
        dashed
        dashSize={0.13}
        gapSize={0.1}
        lineWidth={1.1}
      />
    })}
  </>
}

function MapMarker({ location, active, onChoose }: { location: LocationStory; active: boolean; onChoose: () => void }) {
  const group = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)

  useFrame(({ clock }) => {
    if (!group.current) return
    const pulse = 1 + Math.sin(clock.elapsedTime * 2.3 + location.mapPosition[0]) * 0.09
    group.current.scale.setScalar(active ? pulse * 1.35 : hovered ? 1.23 : pulse)
  })

  return (
    <group ref={group} position={[location.mapPosition[0], location.mapPosition[1], 0.5]}>
      <mesh
        onClick={(event) => { event.stopPropagation(); onChoose() }}
        onPointerOver={(event) => { event.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer' }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = 'default' }}
      >
        <sphereGeometry args={[0.14, 24, 24]} />
        <meshStandardMaterial color={location.color} emissive={location.color} emissiveIntensity={active || hovered ? 1.35 : 0.62} roughness={0.36} metalness={0.25} />
      </mesh>
      <mesh rotation={[0, 0, 0]}>
        <torusGeometry args={[0.25, 0.018, 12, 40]} />
        <meshBasicMaterial color="#f6cc72" transparent opacity={active || hovered ? 1 : 0.5} />
      </mesh>
      {(hovered || active) && (
        <Html position={[0.08, 0.4, 0]} center distanceFactor={10} style={{ pointerEvents: 'none' }}>
          <div className="map-tooltip">
            <span>{location.localLabel}</span>
            <strong>{location.place}</strong>
          </div>
        </Html>
      )}
    </group>
  )
}

function Scene({ activeId, onChoose }: ArtMapProps) {
  return (
    <>
      <color attach="background" args={['#17132d']} />
      <fog attach="fog" args={['#17132d', 12, 28]} />
      <ambientLight intensity={1.7} color="#ffddb0" />
      <directionalLight position={[-4, 7, 10]} intensity={2.2} color="#ffd99a" castShadow />
      <pointLight position={[3, -1, 7]} intensity={38} distance={13} color="#d85f44" />
      <pointLight position={[-4, 4, 4]} intensity={19} distance={11} color="#4ca49a" />
      <group rotation={[-0.11, 0.02, -0.035]}>
        <IndiaRelief />
        <EngravedLines />
        <RouteLines />
        {locations.map((location) => <MapMarker key={location.id} location={location} active={location.id === activeId} onChoose={() => onChoose(location)} />)}
      </group>
      <Sparkles count={105} scale={[16, 16, 3]} size={2.1} speed={0.32} color="#f8d484" opacity={0.48} />
      <CameraDirector activeId={activeId} />
      <OrbitControls enablePan={false} minDistance={11} maxDistance={20} maxPolarAngle={Math.PI / 2.1} minPolarAngle={Math.PI / 3.1} enableDamping dampingFactor={0.08} />
    </>
  )
}

export default function ArtMap({ activeId, onChoose }: ArtMapProps) {
  return (
    <div className="map-canvas" aria-label="Interactive 3D map of India showing art history locations">
      <Canvas shadows dpr={[1, 2]} camera={{ position: [0.25, 0.2, 17], fov: 43 }} gl={{ antialias: true, alpha: false }}>
        <Scene activeId={activeId} onChoose={onChoose} />
      </Canvas>
    </div>
  )
}
