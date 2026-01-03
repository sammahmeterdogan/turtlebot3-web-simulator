import React, { useEffect, useState, useRef, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Keyboard, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Square, AlertCircle, CheckCircle2 } from 'lucide-react'
import PageContainer from '../components/layout/PageContainer'
import { teleopAPI, simulationAPI } from '../services/api'
import { rosClient } from '../services/rosClient'

/**
 * Keyboard Teleoperation Demo Page
 * 
 * A dedicated demo page for keyboard-based robot control, similar to ROS 2 Turtlesim.
 * This demonstrates end-to-end robot control via keyboard input.
 */
const KeyboardTeleopDemo = () => {
    const [isActive, setIsActive] = useState(false)
    const [velocity, setVelocity] = useState({ linear: 0, angular: 0 })
    const [pressedKeys, setPressedKeys] = useState(new Set())
    const [connectionStatus, setConnectionStatus] = useState({ ros: false, backend: false })
    const commandIntervalRef = useRef(null)
    const isMountedRef = useRef(true)

    // Check simulation status
    const { data: simStatus } = useQuery({
        queryKey: ['sim-status'],
        queryFn: simulationAPI.status,
        refetchInterval: 2000,
    })

    const isSimulationRunning = simStatus?.status === 'RUNNING'

    // Velocity constants (TurtleBot3 Burger safe values)
    const MAX_LINEAR_VEL = 0.22  // m/s
    const MAX_ANGULAR_VEL = 2.84 // rad/s

    // Check connections
    useEffect(() => {
        const checkConnections = () => {
            if (isMountedRef.current) {
                setConnectionStatus({
                    ros: rosClient.isConnected(),
                    backend: true, // Assume backend is available if API works
                })
            }
        }

        checkConnections()
        const interval = setInterval(checkConnections, 2000)

        return () => clearInterval(interval)
    }, [])

    // Send velocity command to robot
    const sendVelocityCommand = useCallback((linear, angular) => {
        if (!isMountedRef.current || !isSimulationRunning) return

        // Send via backend API (format: { linear: { x: ... }, angular: { z: ... } })
        const twistCmd = {
            linear: { x: linear, y: 0, z: 0 },
            angular: { x: 0, y: 0, z: angular }
        }

        teleopAPI.sendTwist(twistCmd).catch((error) => {
            console.error('Failed to send velocity command:', error)
        })

        // Also publish directly via ROS client if connected
        if (rosClient.isConnected()) {
            try {
                rosClient.publishTopic('/cmd_vel', 'geometry_msgs/Twist', {
                    linear: { x: linear, y: 0, z: 0 },
                    angular: { x: 0, y: 0, z: angular },
                })
            } catch (error) {
                console.error('Failed to publish via ROS client:', error)
            }
        }

        setVelocity({ linear, angular })
    }, [isSimulationRunning])

    // Stop robot
    const stopRobot = useCallback(() => {
        sendVelocityCommand(0, 0)
        setPressedKeys(new Set())
    }, [sendVelocityCommand])

    // Keyboard event handlers
    useEffect(() => {
        if (!isActive || !isSimulationRunning) {
            stopRobot()
            return
        }

        const pressedKeysSet = new Set()

        const calculateVelocity = () => {
            let linear = 0
            let angular = 0

            const keys = Array.from(pressedKeysSet)

            // Forward
            if (keys.some(k => k.toLowerCase() === 'w' || k === 'ArrowUp')) {
                linear = MAX_LINEAR_VEL
            }
            // Backward
            if (keys.some(k => k.toLowerCase() === 's' || k === 'ArrowDown')) {
                linear = -MAX_LINEAR_VEL
            }
            // Left rotation
            if (keys.some(k => k.toLowerCase() === 'a' || k === 'ArrowLeft')) {
                angular = MAX_ANGULAR_VEL
            }
            // Right rotation
            if (keys.some(k => k.toLowerCase() === 'd' || k === 'ArrowRight')) {
                angular = -MAX_ANGULAR_VEL
            }

            return { linear, angular }
        }

        const sendCommand = () => {
            if (!isMountedRef.current) return
            const { linear, angular } = calculateVelocity()
            sendVelocityCommand(linear, angular)
            setPressedKeys(new Set(pressedKeysSet))
        }

        const handleKeyDown = (event) => {
            if (!isMountedRef.current) return

            // Handle Space key for stop
            if (event.key === ' ' || event.key === 'Space') {
                event.preventDefault()
                stopRobot()
                return
            }

            // Prevent default behavior for control keys
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
                event.preventDefault()
            }

            // Ignore if key is already pressed (prevent repeat)
            if (event.repeat) return

            const key = event.key.toLowerCase()
            const keyCode = event.key

            // Add to pressed keys
            pressedKeysSet.add(key)
            pressedKeysSet.add(keyCode)

            // Send command immediately
            sendCommand()

            // Start continuous command sending if not already running
            if (!commandIntervalRef.current) {
                commandIntervalRef.current = setInterval(sendCommand, 100)
            }
        }

        const handleKeyUp = (event) => {
            if (!isMountedRef.current) return

            const key = event.key.toLowerCase()
            const keyCode = event.key

            // Remove from pressed keys
            pressedKeysSet.delete(key)
            pressedKeysSet.delete(keyCode)

            // Update state for UI
            setPressedKeys(new Set(pressedKeysSet))

            // Check if any movement keys are still pressed
            const { linear, angular } = calculateVelocity()

            // If no keys are pressed, stop robot and clear interval
            if (linear === 0 && angular === 0) {
                if (commandIntervalRef.current) {
                    clearInterval(commandIntervalRef.current)
                    commandIntervalRef.current = null
                }
                stopRobot()
            } else {
                // Continue sending command with remaining keys
                sendCommand()
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        window.addEventListener('keyup', handleKeyUp)

        return () => {
            window.removeEventListener('keydown', handleKeyDown)
            window.removeEventListener('keyup', handleKeyUp)
            if (commandIntervalRef.current) {
                clearInterval(commandIntervalRef.current)
                commandIntervalRef.current = null
            }
            pressedKeysSet.clear()
            stopRobot()
        }
    }, [isActive, isSimulationRunning, sendVelocityCommand, stopRobot])

    // Cleanup on unmount
    useEffect(() => {
        isMountedRef.current = true
        return () => {
            isMountedRef.current = false
            if (commandIntervalRef.current) {
                clearInterval(commandIntervalRef.current)
            }
            stopRobot()
        }
    }, [stopRobot])


    const getKeyStatus = (key) => {
        return pressedKeys.has(key.toLowerCase()) || pressedKeys.has(key)
    }

    return (
        <PageContainer
            title="Keyboard Teleoperation Demo"
            description="Control the robot using keyboard keys - Turtlesim-style demo"
        >
            <div className="space-y-6">
                {/* Status Panel */}
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Simulation Status */}
                        <div className="flex items-center gap-3">
                            {isSimulationRunning ? (
                                <CheckCircle2 className="w-5 h-5 text-green-400" />
                            ) : (
                                <AlertCircle className="w-5 h-5 text-red-400" />
                            )}
                            <div>
                                <p className="text-xs text-gray-400">Simulation</p>
                                <p className={`text-sm font-medium ${isSimulationRunning ? 'text-green-400' : 'text-red-400'}`}>
                                    {isSimulationRunning ? 'Running' : 'Stopped'}
                                </p>
                            </div>
                        </div>

                        {/* Keyboard Control Status */}
                        <div className="flex items-center gap-3">
                            {isActive ? (
                                <CheckCircle2 className="w-5 h-5 text-blue-400" />
                            ) : (
                                <AlertCircle className="w-5 h-5 text-gray-500" />
                            )}
                            <div>
                                <p className="text-xs text-gray-400">Keyboard Control</p>
                                <p className={`text-sm font-medium ${isActive ? 'text-blue-400' : 'text-gray-500'}`}>
                                    {isActive ? 'Active' : 'Inactive'}
                                </p>
                            </div>
                        </div>

                        {/* ROS Connection */}
                        <div className="flex items-center gap-3">
                            {connectionStatus.ros ? (
                                <CheckCircle2 className="w-5 h-5 text-green-400" />
                            ) : (
                                <AlertCircle className="w-5 h-5 text-yellow-400" />
                            )}
                            <div>
                                <p className="text-xs text-gray-400">ROS Connection</p>
                                <p className={`text-sm font-medium ${connectionStatus.ros ? 'text-green-400' : 'text-yellow-400'}`}>
                                    {connectionStatus.ros ? 'Connected' : 'Disconnected'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Warning if simulation not running */}
                {!isSimulationRunning && (
                    <div className="bg-yellow-900/20 border border-yellow-700 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
                            <div>
                                <p className="text-yellow-400 font-medium mb-1">Simulation Not Running</p>
                                <p className="text-yellow-300/80 text-sm">
                                    Please start the simulation from the Simulator page before using keyboard control.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Control Panel */}
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-white font-semibold text-lg flex items-center gap-2">
                            <Keyboard className="w-5 h-5 text-blue-400" />
                            Keyboard Control
                        </h2>
                        <button
                            onClick={() => setIsActive(!isActive)}
                            disabled={!isSimulationRunning}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${
                                isActive
                                    ? 'bg-red-600 hover:bg-red-700 text-white'
                                    : 'bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-700 disabled:cursor-not-allowed'
                            }`}
                        >
                            {isActive ? 'Deactivate' : 'Activate'}
                        </button>
                    </div>

                    {isActive && (
                        <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4 mb-6">
                            <p className="text-blue-300 text-sm font-medium mb-2">✓ Keyboard control is active</p>
                            <p className="text-blue-300/80 text-xs">
                                Click anywhere on this page to focus, then use the keyboard keys below to control the robot.
                            </p>
                        </div>
                    )}

                    {/* Keyboard Layout Visualization */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Visual Keyboard */}
                        <div className="space-y-4">
                            <h3 className="text-white font-medium text-sm">Keyboard Layout</h3>
                            <div className="bg-gray-800 rounded-lg p-6">
                                <div className="grid grid-cols-3 gap-3 max-w-[240px] mx-auto">
                                    {/* Empty */}
                                    <div></div>
                                    {/* Forward */}
                                    <button
                                        className={`p-4 rounded-lg transition-all ${
                                            getKeyStatus('w') || getKeyStatus('ArrowUp')
                                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50'
                                                : 'bg-gray-700 text-gray-400'
                                        }`}
                                        disabled
                                    >
                                        <ArrowUp className="w-6 h-6 mx-auto" />
                                        <p className="text-xs mt-1">W / ↑</p>
                                    </button>
                                    {/* Empty */}
                                    <div></div>

                                    {/* Left */}
                                    <button
                                        className={`p-4 rounded-lg transition-all ${
                                            getKeyStatus('a') || getKeyStatus('ArrowLeft')
                                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50'
                                                : 'bg-gray-700 text-gray-400'
                                        }`}
                                        disabled
                                    >
                                        <ArrowLeft className="w-6 h-6 mx-auto" />
                                        <p className="text-xs mt-1">A / ←</p>
                                    </button>
                                    {/* Stop */}
                                    <button
                                        className={`p-4 rounded-lg transition-all ${
                                            getKeyStatus(' ')
                                                ? 'bg-red-600 text-white shadow-lg shadow-red-500/50'
                                                : 'bg-gray-700 text-gray-400'
                                        }`}
                                        disabled
                                    >
                                        <Square className="w-6 h-6 mx-auto" />
                                        <p className="text-xs mt-1">Space</p>
                                    </button>
                                    {/* Right */}
                                    <button
                                        className={`p-4 rounded-lg transition-all ${
                                            getKeyStatus('d') || getKeyStatus('ArrowRight')
                                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50'
                                                : 'bg-gray-700 text-gray-400'
                                        }`}
                                        disabled
                                    >
                                        <ArrowRight className="w-6 h-6 mx-auto" />
                                        <p className="text-xs mt-1">D / →</p>
                                    </button>

                                    {/* Empty */}
                                    <div></div>
                                    {/* Backward */}
                                    <button
                                        className={`p-4 rounded-lg transition-all ${
                                            getKeyStatus('s') || getKeyStatus('ArrowDown')
                                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50'
                                                : 'bg-gray-700 text-gray-400'
                                        }`}
                                        disabled
                                    >
                                        <ArrowDown className="w-6 h-6 mx-auto" />
                                        <p className="text-xs mt-1">S / ↓</p>
                                    </button>
                                    {/* Empty */}
                                    <div></div>
                                </div>
                            </div>
                        </div>

                        {/* Velocity Display */}
                        <div className="space-y-4">
                            <h3 className="text-white font-medium text-sm">Current Velocity</h3>
                            <div className="bg-gray-800 rounded-lg p-6 space-y-4">
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-gray-400 text-sm">Linear Velocity</span>
                                        <span className="text-white font-mono text-lg">
                                            {velocity.linear.toFixed(2)} m/s
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-700 rounded-full h-2">
                                        <div
                                            className="bg-blue-500 h-2 rounded-full transition-all duration-200"
                                            style={{
                                                width: `${Math.abs((velocity.linear / MAX_LINEAR_VEL) * 100)}%`,
                                                marginLeft: velocity.linear < 0 ? 'auto' : '0',
                                            }}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-gray-400 text-sm">Angular Velocity</span>
                                        <span className="text-white font-mono text-lg">
                                            {velocity.angular.toFixed(2)} rad/s
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-700 rounded-full h-2">
                                        <div
                                            className="bg-green-500 h-2 rounded-full transition-all duration-200"
                                            style={{
                                                width: `${Math.abs((velocity.angular / MAX_ANGULAR_VEL) * 100)}%`,
                                                marginLeft: velocity.angular < 0 ? 'auto' : '0',
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Instructions */}
                    <div className="mt-6 bg-gray-800 rounded-lg p-4">
                        <h3 className="text-white font-medium text-sm mb-3">Instructions</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                            <div className="flex items-center gap-2">
                                <ArrowUp className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-300">W or ↑ - Move Forward</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <ArrowDown className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-300">S or ↓ - Move Backward</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <ArrowLeft className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-300">A or ← - Rotate Left</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <ArrowRight className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-300">D or → - Rotate Right</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Square className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-300">Space - Stop Robot</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Keyboard className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-300">Keys can be combined (e.g., W+A)</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Info Panel */}
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                    <h3 className="text-white font-medium text-sm mb-3">About This Demo</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                        This keyboard teleoperation demo is inspired by the ROS 2 Turtlesim example. It demonstrates
                        end-to-end robot control from keyboard input to ROS 2 command publishing. Commands are sent to
                        the <code className="text-blue-400">/cmd_vel</code> topic as <code className="text-blue-400">geometry_msgs/Twist</code> messages.
                        You can observe the robot movement in RViz on the Simulator page.
                    </p>
                </div>
            </div>
        </PageContainer>
    )
}

export default KeyboardTeleopDemo

