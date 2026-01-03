import React, { useEffect, useState } from 'react'
import { visualizationAPI } from '../../services/api'

/**
 * RViz Panel Component - Displays RViz via noVNC iframe
 * 
 * This component fetches the RViz noVNC URL from the backend and displays it
 * in an iframe. The backend ensures the URL points to the correct noVNC entry page.
 */
const RvizPanel = () => {
    const [rvizUrl, setRvizUrl] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [loadError, setLoadError] = useState(false)

    // Fetch RViz URL from backend
    useEffect(() => {
        const fetchRvizUrl = async () => {
            try {
                setIsLoading(true)
                setLoadError(false)
                const response = await visualizationAPI.getRvizUrl()
                if (response?.data?.url) {
                    // Validate and normalize URL
                    let normalizedUrl = response.data.url
                    try {
                        const url = new URL(response.data.url)
                        // Ensure URL has a valid path (not just root)
                        if (!url.pathname || url.pathname === '/' || url.pathname === '') {
                            normalizedUrl = response.data.url.replace(/\/$/, '') + '/vnc.html?autoconnect=true&resize=remote'
                        } else if (!url.pathname.includes('vnc')) {
                            // If path doesn't contain 'vnc', append vnc.html
                            normalizedUrl = url.origin + '/vnc.html?autoconnect=true&resize=remote'
                        }
                    } catch (e) {
                        console.error('Invalid RViz URL:', response.data.url, e)
                        setLoadError(true)
                        return
                    }
                    setRvizUrl(normalizedUrl)
                } else {
                    setLoadError(true)
                }
            } catch (error) {
                console.error('Failed to fetch RViz URL:', error)
                setLoadError(true)
            } finally {
                setIsLoading(false)
            }
        }

        fetchRvizUrl()
    }, [])

    if (isLoading) {
        return (
            <div className="w-full h-full bg-gray-950 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-white text-sm">Loading RViz...</p>
                    <p className="text-gray-400 text-xs mt-1">Connecting to visualization server</p>
                </div>
            </div>
        )
    }

    if (loadError || !rvizUrl) {
        return (
            <div className="w-full h-full bg-gray-950 flex items-center justify-center">
                <div className="text-center max-w-md">
                    <div className="text-red-400 text-4xl mb-4">⚠️</div>
                    <p className="text-white text-lg font-medium mb-2">Failed to Load RViz</p>
                    <p className="text-gray-400 text-sm mb-4">
                        Could not connect to the RViz visualization server. Please ensure:
                    </p>
                    <ul className="text-gray-400 text-xs text-left space-y-1 mb-4">
                        <li>• The simulation is running</li>
                        <li>• The RViz container is started</li>
                        <li>• The backend is accessible</li>
                    </ul>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="w-full h-full bg-gray-950 relative">
            <iframe
                src={rvizUrl}
                className="w-full h-full border-0"
                title="RViz Visualization"
                allow="fullscreen"
                sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
            />
            {/* Info overlay */}
            <div className="absolute top-4 right-4 bg-gray-900/90 backdrop-blur-sm rounded-lg p-2 text-xs text-white">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span>RViz Connected</span>
                </div>
            </div>
        </div>
    )
}

export default RvizPanel
