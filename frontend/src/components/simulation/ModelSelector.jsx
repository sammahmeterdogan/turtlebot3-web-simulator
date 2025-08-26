import React from 'react'
import { motion } from 'framer-motion'
import { Bot, Cpu, Camera, Zap } from 'lucide-react'

const ROBOT_MODELS = [
    {
        id: 'burger',
        name: 'TurtleBot3 Burger',
        description: 'Basic model for education and research',
        specs: {
            maxSpeed: '0.22 m/s',
            payload: '15 kg',
            sensors: 'LiDAR, IMU',
            battery: '2800 mAh'
        },
        icon: Bot,
        color: 'blue'
    },
    {
        id: 'waffle',
        name: 'TurtleBot3 Waffle',
        description: 'Advanced model with more sensors',
        specs: {
            maxSpeed: '0.26 m/s',
            payload: '30 kg',
            sensors: 'LiDAR, IMU, Camera',
            battery: '3200 mAh'
        },
        icon: Cpu,
        color: 'green'
    },
    {
        id: 'waffle_pi',
        name: 'TurtleBot3 Waffle Pi',
        description: 'Waffle with Raspberry Pi and camera',
        specs: {
            maxSpeed: '0.26 m/s',
            payload: '30 kg',
            sensors: 'LiDAR, IMU, RealSense',
            battery: '3200 mAh'
        },
        icon: Camera,
        color: 'purple'
    }
]

const ModelSelector = ({ selectedModel, onModelChange, disabled = false, models }) => {
    const availableModels = models || ROBOT_MODELS

    return (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <Bot className="w-4 h-4 text-primary-400" />
                Robot Model
            </h3>

            <div className="space-y-3">
                {availableModels.map((model, index) => {
                    const Icon = model.icon
                    const isSelected = selectedModel === model.id

                    return (
                        <motion.div
                            key={model.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <button
                                onClick={() => onModelChange(model.id)}
                                disabled={disabled}
                                className={`w-full text-left transition-all ${
                                    disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                                }`}
                            >
                                <div
                                    className={`border-2 rounded-lg p-3 transition-all ${
                                        isSelected
                                            ? 'border-primary-500 bg-primary-500/10'
                                            : 'border-gray-700 hover:border-gray-600 bg-gray-800/50'
                                    }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className={`p-2 rounded-lg ${
                                            isSelected ? 'bg-primary-500/20' : 'bg-gray-700'
                                        }`}>
                                            <Icon className={`w-5 h-5 ${
                                                isSelected ? 'text-primary-400' : 'text-gray-400'
                                            }`} />
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <h4 className={`font-medium ${
                                                    isSelected ? 'text-white' : 'text-gray-300'
                                                }`}>
                                                    {model.name}
                                                </h4>
                                                {isSelected && (
                                                    <motion.span
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        className="px-2 py-0.5 bg-primary-500 text-white text-xs rounded-full"
                                                    >
                                                        Selected
                                                    </motion.span>
                                                )}
                                            </div>

                                            <p className="text-xs text-gray-400 mt-1">
                                                {model.description}
                                            </p>

                                            {isSelected && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    className="mt-2 pt-2 border-t border-gray-700"
                                                >
                                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                                        <div>
                                                            <span className="text-gray-500">Speed:</span>
                                                            <span className="ml-1 text-gray-300">{model.specs.maxSpeed}</span>
                                                        </div>
                                                        <div>
                                                            <span className="text-gray-500">Payload:</span>
                                                            <span className="ml-1 text-gray-300">{model.specs.payload}</span>
                                                        </div>
                                                        <div>
                                                            <span className="text-gray-500">Sensors:</span>
                                                            <span className="ml-1 text-gray-300">{model.specs.sensors}</span>
                                                        </div>
                                                        <div>
                                                            <span className="text-gray-500">Battery:</span>
                                                            <span className="ml-1 text-gray-300">{model.specs.battery}</span>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </button>
                        </motion.div>
                    )
                })}
            </div>
        </div>
    )
}

export default ModelSelector