import { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Float, Text, Box, Sphere, Ring } from '@react-three/drei'
import { Vector3, Color } from 'three'
import * as THREE from 'three'

// Individual Island Component
const Island = ({ island, isLocked, isActive, onClick, playerProgress }) => {
  const meshRef = useRef()
  const [hovered, setHovered] = useState(false)
  const { camera } = useThree()

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.001
      if (hovered && !isLocked) {
        meshRef.current.scale.lerp(new Vector3(1.1, 1.1, 1.1), 0.1)
      } else {
        meshRef.current.scale.lerp(new Vector3(1, 1, 1), 0.1)
      }
    }
  })

  const handleClick = () => {
    if (!isLocked) {
      onClick(island)
      // Animate camera to focus on island
      camera.lookAt(new Vector3(...island.position))
    }
  }

  // Calculate completion percentage
  const completionRate = island.lessons 
    ? (island.lessons.filter(l => playerProgress.completedLessons.includes(l.id)).length / island.lessons.length) * 100
    : 0

  return (
    <group position={island.position}>
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
        {/* Main Island */}
        <Box
          ref={meshRef}
          args={[3, 1, 3]}
          onClick={handleClick}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <meshStandardMaterial 
            color={isLocked ? '#666666' : island.color}
            metalness={0.3}
            roughness={0.7}
            emissive={isActive ? island.color : '#000000'}
            emissiveIntensity={isActive ? 0.3 : 0}
          />
        </Box>

        {/* Island Features */}
        {!isLocked && (
          <>
            {/* Trees/Decorations based on theme */}
            {island.theme === 'tropical' && (
              <>
                <Sphere args={[0.3]} position={[0.5, 0.8, 0.5]}>
                  <meshStandardMaterial color="#228B22" />
                </Sphere>
                <Box args={[0.1, 0.5, 0.1]} position={[0.5, 0.3, 0.5]}>
                  <meshStandardMaterial color="#8B4513" />
                </Box>
              </>
            )}
            
            {island.theme === 'volcanic' && (
              <Sphere args={[0.5]} position={[0, 1, 0]}>
                <meshStandardMaterial 
                  color="#FF4500"
                  emissive="#FF0000"
                  emissiveIntensity={0.5}
                />
              </Sphere>
            )}

            {island.theme === 'arctic' && (
              <>
                <Box args={[0.4, 0.8, 0.4]} position={[-0.5, 0.9, -0.5]}>
                  <meshStandardMaterial color="#E0FFFF" opacity={0.8} transparent />
                </Box>
              </>
            )}
          </>
        )}

        {/* Lock Icon */}
        {isLocked && (
          <group position={[0, 1, 0]}>
            <Box args={[0.5, 0.6, 0.1]}>
              <meshStandardMaterial color="#444444" />
            </Box>
            <Ring args={[0.2, 0.3, 32]} position={[0, 0.4, 0.05]} rotation={[0, 0, 0]}>
              <meshStandardMaterial color="#444444" />
            </Ring>
          </group>
        )}

        {/* Island Name */}
        <Text
          position={[0, 2, 0]}
          fontSize={0.3}
          color={isLocked ? '#999999' : '#ffffff'}
          anchorX="center"
          anchorY="middle"
        >
          {island.name}
        </Text>

        {/* Progress Ring */}
        {!isLocked && completionRate > 0 && (
          <Ring
            args={[1.8, 2, 64]}
            position={[0, -0.6, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <meshStandardMaterial 
              color={completionRate === 100 ? '#00FF00' : '#FFD700'}
              opacity={0.6}
              transparent
            />
          </Ring>
        )}

        {/* Completion Percentage */}
        {!isLocked && (
          <Text
            position={[0, -1.5, 0]}
            fontSize={0.2}
            color="#ffffff"
            anchorX="center"
          >
            {Math.round(completionRate)}%
          </Text>
        )}
      </Float>

      {/* Hover Effect Ring */}
      {hovered && !isLocked && (
        <Ring
          args={[2, 2.5, 32]}
          position={[0, -0.5, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <meshBasicMaterial color={island.color} opacity={0.3} transparent />
        </Ring>
      )}

      {/* Connection Lines to Next Islands */}
      {island.connections?.map((targetId, idx) => (
        <ConnectionLine
          key={idx}
          start={island.position}
          end={islands.find(i => i.id === targetId)?.position}
          isUnlocked={!isLocked}
        />
      ))}
    </group>
  )
}

// Connection Line Component
const ConnectionLine = ({ start, end, isUnlocked }) => {
  const ref = useRef()
  
  useFrame((state) => {
    if (ref.current && isUnlocked) {
      ref.current.material.opacity = 0.3 + Math.sin(state.clock.elapsedTime * 2) * 0.2
    }
  })

  if (!end) return null

  const points = []
  points.push(new Vector3(...start))
  points.push(new Vector3(...end))
  
  const geometry = new THREE.BufferGeometry().setFromPoints(points)

  return (
    <line ref={ref} geometry={geometry}>
      <lineBasicMaterial 
        color={isUnlocked ? '#FFD700' : '#444444'}
        opacity={isUnlocked ? 0.5 : 0.2}
        transparent
      />
    </line>
  )
}

// Animated Background Elements
const FloatingClouds = () => {
  const cloudsRef = useRef()

  useFrame((state) => {
    cloudsRef.current.position.x = Math.sin(state.clock.elapsedTime * 0.1) * 2
  })

  return (
    <group ref={cloudsRef}>
      {[...Array(5)].map((_, i) => (
        <Float key={i} speed={1 + i * 0.2} floatIntensity={2}>
          <Sphere
            position={[
              Math.random() * 20 - 10,
              5 + Math.random() * 5,
              -10 - Math.random() * 10
            ]}
            args={[1 + Math.random(), 8, 6]}
          >
            <meshStandardMaterial color="white" opacity={0.8} transparent />
          </Sphere>
        </Float>
      ))}
    </group>
  )
}

// Main Island Map Component
export default function IslandMap({ islands, onIslandSelect, playerProgress, currentIsland }) {
  const [cameraPosition, setCameraPosition] = useState([0, 10, 20])

  return (
    <div className="h-full w-full">
      <Canvas camera={{ position: cameraPosition, fov: 60 }}>
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -5]} intensity={0.5} />

        {/* Sky Background */}
        <mesh position={[0, 0, -50]} scale={[200, 100, 1]}>
          <planeGeometry />
          <meshBasicMaterial color="#87CEEB" />
        </mesh>

        {/* Ocean */}
        <mesh position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[100, 100]} />
          <meshStandardMaterial 
            color="#006994"
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>

        {/* Islands */}
        {islands.map(island => (
          <Island
            key={island.id}
            island={island}
            islands={islands}
            isLocked={!playerProgress.unlockedIslands.includes(island.id)}
            isActive={currentIsland?.id === island.id}
            onClick={onIslandSelect}
            playerProgress={playerProgress}
          />
        ))}

        {/* Floating Clouds */}
        <FloatingClouds />

        {/* Camera Controls */}
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          maxDistance={30}
          minDistance={10}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  )
}