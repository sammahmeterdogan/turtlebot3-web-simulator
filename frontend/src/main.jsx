import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import './index.css'   // <— BURASI DÜZELDİ
import { wsService } from './services/ws'
import { rosClient } from './services/rosClient'

const queryClient = new QueryClient()

function Bootstrapper({ children }) {
    React.useEffect(() => {
        const rosUrl = localStorage.getItem('rosbridge_url') || 'ws://localhost:9090'
        const wsUrl  = localStorage.getItem('ws_url') || 'http://localhost:8080/ws/robot'
        wsService.connect(wsUrl).catch(() => {})
        rosClient.connect(rosUrl).catch(() => {})
        return () => {
            wsService.disconnect()
            rosClient.disconnect()
        }
    }, [])
    return children
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <Bootstrapper>
                <App />
            </Bootstrapper>
            <Toaster position="top-right" />
        </QueryClientProvider>
    </React.StrictMode>
)
