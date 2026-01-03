import React from 'react'
import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
    LayoutDashboard,
    Cpu,
    Grid3x3,
    Map,
    Settings,
    Wifi,
    WifiOff,
    Bot,
    Zap,
    Activity,
    ChevronLeft,
    ChevronRight
} from 'lucide-react'
import { rosClient } from '../../services/rosClient'
import { wsService } from '../../services/ws'

const menuItems = [
    { path: '/dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { path: '/simulator', name: 'Simulator', icon: Cpu },
    { path: '/examples', name: 'Examples', icon: Grid3x3 },
    { path: '/maps', name: 'Maps', icon: Map },
    { path: '/settings', name: 'Settings', icon: Settings },
]

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
    const [rosConnected, setRosConnected] = React.useState(false)
    const [wsConnected, setWsConnected] = React.useState(false)

    React.useEffect(() => {
        const checkConnections = () => {
            setRosConnected(rosClient.isConnected())
            setWsConnected(wsService.isConnected())
        }
        const interval = setInterval(checkConnections, 2000)
        checkConnections(); // initial check
        return () => clearInterval(interval)
    }, [])

    return (
        <motion.aside
            animate={{ width: isCollapsed ? '80px' : '280px' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="h-screen bg-gray-900 border-r border-gray-800 flex flex-col relative"
        >
            {/* Logo */}
            <div className="p-6 border-b border-gray-800 flex items-center gap-3 h-16" style={{ justifyContent: isCollapsed ? 'center' : 'flex-start' }}>
                <Bot className="w-8 h-8 text-blue-500 flex-shrink-0" />
                {!isCollapsed && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
                        <h1 className="text-xl font-bold text-white leading-tight">TurtleBot3</h1>
                        <p className="text-xs text-gray-400">Web UI</p>
                    </motion.div>
                )}
            </div>

            {/* Bağlantı Durumu */}
            <div className="px-4 py-4 border-b border-gray-800">
                <div className={`space-y-3 ${isCollapsed ? 'items-center' : ''}`}>
                    <div title={rosConnected ? 'ROS Connected' : 'ROS Disconnected'} className={`flex items-center gap-2 ${isCollapsed ? 'justify-center' : ''}`}>
                        <Wifi className={`w-4 h-4 ${rosConnected ? 'text-green-400' : 'text-red-400'}`} />
                        {!isCollapsed && <span className="text-xs font-medium text-gray-300">ROS Bridge</span>}
                    </div>
                    <div title={wsConnected ? 'WebSocket Active' : 'WebSocket Inactive'} className={`flex items-center gap-2 ${isCollapsed ? 'justify-center' : ''}`}>
                        <Zap className={`w-4 h-4 ${wsConnected ? 'text-green-400' : 'text-red-400'}`} />
                        {!isCollapsed && <span className="text-xs font-medium text-gray-300">Backend WS</span>}
                    </div>
                </div>
            </div>

            {/* Navigasyon */}
            <nav className="flex-1 p-4 space-y-2">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group ${
                                isActive ? 'bg-blue-600/20 text-blue-300' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                            } ${isCollapsed ? 'justify-center' : ''}`
                        }
                    >
                        <item.icon className="w-5 h-5 flex-shrink-0" />
                        {!isCollapsed && <span className="font-medium">{item.name}</span>}
                    </NavLink>
                ))}
            </nav>

            {/* Collapse Butonu */}
            <div className="p-4 border-t border-gray-800">
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="w-full flex items-center justify-center py-2 px-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
                >
                    {isCollapsed ? <ChevronRight className="w-5 h-5 text-gray-400" /> : <ChevronLeft className="w-5 h-5 text-gray-400" />}
                </button>
            </div>
        </motion.aside>
    )
}

export default Sidebar