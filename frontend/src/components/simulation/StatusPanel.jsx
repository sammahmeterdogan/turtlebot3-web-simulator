import React from 'react'
import { motion } from 'framer-motion'
import {
    Activity,
    Battery,
    Cpu,
    Navigation,
    Gauge,
    MapPin,
    Zap,
    AlertCircle,
    CheckCircle,
    Clock
} from 'lucide-react'

const StatusIndicator = ({ status, label, color = 'gray' }) => {
    const colors = {
        green: 'bg-green-500',
        red: 'bg-red-500',
        yellow: 'bg-yellow-500',
        blue: 'bg-blue-500',
        gray: 'bg-gray-500'
    }

    return (
        <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${colors[color]} animate-pulse`} />
            <span className="text-xs text-gray-400">{label}</span>
            <span className="text-xs text-white font-medium">{status}</span>
        </div>
    )
}

const MetricCard = ({ icon: Icon, title, value, unit, color = 'blue' }) => {
    const colorClasses = {
        blue: 'text-blue-400 bg-blue-500/10',
        green: 'text-green-400 bg-green-500/10',
        orange: 'text-orange-400 bg-orange-500/10',
        red: 'text-red-400 bg-red-500/10',
        purple: 'text-purple-400 bg-purple-500/10'
    }

    return (
        <div className="bg-gray-800/50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
                <div className={`p-1.5 rounded-lg ${colorClasses[color].split(' ')[1]}`}>
                    <Icon className={`w-3 h-3 ${colorClasses[color].split(' ')[0]}`} />
                </div>
                <span className="text-xs text-gray-400">{title}</span>
            </div>
            <div className="text-lg font-bold text-white">
                {value}
                {unit && <span className="text-sm text-gray-400 ml-1">{unit}</span>}
            </div>
        </div>
    )
}

const StatusPanel = ({ status = 'STOPPED', telemetryData = {}, isRunning = false }) => {
    // Default telemetry data
    const telemetry = {
        pose: { x: 0, y: 0, theta: 0 },
        velocity: { linear: 0, angular: 0 },
        battery: 100,
        status: 'IDLE',
        ...telemetryData
    }

    // Status color mapping
    const getStatusColor = (status) => {
        switch (status) {
            case 'RUNNING': return 'green'
            case 'STOPPED': return 'gray'
            case 'ERROR': return 'red'
            case 'STARTING': return 'yellow'
            case 'STOPPING': return 'yellow'
            default: return 'gray'
        }
    }

    // Battery level color
    const getBatteryColor = (level) => {
        if (level > 60) return 'green'
        if (level > 30) return 'yellow'
        return 'red'
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900 border border-gray-800 rounded-xl p-4"
        >
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold flex items-center gap-2">
                    <Activity className="w-4 h-4 text-blue-400" />
                    System Status
                </h3>
                {isRunning ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                ) : (
                    <AlertCircle className="w-5 h-5 text-gray-400" />
                )}
            </div>

            {/* Status Indicators */}
            <div className="space-y-3 mb-4">
                <StatusIndicator
                    status={status}
                    label="Simulation"
                    color={getStatusColor(status)}
                />
                <StatusIndicator
                    status={telemetry.status}
                    label="Robot State"
                    color={isRunning ? 'blue' : 'gray'}
                />
                <StatusIndicator
                    status={isRunning ? 'Active' : 'Inactive'}
                    label="Control"
                    color={isRunning ? 'green' : 'gray'}
                />
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-3 mb-4">
                <MetricCard
                    icon={Battery}
                    title="Battery"
                    value={telemetry.battery || 100}
                    unit="%"
                    color={getBatteryColor(telemetry.battery || 100)}
                />
                <MetricCard
                    icon={Gauge}
                    title="Speed"
                    value={Math.abs(telemetry.velocity?.linear || 0).toFixed(2)}
                    unit="m/s"
                    color="blue"
                />
            </div>

            {/* Position Information */}
            <div className="bg-gray-800/30 rounded-lg p-3 mb-4">
                <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-3 h-3 text-purple-400" />
                    <span className="text-xs text-gray-400">Position</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                        <span className="text-gray-500">X:</span>
                        <span className="ml-1 text-white font-mono">
                            {(telemetry.pose?.x || 0).toFixed(2)}
                        </span>
                    </div>
                    <div>
                        <span className="text-gray-500">Y:</span>
                        <span className="ml-1 text-white font-mono">
                            {(telemetry.pose?.y || 0).toFixed(2)}
                        </span>
                    </div>
                    <div>
                        <span className="text-gray-500">θ:</span>
                        <span className="ml-1 text-white font-mono">
                            {((telemetry.pose?.theta || 0) * 180 / Math.PI).toFixed(0)}°
                        </span>
                    </div>
                </div>
            </div>

            {/* Velocity Information */}
            <div className="bg-gray-800/30 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                    <Navigation className="w-3 h-3 text-blue-400" />
                    <span className="text-xs text-gray-400">Velocity</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                        <span className="text-gray-500">Linear:</span>
                        <span className="ml-1 text-white font-mono">
                            {(telemetry.velocity?.linear || 0).toFixed(2)} m/s
                        </span>
                    </div>
                    <div>
                        <span className="text-gray-500">Angular:</span>
                        <span className="ml-1 text-white font-mono">
                            {(telemetry.velocity?.angular || 0).toFixed(2)} rad/s
                        </span>
                    </div>
                </div>
            </div>

            {/* Connection Status at bottom */}
            <div className="mt-4 pt-3 border-t border-gray-800">
                <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Last Update:</span>
                    <span className="text-gray-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date().toLocaleTimeString()}
                    </span>
                </div>
            </div>
        </motion.div>
    )
}

export default StatusPanel