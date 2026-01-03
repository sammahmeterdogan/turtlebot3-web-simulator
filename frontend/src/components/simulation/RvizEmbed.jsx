// frontend/src/components/simulation/RvizEmbed.jsx
import React from 'react'

const RVIZ_URL =
    import.meta.env?.VITE_RVIZ_URL ||
    'http://localhost:6080/vnc.html?autoconnect=true&resize=scale'

export default function RvizEmbed() {
    return (
        <iframe
            src={RVIZ_URL}
            title="RViz"
            className="w-full h-full border border-gray-800 rounded-xl"
            allow="clipboard-read; clipboard-write"
        />
    )
}
