import React from 'react'
import { motion } from 'framer-motion'
import {
    Circle,
    CheckCircle,
    XCircle,
    AlertCircle,
    Loader,
    Wifi,
    WifiOff,
    Activity,
    Zap
} from 'lucide-react'

const StatusPanel = ({ status, model, scenario }) => {
    const getStatusIcon = () => {
        switch (status) {
            case 'RUNNING':
                return <CheckCircle className="w-5 h-5 text-green-400" />
            case 'STOPPED':
                return <XCircle className="w-5 h-5 text-red-400" />
            case 'STARTING':
            case 'STOPPING':
                return <Loader className="w-5 h-5 text-yellow-400 animate-spin" />
            case 'ERROR':
                return <AlertCircle className="w-5 h-5 text-red-400" />
            default:
                return <Circle className="w-5 h-5 text-gray-400" />
        }
    }

    const getStatusColor = () => {
        switch (status) {
            case 'RUNNING': return 'text-green-400 bg-green-900/50 border-green-800'
            case 'STOPPED': return 'text-red-400 bg-red-900/50 border-red-800'
            case 'STARTING':
            case 'STOPPING': return 'text-yellow-400 bg-yellow-900/50 border-yellow-800'
            case 'ERROR': return 'text-red-400 bg-red-900/50 border-red-800'
            default: return 'text-gray-400 bg-gray-900/50 border-gray-800'
        }
    }

    return (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary-400" />
                Simulation Status
            </h3>

            <div className="space-y-3">
                {/* Main Status */}
                <div className={`border rounded-lg p-3 ${getStatusColor()}`}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            {getStatusIcon()}
                            <span className="font-medium">{status}</span>
                        </div>
                        {status === 'RUNNING' && (
                            <motion.div
                                className="w-2 h-2 bg-green-400 rounded-full"
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                            />
                        )}
                    </div>
                </div>

                {/* Model & Scenario */}
                <div className="grid grid-cols-2 gap-2">
                    <div className="bg-gray-800 rounded-lg p-2">
                        <p className="text-xs text-gray-500 mb-1">Model</p>
                        <p className="text-sm text-white font-medium capitalize">
                            {model?.replace('_', ' ') || 'Not selected'}
                        </p>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-2">
                        <p className="text-xs text-gray-500 mb-1">Scenario</p>
                        <p className="text-sm text-white font-medium">
                            {scenario?.replace('_', ' ') || 'Not selected'}
                        </p>
                    </div>
                </div>

                {/* Connection Status */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-gray-800 rounded-lg">
                        <div className="flex items-center gap-2">
                            <Wifi className="w-4 h-4 text-gray-400" />
                            <span className="text-xs text-gray-400">ROS Bridge</span>
                        </div>
                        <span className="text-xs text-green-400">Connected</span>
                    </div>

                    <div className="flex items-center justify-between p-2 bg-gray-800 rounded-lg">
                        <div className="flex items-center gap-2">
                            <Zap className="w-4 h-4 text-gray-400" />
                            <span className="text-xs text-gray-400">WebSocket</span>
                        </div>
                        <span className="text-xs text-green-400">Active</span>
                    </div>

                    <div className="flex items-center justify-between p-2 bg-gray-800 rounded-lg">
                        <div className="flex items-center gap-2">
                            <Activity className="w-4 h-4 text-gray-400" />
                            <span className="text-xs text-gray-400">Gazebo</span>
                        </div>
                        <span className={`text-xs ${status === 'RUNNING' ? 'text-green-400' : 'text-gray-500'}`}>
              {status === 'RUNNING' ? 'Running' : 'Idle'}
            </span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StatusPanel