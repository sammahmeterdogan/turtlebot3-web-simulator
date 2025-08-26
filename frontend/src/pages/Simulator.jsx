import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuery, useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import {
  Play,
  Square,
  Save,
  RefreshCw,
  Maximize2,
  Settings,
  Camera,
  Cpu,
  Map,
  Navigation,
  Target,
  Zap,
  Activity,
  ChevronRight,
} from 'lucide-react'
import PageContainer from '../components/layout/PageContainer'
import RvizPanel from '../components/simulation/RvizPanel'
import TeleopPad from '../components/simulation/TeleopPad'
import ModelSelector from '../components/simulation/ModelSelector'
import ScenarioSelector from '../components/simulation/ScenarioSelector'
import StatusPanel from '../components/simulation/StatusPanel'
import { simulationAPI, mapAPI, configAPI } from '../services/api'
import { wsService } from '../services/ws'
import { rosClient } from '../services/rosClient'

const Simulator = () => {
  const [selectedModel, setSelectedModel] = useState('burger')
  const [selectedScenario, setSelectedScenario] = useState('TELEOP')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [activeTab, setActiveTab] = useState('control')
  const [telemetryData, setTelemetryData] = useState({
    pose: { x: 0, y: 0, theta: 0 },
    velocity: { linear: 0, angular: 0 },
    battery: 100,
    status: 'IDLE',
  })

  const simulatorRef = useRef(null)

  // Queries
  const { data: status, refetch: refetchStatus } = useQuery({
    queryKey: ['sim-status'],
    queryFn: simulationAPI.status,
    refetchInterval: 2000,
  })

  const { data: models } = useQuery({
    queryKey: ['robot-models'],
    queryFn: configAPI.getModels,
  })

  // Mutations
  const startSimulation = useMutation({
    mutationFn: () =>
        simulationAPI.start({
          model: selectedModel,
          scenario: selectedScenario,
        }),
    onSuccess: () => {
      toast.success('Simulation started successfully')
      refetchStatus()
    },
    onError: (error) => {
      toast.error('Failed to start simulation')
      console.error(error)
    },
  })

  const stopSimulation = useMutation({
    mutationFn: simulationAPI.stop,
    onSuccess: () => {
      toast.success('Simulation stopped')
      refetchStatus()
    },
    onError: (error) => {
      toast.error('Failed to stop simulation')
      console.error(error)
    },
  })

  const saveMap = useMutation({
    mutationFn: () =>
        mapAPI.save({
          name: `map_${Date.now()}`,
        }),
    onSuccess: () => {
      toast.success('Map saved successfully')
    },
    onError: (error) => {
      toast.error('Failed to save map')
      console.error(error)
    },
  })

  // WebSocket subscriptions
  useEffect(() => {
    const telemetrySubscription = wsService.subscribe(
        '/topic/telemetry',
        (data) => {
          setTelemetryData((prev) => ({ ...prev, ...data }))
        }
    )

    const statusSubscription = wsService.subscribe('/topic/status', () => {
      refetchStatus()
    })

    return () => {
      if (telemetrySubscription) wsService.unsubscribe('/topic/telemetry')
      if (statusSubscription) wsService.unsubscribe('/topic/status')
    }
  }, [refetchStatus])

  // ROS subscriptions
  useEffect(() => {
    if (status?.status === 'RUNNING') {
      const odomTopic = rosClient.subscribeTopic(
          '/odom',
          'nav_msgs/Odometry',
          (msg) => {
            const pose = msg.pose.pose.position
            const orientation = msg.pose.pose.orientation
            const theta = Math.atan2(
                2 * (orientation.w * orientation.z + orientation.x * orientation.y),
                1 - 2 * (orientation.y * orientation.y + orientation.z * orientation.z)
            )
            setTelemetryData((prev) => ({
              ...prev,
              pose: { x: pose.x, y: pose.y, theta },
            }))
          }
      )

      return () => {
        try {
          if (odomTopic) rosClient.unsubscribeTopic('/odom')
        } catch (e) {
          console.error('Unsubscribe error:', e)
        }
      }
    }
  }, [status?.status])

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      simulatorRef.current?.requestFullscreen()
      setIsFullscreen(true)
    } else {
      if (document.fullscreenElement) {
        document.exitFullscreen()
        setIsFullscreen(false)
      }
    }
  }

  const isRunning = status?.status === 'RUNNING'

  return (
      <PageContainer
          title="TurtleBot3 Simulator"
          description="Real-time robot simulation and control"
          actions={
            <div className="flex items-center gap-3">
              {!isRunning ? (
                  <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => startSimulation.mutate()}
                      disabled={startSimulation.isLoading}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                  >
                    <Play className="w-4 h-4" />
                    Start Simulation
                  </motion.button>
              ) : (
                  <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => stopSimulation.mutate()}
                      disabled={stopSimulation.isLoading}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  >
                    <Square className="w-4 h-4" />
                    Stop Simulation
                  </motion.button>
              )}
              <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => saveMap.mutate()}
                  disabled={!isRunning || saveMap.isLoading}
                  className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                <Save className="w-4 h-4" />
                Save Map
              </motion.button>
            </div>
          }
      >
        <div
            className="grid grid-cols-1 xl:grid-cols-4 gap-6 h-[calc(100vh-200px)]"
            ref={simulatorRef}
        >
          {/* Sol panel vs sağ panel kodları aynı kalıyor, sadece telemetryData güvenliği eklendi */}

          {/* Telemetry örneği */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary-400" />
              Telemetry
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-gray-400 text-xs uppercase mb-1">Position</p>
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-gray-800 rounded px-2 py-1">
                    <p className="text-xs text-gray-500">X</p>
                    <p className="text-sm text-white font-mono">
                      {telemetryData.pose?.x?.toFixed?.(2) ?? '0.00'}
                    </p>
                  </div>
                  <div className="bg-gray-800 rounded px-2 py-1">
                    <p className="text-xs text-gray-500">Y</p>
                    <p className="text-sm text-white font-mono">
                      {telemetryData.pose?.y?.toFixed?.(2) ?? '0.00'}
                    </p>
                  </div>
                  <div className="bg-gray-800 rounded px-2 py-1">
                    <p className="text-xs text-gray-500">θ</p>
                    <p className="text-sm text-white font-mono">
                      {telemetryData.pose?.theta?.toFixed?.(2) ?? '0.00'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Kamera feed kısmı */}
          {isRunning ? (
              <img
                  src={`http://localhost:8080/stream?topic=/camera/image_raw&type=mjpeg`}
                  alt="Camera feed"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    if (e.currentTarget) e.currentTarget.src = '/placeholder-camera.jpg'
                  }}
              />
          ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-400 text-sm">Camera feed inactive</p>
              </div>
          )}
        </div>
      </PageContainer>
  )
}

export default Simulator
