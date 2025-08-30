// frontend/src/services/ws.js
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'

function resolveHttpUrl(input) {
    if (!input) return `${window.location.origin}/ws/robot`
    if (input.startsWith('/')) return `${window.location.origin}${input}`
    return input
}

class WebSocketService {
    constructor() {
        this.client = null
        this.connected = false
        this.subscriptions = new Map()
        this.reconnectAttempts = 0
        this.maxReconnectAttempts = 5
        this.reconnectDelay = 2000
        this.isDestroyed = false
        this.defaultUrl = (import.meta.env && import.meta.env.VITE_WS_URL) || '/ws/robot'
    }

    connect(url = this.defaultUrl) {
        if (this.isDestroyed) return Promise.reject(new Error('Service destroyed'))

        const httpUrl = resolveHttpUrl(url)
        return new Promise((resolve, reject) => {
            try {
                this.client = new Client({
                    webSocketFactory: () => new SockJS(httpUrl),
                    debug: (str) => { if (import.meta.env?.DEV) console.log('STOMP:', str) },
                    reconnectDelay: this.reconnectDelay,
                    heartbeatIncoming: 4000,
                    heartbeatOutgoing: 4000,
                    onConnect: () => {
                        this.connected = true
                        this.reconnectAttempts = 0
                        resolve()
                    },
                    onStompError: (frame) => {
                        const msg = frame.headers?.message || 'STOMP error'
                        reject(new Error(msg))
                    },
                    onWebSocketClose: () => {
                        this.connected = false
                        if (this.isDestroyed) return
                        if (this.reconnectAttempts >= this.maxReconnectAttempts) return
                        this.reconnectAttempts += 1
                        const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1)
                        setTimeout(() => { if (!this.isDestroyed) this.attemptReconnect() }, delay)
                    },
                })
                this.client.activate()
            } catch (err) {
                reject(err)
            }
        })
    }

    attemptReconnect() {
        if (this.isDestroyed || this.connected) return
        this.client?.activate()
    }

    disconnect() {
        try { this.client?.deactivate() } catch {}
        this.connected = false
    }

    destroy() {
        this.isDestroyed = true
        this.disconnect()
        this.subscriptions.clear()
        this.client = null
    }

    subscribe(destination, callback) {
        if (!this.connected || !this.client) {
            console.warn('WebSocket not connected')
            return null
        }
        const sub = this.client.subscribe(destination, callback)
        this.subscriptions.set(destination, sub)
        return sub
    }

    unsubscribe(destination) {
        const sub = this.subscriptions.get(destination)
        if (sub) {
            try { sub.unsubscribe() } catch {}
            this.subscriptions.delete(destination)
        }
    }

    send(destination, body = {}) {
        if (!this.connected || !this.client) {
            console.warn('WebSocket not connected')
            return
        }
        this.client.publish({ destination, body: JSON.stringify(body) })
    }

    // EKSİK OLAN METOT: Dashboard.jsx 'wsService.isConnected()' çağırıyor
    isConnected() {
        return !!this.connected
    }
}

export default WebSocketService
export const wsService = new WebSocketService()
