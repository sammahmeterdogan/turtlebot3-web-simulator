import React, { useEffect, useRef, useState } from 'react'
import { rosClient } from '../../services/rosClient'

// Simple 2D Canvas-based visualization (production ready)
const RvizPanel = () => {
    const canvasRef = useRef(null)
    const [robotPose, setRobotPose] = useState({ x: 0, y: 0, theta: 0 })
    const [scanData, setScanData] = useState(null)
    const [pathPoints, setPathPoints] = useState([])
    const [isConnected, setIsConnected] = useState(false)

    // Canvas dimensions and scaling
    const CANVAS_WIDTH = 800
    const CANVAS_HEIGHT = 600
    const SCALE = 100 // pixels per meter
    const CENTER_X = CANVAS_WIDTH / 2
    const CENTER_Y = CANVAS_HEIGHT / 2

    useEffect(() => {
        // Check ROS connection
        const checkConnection = () => {
            setIsConnected(rosClient.isConnected())
        }

        checkConnection()
        const connectionInterval = setInterval(checkConnection, 1000)

        // Subscribe to odometry if connected
        let odomTopic = null
        let scanTopic = null

        const setupSubscriptions = () => {
            if (rosClient.isConnected()) {
                // Subscribe to odometry
                odomTopic = rosClient.subscribeTopic('/odom', 'nav_msgs/Odometry', (msg) => {
                    try {
                        const pose = msg?.pose?.pose?.position || { x: 0, y: 0 }
                        const orientation = msg?.pose?.pose?.orientation || { x: 0, y: 0, z: 0, w: 1 }

                        // Convert quaternion to yaw
                        const yaw = Math.atan2(
                            2 * (orientation.w * orientation.z + orientation.x * orientation.y),
                            1 - 2 * (orientation.y * orientation.y + orientation.z * orientation.z)
                        )

                        setRobotPose({ x: pose.x, y: pose.y, theta: yaw })

                        // Add to path (keep last 200 points)
                        setPathPoints(prev => [...prev.slice(-199), { x: pose.x, y: pose.y }])
                    } catch (error) {
                        console.error('Odom parsing error:', error)
                    }
                })

                // Subscribe to laser scan
                scanTopic = rosClient.subscribeTopic('/scan', 'sensor_msgs/LaserScan', (msg) => {
                    try {
                        setScanData(msg)
                    } catch (error) {
                        console.error('Scan parsing error:', error)
                    }
                })
            }
        }

        setupSubscriptions()

        // Retry connection setup if not connected
        const setupInterval = setInterval(() => {
            if (!odomTopic && rosClient.isConnected()) {
                setupSubscriptions()
            }
        }, 2000)

        return () => {
            clearInterval(connectionInterval)
            clearInterval(setupInterval)
            if (odomTopic) rosClient.unsubscribeTopic('/odom')
            if (scanTopic) rosClient.unsubscribeTopic('/scan')
        }
    }, [])

    // Canvas drawing function
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

        // Set canvas size
        canvas.width = CANVAS_WIDTH
        canvas.height = CANVAS_HEIGHT

        // Draw grid
        ctx.strokeStyle = '#374151'
        ctx.lineWidth = 1
        ctx.setLineDash([2, 2])

        // Vertical grid lines
        for (let x = 0; x <= CANVAS_WIDTH; x += SCALE / 2) {
            ctx.beginPath()
            ctx.moveTo(x, 0)
            ctx.lineTo(x, CANVAS_HEIGHT)
            ctx.stroke()
        }

        // Horizontal grid lines
        for (let y = 0; y <= CANVAS_HEIGHT; y += SCALE / 2) {
            ctx.beginPath()
            ctx.moveTo(0, y)
            ctx.lineTo(CANVAS_WIDTH, y)
            ctx.stroke()
        }

        ctx.setLineDash([])

        // Draw axes
        ctx.strokeStyle = '#3b82f6'
        ctx.lineWidth = 2

        // X-axis
        ctx.beginPath()
        ctx.moveTo(CENTER_X, CENTER_Y)
        ctx.lineTo(CENTER_X + SCALE, CENTER_Y)
        ctx.stroke()

        // Y-axis
        ctx.beginPath()
        ctx.moveTo(CENTER_X, CENTER_Y)
        ctx.lineTo(CENTER_X, CENTER_Y - SCALE)
        ctx.stroke()

        // Draw axes labels
        ctx.fillStyle = '#3b82f6'
        ctx.font = '12px monospace'
        ctx.fillText('X', CENTER_X + SCALE + 5, CENTER_Y + 5)
        ctx.fillText('Y', CENTER_X - 10, CENTER_Y - SCALE - 5)

        // Draw origin
        ctx.fillStyle = '#ef4444'
        ctx.beginPath()
        ctx.arc(CENTER_X, CENTER_Y, 3, 0, 2 * Math.PI)
        ctx.fill()

        // Draw path
        if (pathPoints.length > 1) {
            ctx.strokeStyle = '#10b981'
            ctx.lineWidth = 2
            ctx.beginPath()

            pathPoints.forEach((point, index) => {
                const x = CENTER_X + point.x * SCALE
                const y = CENTER_Y - point.y * SCALE // Flip Y coordinate

                if (index === 0) {
                    ctx.moveTo(x, y)
                } else {
                    ctx.lineTo(x, y)
                }
            })
            ctx.stroke()
        }

        // Draw laser scan
        if (scanData && scanData.ranges) {
            ctx.fillStyle = '#f59e0b'
            scanData.ranges.forEach((range, index) => {
                if (range > scanData.range_min && range < scanData.range_max) {
                    const angle = scanData.angle_min + index * scanData.angle_increment
                    const globalAngle = robotPose.theta + angle
                    const x = CENTER_X + (robotPose.x + range * Math.cos(globalAngle)) * SCALE
                    const y = CENTER_Y - (robotPose.y + range * Math.sin(globalAngle)) * SCALE

                    ctx.beginPath()
                    ctx.arc(x, y, 1, 0, 2 * Math.PI)
                    ctx.fill()
                }
            })
        }

        // Draw robot
        const robotX = CENTER_X + robotPose.x * SCALE
        const robotY = CENTER_Y - robotPose.y * SCALE

        // Robot body
        ctx.fillStyle = '#3b82f6'
        ctx.beginPath()
        ctx.arc(robotX, robotY, 15, 0, 2 * Math.PI)
        ctx.fill()

        // Robot direction indicator
        ctx.strokeStyle = '#ef4444'
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.moveTo(robotX, robotY)
        ctx.lineTo(
            robotX + 20 * Math.cos(robotPose.theta),
            robotY - 20 * Math.sin(robotPose.theta)
        )
        ctx.stroke()

        // Draw robot coordinates
        ctx.fillStyle = '#ffffff'
        ctx.font = '11px monospace'
        ctx.fillText(
            `(${robotPose.x.toFixed(2)}, ${robotPose.y.toFixed(2)})`,
            robotX + 25,
            robotY - 10
        )

    }, [robotPose, scanData, pathPoints])

    return (
        <div className="w-full h-full bg-gray-950 flex items-center justify-center relative">
            {!isConnected && (
                <div className="absolute inset-0 bg-gray-900/80 flex items-center justify-center z-10">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                        <p className="text-white text-sm">Connecting to ROS...</p>
                        <p className="text-gray-400 text-xs mt-1">Make sure ROS bridge is running</p>
                    </div>
                </div>
            )}

            <canvas
                ref={canvasRef}
                className="border border-gray-700 rounded-lg max-w-full max-h-full"
                style={{
                    imageRendering: 'pixelated',
                    background: 'linear-gradient(135deg, #111827 0%, #1f2937 100%)'
                }}
            />

            {/* Info panel */}
            <div className="absolute top-4 left-4 bg-gray-900/90 backdrop-blur-sm rounded-lg p-3 text-xs text-white">
                <div className="space-y-1">
                    <div>Status: {isConnected ? '🟢 Connected' : '🔴 Disconnected'}</div>
                    <div>Position: ({robotPose.x.toFixed(2)}, {robotPose.y.toFixed(2)})</div>
                    <div>Heading: {(robotPose.theta * 180 / Math.PI).toFixed(1)}°</div>
                    <div>Path Points: {pathPoints.length}</div>
                    <div>Scan Points: {scanData?.ranges?.length || 0}</div>
                </div>
            </div>

            {/* Controls info */}
            <div className="absolute bottom-4 left-4 bg-gray-900/90 backdrop-blur-sm rounded-lg p-3 text-xs text-gray-300">
                <div className="space-y-1">
                    <div className="text-white font-medium mb-2">Visualization:</div>
                    <div>🔵 Robot Position</div>
                    <div>🔴 Robot Orientation</div>
                    <div>🟢 Path Trail</div>
                    <div>🟡 Laser Scan</div>
                </div>
            </div>
        </div>
    )
}

export default RvizPanel