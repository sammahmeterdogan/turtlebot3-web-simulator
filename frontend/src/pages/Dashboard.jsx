import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
    Activity,
    Bot,
    Cpu,
    Map,
    Play,
    Square,
    Zap,
    Clock,
    TrendingUp,
    Battery,
    Wifi,
    HardDrive,
} from 'lucide-react'
import PageContainer from '../components/layout/PageContainer'
import { simulationAPI, mapAPI, examplesAPI } from '../services/api'
import { wsService } from '../services/ws'
import { rosClient } from '../services/rosClient'

// Color mapping - Tailwind safe classes
const colorClasses = {
    primary: {
        bg: 'bg-blue-500/10',
        text: 'text-blue-500',
    },
    green: {
        bg: 'bg-green-500/10',
        text: 'text-green-500',
    },
    blue: {
        bg: 'bg-blue-500/10',
        text: 'text-blue-500',
    },
    purple: {
        bg: 'bg-purple-500/10',
        text: 'text-purple-500',
    },
    orange: {
        bg: 'bg-orange-500/10',
        text: 'text-orange-500',
    },
    gray: {
        bg: 'bg-gray-500/10',
        text: 'text-gray-500',
    },
}

const StatCard = ({ icon: Icon, title, value, unit, trend, color = 'primary' }) => {
    const colors = colorClasses[color] || colorClasses.primary

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            className="bg-gray-900 border border-gray-800 rounded-xl p-6"
        >
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 ${colors.bg} rounded-lg`}>
                    <Icon className={`w-6 h-6 ${colors.text}`} />
                </div>
                {trend && (
                    <div className="flex items-center gap-1 text-green-500 text-sm">
                        <TrendingUp className="w-4 h-4" />
                        <span>{trend}</span>
                    </div>
                )}
            </div>
            <div>
                <p className="text-gray-400 text-sm mb-1">{title}</p>
                <p className="text-2xl font-bold text-white">
                    {value}
                    {unit && <span className="text-lg text-gray-400 ml-1">{unit}</span>}
                </p>
            </div>
        </motion.div>
    )
}

const Dashboard = () => {
    const navigate = useNavigate()
    const [telemetry, setTelemetry] = useState({
        battery: 85,
        cpu: 32,
        memory: 48,
        temperature: 36,
    })

    const { data: status } = useQuery({
        queryKey: ['simulation-status'],
        queryFn: simulationAPI.status,
        refetchInterval: 2000,
    })

    const { data: maps } = useQuery({
        queryKey: ['maps'],
        queryFn: mapAPI.list,
    })

    const { data: examples } = useQuery({
        queryKey: ['examples'],
        queryFn: examplesAPI.list,
    })

    useEffect(() => {
        // Subscribe to telemetry updates
        const subscription = wsService.subscribe('/topic/telemetry', (data) => {
            setTelemetry(data)
        })

        return () => {
            if (subscription) wsService.unsubscribe('/topic/telemetry')
        }
    }, [])

    const quickActions = [
        {
            title: 'Start Simulation',
            description: 'Launch TurtleBot3 in Gazebo',
            icon: Play,
            color: 'green',
            action: () => navigate('/simulator'),
        },
        {
            title: 'View Examples',
            description: 'Browse pre-configured scenarios',
            icon: Cpu,
            color: 'purple',
            action: () => navigate('/examples'),
        },
        {
            title: 'Manage Maps',
            description: 'Load or create new maps',
            icon: Map,
            color: 'orange',
            action: () => navigate('/maps'),
        },
    ]

    return (
        <PageContainer
            title="Dashboard"
            description="Monitor and control your TurtleBot3 simulation"
        >
            <div className="space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                        icon={Activity}
                        title="Simulation Status"
                        value={status?.status || 'STOPPED'}
                        color={status?.status === 'RUNNING' ? 'green' : 'gray'}
                    />
                    <StatCard
                        icon={Battery}
                        title="Battery Level"
                        value={telemetry.battery}
                        unit="%"
                        trend="+2%"
                        color="blue"
                    />
                    <StatCard
                        icon={Cpu}
                        title="CPU Usage"
                        value={telemetry.cpu}
                        unit="%"
                        color="purple"
                    />
                    <StatCard
                        icon={HardDrive}
                        title="Memory Usage"
                        value={telemetry.memory}
                        unit="%"
                        color="orange"
                    />
                </div>

                {/* Quick Actions */}
                <div>
                    <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {quickActions.map((action, index) => {
                            const colors = colorClasses[action.color] || colorClasses.primary

                            return (
                                <motion.button
                                    key={action.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={action.action}
                                    className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-left hover:border-gray-700 transition-all"
                                >
                                    <div className={`inline-flex p-3 ${colors.bg} rounded-lg mb-4`}>
                                        <action.icon className={`w-6 h-6 ${colors.text}`} />
                                    </div>
                                    <h3 className="text-white font-semibold mb-2">{action.title}</h3>
                                    <p className="text-gray-400 text-sm">{action.description}</p>
                                </motion.button>
                            )
                        })}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Maps */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-gray-900 border border-gray-800 rounded-xl p-6"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-white font-semibold">Recent Maps</h3>
                            <button
                                onClick={() => navigate('/maps')}
                                className="text-blue-400 hover:text-blue-300 text-sm"
                            >
                                View all
                            </button>
                        </div>
                        <div className="space-y-3">
                            {maps?.slice(0, 3).map((map) => (
                                <div
                                    key={map.id}
                                    className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg"
                                >
                                    <div className="flex items-center gap-3">
                                        <Map className="w-4 h-4 text-orange-400" />
                                        <div>
                                            <p className="text-white text-sm font-medium">{map.name}</p>
                                            <p className="text-gray-500 text-xs">
                                                {new Date(map.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <button className="text-gray-400 hover:text-white">
                                        <Zap className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                            {(!maps || maps.length === 0) && (
                                <p className="text-gray-500 text-sm text-center py-4">No maps available</p>
                            )}
                        </div>
                    </motion.div>

                    {/* Available Examples */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-gray-900 border border-gray-800 rounded-xl p-6"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-white font-semibold">Popular Examples</h3>
                            <button
                                onClick={() => navigate('/examples')}
                                className="text-blue-400 hover:text-blue-300 text-sm"
                            >
                                View all
                            </button>
                        </div>
                        <div className="space-y-3">
                            {examples?.slice(0, 3).map((example) => (
                                <div
                                    key={example.id}
                                    className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg cursor-pointer hover:bg-gray-800 transition-colors"
                                    onClick={() => navigate('/examples')}
                                >
                                    <div className="flex items-center gap-3">
                                        <Bot className="w-4 h-4 text-purple-400" />
                                        <div>
                                            <p className="text-white text-sm font-medium">{example.title}</p>
                                            <p className="text-gray-500 text-xs">{example.category}</p>
                                        </div>
                                    </div>
                                    <span className={`px-2 py-1 text-xs rounded-full ${
                                        example.difficulty === 'EASY' ? 'bg-green-900/50 text-green-400' :
                                            example.difficulty === 'MEDIUM' ? 'bg-yellow-900/50 text-yellow-400' :
                                                'bg-red-900/50 text-red-400'
                                    }`}>
                    {example.difficulty}
                  </span>
                                </div>
                            ))}
                            {(!examples || examples.length === 0) && (
                                <p className="text-gray-500 text-sm text-center py-4">No examples available</p>
                            )}
                        </div>
                    </motion.div>
                </div>

                {/* System Health */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-900 border border-gray-800 rounded-xl p-6"
                >
                    <h3 className="text-white font-semibold mb-4">System Health</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${rosClient.isConnected() ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
                            <div>
                                <p className="text-white text-sm">ROS Bridge</p>
                                <p className="text-gray-500 text-xs">{rosClient.isConnected() ? 'Connected' : 'Disconnected'}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${wsService.isConnected() ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
                            <div>
                                <p className="text-white text-sm">WebSocket</p>
                                <p className="text-gray-500 text-xs">{wsService.isConnected() ? 'Active' : 'Inactive'}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                            <div>
                                <p className="text-white text-sm">Backend API</p>
                                <p className="text-gray-500 text-xs">Operational</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </PageContainer>
    )
}

export default Dashboard