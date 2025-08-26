import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Grid, PerspectiveCamera, Stats } from '@react-three/drei'
import { rosClient } from '../../services/rosClient'

// Robot Model Component
const RobotModel = ({ position, rotation }) => {
    const meshRef = useRef()

    useFrame(() => {
        if (meshRef.current) {
            meshRef.current.position.set(position[0], position[1], position[2])
            meshRef.current.rotation.set(0, 0, rotation)
        }
    })

    return (
        <group ref={meshRef}>
            {/* Robot body */}
            <mesh position={[0, 0, 0.05]}>
                <cylinderGeometry args={[0.15, 0.15, 0.1, 16]} />
                <meshStandardMaterial color="#3b82f6" />
            </mesh>

            {/* Direction indicator */}
            <mesh position={[0.12, 0, 0.05]}>
                <coneGeometry args={[0.03, 0.08, 8]} />
                <meshStandardMaterial color="#ef4444" />
            </mesh>

            {/* Wheels */}
            <mesh position={[0.08, 0.12, 0.02]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.03, 0.03, 0.02, 16]} />
                <meshStandardMaterial color="#1f2937" />
            </mesh>
            <mesh position={[0.08, -0.12, 0.02]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.03, 0.03, 0.02, 16]} />
                <meshStandardMaterial color="#1f2937" />
            </mesh>
            <mesh position={[-0.08, 0.12, 0.02]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.03, 0.03, 0.02, 16]} />
                <meshStandardMaterial color="#1f2937" />
            </mesh>
            <mesh position={[-0.08, -0.12, 0.02]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.03, 0.03, 0.02, 16]} />
                <meshStandardMaterial color="#1f2937" />
            </mesh>
        </group>
    )
}

// Laser Scan Visualization
const LaserScan = ({ scanData }) => {
    const pointsRef = useRef()

    useEffect(() => {
        if (!scanData || !pointsRef.current) return

        const positions = []
        const colors = []

        scanData.ranges.forEach((range, index) => {
            if (range > scanData.range_min && range < scanData.range_max) {
                const angle = scanData.angle_min + index * scanData.angle_increment
                const x = range * Math.cos(angle)
                const y = range * Math.sin(angle)

                positions.push(x, y, 0.05)

                // Color based on distance
                const normalized = range / scanData.range_max
                colors.push(1 - normalized, normalized, 0)
            }
        })

        const geometry = new THREE.BufferGeometry()
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))

        pointsRef.current.geometry = geometry
    }, [scanData])

    return (
        <points ref={pointsRef}>
            <bufferGeometry />
            <pointsMaterial size={0.02} vertexColors />
        </points>
    )
}

// Path Visualization
const PathLine = ({ points }) => {
    const lineRef = useRef()

    useEffect(() => {
        if (!points || points.length < 2) return

        const positions = []
        points.forEach(point => {
            positions.push(point.x, point.y, 0.02)
        })

        const geometry = new THREE.BufferGeometry()
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))

        if (lineRef.current) {
            lineRef.current.geometry = geometry
        }
    }, [points])

    return (
        <line ref={lineRef}>
            <bufferGeometry />
            <lineBasicMaterial color="#10b981" linewidth={2} />
        </line>
    )
}

// Map Grid
const MapGrid = ({ mapData }) => {
    const meshRef = useRef()

    useEffect(() => {
        if (!mapData) return

        const { width, height, data } = mapData
        const geometry = new THREE.PlaneGeometry(width * 0.05, height * 0.05, width, height)

        const colors = []
        data.forEach(value => {
            const color = value === 0 ? 0.9 : value === 100 ? 0.1 : 0.5
            colors.push(color, color, color)
        })

        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))

        if (meshRef.current) {
            meshRef.current.geometry = geometry
        }
    }, [mapData])

    return (
        <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
            <planeGeometry args={[10, 10, 100, 100]} />
            <meshBasicMaterial vertexColors side={THREE.DoubleSide} opacity={0.8} transparent />
        </mesh>
    )
}

// Main Scene Component
const Scene = () => {
    const [robotPose, setRobotPose] = useState([0, 0, 0])
    const [robotRotation, setRobotRotation] = useState(0)
    const [scanData, setScanData] = useState(null)
    const [pathPoints, setPathPoints] = useState([])
    const [mapData, setMapData] = useState(null)

    useEffect(() => {
        // Subscribe to odometry
        const odomTopic = rosClient.subscribeTopic('/odom', 'nav_msgs/Odometry', (msg) => {
            const pose = msg.pose.pose.position
            const orientation = msg.pose.pose.orientation

            setRobotPose([pose.x, pose.y, pose.z])

            // Convert quaternion to euler (yaw only)
            const yaw = Math.atan2(
                2 * (orientation.w * orientation.z + orientation.x * orientation.y),
                1 - 2 * (orientation.y * orientation.y + orientation.z * orientation.z)
            )
            setRobotRotation(yaw)

            // Add to path
            setPathPoints(prev => [...prev.slice(-100), { x: pose.x, y: pose.y }])
        })

        // Subscribe to laser scan
        const scanTopic = rosClient.subscribeTopic('/scan', 'sensor_msgs/LaserScan', (msg) => {
            setScanData(msg)
        })

        // Subscribe to map
        const mapTopic = rosClient.subscribeTopic('/map', 'nav_msgs/OccupancyGrid', (msg) => {
            setMapData({
                width: msg.info.width,
                height: msg.info.height,
                resolution: msg.info.resolution,
                data: msg.data,
            })
        })

        return () => {
            if (odomTopic) rosClient.unsubscribeTopic('/odom')
            if (scanTopic) rosClient.unsubscribeTopic('/scan')
            if (mapTopic) rosClient.unsubscribeTopic('/map')
        }
    }, [])

    return (
        <>
            <PerspectiveCamera makeDefault position={[2, 2, 2]} fov={60} />
            <OrbitControls enablePan enableZoom enableRotate />

            {/* Lighting */}
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} castShadow />

            {/* Grid */}
            <Grid
                infiniteGrid
                fadeDistance={30}
                cellSize={0.5}
                sectionSize={2}
                sectionColor="#3b82f6"
                cellColor="#374151"
            />

            {/* Robot */}
            <RobotModel position={robotPose} rotation={robotRotation} />

            {/* Laser scan */}
            {scanData && <LaserScan scanData={scanData} />}

            {/* Path */}
            {pathPoints.length > 1 && <PathLine points={pathPoints} />}

            {/* Map */}
            {mapData && <MapGrid mapData={mapData} />}

            {/* Coordinate axes */}
            <axesHelper args={[1]} />
        </>
    )
}

const RvizPanel = () => {
    return (
        <div className="w-full h-full bg-gray-950">
            <Canvas shadows>
                <Scene />
                <Stats className="stats-panel" />
            </Canvas>
        </div>
    )
}

export default RvizPanel