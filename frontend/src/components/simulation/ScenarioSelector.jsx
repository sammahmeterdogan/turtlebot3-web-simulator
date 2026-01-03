import React from 'react';
import { motion } from 'framer-motion';
import {
    Gamepad2,
    Map,
    Navigation,
    Shield,
    Users,
    Route,
    GitBranch,
    Target,
    Grid3x3,
    Turtle // Yeni ikon
} from 'lucide-react';

// Senaryo listesine Turtlesim eklendi
const SCENARIOS = [
    {
        id: 'TELEOP',
        name: 'Teleoperation',
        description: 'Manual control with keyboard or joystick',
        icon: Gamepad2,
        difficulty: 'Easy',
    },
    {
        id: 'TURTLESIM',
        name: 'Turtlesim',
        description: 'Classic ROS simulator for learning basics',
        icon: Turtle, // Turtlesim için yeni ikon
        difficulty: 'Easy',
    },
    {
        id: 'SLAM',
        name: 'SLAM Mapping',
        description: 'Create a map while navigating',
        icon: Map,
        difficulty: 'Medium',
    },
    {
        id: 'NAVIGATION',
        name: 'Navigation',
        description: 'Autonomous navigation to goals',
        icon: Navigation,
        difficulty: 'Medium',
    },
    {
        id: 'OBSTACLE_AVOIDANCE',
        name: 'Obstacle Avoidance',
        description: 'Detect and avoid obstacles automatically',
        icon: Shield,
        difficulty: 'Medium',
    },
    {
        id: 'FOLLOW_PERSON',
        name: 'Person Following',
        description: 'Follow a person using vision sensors',
        icon: Users,
        difficulty: 'Hard',
    },
    {
        id: 'PATROL',
        name: 'Patrol Route',
        description: 'Follow a predefined patrol route',
        icon: Route,
        difficulty: 'Medium',
    },
    {
        id: 'LINE_FOLLOWING',
        name: 'Line Following',
        description: 'Follow a line on the ground',
        icon: GitBranch,
        difficulty: 'Easy',
    },
    {
        id: 'POSITION_CONTROL',
        name: 'Position Control',
        description: 'Move to a specific coordinate',
        icon: Target,
        difficulty: 'Medium',
    },
    {
        id: 'MULTI_ROBOT',
        name: 'Multi-Robot',
        description: 'Coordinate multiple robots in one environment',
        icon: Grid3x3,
        difficulty: 'Expert',
    },
];

const ScenarioSelector = ({ selectedScenario, onScenarioChange, disabled }) => {
    return (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 h-full">
            <h3 className="text-lg font-semibold text-gray-200 mb-4">Select Scenario</h3>
            <div className="space-y-2 overflow-y-auto h-[calc(100%-40px)] pr-2">
                {SCENARIOS.map((scenario) => (
                    <motion.div
                        key={scenario.id}
                        onClick={() => !disabled && onScenarioChange(scenario.id)}
                        className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                            disabled
                                ? 'cursor-not-allowed bg-gray-800 opacity-50'
                                : 'cursor-pointer hover:bg-gray-700'
                        } ${
                            selectedScenario === scenario.id
                                ? 'border-blue-500 bg-gray-800'
                                : 'border-gray-700'
                        }`}
                        whileTap={{ scale: disabled ? 1 : 0.98 }}
                    >
                        <div className="flex items-center gap-4">
                            <scenario.icon className="w-6 h-6 text-blue-400" />
                            <div>
                                <h4 className="font-bold text-gray-100">{scenario.name}</h4>
                                <p className="text-sm text-gray-400">{scenario.description}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default ScenarioSelector;