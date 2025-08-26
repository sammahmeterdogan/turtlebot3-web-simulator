import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'

class WebSocketService {
  constructor() {
    this.client = null
    this.connected = false
    this.subscriptions = new Map()
    this.reconnectAttempts = 0
    this.maxReconnectAttempts = 10
    this.reconnectDelay = 2000
  }

  connect(url = 'http://localhost:8080/ws/robot') {
    return new Promise((resolve, reject) => {
      this.client = new Client({
        webSocketFactory: () => new SockJS(url),
        debug: (str) => {
          if (import.meta.env.DEV) {
            console.log('STOMP:', str)
          }
        },
        reconnectDelay: this.reconnectDelay,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        onConnect: () => {
          console.log('WebSocket connected')
          this.connected = true
          this.reconnectAttempts = 0
          resolve()
        },
        onStompError: (frame) => {
          console.error('STOMP error:', frame.headers['message'])
          reject(new Error(frame.headers['message']))
        },
        onWebSocketClose: () => {
          console.log('WebSocket connection closed')
          this.connected = false
          this.attemptReconnect()
        },
      })

      this.client.activate()
    })
  }

  disconnect() {
    if (this.client && this.connected) {
      this.subscriptions.forEach((subscription) => {
        subscription.unsubscribe()
      })
      this.subscriptions.clear()
      this.client.deactivate()
      this.connected = false
    }
  }

  subscribe(topic, callback) {
    if (!this.client || !this.connected) {
      console.error('WebSocket not connected')
      return null
    }

    const subscription = this.client.subscribe(topic, (message) => {
      try {
        const data = JSON.parse(message.body)
        callback(data)
      } catch (error) {
        console.error('Error parsing message:', error)
        callback(message.body)
      }
    })

    this.subscriptions.set(topic, subscription)
    return subscription
  }

  unsubscribe(topic) {
    const subscription = this.subscriptions.get(topic)
    if (subscription) {
      subscription.unsubscribe()
      this.subscriptions.delete(topic)
    }
  }

  send(destination, body) {
    if (!this.client || !this.connected) {
      console.error('WebSocket not connected')
      return
    }

    this.client.publish({
      destination,
      body: typeof body === 'string' ? body : JSON.stringify(body),
    })
  }

  attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`)
      setTimeout(() => {
        this.connect().catch(console.error)
      }, this.reconnectDelay * this.reconnectAttempts)
    }
  }

  isConnected() {
    return this.connected
  }
}

export const wsService = new WebSocketService()
export default wsService