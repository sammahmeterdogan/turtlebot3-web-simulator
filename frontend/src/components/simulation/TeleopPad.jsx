import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import {
    ArrowUp,
    ArrowDown,
    ArrowLeft,
    ArrowRight,
    RotateCcw,
    RotateCw,
    Square,
    Gamepad2,
    Keyboard
} from 'lucide-react'
import { teleopAPI } from '../../services/api'
import { publishCmdVel } from '../../services/rosClient'

const TeleopPad = ({ enabled = true }) => {
    const [mode, setMode] = useState('keyboard') // 'keyboard' or 'joystick'
    const [velocity, setVelocity] = useState({ linear: 0, angular: 0 })
    const [isPressed, setIsPressed] = useState({})
    const intervalRef = useRef(null)

    const MAX_LINEAR_VEL = 0.22 // m/s for TurtleBot3 Burger
    const MAX_ANGULAR_VEL = 2.84 // rad/s for TurtleBot3 Burger

    // Send velocity command
    const sendVelocity = (linear, angular) => {
        if (!enabled) return

        const cmd = {
            linear: { x: linear, y: 0, z: 0 },
            angular: { x: 0, y: 0, z: angular }
        }

        // Use ROS client for direct publishing
        publishCmdVel(linear, angular)

        // Also send via REST API for backend tracking
        teleopAPI.sendTwist(cmd).catch(console.error)

        setVelocity({ linear, angular })
    }

    // Stop robot
    const stopRobot = () => {
        sendVelocity(0, 0)
        setIsPressed({})
    }

    // Movement functions
    const moveForward = () => sendVelocity(MAX_LINEAR_VEL, 0)
    const moveBackward = () => sendVelocity(-MAX_LINEAR_VEL, 0)
    const turnLeft = () => sendVelocity(0, MAX_ANGULAR_VEL)
    const turnRight = () => sendVelocity(0, -MAX_ANGULAR_VEL)
    const moveForwardLeft = () => sendVelocity(MAX_LINEAR_VEL, MAX_ANGULAR_VEL / 2)
    const moveForwardRight = () => sendVelocity(MAX_LINEAR_VEL, -MAX_ANGULAR_VEL / 2)
    const moveBackwardLeft = () => sendVelocity(-MAX_LINEAR_VEL, MAX_ANGULAR_VEL / 2)
    const moveBackwardRight = () => sendVelocity(-MAX_LINEAR_VEL, -MAX_ANGULAR_VEL / 2)

    // Keyboard event handlers
    useEffect(() => {
        if (!enabled || mode !== 'keyboard') return

        const handleKeyDown = (e) => {
            if (e.repeat) return

            const key = e.key.toLowerCase()
            setIsPressed(prev => ({ ...prev, [key]: true }))

            switch(key) {
                case 'w':
                case 'arrowup':
                    moveForward()
                    break
                case 's':
                case 'arrowdown':
                    moveBackward()
                    break
                case 'a':
                case 'arrowleft':
                    turnLeft()
                    break
                case 'd':
                case 'arrowright':
                    turnRight()
                    break
                case 'q':
                    moveForwardLeft()
                    break
                case 'e':
                    moveForwardRight()
                    break
                case 'z':
                    moveBackwardLeft()
                    break
                case 'c':
                    moveBackwardRight()
                    break
                case ' ':
                    stopRobot()
                    break
            }
        }

        const handleKeyUp = (e) => {
            const key = e.key.toLowerCase()
            setIsPressed(prev => ({ ...prev, [key]: false }))

            // Stop robot when key is released
            if (['w', 's', 'a', 'd', 'q', 'e', 'z', 'c', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key)) {
                stopRobot()
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        window.addEventListener('keyup', handleKeyUp)

        return () => {
            window.removeEventListener('keydown', handleKeyDown)
            window.removeEventListener('keyup', handleKeyUp)
        }
    }, [enabled, mode])

    // Button press handlers
    const handleButtonPress = (action) => {
        if (!enabled) return

        action()

        // Continue sending command while button is pressed
        intervalRef.current = setInterval(action, 100)
    }

    const handleButtonRelease = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
        }
        stopRobot()
    }

    return (
        <div className="space-y-4">
            {/* Mode Selector */}
            <div className="flex gap-2">
                <button
                    onClick={() => setMode('keyboard')}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                        mode === 'keyboard'
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }`}
                >
                    <Keyboard className="w-4 h-4" />
                    <span className="text-sm">Keyboard</span>
                </button>
                <button
                    onClick={() => setMode('joystick')}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                        mode === 'joystick'
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }`}
                >
                    <Gamepad2 className="w-4 h-4" />
                    <span className="text-sm">Joystick</span>
                </button>
            </div>

            {/* Control Pad */}
            <div className="bg-gray-800 rounded-lg p-4">
                <div className="grid grid-cols-3 gap-2 max-w-[200px] mx-auto">
                    {/* Forward Left */}
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onMouseDown={() => handleButtonPress(moveForwardLeft)}
                        onMouseUp={handleButtonRelease}
                        onMouseLeave={handleButtonRelease}
                        onTouchStart={() => handleButtonPress(moveForwardLeft)}
                        onTouchEnd={handleButtonRelease}
                        disabled={!enabled}
                        className="p-3 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-900 rounded-lg transition-colors"
                    >
                        <div className="rotate-[-45deg]">
                            <ArrowUp className="w-5 h-5 text-white" />
                        </div>
                    </motion.button>

                    {/* Forward */}
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onMouseDown={() => handleButtonPress(moveForward)}
                        onMouseUp={handleButtonRelease}
                        onMouseLeave={handleButtonRelease}
                        onTouchStart={() => handleButtonPress(moveForward)}
                        onTouchEnd={handleButtonRelease}
                        disabled={!enabled}
                        className={`p-3 ${isPressed.w || isPressed.arrowup ? 'bg-primary-600' : 'bg-gray-700 hover:bg-gray-600'} disabled:bg-gray-900 rounded-lg transition-colors`}
                    >
                        <ArrowUp className="w-5 h-5 text-white" />
                    </motion.button>

                    {/* Forward Right */}
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onMouseDown={() => handleButtonPress(moveForwardRight)}
                        onMouseUp={handleButtonRelease}
                        onMouseLeave={handleButtonRelease}
                        onTouchStart={() => handleButtonPress(moveForwardRight)}
                        onTouchEnd={handleButtonRelease}
                        disabled={!enabled}
                        className="p-3 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-900 rounded-lg transition-colors"
                    >
                        <div className="rotate-45">
                            <ArrowUp className="w-5 h-5 text-white" />
                        </div>
                    </motion.button>

                    {/* Turn Left */}
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onMouseDown={() => handleButtonPress(turnLeft)}
                        onMouseUp={handleButtonRelease}
                        onMouseLeave={handleButtonRelease}
                        onTouchStart={() => handleButtonPress(turnLeft)}
                        onTouchEnd={handleButtonRelease}
                        disabled={!enabled}
                        className={`p-3 ${isPressed.a || isPressed.arrowleft ? 'bg-primary-600' : 'bg-gray-700 hover:bg-gray-600'} disabled:bg-gray-900 rounded-lg transition-colors`}
                    >
                        <RotateCcw className="w-5 h-5 text-white" />
                    </motion.button>

                    {/* Stop */}
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={stopRobot}
                        disabled={!enabled}
                        className="p-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-900 rounded-lg transition-colors"
                    >
                        <Square className="w-5 h-5 text-white" />
                    </motion.button>

                    {/* Turn Right */}
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onMouseDown={() => handleButtonPress(turnRight)}
                        onMouseUp={handleButtonRelease}
                        onMouseLeave={handleButtonRelease}
                        onTouchStart={() => handleButtonPress(turnRight)}
                        onTouchEnd={handleButtonRelease}
                        disabled={!enabled}
                        className={`p-3 ${isPressed.d || isPressed.arrowright ? 'bg-primary-600' : 'bg-gray-700 hover:bg-gray-600'} disabled:bg-gray-900 rounded-lg transition-colors`}
                    >
                        <RotateCw className="w-5 h-5 text-white" />
                    </motion.button>

                    {/* Backward Left */}
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onMouseDown={() => handleButtonPress(moveBackwardLeft)}
                        onMouseUp={handleButtonRelease}
                        onMouseLeave={handleButtonRelease}
                        onTouchStart={() => handleButtonPress(moveBackwardLeft)}
                        onTouchEnd={handleButtonRelease}
                        disabled={!enabled}
                        className="p-3 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-900 rounded-lg transition-colors"
                    >
                        <div className="rotate-[-135deg]">
                            <ArrowUp className="w-5 h-5 text-white" />
                        </div>
                    </motion.button>

                    {/* Backward */}
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onMouseDown={() => handleButtonPress(moveBackward)}
                        onMouseUp={handleButtonRelease}
                        onMouseLeave={handleButtonRelease}
                        onTouchStart={() => handleButtonPress(moveBackward)}
                        onTouchEnd={handleButtonRelease}
                        disabled={!enabled}
                        className={`p-3 ${isPressed.s || isPressed.arrowdown ? 'bg-primary-600' : 'bg-gray-700 hover:bg-gray-600'} disabled:bg-gray-900 rounded-lg transition-colors`}
                    >
                        <ArrowDown className="w-5 h-5 text-white" />
                    </motion.button>

                    {/* Backward Right */}
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onMouseDown={() => handleButtonPress(moveBackwardRight)}
                        onMouseUp={handleButtonRelease}
                        onMouseLeave={handleButtonRelease}
                        onTouchStart={() => handleButtonPress(moveBackwardRight)}
                        onTouchEnd={handleButtonRelease}
                        disabled={!enabled}
                        className="p-3 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-900 rounded-lg transition-colors"
                    >
                        <div className="rotate-[135deg]">
                            <ArrowUp className="w-5 h-5 text-white" />
                        </div>
                    </motion.button>
                </div>
            </div>

            {/* Velocity Display */}
            <div className="bg-gray-800 rounded-lg p-3">
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <p className="text-xs text-gray-400 mb-1">Linear Velocity</p>
                        <p className="text-sm text-white font-mono">{velocity.linear.toFixed(2)} m/s</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 mb-1">Angular Velocity</p>
                        <p className="text-sm text-white font-mono">{velocity.angular.toFixed(2)} rad/s</p>
                    </div>
                </div>
            </div>

            {/* Keyboard Shortcuts */}
            {mode === 'keyboard' && (
                <div className="bg-gray-800 rounded-lg p-3">
                    <p className="text-xs text-gray-400 mb-2">Keyboard Controls</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex justify-between">
                            <span className="text-gray-500">Forward:</span>
                            <span className="text-white font-mono">W / ↑</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Backward:</span>
                            <span className="text-white font-mono">S / ↓</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Left:</span>
                            <span className="text-white font-mono">A / ←</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Right:</span>
                            <span className="text-white font-mono">D / →</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Stop:</span>
                            <span className="text-white font-mono">Space</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Diagonals:</span>
                            <span className="text-white font-mono">Q/E/Z/C</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default TeleopPad