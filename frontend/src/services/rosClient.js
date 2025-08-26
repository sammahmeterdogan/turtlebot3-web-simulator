import ROSLIB from 'roslib'

class RosClient {
    constructor() {
        this.ros = null
        this.connected = false
        this.topics = new Map()
        this.services = new Map()
        this.reconnectAttempts = 0
        this.maxReconnectAttempts = 5
        this.reconnectDelay = 2000
        this.listeners = new Set()
    }

    connect(url = 'ws://localhost:9090') {
        return new Promise((resolve, reject) => {
            if (this.ros) this.ros.close()

            this.ros = new ROSLIB.Ros({ url })

            this.ros.on('connection', () => {
                this.connected = true
                this.reconnectAttempts = 0
                this.notifyListeners('connected')
                resolve()
            })

            this.ros.on('error', (error) => {
                this.connected = false
                this.notifyListeners('error', error)
                reject(error)
            })

            this.ros.on('close', () => {
                this.connected = false
                this.notifyListeners('disconnected')
                this.attemptReconnect(url)
            })
        })
    }

    disconnect() {
        if (this.ros) {
            this.topics.forEach((t) => t.unsubscribe())
            this.topics.clear()
            this.services.clear()
            this.ros.close()
            this.ros = null
        }
        this.connected = false
        this.reconnectAttempts = 0
    }

    attemptReconnect(url) {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++
            setTimeout(() => this.connect(url).catch(() => {}), this.reconnectDelay)
        }
    }

    // Event listeners
    addListener(callback) { this.listeners.add(callback) }
    removeListener(callback) { this.listeners.delete(callback) }
    notifyListeners(event, data) { this.listeners.forEach(cb => cb(event, data)) }

    // Topic operations
    subscribeTopic(topicName, messageType, callback) {
        if (!this.ros) {
            console.error('ROS not connected')
            return null
        }
        // reuse if already created
        let topic = this.topics.get(topicName)
        if (!topic) {
            topic = new ROSLIB.Topic({ ros: this.ros, name: topicName, messageType })
            this.topics.set(topicName, topic)
        }
        topic.subscribe(callback)
        return topic
    }

    unsubscribeTopic(topicName) {
        const topic = this.topics.get(topicName)
        if (topic) {
            topic.unsubscribe()
            this.topics.delete(topicName)
        }
    }

    publishTopic(topicName, messageType, message) {
        if (!this.ros) {
            console.error('ROS not connected')
            return
        }
        let topic = this.topics.get(topicName)
        if (!topic) {
            topic = new ROSLIB.Topic({ ros: this.ros, name: topicName, messageType })
            this.topics.set(topicName, topic)
        }
        const rosMessage = new ROSLIB.Message(message)
        topic.publish(rosMessage)
    }

    // Service operations
    callService(serviceName, serviceType, request) {
        return new Promise((resolve, reject) => {
            if (!this.ros) {
                reject(new Error('ROS not connected'))
                return
            }
            let service = this.services.get(serviceName)
            if (!service) {
                service = new ROSLIB.Service({ ros: this.ros, name: serviceName, serviceType })
                this.services.set(serviceName, service)
            }
            const serviceRequest = new ROSLIB.ServiceRequest(request)
            service.callService(
                (res) => resolve(res),
                (err) => reject(err),
                serviceRequest
            )
        })
    }

    // Introspection
    getTopics() {
        return new Promise((resolve, reject) => {
            if (!this.ros) return reject(new Error('ROS not connected'))
            this.ros.getTopics(
                (topics) => resolve(topics),
                (error) => reject(error)
            )
        })
    }

    getServices() {
        return new Promise((resolve, reject) => {
            if (!this.ros) return reject(new Error('ROS not connected'))
            this.ros.getServices(
                (services) => resolve(services),
                (error) => reject(error)
            )
        })
    }

    getNodes() {
        return new Promise((resolve, reject) => {
            if (!this.ros) return reject(new Error('ROS not connected'))
            this.ros.getNodes(
                (nodes) => resolve(nodes),
                (error) => reject(error)
            )
        })
    }

    isConnected() { return this.connected }
}

export const rosClient = new RosClient()

// Convenience publishers
export const publishCmdVel = (linear, angular) => {
    rosClient.publishTopic('/cmd_vel', 'geometry_msgs/Twist', {
        linear: { x: linear, y: 0, z: 0 },
        angular: { x: 0, y: 0, z: angular },
    })
}

export const publishGoal = (x, y, theta) => {
    rosClient.publishTopic('/move_base_simple/goal', 'geometry_msgs/PoseStamped', {
        header: {
            frame_id: 'map',
            stamp: {
                secs: Math.floor(Date.now() / 1000),
                nsecs: (Date.now() % 1000) * 1e6,
            },
        },
        pose: {
            position: { x, y, z: 0 },
            orientation: {
                x: 0, y: 0,
                z: Math.sin(theta / 2),
                w: Math.cos(theta / 2),
            },
        },
    })
}

export default rosClient
