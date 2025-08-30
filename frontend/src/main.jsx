// frontend/src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import './index.css'
import { wsService } from './services/ws'
import { rosClient } from './services/rosClient'

const queryClient = new QueryClient()

function Bootstrapper({ children }) {
    const didInit = React.useRef(false)

    React.useEffect(() => {
        if (didInit.current) return
        didInit.current = true

        const rosUrl = import.meta.env?.VITE_ROSBRIDGE_URL || '/rosbridge'
        const wsUrl  = import.meta.env?.VITE_WS_URL || '/ws/robot'

        wsService.connect(wsUrl).catch(() => {})
        rosClient.connect(rosUrl).catch(() => {})

        return () => {
            wsService.disconnect()
            rosClient.disconnect()
            didInit.current = false
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
