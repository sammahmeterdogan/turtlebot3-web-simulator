import React from 'react'
import { motion } from 'framer-motion'
import {
    Gamepad2,
    Map,
    Navigation,
    Shield,
    Users,
    Route,
    GitBranch,
    Target,
    Grid3x3
} from 'lucide-react'

const SCENARIOS = [
    {
        id: 'TELEOP',
        name: 'Teleoperation',
        description: 'Manual control with keyboard or joystick',
        icon: Gamepad2,
        difficulty: 'Easy',
        color: 'green',
        requiredTopics: ['/cmd_vel', '/odom'],
    },
    {
        id: 'SLAM',
        name: 'SLAM Mapping',
        description: 'Create a map while navigating',
        icon: Map,
        difficulty: 'Medium',
        color: 'blue',
        requiredTopics: ['/scan', '/map', '/tf'],
    },
    {
        id: 'NAVIGATION',
        name: 'Navigation',
        description: 'Autonomous navigation to goals',
        icon: Navigation,
        difficulty: 'Medium',
        color: 'purple',
        requiredTopics: ['/map', '/amcl_pose', '/move_base'],
    },
    {
        id: 'OBSTACLE_AVOIDANCE',
        name: 'Obstacle Avoidance',
        description: 'Avoid obstacles autonomously',
        icon: Shield,
        difficulty: 'Medium',
        color: 'orange',
        requiredTopics: ['/scan', '/cmd_vel'],
    },
    {
        id: 'FOLLOW_PERSON',
        name: 'Follow Mode',
        description: 'Follow a detected person or object',
        icon: Users,
        difficulty: 'Hard',
        color: 'pink',
        requiredTopics: ['/camera/image', '/scan', '/cmd_vel'],
    },
    {
        id: 'PATROL',
        name: 'Patrol Mode',
        description: 'Patrol between waypoints',
        icon: Route,
        difficulty: 'Medium',
        color: 'cyan',
        requiredTopics: ['/waypoints', '/amcl_pose'],
    },
    {
        id: 'LINE_FOLLOWING',
        name: 'Line Following',
        description: 'Follow a line on the ground',
        icon: GitBranch,
        difficulty: 'Hard',
        color: 'yellow',
        requiredTopics: ['/camera/image', '/cmd_vel'],
    },
    {
        id: 'POSITION_CONTROL',
        name: 'Position Control',
        description: 'Precise position commands',
        icon: Target,
        difficulty: 'Easy',
        color: 'indigo',
        requiredTopics: ['/cmd_vel', '/odom'],
    },
    {
        id: 'MULTI_ROBOT',
        name: 'Multi-Robot',
        description: 'Control multiple robots',
        icon: Grid3x3,
        difficulty: 'Hard',
        color: 'red',
        requiredTopics: ['/robot1/*', '/robot2/*'],
    },
]

const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
        case 'Easy': return 'text-green-400 bg-green-900/50'
        case 'Medium': return 'text-yellow-400 bg-yellow-900/50'
        case 'Hard': return 'text-red-400 bg-red-900/50'
        default: return 'text-gray-400 bg-gray-900/50'
    }
}

const ScenarioSelector = ({ selectedScenario, onScenarioChange, disabled = false }) => {
    return (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <Grid3x3 className="w-4 h-4 text-primary-400" />
                Scenario
            </h3>

            <div className="grid grid-cols-1 gap-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {SCENARIOS.map((scenario, index) => {
                    const Icon = scenario.icon
                    const isSelected = selectedScenario === scenario.id

                    return (
                        <motion.button
                            key={scenario.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => onScenarioChange(scenario.id)}
                            disabled={disabled}
                            className={`w-full text-left transition-all ${
                                disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                            }`}
                        >
                            <div
                                className={`border rounded-lg p-3 transition-all ${
                                    isSelected
                                        ? 'border-primary-500 bg-primary-500/10'
                                        : 'border-gray-700 hover:border-gray-600 bg-gray-800/50'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`p-1.5 rounded-lg ${
                                        isSelected ? 'bg-primary-500/20' : 'bg-gray-700'
                                    }`}>
                                        <Icon className={`w-4 h-4 ${
                                            isSelected ? 'text-primary-400' : 'text-gray-400'
                                        }`} />
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <h4 className={`font-medium text-sm ${
                                                isSelected ? 'text-white' : 'text-gray-300'
                                            }`}>
                                                {scenario.name}
                                            </h4>
                                            <span className={`px-2 py-0.5 text-xs rounded-full ${getDifficultyColor(scenario.difficulty)}`}>
                        {scenario.difficulty}
                      </span>
                                        </div>
                                        <p className="text-xs text-gray-400 mt-0.5">
                                            {scenario.description}
                                        </p>
                                    </div>
                                </div>

                                {isSelected && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        className="mt-2 pt-2 border-t border-gray-700"
                                    >
                                        <p className="text-xs text-gray-500 mb-1">Required Topics:</p>
                                        <div className="flex flex-wrap gap-1">
                                            {scenario.requiredTopics.map((topic) => (
                                                <span
                                                    key={topic}
                                                    className="px-2 py-0.5 bg-gray-800 text-gray-300 text-xs rounded"
                                                >
                          {topic}
                        </span>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        </motion.button>
                    )
                })}
            </div>
        </div>
    )
}

export default ScenarioSelector